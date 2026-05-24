import request from 'supertest';
import { HTTP_STATUSES } from '../../../src/core/utils/http-status';
import { routerPath } from '../../../src/core/paths/paths';
import { clearDb } from '../../utils/clear-db';
import { postTestManager } from '../../utils/test-managers';
import { createTestApp } from '../../utils/createTestApp';
import { ResourceType } from '../../../src/core/types/resource-type.types';

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
        data: {
          type: ResourceType.Blogs, 
          attributes: {
            name: `Blog ${index}`,
            description: `Description ${index}`,
            websiteUrl: `https://blog-${index}.com`,
          },
        },
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

    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.pageSize).toBe(10);
    expect(res.body.meta.totalCount).toBe(3);
    expect(res.body.meta.pagesCount).toBe(1);
    expect(res.body.data).toHaveLength(3);
  });

  it('GET /posts should apply pageSize', async () => {
    await createPostWithBlog(1);
    await createPostWithBlog(2);
    await createPostWithBlog(3);

    const res = await request(app)
      .get(`${routerPath.posts}?pageSize=2`)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body.meta.page).toBe(1);
    expect(res.body.meta.pageSize).toBe(2);
    expect(res.body.meta.totalCount).toBe(3);
    expect(res.body.meta.pagesCount).toBe(2);
    expect(res.body.data).toHaveLength(2);
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

    expect(firstPage.body.meta.page).toBe(1);
    expect(firstPage.body.meta.pageSize).toBe(2);
    expect(firstPage.body.data).toHaveLength(2);

    expect(secondPage.body.meta.page).toBe(2);
    expect(secondPage.body.meta.pageSize).toBe(2);
    expect(secondPage.body.meta.totalCount).toBe(3);
    expect(secondPage.body.meta.pagesCount).toBe(2);
    expect(secondPage.body.data).toHaveLength(1);

    expect(secondPage.body.data[0].id).not.toBe(firstPage.body.data[0].id);
    expect(secondPage.body.data[0].id).not.toBe(firstPage.body.data[1].id);
  });

  it('GET /posts should return empty items with correct pagination metadata when db is empty', async () => {
    const res = await request(app)
      .get(routerPath.posts)
      .expect(HTTP_STATUSES.OK_200);

    expect(res.body).toEqual({
      meta: {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
      },
      data: [],
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

    expect(res.body.meta.page).toBe(3);
    expect(res.body.meta.pageSize).toBe(2);
    expect(res.body.meta.totalCount).toBe(5);
    expect(res.body.meta.pagesCount).toBe(3);
    expect(res.body.data).toHaveLength(1);
  });
});