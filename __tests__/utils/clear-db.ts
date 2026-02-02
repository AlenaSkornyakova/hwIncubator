import request from 'supertest';
import { Express } from 'express';
import { HTTP_STATUSES } from '../../src/core/utils/http-status';
import { routerPath } from '../../src/core/paths/paths';


export async function clearDb(app: Express) {
  await request(app)
    .delete(`${routerPath.testing}/all-data`)
    .expect(HTTP_STATUSES.NO_CONTENT_204);
  return;
}
