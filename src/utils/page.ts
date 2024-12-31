import { Claims } from '@auth0/nextjs-auth0';

export type AuthorizedPageProps<PageProps extends object = object> = {
  readonly user: Claims;
} & PageProps;

export const PROJECTS_ID_PATH_NAME = 'projects';
export const CHAPTER_ID_PARAM_KEY = 'chapter';
export const SECTION_ID_PARAM_KEY = 'section';
