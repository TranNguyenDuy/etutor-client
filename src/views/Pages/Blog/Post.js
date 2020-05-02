import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Card, CardBody } from "reactstrap";
import { ConfirmModal } from "../../../modals/confirm-modal";
import { PostService } from "../../../services/post";
import AttachmentsPreview from "./AttachmentsPreview";
import PostCommentInput from "./PostCommentInput";
import PostComments from "./PostComments";

class Post extends React.Component {
  state = {
    confirmModalShow: false,
  };

  isAuthor = () => {
    if (!this.props.auth || !this.props.auth.user) return false;
    return (
      this.props.post.author &&
      this.props.post.author.id === this.props.auth.user.id
    );
  };

  deletePost = () => {
    PostService.deletePost(this.props.post.id).then(() => {
      if (this.props.refetch) this.props.refetch();
    });
  };

  render() {
    const { post, className } = this.props;
    return (
      <div className="animated fadeIn">
        <ConfirmModal
          title="Confirm delete post"
          type="danger"
          isOpen={this.state.confirmModalShow}
          toggle={() =>
            this.setState({
              confirmModalShow: !this.state.confirmModalShow,
            })
          }
          content="Are you sure want to delete this post?"
          onCancel={() =>
            this.setState({
              confirmModalShow: false,
            })
          }
          onConfirm={this.deletePost}
        />
        <Card
          className={`${className} mb-0`}
          style={{
            borderBottom: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <CardBody className="pb-0">
            <div className="d-flex justify-content-between">
              <h3>
                <b>{post.title}</b>
              </h3>
              {this.isAuthor() && (
                <div>
                  <Button
                    color="link"
                    onClick={() => {
                      this.props.history.push(`/blog/${post.id}/edit`);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    color="link"
                    style={{
                      color: "red",
                    }}
                    onClick={() =>
                      this.setState({
                        confirmModalShow: true,
                      })
                    }
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
            <hr />
            <p>{post.description}</p>
            {!!post.attachments.length && (
              <React.Fragment>
                <hr />
                <div className="pb-3">
                  <p>
                    <b>Attachments:</b>
                  </p>
                  <AttachmentsPreview
                    mode="view"
                    attachments={post.attachments}
                  />
                </div>
              </React.Fragment>
            )}
          </CardBody>
        </Card>
        <Card
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderTop: 0,
          }}
        >
          <CardBody>
            <PostComments
              comments={post.comments}
              onDeleted={() => {
                this.props.refetchPost(post.id, post.type);
              }}
            />
            <PostCommentInput
              post={post}
              onCommented={() => {
                this.props.refetchPost(post.id, post.type);
              }}
            />
          </CardBody>
        </Card>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(withRouter(Post));
