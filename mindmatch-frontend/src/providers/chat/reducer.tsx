import { ChatState } from './types';
import { ChatAction } from './actions';

export const initialChatState: ChatState = {
  messages: [],
  loading: false,
  error: undefined,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SEND_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: true,
        error: undefined,
      };
    case 'RECEIVE_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
}
