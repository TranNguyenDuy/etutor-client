import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import { UserService } from "../../../services/user";
import { AssignTutorModal } from "./AssignTutorModal";

class TutorInfo extends React.Component {
  state = {
    assignModalOpened: false,
    isAssigning: false
  };

  toggleModal = () =>
    this.setState({
      assignModalOpened: !this.state.assignModalOpened
    });

  allowedToAssignOrRevoke = () => {
    const { user } = this.props.auth;
    if (!user) return false;
    switch (user.role) {
      case "admin":
        return true;
      case "staff":
        return true;
      case "tutor":
        return false;
      case "student":
        return false;
      default:
        return false;
    }
  };

  onAssign = tutor => {
    this.setState({
      isAssigning: true
    });
    UserService.assignTutor([this.props.studentId], tutor.id)
      .then(res => {
        console.log(res);
        if (this.props.onReload) this.props.onReload();
      })
      .finally(() => {
        this.setState({
          isAssigning: false,
          assignModalOpened: false
        });
      });
  };

  onCancel = () =>
    this.setState({
      assignModalOpened: false
    });

  render() {
    const { tutor } = this.props;

    return (
      <React.Fragment>
        <AssignTutorModal
          isOpen={this.state.assignModalOpened}
          toggle={this.toggleModal}
          onAssign={this.onAssign}
          onCancel={this.onCancel}
          disabled={this.state.isAssigning}
        />
        <Row>
          <Col cols={12}>
            <Card>
              <CardHeader>
                <strong>Tutor</strong> Information
                {this.allowedToAssignOrRevoke() ? (
                  <div className="card-header-actions">
                    {tutor ? (
                      <Button
                        color="danger"
                        size="sm"
                        onClick={this.props.onRevoke}
                        disabled={this.props.disableRevoke}
                      >
                        Revoke
                      </Button>
                    ) : (
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() =>
                            this.setState({
                              assignModalOpened: true
                            })
                          }
                        >
                          Assign Tutor
                        </Button>
                      )}
                  </div>
                ) : null}
              </CardHeader>
              <CardBody>
                {!tutor ? (
                  <Row>
                    <Col cols={12}>
                      <p>No tutors assigned</p>
                    </Col>
                  </Row>
                ) : (
                    <dl className="row">
                      <Col md={4} sm={6}>
                        <dt>First name:</dt>
                        <dd>{tutor.firstName}</dd>
                      </Col>
                      <Col md={4} sm={6}>
                        <dt>Last name:</dt>
                        <dd>{tutor.lastName}</dd>
                      </Col>
                      <Col md={4} sm={6}>
                        <dt>Email:</dt>
                        <dd>{tutor.email}</dd>
                      </Col>
                    </dl>
                  )}
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

export default connect(mapStateToProps)(withRouter(TutorInfo));
