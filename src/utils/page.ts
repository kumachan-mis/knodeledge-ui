import { Claims } from '@auth0/nextjs-auth0';

export type AuthorizedPageProps<PageProps extends object = object> = {
  readonly user: Claims;
} & PageProps;
