import express from 'express'
import { publicProcedure } from './trpc'
import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { PrismaClient } from '@prisma/client'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { connect } from './sync'

const prisma = new PrismaClient()

const createContext = (
  _options: trpcExpress.CreateExpressContextOptions,
) => ({}) // no context
type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

const appRouter = t.router({
  controls: publicProcedure.query(async () => {
    const controls = await prisma.control.findMany({
      include: {
        uncertainty: true,
      },
    })

    return controls
  }),
})

const app = express()
const server = createServer(app)

app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
)

const wss = new WebSocketServer({ noServer: true })

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request)
  })
})

wss.on('connection', connect)

server.listen(1337, () => {
  console.log('server running at http://localhost:1337')
})

export type AppRouter = typeof appRouter
