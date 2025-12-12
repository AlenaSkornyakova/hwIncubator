import type { Video } from "../videos/types/video";

export type DBType = {
  videos: Video[];
}

export const db = {
  videos: <Video[]>[
    {
      id: 1,
      title: "string",
      author: "string",
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: "2025-12-11T11:23:37.295Z",
      publicationDate: "2025-12-11T11:23:37.295Z",
      availableResolutions: ["P144"],
    },
  ],
};
