export interface IChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  createdAt: string;
  audioData?: string;
}

export interface ChatState {
  messages: IChatMessage[];
  loading: boolean;
  error?: string;
  readyState?: 'OPEN' | 'CLOSED' | 'CONNECTING';
  isListening?: boolean;
  isMuted?: boolean;
  isPlaying?: boolean;
}
