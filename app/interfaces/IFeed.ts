export interface IFeed {
    _id: string;
    author: String;   
    slug: String;
    kpi?: {
        comments: Number;
        reaction: Number;
    },
    title: String;
    content: String;
    image: String;  
    reward: number;
    threshold: number;
    comment?: Array<{}>;
    reaction?: Array<{}>;  
    published: Boolean;
    deleted?: Boolean;
  }
  
  export interface IFeedInputDTO {
    title: string;
    content: string;
    reward?: number;
    threshold?: number;  
    image: string;
    published: Boolean;
  }