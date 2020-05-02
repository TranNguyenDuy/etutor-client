import {
  CONVERSATIONS_LOADED,
  SELECT_CONVERSATION,
  PUSH_UNREAD_MESSAGE,
  MARK_CONVERSATION_AS_READ,
} from "../actions";

export const initialMessageState = {
  conversations: [],
  conversation: null,
  unreadMessages: [],
};

export function messageReducer(state = initialMessageState, action) {
  switch (action.type) {
    case MARK_CONVERSATION_AS_READ:
      return {
        ...state,
        unreadMessages: state.unreadMessages.filter(
          (message) =>
            message &&
            message.conversation &&
            message.conversation.id !== action.conversationId
        ),
      };
    case PUSH_UNREAD_MESSAGE:
      return {
        ...state,
        unreadMessages: [...state.unreadMessages, action.message].filter(
          (message) => message && message.conversation
        ),
      };
    case CONVERSATIONS_LOADED:
      return {
        ...state,
        conversations: action.conversations || [],
      };
    case SELECT_CONVERSATION:
      return {
        ...state,
        conversation: action.conversation || null,
      };
    default:
      return state;
  }
}
