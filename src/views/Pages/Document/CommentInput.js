import React from "react";
import { Form, Input } from "reactstrap";
import { PostService } from "../../../services/post";

class DocumentCommentInput extends React.Component {
  state = {
    text: "",
    isSending: false,
  };

  handleSubmit = () => {
    if (!this.state.text || this.state.isSending) return;
    this.setState({
      isSending: true,
    });
    PostService.comment(this.props.post.id, this.state.text)
      .then(() => {
        this.setState({
          isSending: false,
          text: "",
        });
        if (this.props.onCommented) this.props.onCommented();
      })
      .catch(() => {
        this.setState({
          isSending: false,
        });
      });
  };

  render() {
    return (
      <React.Fragment>
        <Form
          className="document-comment-input"
          onSubmit={(e) => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <div className="d-flex">
            <Input
              value={this.state.text}
              placeholder="Type something to comment..."
              onChange={(e) => {
                this.setState({
                  text: e.target.value,
                });
              }}
            />
            <div className="send-button-container">
              <span className="send-button" onClick={this.handleSubmit}>
                Submit{this.state.isSending && "ting..."}
              </span>
            </div>
          </div>
        </Form>
      </React.Fragment>
    );
  }
}

export default DocumentCommentInput;
