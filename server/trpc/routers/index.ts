import { router, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '../../db/index';
import { kalpataruInVidya } from '../../db/schema';

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return {
      status: 'success',
      message: 'VidyaCore tRPC Success Tunnel is Active',
      timestamp: new Date().toISOString(),
    };
  }),

  // Protected Example: Get the Kalpataru Tree Structure
  getTree: protectedProcedure.query(async () => {
    const tree = await db.select().from(kalpataruInVidya);
    return tree;
  }),
});

// Export only the type of a router!
// This is used on the client side for full type safety.
export type AppRouter = typeof appRouter;
