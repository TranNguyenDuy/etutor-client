import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Spinner
} from "reactstrap";
import {
  Validators,
  withValidations
} from "../../../hocs/form/withValidations";
import { ConfirmModal } from "../../../modals/confirm-modal";
import { addAlert } from "../../../redux/actions";
import { UserService } from "../../../services/user";
import StudentsAssigned from "./StudentsAssigned";
import TutorInfo from "./TutorInfo";

class UserForm extends React.Component {
  state = {
    role: "",
    userId: "",
    isLoading: false,
    isDeleting: false,
    isRevokingTutor: false,
    deleteModalOpened: false,
    mode:
      (this.props.location.state && this.props.location.state.mode) || "create",
    isSubmitting: false,
    isTouched: false,
    data: {
      firstName: {
        value: "",
        isValid: false
      },
      lastName: {
        value: "",
        isValid: false
      },
      email: {
        value: "",
        isValid: false
      }
    },
    tutor: null,
    students: []
  };

  componentDidMount = () => {
    const {
      match: {
        params: { id }
      },
      location: { state }
    } = this.props;
    if (!state || !state.role) return this.props.history.push("/500");
    this.setState(
      {
        role: state.role
      },
      () => {
        if (id && this.state.mode !== "create")
          return this.getUserDetails(id, this.state.role);
        this.setState({ isLoading: false });
      }
    );
  };

  getUserDetails = (id, role) => {
    this.setState({
      isLoading: true,
      userId: id
    });
    UserService.getUserDetails(id, role)
      .then(res => {
        const { data } = res;
        this.setState({
          data: {
            firstName: {
              isValid: true,
              value: data.firstName
            },
            lastName: {
              isValid: true,
              value: data.lastName
            },
            email: {
              isValid: true,
              value: data.email
            }
          },
          tutor: data.tutor || null,
          students: data.students || []
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  fields = {
    FirstName: withValidations(Input, {
      validators: [Validators.required("Please input First Name")]
    }),
    LastName: withValidations(Input, {
      validators: [Validators.required("Please input Last Name")]
    }),
    Email: withValidations(Input, {
      validators: [Validators.required("Please input Email")]
    })
  };

  validateAllFields = () => {
    const { data } = this.state;
    const isValid = Object.keys(data).reduce((prev, curr) => {
      if (!prev) return prev;
      const object = data[curr];
      if (!object || !object.isValid) return false;
      return true;
    }, true);

    return isValid;
  };

  mapData = () => {
    const { data } = this.state;
    const mappedData = {};
    Object.keys(data).forEach(key => {
      mappedData[key] = data[key] ? data[key].value : "";
    });
    return mappedData;
  };

  handleSubmit = () => {
    const isValid = this.validateAllFields();
    if (!isValid) return alert("Please fill out all required fields");
    const data = this.mapData();

    this.setState({
      isSubmitting: true
    });
    if (this.state.mode === "create") {
      UserService.createUser(data, this.state.role)
        .then(() => {
          this.props.history.push(
            `/${(this.props.location.state && this.props.location.state.role) +
              "s" || ""}`
          );
        })
        .catch(err => {
          console.log(err);
          this.setState({ isSubmitting: false });
        });
    } else if (this.state.mode === "edit") {
      UserService.updateUser(this.state.userId, this.state.role, data)
        .then(res => {
          console.log("Updated user", res.data.id);
          this.getUserDetails(
            this.state.userId,
            this.props.location.state && this.props.location.state.role
              ? this.props.location.state.role
              : "student"
          );
          this.setState({ isSubmitting: false });
        })
        .catch(err => {
          console.error(err);
          this.setState({ isSubmitting: false });
        });
    }
  };

  allowedToUpdate = () => {
    const { user } = this.props.auth;
    if (!user) return false;
    switch (user.role) {
      case "admin":
        return true;
      case "staff":
        return this.state.role === "student" || this.state.role === "tutor";
      case "student":
        return false;
      case "tutor":
        return false;
      default:
        return false;
    }
  };

  allowedToDelete = () => {
    const { user } = this.props.auth;
    if (!user) return false;
    switch (user.role) {
      case "admin":
        return true;
      case "staff":
        return this.state.role === "student" || this.state.role === "tutor";
      case "student":
        return false;
      case "tutor":
        return false;
      default:
        return false;
    }
  };

  handleDelete = () => {
    this.setState({
      deleteModalOpened: true
    });
  };

  delete = () => {
    this.setState({
      isDeleting: true
    });
    UserService.deleteUser(this.state.userId, this.state.role)
      .then(() => {
        this.setState({
          deleteModalOpened: false,
          isDeleting: false
        });
        this.props.history.goBack();
      })
      .catch(() => {
        this.setState({
          deleteModalOpened: false,
          isDeleting: false
        });
      });
  };

  onRevokeTutor = () => {
    this.setState({
      isRevokingTutor: true
    });
    UserService.revokeTutor(this.state.userId)
      .then(() => {
        this.getUserDetails(this.state.userId, this.state.role);
      })
      .finally(() => {
        this.setState({
          isRevokingTutor: false
        });
      });
  };

  revokeStudent = id => {
    UserService.revokeTutor(id).then(() => {
      this.getUserDetails(this.state.userId, this.state.role);
    });
  };

  render() {
    const { FirstName, LastName, Email } = this.fields;
    if (this.state.isLoading) return <Spinner color="primary" />;
    return (
      <div className="animated fadeIn">
        <ConfirmModal
          {...{
            isOpen: this.state.deleteModalOpened,
            type: "danger",
            onConfirm: this.delete,
            toggle: () =>
              this.setState({
                deleteModalOpened: !this.state.deleteModalOpened
              }),
            onCancel: () =>
              this.setState({
                deleteModalOpened: false
              }),
            title: "Confirm delete",
            content: "Are you sure to delete this user?",
            disableButtons: this.state.isDeleting
          }}
        />
        <Row>
          <Col cols={12}>
            <Card>
              <CardHeader>
                <strong>General</strong> Information
                <div className="card-header-actions">
                  {this.allowedToDelete() && this.state.mode !== "create" && (
                    <Button
                      color="danger"
                      size="sm"
                      onClick={this.handleDelete}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardBody>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    this.handleSubmit();
                  }}
                >
                  <FormGroup>
                    <Label required htmlFor="name">
                      First Name
                    </Label>
                    <FirstName
                      type="text"
                      id="firstName"
                      value={this.state.data.firstName.value}
                      disabled={!this.allowedToUpdate()}
                      onChange={(value, isValid) => {
                        this.setState({
                          isTouched: true,
                          data: {
                            ...this.state.data,
                            firstName: {
                              value,
                              isValid
                            }
                          }
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label required htmlFor="lastName">
                      Last Name
                    </Label>
                    <LastName
                      type="text"
                      id="lastName"
                      value={this.state.data.lastName.value}
                      disabled={!this.allowedToUpdate()}
                      onChange={(value, isValid) => {
                        this.setState({
                          isTouched: true,
                          data: {
                            ...this.state.data,
                            lastName: {
                              value,
                              isValid
                            }
                          }
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label required htmlFor="email">
                      Email
                    </Label>
                    <Email
                      type="email"
                      id="email"
                      value={this.state.data.email.value}
                      disabled={!this.allowedToUpdate()}
                      onChange={(value, isValid) => {
                        this.setState({
                          isTouched: true,
                          data: {
                            ...this.state.data,
                            email: {
                              value,
                              isValid
                            }
                          }
                        });
                      }}
                    />
                  </FormGroup>
                  <Row>
                    <Col className="d-flex justify-content-between" cols={12}>
                      <div></div>
                      <div>
                        {this.allowedToUpdate() && (
                          <Button
                            color="primary"
                            type="submit"
                            size="sm"
                            disabled={
                              this.state.isSubmitting || !this.state.isTouched
                            }
                          >
                            Save{" "}
                            {this.state.isSubmitting && (
                              <Spinner color="primary" size="sm" />
                            )}
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {this.state.role === "student" && (
          <TutorInfo
            tutor={this.state.tutor}
            studentId={this.state.userId}
            onRevoke={this.onRevokeTutor}
            disableRevoke={this.state.isRevokingTutor}
            onReload={() => {
              this.getUserDetails(this.state.userId, this.state.role);
            }}
          />
        )}
        {this.state.role === "tutor" && (
          <StudentsAssigned
            students={this.state.students}
            tutorId={this.state.userId}
            postAssign={() => {
              this.getUserDetails(this.state.userId, this.state.role);
            }}
            onRevoke={this.revokeStudent}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  addAlert: options => dispatch(addAlert(options))
});

export default connect(mapStateToProps, mapDispatchToProps)(UserForm);
