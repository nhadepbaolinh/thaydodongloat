export interface ImageFile {
  id: string;
  file: File;
  url: string;
}

export enum JobStatus {
  PENDING,
  PROCESSING,
  COMPLETED,
  FAILED,
}

export interface Job {
  id: string;
  outfit: ImageFile;
  status: JobStatus;
  resultUrl?: string;
  error?: string;
}
