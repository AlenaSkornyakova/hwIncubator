import request from 'supertest';
import { app, routerPath } from '../src/set-app';
import { HTTP_STATUSES } from '../src/core/utils/http-status';
import { VideoUpdateInputDto } from '../src/videos/dto/video-update.input.dto';
import { VideoResolution } from '../src/videos/types/video';

describe('Video API body validation', () => {
  const correctCreateVideoData = {
    title: 'Test title',
    author: 'Test author',
    availableResolutions: [VideoResolution.P720, VideoResolution.P1080],
  };

  const correctUpdateVideoData: VideoUpdateInputDto = {
    ...correctCreateVideoData,
    canBeDownloaded: true,
    minAgeRestriction: 18,
    publicationDate: new Date().toISOString(),
  };

  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it('should not create Video with incorrect body', async () => {
    const invalidDataSet1 = await request(app)
      .post(routerPath.videos)
      .send({
        ...correctCreateVideoData,
        title: '   ',
        author: '    ',
        availableResolutions: ['invalid-resolution'] as any,
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet1.body.errorMessages).toHaveLength(3);

    const invalidDataSet2 = await request(app)
      .post(routerPath.videos)
      .send({
        ...correctCreateVideoData,
        title: '',
        author: '    ',
        availableResolutions: ['invalid-resolution'] as any,
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet2.body.errorMessages).toHaveLength(3);

    const invalidDataSet3 = await request(app)
      .post(routerPath.videos)
      .send({
        ...correctCreateVideoData,
        title: 'A',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const videoListResponse = await request(app).get(routerPath.videos).expect(HTTP_STATUSES.OK_200);
    expect(videoListResponse.body).toHaveLength(0);
  });

  it('should not update Video when incorrect data passed', async () => {
    const { body: createdVideo } = await request(app)
      .post(routerPath.videos)
      .send(correctCreateVideoData)
      .expect(HTTP_STATUSES.CREATED_201);

    const invalidDataSet1 = await request(app)
      .put(`${routerPath.videos}/${createdVideo.id}`)
      .send({
        ...correctUpdateVideoData,
        title: '',
        author: '    ',
        availableResolutions: ['invalid-resolution'] as any,
        canBeDownloaded: 'not-a-boolean' as any,
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    // тут длина может быть 3 или 4 — зависит от того, валидируешь ли ты canBeDownloaded в update
    expect(invalidDataSet1.body.errorMessages.length).toBeGreaterThanOrEqual(3);

    const invalidDataSet3 = await request(app)
      .put(`${routerPath.videos}/${createdVideo.id}`)
      .send({
        ...correctUpdateVideoData,
        title: 'A',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(invalidDataSet3.body.errorMessages).toHaveLength(1);

    const videoResponse = await request(app)
      .get(`${routerPath.videos}/${createdVideo.id}`)
      .expect(HTTP_STATUSES.OK_200);

    // Главное: после 400 сущность не изменилась
    expect(videoResponse.body).toEqual(createdVideo);
  });

  it('should not update Video when incorrect availableResolutions passed', async () => {
    const { body: createdVideo } = await request(app)
      .post(routerPath.videos)
      .send(correctCreateVideoData)
      .expect(HTTP_STATUSES.CREATED_201);

    await request(app)
      .put(`${routerPath.videos}/${createdVideo.id}`)
      .send({
        ...correctUpdateVideoData,
        availableResolutions: [VideoResolution.P720, 'invalid-resolution' as any, VideoResolution.P1080],
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    const videoResponse = await request(app)
      .get(`${routerPath.videos}/${createdVideo.id}`)
      .expect(HTTP_STATUSES.OK_200);

    expect(videoResponse.body).toEqual(createdVideo);
  });
});
