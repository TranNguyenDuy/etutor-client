import React from "react";
import { connect } from "react-redux";
import { Form, Input } from "reactstrap";
import { MessageService } from "../../../services/message";
import { markConversationAsRead } from "../../../redux/actions";

class MessageInput extends React.Component {
  state = {
    text: "",
    isSending: false,
  };

  textChange = (e) => {
    e = e || window.event;
    this.setState({
      text: e.target.value,
    });
  };

  sendMessage = () => {
    if (this.state.isSending) return;
    if (!this.state.text) return;
    const {
      conversation,
      auth: { user },
    } = this.props;
    if (!conversation || !user) return;
    let to = "";
    if (conversation.tutor && conversation.tutor.id === user.id) {
      to = conversation.student && conversation.student.id;
    } else {
      to = conversation.tutor && conversation.tutor.id;
    }
    if (!to) return;
    const text = this.state.text;
    this.setState({
      isSending: true,
    });
    MessageService.sendMessage(text, to)
      .then((res) => {
        this.setState({
          text: "",
        });
        if (this.props.onRefresh) this.props.onRefresh();
      })
      .finally(() => {
        this.setState({
          isSending: false,
        });
      });
  };

  markConversationAsRead = () => {
    const { conversation } = this.props;
    if (!conversation) return;
    this.props.markConversationAsRead(conversation.id);
  };

  render() {
    return (
      <React.Fragment>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            this.sendMessage();
          }}
        >
          <div
            onFocus={this.markConversationAsRead}
            className="d-flex message-input-wrapper"
          >
            <Input
              disabled={this.state.isSending}
              value={this.state.text}
              onChange={this.textChange}
              className="message-input"
            />
            <div className="send-button-container">
              <span onClick={this.sendMessage} className="send-button">
                Send
              </span>
            </div>
          </div>
        </Form>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  conversation: state.messages.conversation,
});

const mapDispatchToProps = (dispatch) => ({
  markConversationAsRead: (conversationId) =>
    dispatch(markConversationAsRead(conversationId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MessageInput);
