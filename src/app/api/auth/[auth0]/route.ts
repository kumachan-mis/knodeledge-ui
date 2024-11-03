import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth() as (req: Request) => Promise<Response>;
