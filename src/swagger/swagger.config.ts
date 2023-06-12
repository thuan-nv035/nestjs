import { SwaggerConfig } from './swagger.interface';

/**
 * Configuration for the swagger UI (found at /api).
 * Change this to suit your app!
 */
export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'Nest js Service',
  description: 'Nest js api ',
  version: '1.0',
  tags: [],
  contact: {
    name: 'thuan',
    url: 'http://localhost:3001/api/v1',
    email: 'thuan.nv35@gmail.com',
  },
};
