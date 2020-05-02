import React from "react";
import { Form, Input } from "reactstrap";
import { PostService } from "../../../services/post";

class PostCommentInput extends React.Component {
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
      <Form
        className="document-comment-input"
        onSubmit={(e) => {
          e.preventDefault();
          this.handleSubmit();
        }}
      >
        <div className="d-flex">
          <Input
            placeholder="Type something to comment..."
            value={this.state.text}
            onChange={(e) => {
              this.setState({
                text: e.target.value,
              });
            }}
          />
          <div className="send-button-container">
            <span className="send-button" onClick={this.handleSubmit}>
              Submit
              {this.state.isSending && "ting..."}
            </span>
          </div>
        </div>
      </Form>
    );
  }
}

export default PostCommentInput;
