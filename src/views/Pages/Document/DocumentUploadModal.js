import React from "react";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";
import {
  Validators,
  withValidations,
} from "../../../hocs/form/withValidations";
import { FileService } from "../../../services/file";
import { PostService } from "../../../services/post";

class DocumentUploadModal extends React.Component {
  state = {
    isSending: false,
    fields: {
      Title: withValidations(Input, {
        validators: [Validators.required("Please input Title")],
      }),
      Document: withValidations(Input, {
        validators: [Validators.required("Please select Document")],
      }),
    },
    data: {
      title: {
        isValid: false,
        value: "",
      },
      document: {
        value: null,
      },
    },
  };

  fieldRefs = {
    title: null,
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
    return res;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const results = await this.validateAllFormFields();
    const invalidFields = results.filter((result) => !result.isValid);
    if (invalidFields.length) return;
    const { data } = this.state;
    this.setState({
      isSending: true,
    });
    const file = await FileService.uploadFile(data.document.value);
    const document = {
      title: data.title.value,
      attachments: [file.data],
      type: "document",
    };
    await PostService.createPost(document);
    this.setState({
      isSending: false,
    });
    if (this.props.onDone) this.props.onDone();
  };

  render() {
    const { Title, Document } = this.state.fields;
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={this.props.toggle}
        className="modal-primary"
      >
        <ModalHeader toggle={this.props.toggle}>Upload Document</ModalHeader>
        <ModalBody>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Col cols={12}>
                <FormGroup>
                  <Label for="documentTitle">Title</Label>
                  <Title
                    ref={this.fieldRefs.title}
                    id="documentTitle"
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
                  <Label for="documentFile">Document</Label>
                  <Input
                    id="documentFile"
                    type="file"
                    required
                    value={this.state.data.document.name}
                    onChange={(e) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          document: {
                            value: e.target.files[0] || null,
                          },
                        },
                      });
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col cols={12} className="d-flex justify-content-between">
                <div></div>
                <div>
                  <Button
                    type="submit"
                    color="primary"
                    size="sm"
                    disabled={this.state.isSending}
                  >
                    Upload
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    );
  }
}

export default DocumentUploadModal;
