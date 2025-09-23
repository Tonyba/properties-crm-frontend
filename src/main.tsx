import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { routesFn } from './routes.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const root = document.getElementById('root');

const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000 // 5 minutes,
    },
  },
})


createRoot(root!).render(
  <StrictMode>
    <QueryClientProvider client={queryClientInstance}>
      <RouterProvider router={routesFn(queryClientInstance).router} />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </QueryClientProvider>
  </StrictMode>
)