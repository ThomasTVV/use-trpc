# useTRPC

[SWR](https://swr.vercel.app/) wrapper for [tRPC](https://trpc.io/) queries.

### Motivation:

SWR has great DX. tRPC has great DX. Let’s integrate them to get the best of both worlds for a super fast and swift development experience.

### Features:

- ✅&nbsp; Full type-safety
- ✅&nbsp; No dependencies
- ✅&nbsp; Simple syntax

### Setup:

- add the **useTRPC.ts** file to your repo.
- ensure that your tRPC client is initialized with **createTRPCProxyClient** - not createTRPCClient.

### Usage:

    const { data, error, isLoading } = useTRPC('getUser', { id: 123 })
