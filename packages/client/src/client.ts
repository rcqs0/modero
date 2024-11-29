import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '../../server/src'

const client = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'api/trpc',
      // You can pass any HTTP headers you wish here
      async headers() {
        return {
          // authorization: getAuthCookie(),
        }
      },
    }),
  ],
})

export default client
