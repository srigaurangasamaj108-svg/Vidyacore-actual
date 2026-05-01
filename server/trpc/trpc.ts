import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateExpressContextOptions } from '@trpc/server/adapters/express';
import jwt from 'jsonwebtoken';

// 1. Context Creation (The Bridge)
export const createContext = ({ req, res }: CreateExpressContextOptions) => {
  const getUser = () => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded;
      } catch (err) {
        return null;
      }
    }
    return null;
  };

  return {
    req,
    res,
    user: getUser(),
  };
};

type Context = Awaited<ReturnType<typeof createContext>>;

// 2. Initialize tRPC
const t = initTRPC.context<Context>().create();

// 3. Export Procedures
export const router = t.router;
export const publicProcedure = t.procedure;

// Protected Procedure (Middleware)
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You must be logged in to access this Shastra.' });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});
