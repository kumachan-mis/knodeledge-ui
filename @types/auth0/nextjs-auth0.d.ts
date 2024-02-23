// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as NextjsAuth0 from '@auth0/nextjs-auth0';

declare module '@auth0/nextjs-auth0' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Claims {
    readonly sub: string;
    readonly name: string;
    readonly email: string;
  }
}
