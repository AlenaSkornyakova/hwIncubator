import type { VideoResolution } from '../types/video';

export interface VideoInputDto {
  title: string;
  author: string;
  availableResolutions: VideoResolution[];
}