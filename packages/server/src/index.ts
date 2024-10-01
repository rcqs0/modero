import { publicProcedure, router } from './trpc'
import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const appRouter = router({
  controls: publicProcedure.query(async () => {
    const controls = await prisma.control.findMany({
      include: {
        uncertainty: true,
      },
    })

    return controls
  }),
})

const server = createHTTPServer({
  router: appRouter,
})

server.listen(1337, () => {
  console.log(`App listening at http://localhost:${1337}`)
})

export type AppRouter = typeof appRouter
