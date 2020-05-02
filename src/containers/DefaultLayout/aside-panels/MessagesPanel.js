import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Spinner } from "reactstrap";
import {
  conversationsLoaded,
  markConversationAsRead,
  pushUnreadMessage,
  selectConversation,
} from "../../../redux/actions";
import { MessageService } from "../../../services/message";
import socket from "../../../socket";
class MessagesPanel extends React.Component {
  state = {
    isLoading: false,
  };

  componentDidMount() {
    this.loadConversations();
    this.listenToNewMessages();
  }

  listenToNewMessages = () => {
    socket.on("noti", (noti) => {
      if (noti.type === "message") {
        this.props.pushUnreadMessage(noti.message);
      }
    });
  };

  loadConversations = () => {
    this.setState({ isLoading: true });
    MessageService.getConversations()
      .then((res) => {
        this.props.conversationsLoaded(res.data);
      })
      .catch((error) => {
        console.error(error);
        this.props.conversationsLoaded([]);
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  viewConversation = (conversation) => () => {
    if (!conversation) return;
    this.props.markConversationAsRead(conversation.id);
    this.props.selectConversation(conversation);
    this.props.history.push(`/messages/${conversation.id}`);
  };

  getNewMessages = (conversationId) => {
    const { user } = this.props.auth;
    if (!user) return [];
    const newMessages = this.props.unreadMessages.filter((message) => {
      const matchConversation =
        message.conversation && message.conversation.id === conversationId;
      if (user.role === "tutor") {
        return (
          matchConversation &&
          message.conversation &&
          message.conversation.tutor &&
          message.conversation.tutor.id === user.id
        );
      } else if (user.role === "student") {
        return (
          matchConversation &&
          message.conversation &&
          message.conversation.student &&
          message.conversation.student.id === user.id
        );
      }
      return false;
    });
    return newMessages;
  };

  render() {
    const {
      messages: { conversation: selectedConversation, conversations },
    } = this.props;

    return (
      <div className="aside-messages-panel">
        {this.state.isLoading && <Spinner color="primary" />}
        {conversations.map((conversation, index) => {
          const {
            auth: { user },
          } = this.props;
          const conversationWith = user
            ? user.role === "tutor"
              ? conversation.student
              : conversation.tutor
            : null;

          if (!conversationWith) return null;
          let avatarPath = "assets/img/avatars/7.jpg";
          if (conversationWith.avatar) {
            avatarPath = conversationWith.avatar.path || avatarPath;
          }
          const newMessages = this.getNewMessages(conversation.id);
          return (
            <React.Fragment key={index}>
              <div
                onClick={this.viewConversation(conversation)}
                className={`message d-flex ${
                  selectedConversation &&
                  selectedConversation.id === conversation.id &&
                  "selected"
                }`}
              >
                <div className="my-auto mr-3">
                  <div className="avatar">
                    <img
                      src={avatarPath}
                      className="img-avatar"
                      alt={
                        conversationWith.firstName + conversationWith.lastName
                      }
                    />
                    <span className="avatar-status badge-success"></span>
                  </div>
                </div>
                <div>
                  <p className="m-0 text-truncate font-weight-bold">
                    {conversationWith.firstName} {conversationWith.lastName}
                  </p>
                  <p className="m-0">
                    {newMessages.length ? (
                      <small className="text-truncate text-muted">
                        {newMessages.length} new message
                        {newMessages.length > 1 ? "s" : ""}
                      </small>
                    ) : null}
                  </p>
                </div>
              </div>
              {index < conversations.length - 1 && <hr />}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  messages: state.messages,
  unreadMessages: state.messages.unreadMessages,
});

const mapDispatchToProps = (dispatch) => ({
  conversationsLoaded: (conversations = []) =>
    dispatch(conversationsLoaded(conversations)),
  selectConversation: (conversation = null) =>
    dispatch(selectConversation(conversation)),
  pushUnreadMessage: (message) => dispatch(pushUnreadMessage(message)),
  markConversationAsRead: (conversationId) =>
    dispatch(markConversationAsRead(conversationId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(MessagesPanel));
