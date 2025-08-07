import { IChatMessage } from './types';

export type ChatAction =
  | { type: 'SEND_MESSAGE'; payload: IChatMessage }
  | { type: 'RECEIVE_MESSAGE'; payload: IChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | undefined };

export const sendMessage = (message: IChatMessage): ChatAction => ({
  type: 'SEND_MESSAGE',
  payload: message,
});

export const receiveMessage = (message: IChatMessage): ChatAction => ({
  type: 'RECEIVE_MESSAGE',
  payload: message,
});

export const setLoading = (loading: boolean): ChatAction => ({
  type: 'SET_LOADING',
  payload: loading,
});

export const setError = (error?: string): ChatAction => ({
  type: 'SET_ERROR',
  payload: error,
});
