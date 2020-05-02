import moment from "moment";
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
  Spinner,
} from "reactstrap";
import { PageContent } from "../../../containers/DefaultLayout/PageContent";
import {
  Validators,
  withValidations,
} from "../../../hocs/form/withValidations";
import { ConfirmModal } from "../../../modals/confirm-modal";
import { addAlert, loadMeetings } from "../../../redux/actions";
import { MeetingService } from "../../../services/meeting";
import { displayName } from "../../../utils/name";
import MeetingRecord from "./MeetingRecord";

class MeetingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingId: "",
      host: null,
      meetingStatus: "",
      meetingRecord: null,
      mode: (props.location.state && props.location.state.mode) || "create",
      isLoading: false,
      isTouched: false,
      isSending: false,
      data: {
        meetingName: {
          value: "",
          isValid: false,
        },
        startTime: {
          value: "",
          isValid: false,
        },
        endTime: {
          value: "",
          isValid: false,
        },
        participants: {
          value: [],
          isValid: false,
        },
        description: {
          value: "",
          isValid: true,
        },
        url: {
          value: "",
          isValid: true,
        },
      },
      availableParticipants: [],
      participantOptions: [],
      selectedPaticipant: "",
      cancelModalOpened: false,
      isCanceling: false,
    };
  }

  fieldRefs = {
    MeetingName: React.createRef(),
    StartTime: React.createRef(),
    EndTime: React.createRef(),
    MeetingWith: React.createRef(),
    Description: React.createRef(),
    MeetingURL: React.createRef(),
  };

  fields = {
    MeetingName: withValidations(Input, {
      validators: [Validators.required("Please input Meeting Name")],
    }),
    StartTime: withValidations(Input, {
      validators: [Validators.required("Please select Start Time")],
    }),
    EndTime: withValidations(Input, {
      validators: [Validators.required("Please select End time")],
    }),
    MeetingWith: withValidations(Input),
    Description: withValidations(Input),
    MeetingURL: withValidations(Input),
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

  componentDidMount = () => {
    if (
      this.props.location.state &&
      this.props.location.state.mode === "edit"
    ) {
      this.getData(this.getAvailableParticipants);
    } else {
      this.getAvailableParticipants();
      this.setState({
        data: {
          ...this.state.data,
          participants: {
            ...this.state.data.participants,
            value: [this.props.auth.user],
          },
        },
      });
    }
  };

  componentDidUpdate(props) {
    if (
      props.match.params.id &&
      props.match.params.id !== this.props.match.params.id
    ) {
      this.getData(this.getAvailableParticipants);
    }
  }

  mapMeetingDetails = (data, cb) => {
    const stateData = {
      meetingName: {
        value: data.name,
        isValid: true,
      },
      startTime: {
        value: moment(data.startTime).local().format("YYYY-MM-DDTHH:mm"),
        isValid: true,
      },
      endTime: {
        value: moment(data.endTime).local().format("YYYY-MM-DDTHH:mm"),
        isValid: true,
      },
      description: {
        value: data.description,
        isValid: true,
      },
      url: {
        value: data.url,
        isValid: true,
      },
      participants: {
        value:
          data.host && data.host.id === this.props.auth.user.id
            ? [this.props.auth.user, ...data.participants]
            : data.participants,
        isValid: true,
      },
    };
    this.setState(
      {
        meetingId: data.id,
        data: stateData,
        host: data.host,
        meetingStatus: data.status,
        meetingRecord: data.record,
      },
      cb
    );
  };

  getData = (cb) => {
    if (this.state.isLoading) return;
    const { id } = this.props.match.params;
    this.setState({
      isLoading: true,
    });
    MeetingService.getMeetingDetails(id)
      .then(({ data }) => {
        this.mapMeetingDetails(data, cb);
      })
      .finally(() => {
        this.setState({
          isLoading: false,
        });
      });
  };

  getAvailableParticipants = () => {
    MeetingService.getAvailableParticipants().then((res) => {
      const filteredData = res.data.filter(
        (user) =>
          !this.state.data.participants.value.find((p) => p.id === user.id)
      );
      this.setState(
        {
          availableParticipants: filteredData,
          selectedPaticipant: "",
          participantOptions: filteredData,
        },
        () => {
          if (
            !this.fieldRefs.MeetingWith ||
            !this.fieldRefs.MeetingWith.current
          )
            return;
          this.fieldRefs.MeetingWith.current.setValue(
            this.state.selectedPaticipant
          );
        }
      );
    });
  };

  addParticipant = () => {
    const participant = this.state.participantOptions.find(
      (p) => p.id === this.state.selectedPaticipant
    );
    if (!participant) return;
    this.setState({
      isTouched: true,
      selectedPaticipant: "",
      participantOptions: this.state.participantOptions.filter(
        (p) => p.id !== participant.id
      ),
      data: {
        ...this.state.data,
        participants: {
          value: [...this.state.data.participants.value, participant].filter(
            (p) => !!p
          ),
          isValid: !!this.state.selectedPaticipant,
        },
      },
    });
  };

  mapData = () => {
    const { data } = this.state;
    return [
      {
        name: data.meetingName.value,
        startTime: moment(data.startTime.value).format("YYYY-MM-DD HH:mm:ss"),
        endTime: moment(data.endTime.value).format("YYYY-MM-DD HH:mm:ss"),
        description: data.description.value,
        url: data.url.value,
      },
      data.participants.value
        .filter((p) => p.id !== this.props.auth.user.id)
        .map((p) => p.id),
    ];
  };

  handleSubmit = async () => {
    if (this.state.isSending) return;
    const results = await this.validateAllFormFields();
    const invalidFields = results.filter((result) => !result.isValid);
    if (invalidFields.length) return;
    if (this.state.data.participants.value.length < 2)
      return alert("Please select at least 2 participants");
    const [data, participants] = this.mapData();
    console.log(data, participants);
    this.setState({
      isSending: true,
    });
    if (this.state.mode === "create") {
      MeetingService.createMeeting(data, participants).then((res) => {
        this.props.addAlert({
          message: `Meeting created successfully`,
        });
        this.setState({
          isSending: false,
        });
        this.props.loadMeetings();
        this.props.history.push(`/meetings/${res.data.id}`);
      });
    } else {
      //update
      data.id = this.state.meetingId;
      MeetingService.updateMeeting(data, participants).then((res) => {
        this.props.addAlert({
          message: `Meeting updated successfully`,
        });
        this.setState({
          isSending: false,
        });
        this.getData(this.getAvailableParticipants);
        this.props.loadMeetings();
      });
    }
  };

  allowedToCreateOrUpdate = () => {
    if (this.state.mode === "create") {
      return true;
    }
    if (this.isPast() || this.isCanceled()) return false;
    if (!this.state.host) return false;
    if (!this.props.auth || !this.props.auth.user) return false;
    if (this.state.host.id !== this.props.auth.user.id) return false;
    return true;
  };

  isPast = () => this.state.meetingStatus === "past";
  isCanceled = () => this.state.meetingStatus === "canceled";

  cancelMeeting = () => {
    this.setState({
      cancelModalOpened: true,
    });
  };

  cancel = () => {
    this.setState({
      isCanceling: true,
    });
    MeetingService.cancelMeeting(this.state.meetingId)
      .then(() => {
        this.getData(this.getAvailableParticipants);
        this.props.loadMeetings();
      })
      .finally(() => {
        this.setState({
          isCanceling: false,
          cancelModalOpened: false,
        });
      });
  };

  render() {
    const {
      MeetingName,
      StartTime,
      EndTime,
      MeetingWith,
      Description,
      MeetingURL,
    } = this.fields;
    if (!this.props.auth.user) return null;
    if (this.state.isLoading) return <Spinner color="primary" size="md" />;
    return (
      <PageContent>
        <ConfirmModal
          {...{
            isOpen: this.state.cancelModalOpened,
            type: "danger",
            onConfirm: this.cancel,
            toggle: () =>
              this.setState({
                cancelModalOpened: !this.state.cancelModalOpened,
              }),
            onCancel: () =>
              this.setState({
                cancelModalOpened: false,
              }),
            title: "Confirm cancel meeting",
            content: "Are you sure to cancel this meeting?",
            disableButtons: this.state.isCanceling,
          }}
        />
        <Row>
          <Col cols={12}>
            <Card>
              <CardHeader>
                {(this.props.location.state &&
                  this.props.location.state.name) ||
                  "Meeting Details"}{" "}
                {!!this.state.meetingStatus && (
                  <span
                    className={
                      (this.isPast() || this.isCanceled()
                        ? "badge badge-danger"
                        : "badge badge-success") + " rounded text-capitalize"
                    }
                  >
                    {this.state.meetingStatus}
                  </span>
                )}
                <div className="card-header-actions">
                  {this.allowedToCreateOrUpdate() &&
                    this.state.mode !== "create" && (
                      <Button
                        color="danger"
                        size="sm"
                        onClick={this.cancelMeeting}
                      >
                        Cancel Meeting
                      </Button>
                    )}
                </div>
              </CardHeader>
              <CardBody>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    this.handleSubmit();
                  }}
                >
                  <FormGroup>
                    <Label required for="meetingName">
                      Meeting Name
                    </Label>
                    <MeetingName
                      ref={this.fieldRefs.MeetingName}
                      disabled={
                        this.isPast() || !this.allowedToCreateOrUpdate()
                      }
                      type="text"
                      id="meetingName"
                      value={this.state.data.meetingName.value}
                      onChange={(value, isValid) => {
                        this.setState({
                          isTouched: true,
                          data: {
                            ...this.state.data,
                            meetingName: {
                              value,
                              isValid,
                            },
                          },
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="meetingUrl">Meeting URL</Label>
                    <MeetingURL
                      ref={this.fieldRefs.MeetingURL}
                      disabled={
                        this.isPast() || !this.allowedToCreateOrUpdate()
                      }
                      id="meetingUrl"
                      type="text"
                      value={this.state.data.url.value}
                      onChange={(value, isValid) => {
                        this.setState({
                          isTouched: true,
                          data: {
                            ...this.state.data,
                            url: {
                              value,
                              isValid,
                            },
                          },
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup row>
                    <Col sm={12} md={6}>
                      <Label required for="startTime">
                        Start Time
                      </Label>
                      <StartTime
                        ref={this.fieldRefs.StartTime}
                        disabled={
                          this.isPast() || !this.allowedToCreateOrUpdate()
                        }
                        id="startTime"
                        type="datetime-local"
                        min={moment().format("YYYY-MM-DDTHH:mm")}
                        value={this.state.data.startTime.value}
                        onChange={(value, isValid) => {
                          this.setState({
                            isTouched: true,
                            data: {
                              ...this.state.data,
                              startTime: {
                                value: moment(value).format("YYYY-MM-DDTHH:mm"),
                                isValid,
                              },
                            },
                          });
                        }}
                      />
                    </Col>
                    <Col sm={12} md={6}>
                      <Label required for="endTime">
                        End Time
                      </Label>
                      <EndTime
                        ref={this.fieldRefs.EndTime}
                        disabled={
                          this.isPast() || !this.allowedToCreateOrUpdate()
                        }
                        id="endTime"
                        type="datetime-local"
                        min={
                          this.state.data.startTime.value ||
                          moment().format("YYYY-MM-DDTHH:mm")
                        }
                        value={this.state.data.endTime.value}
                        onChange={(value, isValid) => {
                          this.setState({
                            isTouched: true,
                            data: {
                              ...this.state.data,
                              endTime: {
                                value: moment(value).format("YYYY-MM-DDTHH:mm"),
                                isValid,
                              },
                            },
                          });
                        }}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Label for="description">Description</Label>
                    <Description
                      ref={this.fieldRefs.Description}
                      id="description"
                      type="textarea"
                      rows={5}
                      value={this.state.data.description.value}
                      disabled={
                        this.isPast() || !this.allowedToCreateOrUpdate()
                      }
                      onChange={(value, isValid) => {
                        this.setState({
                          isTouched: true,
                          data: {
                            ...this.state.data,
                            description: {
                              value,
                              isValid,
                            },
                          },
                        });
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label required for="meetingWith">
                      Participants
                    </Label>
                    <ul>
                      {this.state.data.participants.value.map(
                        (participant, index) => {
                          return (
                            <li key={index}>
                              <span>
                                {displayName(participant)} ({participant.email})
                              </span>
                              &nbsp;
                              {participant.id !== this.props.auth.user.id &&
                                this.allowedToCreateOrUpdate() && (
                                  <i
                                    className="fa fa-trash text-danger"
                                    style={{
                                      cursor: "pointer",
                                    }}
                                    onClick={() => {
                                      this.setState(
                                        {
                                          isTouched: true,
                                          data: {
                                            ...this.state.data,
                                            participants: {
                                              value: this.state.data.participants.value.filter(
                                                (p) => p.id !== participant.id
                                              ),
                                              isValid: this.state.data
                                                .participants.isValid,
                                            },
                                          },
                                          participantOptions: [
                                            ...this.state.participantOptions,
                                            participant,
                                          ],
                                        },
                                        () => {
                                          this.setState({
                                            data: {
                                              ...this.state.data,
                                              participants: {
                                                value: this.state.data
                                                  .participants.value,
                                                isValid: this.state.data
                                                  .participants.value.length
                                                  ? true
                                                  : false,
                                              },
                                            },
                                            selectedPaticipant:
                                              (this.state
                                                .participantOptions[0] &&
                                                this.state.participantOptions[0]
                                                  .id) ||
                                              "",
                                          });
                                        }
                                      );
                                    }}
                                  ></i>
                                )}
                            </li>
                          );
                        }
                      )}
                    </ul>
                    <div className="d-flex">
                      <div className="w-100 mr-2">
                        <MeetingWith
                          ref={this.fieldRefs.MeetingWith}
                          disabled={
                            this.isPast() || !this.allowedToCreateOrUpdate()
                          }
                          type="select"
                          id="meetingWith"
                          value={this.state.selectedPaticipant}
                          onChange={(value) => {
                            this.setState({
                              isTouched: true,
                              selectedPaticipant: value,
                            });
                          }}
                        >
                          <option disabled value="">
                            Select participant...
                          </option>
                          {this.state.participantOptions.map((user) => (
                            <option key={user.id} value={user.id}>
                              {displayName(user)} ({user.email})
                            </option>
                          ))}
                        </MeetingWith>
                      </div>
                      <div className="my-auto h-100">
                        <Button
                          type="button"
                          color="primary"
                          size="sm"
                          onClick={this.addParticipant}
                          disabled={!this.state.selectedPaticipant}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </FormGroup>
                  <Row className="mt-4">
                    <Col cols={12} className="d-flex justify-content-between">
                      <div></div>
                      <div>
                        {this.allowedToCreateOrUpdate() && (
                          <Button
                            color="primary"
                            type="submit"
                            disabled={
                              this.state.isSending ||
                              !this.state.isTouched ||
                              this.isPast()
                            }
                          >
                            Save
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
        {this.state.mode !== "create" &&
          this.isPast() &&
          !this.isCanceled() && (
            <MeetingRecord
              record={this.state.meetingRecord}
              meetingId={this.state.meetingId}
            />
          )}
      </PageContent>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  addAlert: (options) => dispatch(addAlert(options)),
  loadMeetings: () => dispatch(loadMeetings()),
});

export default connect(undefined, mapDispatchToProps)(MeetingForm);
