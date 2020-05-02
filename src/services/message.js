import { APIService } from "./api";

const sendMessage = (text, to) => {
    return APIService.post('/messages', {
        content: text,
        to
    })
}

const getConversations = () => {
    return APIService.get('/messages');
}

const getMessagesByConversationId = (conversationId) => {
    return APIService.get(`/messages/${conversationId}`);
}

export const MessageService = {
    sendMessage,
    getConversations,
    getMessagesByConversationId
}