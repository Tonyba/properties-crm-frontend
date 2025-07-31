import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { routesFn } from './routes.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const root = document.getElementById('root');

const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 10,
    },
  },
})


createRoot(root!).render(
  <StrictMode>
    <QueryClientProvider client={queryClientInstance}>
      <RouterProvider router={routesFn(queryClientInstance).router} />
    </QueryClientProvider>
  </StrictMode>
)