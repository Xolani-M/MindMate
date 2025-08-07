export interface IChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  createdAt: string;
}

export interface ChatState {
  messages: IChatMessage[];
  loading: boolean;
  error?: string;
}
