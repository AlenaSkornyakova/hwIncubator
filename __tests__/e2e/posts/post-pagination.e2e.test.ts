import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { routerPath } from '../../../src/core/paths/paths';
import { clearDb } from '../../utils/clear-db';
import { postTestManager } from '../../utils/test-managers';
import { createTestApp } from '../../utils/createTestApp';

describe('Post API pagination', () => {
    const app = createTestApp();
  beforeEach(async () => {
    await clearDb(app);
  });

  const createPostWithBlog = async (index: number) => {
    const result = await postTestManager.createPostWithBlog(
      app,
      {
        title: `Post ${index}`,
        shortDescription: `Short Description ${index}`,
        content: `Content ${index}`,
      },
      {
        name: `Blog ${index}`,
        description: `Description ${index}`,
        websiteUrl: `https://blog-${index}.com`,
      },
    );

    return result.createdEntity ?? result;
  };

  it('GET /posts should return default pagination values', async () => {
    await createPostWithBlog(1);
    await createPostWithBlog(2);
    await createPostWithBlog(3);

    const res = await request(app)
      .get(routerPath.posts)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(10);
    expect(res.body.totalCount).toBe(3);
    expect(res.body.pagesCount).toBe(1);
    expect(res.body.items).toHaveLength(3);
  });

  it('GET /posts should apply pageSize', async () => {
    await createPostWithBlog(1);
    await createPostWithBlog(2);
    await createPostWithBlog(3);

    const res = await request(app)
      .get(`${routerPath.posts}?pageSize=2`)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.page).toBe(1);
    expect(res.body.pageSize).toBe(2);
    expect(res.body.totalCount).toBe(3);
    expect(res.body.pagesCount).toBe(2);
    expect(res.body.items).toHaveLength(2);
  });

  it('GET /posts should return second page correctly', async () => {
    await createPostWithBlog(1);
    await createPostWithBlog(2);
    await createPostWithBlog(3);

    const firstPage = await request(app)
      .get(`${routerPath.posts}?pageNumber=1&pageSize=2`)
      .expect(HTTP_STATUSES.OK_200);

    const secondPage = await request(app)
      .get(`${routerPath.posts}?pageNumber=2&pageSize=2`)
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

  it('GET /posts should return empty items with correct pagination metadata when db is empty', async () => {
    const res = await request(app)
      .get(routerPath.posts)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('GET /posts should preserve correct items count on the last page', async () => {
    await createPostWithBlog(1);
    await createPostWithBlog(2);
    await createPostWithBlog(3);
    await createPostWithBlog(4);
    await createPostWithBlog(5);

    const res = await request(app)
      .get(`${routerPath.posts}?pageNumber=3&pageSize=2`)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.page).toBe(3);
    expect(res.body.pageSize).toBe(2);
    expect(res.body.totalCount).toBe(5);
    expect(res.body.pagesCount).toBe(3);
    expect(res.body.items).toHaveLength(1);
  });
});