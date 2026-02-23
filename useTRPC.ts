import useSWR, { type SWRConfiguration, type SWRResponse } from 'swr'
import type { TRPCClientErrorLike } from '@trpc/client'
import { trpc } from './trpc' // Import your tRPC client instance
import type { TRPCRouter } from './trpc' // Import your tRPC router type

/** SWR wrapper for tRPC queries
 * @example
 * const { data, error, isLoading } = useTRPC('getUser', { id: 123 })
 */
export function useTRPC<
  TPath extends DotPath<typeof trpc>,
  TProc = PathValue<typeof trpc, TPath>,
  TData = QueryOutput<TProc>,
  TError = TRPCClientErrorLike<TRPCRouter>,
>(path: TPath, input: QueryInput<TProc>, config?: SWRConfiguration<TData, TError>): SWRResponse<TData, TError> {
  const key = ['trpc', path, input] as const

  return useSWR<TData, TError>(
    key,
    async () => {
      // Resolve the procedure from the dot-path at runtime
      const parts = path.split('.')
      let node: any = trpc
      for (const p of parts) node = node[p]

      return node.query(input) as Promise<TData>
    },
    config
  )
}

// All procedure paths as "a.b.c"
type DotPath<TObj, Prev extends string = ''> = {
  [K in Extract<keyof TObj, string>]: TObj[K] extends {
    query: (...args: any[]) => any
  } // leaf procedure proxy
    ? `${Prev}${K}`
    : TObj[K] extends object
      ? DotPath<TObj[K], `${Prev}${K}.`>
      : never
}[Extract<keyof TObj, string>]

// Get the type at a dot path
type PathValue<TObj, TPath extends string> = TPath extends `${infer Head}.${infer Tail}`
  ? Head extends keyof TObj
    ? PathValue<TObj[Head], Tail>
    : never
  : TPath extends keyof TObj
    ? TObj[TPath]
    : never

// Extract input/output from a `.query` function
type QueryInput<TProc> = TProc extends {
  query: (input: infer TInput, ...args: any[]) => any
}
  ? TInput
  : never

type QueryOutput<TProc> = TProc extends {
  query: (input: any, ...args: any[]) => Promise<infer TOutput>
}
  ? TOutput
  : never
