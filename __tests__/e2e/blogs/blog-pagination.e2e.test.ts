import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { routerPath } from '../../../src/core/paths/paths';
import { clearDb } from '../../utils/clear-db';
import { blogTestManager } from '../../utils/test-managers';  
import { createTestApp } from '../../utils/createTestApp';

describe('Blog API pagination', () => {
    const app = createTestApp();
  beforeEach(async () => {
    await clearDb(app);
  });

  const createBlog = async (name: string) => {
    const created = await blogTestManager.createBlog(app, {
      name,
      description: `Description for ${name}`,
      websiteUrl: `https://${name.toLowerCase().replace(/\s+/g, '-')}.com`,
    });

    return created.createdEntity ?? created;
  };

  it('GET /blogs should return default pagination values', async () => {
    await createBlog('Blog 1');
    await createBlog('Blog 2');
    await createBlog('Blog 3');

    const res = await request(app)
      .get(routerPath.blogs)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.totalCount).toBe(3);
    expect(res.body.pagesCount).toBe(1);
    expect(res.body.items).toHaveLength(3);
  });

  it('GET /blogs should apply pageSize', async () => {
    await createBlog('Blog 1');
    await createBlog('Blog 2');
    await createBlog('Blog 3');

    const res = await request(app)
      .get(`${routerPath.blogs}?pageSize=2`)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(2);
    expect(res.body.totalCount).toBe(3);
    expect(res.body.pagesCount).toBe(2);
    expect(res.body.items).toHaveLength(2);
  });

  it('GET /blogs should return second page correctly', async () => {
    await createBlog('Blog 1');
    await createBlog('Blog 2');
    await createBlog('Blog 3');

    const firstPage = await request(app)
      .get(`${routerPath.blogs}?pageNumber=1&pageSize=2`)
      .expect(HTTP_STATUSES.OK_200);

    const secondPage = await request(app)
      .get(`${routerPath.blogs}?pageNumber=2&pageSize=2`)
      .expect(HTTP_STATUSES.OK_200);

    expect(firstPage.body.page).toBe(1);
    expect(firstPage.body.pageSize).toBe(2);
    expect(firstPage.body.items).toHaveLength(2);

    expect(secondPage.body.page).toBe(2);
    expect(secondPage.body.pageSize).toBe(2);
    expect(secondPage.body.totalCount).toBe(3);
    expect(secondPage.body.pagesCount).toBe(2);
    expect(secondPage.body.items).toHaveLength(1);

    expect(secondPage.body.items[0].id).not.toBe(firstPage.body.items[0].id);
    expect(secondPage.body.items[0].id).not.toBe(firstPage.body.items[1].id);
  });

  it('GET /blogs should return empty items with correct pagination metadata when db is empty', async () => {
    const res = await request(app)
      .get(routerPath.blogs)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('GET /blogs should preserve correct items count on the last page', async () => {
    await createBlog('Blog 1');
    await createBlog('Blog 2');
    await createBlog('Blog 3');
    await createBlog('Blog 4');
    await createBlog('Blog 5');

    const res = await request(app)
      .get(`${routerPath.blogs}?pageNumber=3&pageSize=2`)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.page).toBe(3);
    expect(res.body.pageSize).toBe(2);
    expect(res.body.totalCount).toBe(5);
    expect(res.body.pagesCount).toBe(3);
    expect(res.body.items).toHaveLength(1);
  });
});