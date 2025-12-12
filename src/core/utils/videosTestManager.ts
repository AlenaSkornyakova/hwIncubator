import request from "supertest";
import { app } from "../../set-app";
import { VideoInputDto } from "../../videos/dto/video-input.dto";
import { HTTP_STATUSES, HttpStatusType } from "./http-status";


export const videosTestManager = {
  async createVideo(
    data: VideoInputDto,
    expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
  ) {
    const response = await request(app)
      .post(`/videos`)
      .send(data)
      .expect(expectedStatusCode);

    let createdEntity;

    if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
      createdEntity = response.body;
      expect(createdEntity).toEqual({
        id: expect.any(Number),
        title: data.title,
        author: data.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: expect.any(String),
        publicationDate: expect.any(String),
        availableResolutions: data.availableResolutions,
      });
    }
    return { response, createdEntity };
  },
};
