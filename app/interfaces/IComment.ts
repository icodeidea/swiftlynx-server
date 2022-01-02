export interface IComment {
    _id: string;
    User: String;
    kpi: {
        comments: Number;
        reaction: Number;
    },
    subject: String;
    slug: String;
    subjectRef: String;
    content: String;
    shortContent: String;
    tags: [];
    deleted: Boolean
  }
  
  export interface ICommentInputDTO {
    subject: String;
    subjectRef: String;
    content: string;
  }