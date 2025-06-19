export interface userSession {
    userID : string,
    step? : string, // keep step for postback
    content? : string,
}

export interface ServiceCenter {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export enum ConversationStep {
  Priority = 'priority',
  Urgency = 'urgency',
  Category = 'category',
  Subcategory = 'subcategory',
  Content = 'content',
  Done = 'done',
}