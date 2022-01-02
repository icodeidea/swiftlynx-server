export interface IActivity {
    User: String;
    subject: String;
    subjectRef: String;
    content: String;
    type?: String;
    deleted: Boolean
  }
  
  export interface IActivityInputDTO {
    User: String;
    subject: String;
    content: string;
    subjectRef?: String;
    type?: String;
  }