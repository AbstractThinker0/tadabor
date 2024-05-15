export interface tagProps {
  tagID: string;
  tagDisplay: string;
}

export interface tagsProps {
  [key: string]: tagProps;
}

export interface versesTagsProps {
  [key: string]: string[];
}
