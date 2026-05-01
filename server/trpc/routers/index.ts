import { router, publicProcedure, protectedProcedure } from '../trpc';
import { db } from '../../db/index';
import { kalpataruInVidya } from '../../db/schema';
import { z } from 'zod';
import { eq } from 'drizzle-orm';


export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return {
      status: 'success',
      message: 'VidyaCore tRPC Success Tunnel is Active',
      timestamp: new Date().toISOString(),
    };
  }),

  // Get the entire tree for navigation
  getTree: publicProcedure.query(async () => {
    const rawTree = await db.select().from(kalpataruInVidya).orderBy(kalpataruInVidya.path);
    console.log('--- KALPATARU TREE FETCH ---');
    console.log(`Fetched ${rawTree.length} nodes`);
    
    // Safely transform BigInt to Number/String for JSON serialization
    return rawTree.map(node => ({
      ...node,
      id: Number(node.id),
      parentId: node.parentId ? Number(node.parentId) : null,
      granthaId: node.granthaId ? Number(node.granthaId) : null,
    }));
  }),



  // Get specific node metadata by slug
  getNodeBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const node = await db
        .select()
        .from(kalpataruInVidya)
        .where(eq(kalpataruInVidya.slug, input.slug))
        .limit(1);
      
      if (!node[0]) return null;

      return {
        ...node[0],
        id: Number(node[0].id),
        parentId: node[0].parentId ? Number(node[0].parentId) : null,
        granthaId: node[0].granthaId ? Number(node[0].granthaId) : null,
      };
    }),

});


// Export only the type of a router!
// This is used on the client side for full type safety.
export type AppRouter = typeof appRouter;
