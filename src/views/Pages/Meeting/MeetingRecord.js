import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { FileService } from "../../../services/file";
import { MeetingService } from "../../../services/meeting";

class MeetingRecord extends React.Component {
  state = {
    file: null,
    record: this.props.record || null,
    isUploading: false,
    mode: this.props.record ? "view" : "upload",
  };

  uploadRecord = () => {
    if (!this.state.file) return;
    this.setState({
      isUploading: true,
    });
    FileService.uploadFile(this.state.file)
      .then((res) => {
        MeetingService.uploadMeetingRecord(this.props.meetingId, res.data)
          .then(() => {
            this.setState({
              record: res.data,
            });
          })
          .finally(() => {
            this.setState({
              isUploading: false,
              mode: "view",
            });
          });
      })
      .catch(() => {
        this.setState({
          isUploading: false,
        });
      });
  };

  render() {
    const { record } = this.state;

    return (
      <Row>
        <Col cols={12}>
          <Card>
            <CardHeader>Meeting Record</CardHeader>
            <CardBody>
              {!!!record && <p>No record uploaded</p>}
              {(!!!record || this.state.mode === "upload") && (
                <React.Fragment>
                  <FormGroup row>
                    <Col md="3">
                      <Label htmlFor="file-input">Upload a record</Label>
                    </Col>
                    <Col xs="12" md="9">
                      <Input
                        type="file"
                        id="file-input"
                        name="file-input"
                        onChange={(e) => {
                          this.setState({
                            file: e.target.files[0] || null,
                          });
                        }}
                      />
                    </Col>
                  </FormGroup>
                  <Row className="mt-4">
                    <Col cols={12} className="d-flex justify-content-between">
                      <div></div>
                      <div>
                        {!!record && (
                          <Button
                            type="button"
                            disabled={this.state.isUploading}
                            className="mr-2"
                            onClick={() => {
                              this.setState({
                                mode: "view",
                              });
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          color="primary"
                          type="submit"
                          disabled={this.state.isUploading || !this.state.file}
                          onClick={this.uploadRecord}
                        >
                          Upload
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </React.Fragment>
              )}

              {!!record && this.state.mode === "view" && (
                <React.Fragment>
                  <Row>
                    <Col md={3} sm={12}>
                      <Label>Record name:</Label>
                    </Col>
                    <Col md={9} sm={12}>
                      <a href={record.path} download className="mr-4">
                        {record.actualName}
                      </a>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => {
                          this.setState({
                            mode: "upload",
                          });
                        }}
                      >
                        Change
                      </Button>
                    </Col>
                  </Row>
                </React.Fragment>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default MeetingRecord;
