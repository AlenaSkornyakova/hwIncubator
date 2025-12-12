import type { VideoResolution } from '../types/video';

export interface VideoUpdateInputDto {
  title: string;
  author: string;
  availableResolutions: VideoResolution[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: string;
}