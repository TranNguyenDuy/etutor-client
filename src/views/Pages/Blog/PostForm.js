import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import { PageContent } from "../../../containers/DefaultLayout/PageContent";
import {
  Validators,
  withValidations,
} from "../../../hocs/form/withValidations";
import { FileService } from "../../../services/file";
import { PostService } from "../../../services/post";
import AttachmentsPreview from "./AttachmentsPreview";

class PostForm extends React.Component {
  state = {
    mode: "create",
    postData: null,
    data: {
      title: {
        value: "",
        isValid: false,
      },
      content: {
        value: "",
        isValid: false,
      },
    },
    attachments: [],
    files: [],
    isUploadingAttachment: false,
    isSending: false,
  };

  fieldRefs = {
    title: React.createRef(),
    content: React.createRef(),
  };

  fields = {
    Title: withValidations(Input, {
      validators: [Validators.required("Please enter post title")],
    }),
    Content: withValidations(Input, {
      validators: [Validators.required("Please enter post content")],
    }),
  };

  componentDidMount() {
    const mode = this.props.match.params["id"] ? "edit" : "create";
    this.setState({
      mode,
    });
    const { id } = this.props.match.params;
    if (id) {
      this.getPostData(id).then(this.mapPostData);
    }
  }

  mapPostData = (postData) => {
    const data = {
      title: {
        isValid: true,
        value: postData.title,
      },
      content: {
        isValid: true,
        value: postData.description,
      },
    };
    this.setState({
      postData,
      data,
      attachments: postData.attachments || [],
    });
  };

  getPostData = (id) => {
    return PostService.getPostDetails(id, "blog").then((res) => res.data);
  };

  uploadAttachment = (file) => {
    this.setState({
      isUploadingAttachment: true,
    });
    FileService.uploadFile(file)
      .then((res) => {
        this.setState({
          attachments: [...this.state.attachments, res.data],
        });
      })
      .finally(() => {
        this.setState({
          isUploadingAttachment: false,
        });
      });
  };

  removeAttachment = (attachment) => {
    let attachments = [...this.state.attachments];
    attachments = attachments.filter((a) => a.id !== attachment.id);
    this.setState({
      attachments,
    });
  };

  validateAllFormFields = async () => {
    const promises = [];
    Object.keys(this.fieldRefs).forEach((key) => {
      const ref = this.fieldRefs[key];
      if (!ref) return;
      promises.push(
        ref.current.markAsTouched().then(() => {
          return ref.current.validateAsPromise();
        })
      );
    });
    const res = await Promise.all(promises);
    const isInvalid = !!res.filter((result) => !result.isValid).length;
    return isInvalid;
  };

  handleSubmit = async () => {
    const isFormInvalid = await this.validateAllFormFields();
    if (isFormInvalid) return;
    const data = {
      title: this.state.data.title.value,
      description: this.state.data.content.value,
      type: "blog",
      attachments: this.state.attachments,
    };
    this.setState({
      isSending: true,
    });
    if (this.state.mode === "create") {
      await PostService.createPost(data);
    } else {
      await PostService.updatePost(this.state.postData.id, data);
    }
    this.setState(
      {
        isSending: false,
      },
      () => {
        this.props.history.push("/blog");
      }
    );
  };

  render() {
    const { Title, Content } = this.fields;
    return (
      <PageContent>
        <Card>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              this.handleSubmit();
            }}
          >
            <CardHeader>
              <i className="fa fa-cloud-upload"></i>{" "}
              {this.state.mode === "create" ? "New Post" : "Edit Post"}
            </CardHeader>
            <CardBody>
              <Row>
                <Col cols={12}>
                  <FormGroup>
                    <Label required for="postTitle">
                      Title
                    </Label>
                    <Title
                      ref={this.fieldRefs.title}
                      id="postTitle"
                      type="text"
                      value={this.state.data.title.value}
                      onChange={(value, isValid) => {
                        this.setState({
                          data: {
                            ...this.state.data,
                            title: {
                              value,
                              isValid,
                            },
                          },
                        });
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col cols={12}>
                  <FormGroup>
                    <Label required for="postContent">
                      Content
                    </Label>
                    <Content
                      ref={this.fieldRefs.content}
                      id="postContent"
                      type="textarea"
                      rows={10}
                      value={this.state.data.content.value}
                      onChange={(value, isValid) => {
                        this.setState({
                          data: {
                            ...this.state.data,
                            content: {
                              value,
                              isValid,
                            },
                          },
                        });
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col cols={12}>
                  <FormGroup>
                    <Label
                      for="postAttachments"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      Attachments&nbsp;
                      {this.state.isUploadingAttachment ? (
                        <Spinner size="sm" color="primary" />
                      ) : (
                        <i className="fa fa-plus text-primary"></i>
                      )}
                      <Input
                        type="file"
                        id="postAttachments"
                        hidden
                        disabled={this.state.isUploadingAttachment}
                        onChange={(e) => {
                          this.uploadAttachment(e.target.files[0]);
                        }}
                      />
                    </Label>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col cols={12}>
                  <AttachmentsPreview
                    attachments={this.state.attachments}
                    removeAttachment={this.removeAttachment}
                    mode="form"
                  />
                </Col>
              </Row>
            </CardBody>
            <CardFooter className="d-flex justify-content-between">
              <div></div>
              <div>
                <Button
                  className="mr-2"
                  type="button"
                  color="secondary"
                  onClick={() => {
                    this.props.history.goBack();
                  }}
                  disabled={this.state.isSending}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  type="submit"
                  disabled={this.state.isSending}
                >
                  Save&nbsp;
                  {this.state.isSending && <Spinner size="sm" color="white" />}
                </Button>
              </div>
            </CardFooter>
          </Form>
        </Card>
      </PageContent>
    );
  }
}

export default PostForm;
