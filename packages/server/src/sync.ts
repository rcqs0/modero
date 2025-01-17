import { WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import * as Y from 'yjs'
import * as encoding from 'lib0/encoding'
import * as decoding from 'lib0/decoding'
import {
  Awareness,
  encodeAwarenessUpdate,
  applyAwarenessUpdate,
  removeAwarenessStates,
} from 'y-protocols/awareness'
import { readSyncMessage, writeSyncStep1, writeUpdate } from 'y-protocols/sync'

const Y_SYNC_MESSAGE_CODE = 0
const Y_AWARENESS_MESSAGE_CODE = 1

const rooms = new Map<
  string,
  {
    doc: Y.Doc
    connections: Map<WebSocket, number>
    awareness: Awareness
  }
>()

function createAwarenessPatch(
  awareness: Awareness,
  clients: number[] = Array.from(awareness.getStates().keys()),
) {
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, Y_AWARENESS_MESSAGE_CODE)
  encoding.writeVarUint8Array(
    encoder,
    encodeAwarenessUpdate(awareness, clients),
  )

  return encoding.toUint8Array(encoder)
}

export function connect(ws: WebSocket, req: IncomingMessage) {
  ws.binaryType = 'arraybuffer'

  const [channel, query] = (req.url || '').slice(1).split('?')
  const params = new URLSearchParams(query)
  const client = Number(params.get('client')) || 0

  let room = rooms.get(channel)

  if (!room) {
    const doc = new Y.Doc()
    const connections = new Map<WebSocket, number>()
    const awareness = new Awareness(doc)
    awareness.setLocalState(null)

    doc.on('update', (update, _origin, _doc, _tr) => {
      const encoder = encoding.createEncoder()
      encoding.writeVarUint(encoder, Y_SYNC_MESSAGE_CODE)
      writeUpdate(encoder, update)

      const message = encoding.toUint8Array(encoder)
      connections.forEach((_, ws) => ws.send(message))
    })

    awareness.on(
      'update',
      (
        changes: { added: number[]; updated: number[]; removed: number[] },
        _ws: WebSocket | null,
      ) => {
        const changed = changes.added.concat(changes.updated, changes.removed)

        const patch = createAwarenessPatch(awareness, changed)
        connections.forEach((_, ws) => ws.send(patch))
      },
    )

    room = { doc, connections, awareness }
    rooms.set(channel, room)
  }

  room.connections.set(ws, client)

  ws.on('message', (message) => {
    const decoder = decoding.createDecoder(
      new Uint8Array(message as ArrayBuffer),
    )
    const code = decoding.readVarUint(decoder)

    switch (code) {
      case Y_SYNC_MESSAGE_CODE:
        const encoder = encoding.createEncoder()
        encoding.writeVarUint(encoder, Y_SYNC_MESSAGE_CODE)
        readSyncMessage(decoder, encoder, room.doc, ws)

        if (encoding.length(encoder) > 1) {
          ws.send(encoding.toUint8Array(encoder))
        }

        break
      case Y_AWARENESS_MESSAGE_CODE:
        applyAwarenessUpdate(
          room.awareness,
          decoding.readVarUint8Array(decoder),
          ws,
        )

        break
    }
  })

  ws.on('close', () => {
    const client = room.connections.get(ws)!

    room.connections.delete(ws)
    removeAwarenessStates(room.awareness, [client], null)

    if (!room.connections.size) {
      room.doc.destroy()
      room.awareness.destroy()
      rooms.delete(channel)
    }
  })

  // initial sync
  const encoder = encoding.createEncoder()
  encoding.writeVarUint(encoder, Y_SYNC_MESSAGE_CODE)
  writeSyncStep1(encoder, room.doc)
  ws.send(encoding.toUint8Array(encoder))

  const states = room.awareness.getStates()
  if (states.size) {
    ws.send(createAwarenessPatch(room.awareness, Array.from(states.keys())))
  }
}
