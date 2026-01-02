
export interface Section {
  id: string;
  title: string;
  content: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  sections: Section[];
}

export type ViewState = 'toc' | 'reader';
