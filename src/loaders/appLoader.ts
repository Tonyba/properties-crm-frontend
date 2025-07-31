import { type LoaderFunctionArgs } from 'react-router';
import type { QueryClient } from "@tanstack/react-query"

export const appLoader =
    (_queryClient: QueryClient) =>
        async ({ request }: LoaderFunctionArgs) => {
            const url = new URL(request.url)
            const q = url.searchParams.get('q') ?? ''
            // await setTimeout(() => { }, 2000);
            return { q }
        }
