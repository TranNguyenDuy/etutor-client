import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { PostService } from "../../../services/post";
import { displayName } from "../../../utils/name";

class DocumentComments extends React.Component {
  state = {
    isDeleting: false,
  };

  deleteComment = (id) => () => {
    this.setState({
      isDeleting: true,
    });
    PostService.deleteComment(id)
      .then(() => {
        this.setState({
          isDeleting: false,
        });
        if (this.props.onDeleted) this.props.onDeleted();
      })
      .catch(() => {
        this.setState({
          isDeleting: false,
        });
      });
  };

  isOwner = (comment) => {
    const { commentedBy } = comment;
    if (!commentedBy) return false;
    const {
      auth: { user },
    } = this.props;
    if (user && user.id === commentedBy.id) return true;
    return false;
  };

  render() {
    const { comments } = this.props;

    return (
      <div className="document-comments">
        {comments.map((comment, index) => {
          return (
            <div className="comment" key={index}>
              <div className="d-flex justify-content-between">
                <p>{comment.content}</p>
                {this.isOwner(comment) && (
                  <i
                    className="fa fa-trash text-danger"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={this.deleteComment(comment.id)}
                  ></i>
                )}
              </div>
              <small>
                Commented by: {displayName(comment.commentedBy)} - at:{" "}
                {moment(comment.commentedAt)
                  .local()
                  .format("YYYY-MM-DD HH:mm:ss")}
              </small>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DocumentComments);
