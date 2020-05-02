import React from "react";
import { Button, Col, Row } from "reactstrap";
import { PageContent } from "../../../containers/DefaultLayout/PageContent";
import { PostService } from "../../../services/post";
import Post from "./Post";

class Blog extends React.Component {
  state = {
    posts: [],
  };

  componentDidMount = () => {
    this.loadPosts();
  };

  loadPosts = () => {
    PostService.getPosts("blog").then(({ data }) => {
      this.setState({
        posts: data,
      });
    });
  };

  refetchPost = (postId) => {
    PostService.getPostDetails(postId).then(({ data }) => {
      this.setState({
        posts: this.state.posts.map((post) => {
          if (post.id !== postId) return post;
          return data;
        }),
      });
    });
  };

  render() {
    return (
      <PageContent>
        <Row>
          <Col cols={12} className="d-flex justify-content-between">
            <h4
              style={{
                fontFamily: "Ubuntu",
              }}
            >
              Blog
            </h4>
            <div>
              <Button
                type="button"
                color="primary"
                onClick={() => {
                  this.props.history.push("/blog/new");
                }}
              >
                New Post
              </Button>
            </div>
          </Col>
        </Row>
        {this.state.posts.map((post, index) => (
          <Post
            key={index}
            post={post}
            className={"mt-3"}
            refetch={this.loadPosts}
            refetchPost={this.refetchPost}
          />
        ))}
      </PageContent>
    );
  }
}

export default Blog;
