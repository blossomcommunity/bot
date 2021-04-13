export interface PanelRes {
  data: Data;
  extensions: Extensions;
}

export interface Data {
  user: User;
}

export interface User {
  description: string;
  panels: Panel[];
}

export interface Panel {
  __typename: string;
  linkURL?: string;
}

export interface Extensions {
  durationMilliseconds: number;
  requestID: string;
}
