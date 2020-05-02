import React from "react";
import { connect } from "react-redux";
import { Badge, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { withAuthorizedUser } from "../../../hocs/withAuth";
import { selectConversation } from "../../../redux/actions";
import { MessageService } from "../../../services/message";
import socket from "../../../socket";
import { displayName } from "../../../utils/name";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

class Messages extends React.Component {
  state = {
    isLoading: false,
    messages: [],
  };

  componentDidMount() {
    this.fetchConversationInfo();
    this.listenToNewMessage();
  }

  componentDidUpdate(props) {
    if (
      !props.messages.conversation ||
      props.messages.conversation.id !== this.props.messages.conversation.id
    ) {
      this.fetchConversationInfo();
    }
  }

  listenToNewMessage = () => {
    socket.on("noti", this.handleOnMessagePushed);
  };

  handleOnMessagePushed = (noti) => {
    if (noti.type !== "message") return;
    if (!this.props.messages.conversation) return;
    if (
      noti.message &&
      noti.message.conversation &&
      noti.message.conversation.id === this.props.messages.conversation.id
    ) {
      this.getMessages(noti.message.conversation.id);
    }
  };

  fetchConversationInfo = () => {
    const {
      match: {
        params: { conversationId },
      },
      messages: { conversations = [] },
    } = this.props;
    const conversation = conversations.find((c) => c.id === conversationId);
    if (!conversation) return;
    this.props.selectConversation(conversation);
    this.getMessages(conversation.id);
  };

  getMessages = (conversationId) => {
    this.setState({
      isLoading: true,
    });
    MessageService.getMessagesByConversationId(conversationId)
      .then((res) => {
        this.setState({
          messages: (res.data || []).reverse(),
        });
        const wrapper = document.getElementById("messagesWrapper");
        if (!wrapper) return;
        wrapper.scroll({
          top: wrapper.scrollHeight,
          behavior: "smooth",
        });
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  componentWillUnmount() {
    this.props.selectConversation(null);
  }

  render() {
    const {
      messages: { conversation },
      auth: { user },
    } = this.props;
    if (!user) return null;
    const conversationName =
      conversation &&
      (conversation.tutor && conversation.tutor.id === user.id
        ? displayName(conversation.student)
        : displayName(conversation.tutor));

    return (
      <div className="animated fadeIn messages-container">
        <Row>
          <Col cols={12}>
            <Card>
              <CardHeader>
                <i className="icon-cursor"></i> Messages{" "}
                <Badge
                  color="primary"
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {conversationName}
                </Badge>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col className="messages">
                    <div id="messagesWrapper" className="messages-wrapper">
                      <MessageList
                        conversation={conversation}
                        messages={this.state.messages}
                      />
                    </div>
                    <div className="input-container">
                      <MessageInput
                        onRefresh={() => {
                          this.getMessages(conversation.id);
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages,
});

const mapDispatchToProps = (dispatch) => ({
  selectConversation: (conversation) =>
    dispatch(selectConversation(conversation)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuthorizedUser(Messages));
