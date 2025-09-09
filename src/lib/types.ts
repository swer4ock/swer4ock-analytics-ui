export interface ReadyAsset {
  name: string;
  fq_name: string;
  description: string | null;
  tags: string[] | null;
  last_refreshed: string | null;
}

export interface AdsPulse {
  [key: string]: any;
}
