import request from 'supertest';
import { app } from '../src/set-app';
import { HTTP_STATUSES } from '../src/core/utils/http-status';
import { videosTestManager } from '../src/core/utils/videosTestManager';
import { VideoUpdateInputDto } from '../src/videos/dto/video-update.input.dto';
import { VideoInputDto } from '../src/videos/dto/video-input.dto';

describe('Videos API', () => {
  beforeEach(async () => {
    await request(app).delete('/testing/all-data');
  });
  afterEach(async () => {
    await request(app).delete('/testing/all-data');
  });

  const createdData: VideoInputDto = {
    title: 'Test Video',
    author: 'Test Author',
    availableResolutions: ['P720', 'P1080'],
  };
  it('should return 200 and an empty array. The server is alive, the route is connected, and the contract is honored.', async () => {
    await request(app).get(`/videos`).expect(HTTP_STATUSES.OK_200, []);
  });

  it('should create a new entity with correct input data and return it', async () => {
    const { createdEntity } = await videosTestManager.createVideo(createdData);
    await request(app).get(`/videos`).expect(HTTP_STATUSES.OK_200, [createdEntity]);
  });

  it("shouldn't create a new entity with incorrect input data and return status 400", async () => {
    const invalidData = {
      title: 'Only Title',
    };
    await videosTestManager.createVideo(invalidData as any, HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('should return entity by existing id', async () => {
    const { createdEntity } = await videosTestManager.createVideo(createdData);
    const response = await request(app)
      .get(`/videos/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200);
    expect(response.body).toEqual(createdEntity);
  });

  it('should return 404 for non-existing id', async () => {
    await request(app).get('/videos/9999').expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('should update the entity by id with correct input data', async () => {
    const updatedData: VideoUpdateInputDto = {
      title: 'Updated Test Video',
      author: 'Updated Test Author',
      availableResolutions: ['P360', 'P480'],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: new Date().toISOString(),
    };
    const { createdEntity } = await videosTestManager.createVideo(createdData);

    await request(app)
      .put(`/videos/${createdEntity.id}`)
      .send(updatedData)
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    await request(app)
      .get(`/videos/${createdEntity.id}`)
      .expect(HTTP_STATUSES.OK_200, {
        ...createdEntity,
        ...updatedData,
      });
  });


  it("shouldn't update the entity by id with incorrect input data", async () => {
    const { createdEntity } = await videosTestManager.createVideo(createdData);
    const invalidData : VideoUpdateInputDto = {
      title: '',
      author: 'Updated Test Author',
      availableResolutions: ['P360', 'P480'],
      canBeDownloaded: true,
      minAgeRestriction: 18,
      publicationDate: new Date().toISOString(),
    };
    await request(app)
      .put(`/videos/${createdEntity.id}`)
      .send(invalidData)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });

  it('should delete the entity by id', async () => {
    const { createdEntity } = await videosTestManager.createVideo(createdData);
    await request(app).delete(`/videos/${createdEntity.id}`).expect(HTTP_STATUSES.NO_CONTENT_204);
    await request(app).get(`/videos/${createdEntity.id}`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
