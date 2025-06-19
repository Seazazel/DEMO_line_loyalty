export interface userSession {
    userID : string,
    step? : string, // keep step for postback
    content? : string,
}

export enum ConversationStep {
  Priority = 'priority',
  Urgency = 'urgency',
  Category = 'category',
  Subcategory = 'subcategory',
  Content = 'content',
  Done = 'done',
}