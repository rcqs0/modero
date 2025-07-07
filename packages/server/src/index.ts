import express from 'express'
import { publicProcedure } from './trpc'
import { initTRPC } from '@trpc/server'
import * as trpcExpress from '@trpc/server/adapters/express'
import { PrismaClient } from '@prisma/client'
import { createServer } from 'http'
import { WebSocketServer } from 'ws'
import { connect } from './sync'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey:
    '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', // defaults to process.env["ANTHROPIC_API_KEY"]
})

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

  chat: publicProcedure.query(async () => {
    const msg = await anthropic.messages.create({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      messages: [{ role: 'user', content: 'Hello, Claude' }],
    })

    console.log(msg)

    return { ok: true }
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
