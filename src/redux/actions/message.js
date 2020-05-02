export const SELECT_CONVERSATION = "MESSAGE/SELECT_CONVERSATION";
export const CONVERSATIONS_LOADED = "MESSAGE/CONVERSATION_LOADED";
export const PUSH_UNREAD_MESSAGE = "MESSAGE/PUSH_UNREAD_MESSAGE";
export const MARK_CONVERSATION_AS_READ = "MESSAGE/MARK_CONVERSATION_AS_READ";

export const pushUnreadMessage = (message) => ({
  type: PUSH_UNREAD_MESSAGE,
  message,
});

export const markConversationAsRead = (conversationId) => ({
  type: MARK_CONVERSATION_AS_READ,
  conversationId,
});

export const conversationsLoaded = (conversations) => ({
  type: CONVERSATIONS_LOADED,
  conversations,
});

export const selectConversation = (conversation) => ({
  type: SELECT_CONVERSATION,
  conversation,
});
