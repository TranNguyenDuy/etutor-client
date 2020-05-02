import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, Row } from "reactstrap";
import { AssignStudentModal } from "./AssignStudentModal";

class StudentsAssigned extends React.Component {
  state = {
    assignModalOpen: false
  };

  allowedToAssignOrRevoke = () => {
    const { user } = this.props.auth;
    if (!user) return false;
    switch (user.role) {
      case "admin":
        return true;
      case "staff":
        return true;
      default:
        return false;
    }
  };

  toggleModal = () => {
    this.setState({
      assignModalOpen: !this.state.assignModalOpen
    })
  }

  revoke = (id) => {
    if (this.props.onRevoke) this.props.onRevoke(id);
  }


  render() {
    const { students } = this.props;
    return (
      <React.Fragment>
        <AssignStudentModal
          isOpen={this.state.assignModalOpen}
          toggle={this.toggleModal}
          students={this.props.students}
          tutorId={this.props.tutorId}
          onCancel={() => {
            this.setState({
              assignModalOpen: false
            })
          }}
          postAssign={() => {
            if (this.props.postAssign) this.props.postAssign();
          }}
        />
        <Row>
          <Col cols={12}>
            <Card>
              <CardHeader>
                <strong>Students</strong> Assigned
                {this.allowedToAssignOrRevoke() && <div className="card-header-actions">
                  <Button color="primary" size="sm" onClick={() => this.setState({
                    assignModalOpen: true
                  })}>
                    Assign Students
                  </Button>
                </div>}
              </CardHeader>
              <CardBody>
                {students.length ? <ListGroup>
                  {students.map((student, index) => {
                    return (
                      <ListGroupItem
                        key={index}
                        className="d-flex justify-content-between"
                      >
                        <p>
                          {student.firstName} {student.lastName} (
                          {student.email})
                        </p>
                        {this.allowedToAssignOrRevoke() && (
                          <div className="d-block d-md-flex">
                            <div>
                              <Button
                                className="ml-2 my-auto"
                                color="danger"
                                size="sm"
                                onClick={() => {
                                  this.revoke(student.id)
                                }}
                              >
                                Revoke
                              </Button>
                            </div>
                          </div>
                        )}
                      </ListGroupItem>
                    );
                  })}
                </ListGroup> : <Row>
                    <Col cols={12}>
                      <p>No students assigned</p>
                    </Col>
                  </Row>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(withRouter(StudentsAssigned));
