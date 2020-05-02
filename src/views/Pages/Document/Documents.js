import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  Row,
} from "reactstrap";
import { PageContent } from "../../../containers/DefaultLayout/PageContent";
import { PostService } from "../../../services/post";
import DocumentCommentInput from "./CommentInput";
import DocumentComments from "./DocumentComments";
import DocumentUploadModal from "./DocumentUploadModal";

class Documents extends React.Component {
  state = {
    uploadModalOpen: false,
    isLoading: false,
    posts: [],
    accordions: {},
    openAccordion: "",
  };

  componentDidMount = () => {
    this.loadPosts();
  };

  loadPosts = () => {
    this.setState({
      isLoading: true,
    });
    PostService.getPosts()
      .then((res) => {
        let accordions = {};
        res.data.forEach((post) => {
          accordions[post.id] =
            post.id === this.state.openAccordion ? true : false;
        });
        this.setState({
          posts: res.data,
          accordions,
        });
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  toggleUploadModal = () => {
    this.setState({
      uploadModalOpen: !this.state.uploadModalOpen,
    });
  };

  onDone = () => {
    this.setState(
      {
        uploadModalOpen: false,
      },
      this.loadPosts
    );
  };

  toggleAccordion = (id) => {
    let accordions = Object.assign({}, this.state.accordions);
    Object.keys(this.state.accordions).forEach((key) => {
      if (key === id) return (accordions[key] = !accordions[key]);
      accordions[key] = false;
    });
    this.setState({
      accordions,
      openAccordion: id,
    });
  };

  render() {
    return (
      <PageContent>
        <DocumentUploadModal
          isOpen={this.state.uploadModalOpen}
          toggle={this.toggleUploadModal}
          onDone={this.onDone}
        />
        <Row>
          <Col cols={12} className="d-flex justify-content-between">
            <h4
              style={{
                fontFamily: "Ubuntu",
              }}
            >
              Documents
            </h4>
            <div>
              <Button
                color="primary"
                onClick={() => {
                  this.setState({
                    uploadModalOpen: true,
                  });
                }}
              >
                Upload document
              </Button>
            </div>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col cols={12}>
            {this.state.posts.map((post, index) => (
              <Card className="mb-0 animated fadeIn" key={index}>
                <CardHeader id="headingOne" className="d-flex">
                  <Button
                    block
                    color="link"
                    className="text-left m-0 p-0"
                    onClick={() => this.toggleAccordion(post.id)}
                    aria-expanded={this.state.accordions[post.id]}
                    aria-controls="collapseOne"
                  >
                    <h5 className="m-0 p-0">{post.title}</h5>
                  </Button>
                  <div className="card-header-actions">
                    {post.attachments && post.attachments[0] && (
                      <a href={post.attachments[0].path} download>
                        <i className="fa fa-download"></i>
                      </a>
                    )}
                  </div>
                </CardHeader>
                <Collapse
                  isOpen={this.state.accordions[post.id]}
                  data-parent="#accordion"
                  id="collapseOne"
                  aria-labelledby="headingOne"
                >
                  <CardBody>
                    <DocumentComments
                      comments={post.comments}
                      onDeleted={() => {
                        this.setState({
                          openAccordion: post.id,
                        });
                        this.loadPosts();
                      }}
                    />
                    <DocumentCommentInput
                      post={post}
                      onCommented={() => {
                        this.setState({
                          openAccordion: post.id,
                        });
                        this.loadPosts();
                      }}
                    />
                  </CardBody>
                </Collapse>
              </Card>
            ))}
          </Col>
        </Row>
      </PageContent>
    );
  }
}

export default Documents;
