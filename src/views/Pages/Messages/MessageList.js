import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ListGroup, ListGroupItem } from "reactstrap";
import { displayName } from "../../../utils/name";

const MessageList = (props) => {
  const {
    messages = [],
    conversation,
    auth: { user },
  } = props;
  if (!conversation || !user) return null;
  const { tutor, student } = conversation;

  return (
    <ListGroup className="message-list">
      {messages.map((message, index) => {
        const { from, content } = message;
        if (!from) return null;
        const sender = tutor.id === from.id ? tutor : student;
        let avatarPath = "assets/img/avatars/7.jpg";
        if (sender.avatar && sender.avatar.path) {
          avatarPath = sender.avatar.path;
        }

        return (
          <ListGroupItem
            className={`message ${sender.id === user.id ? "me" : ""}`}
            key={index}
          >
            <img className="img-avatar" src={avatarPath} alt="me" />
            <div className="message-data">
              <p className="sender-name">{displayName(sender)}</p>
              <p className="message-content badge-primary p-2 rounded">
                {content}
              </p>
            </div>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});
export default withRouter(connect(mapStateToProps)(MessageList));
