import express from 'express';
import { Request, Response } from 'express';
import type { Video } from '../types/video';
import type { VideoInputDto } from '../dto/video-input.dto';
import type { VideoOutputDto } from '../dto/video-output.dto';
import type { DBType } from '../../db/in-memory.db';
import { HTTP_STATUSES } from '../../core/utils/http-status';
import { RequestWithQuery, RequestWithBody, RequestWithParams } from '../../core/types/types';
import { VideoUpdateInputDto } from '../dto/video-update.input.dto';

export const mapVideo = (dbVideo: Video): VideoOutputDto => {
  return {
    id: dbVideo.id,
    title: dbVideo.title,
    author: dbVideo.author,
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: dbVideo.createdAt,
    publicationDate: dbVideo.publicationDate,
    availableResolutions: dbVideo.availableResolutions,
  };
};

export const videosRouter = (db: DBType) => {
  const router = express.Router();

  router.get('/', (req: Request, res: Response<Video[]>) => {
    res.status(HTTP_STATUSES.OK_200).json(db.videos.map(mapVideo));
  });

  router.post('/', (req: RequestWithBody<VideoInputDto>, res: Response<VideoOutputDto>) => {
    if (!req.body.title || !req.body.author || !req.body.availableResolutions) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      return;
    }
    const newVideo: VideoOutputDto = {
      id: +new Date(),
      title: req.body.title,
      author: req.body.author,
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date().toISOString(),
      availableResolutions: req.body.availableResolutions,
    };
    db.videos.push(newVideo);
    res.status(HTTP_STATUSES.CREATED_201).json(mapVideo(newVideo));
  });

  router.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response<VideoOutputDto>) => {
    const id = Number(req.params.id);
    const video = db.videos.find((v) => v.id === id);
    if (!video) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
    return res.status(HTTP_STATUSES.OK_200).json(video);
  });

  router.put(
    '/:id',( req: RequestWithParams<{ id: string }> & RequestWithBody<VideoUpdateInputDto>,
      res: Response,) => {
      const id = Number(req.params.id);
      const video = db.videos.find((v) => v.id === id);
      if (!video) {
        return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      }
      if (!req.body.title || !req.body.author || !req.body.availableResolutions) {
        return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
      }
      video.title = req.body.title;
      video.author = req.body.author;
      video.availableResolutions = req.body.availableResolutions;
      video.canBeDownloaded = req.body.canBeDownloaded;
      video.minAgeRestriction = req.body.minAgeRestriction;
      video.publicationDate = req.body.publicationDate;

      return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
  );

  router.delete('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);
    const index = db.videos.findIndex((c) => c.id === id);
    if (index > -1) {
      db.videos.splice(index, 1);
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  });
  return router;
};
