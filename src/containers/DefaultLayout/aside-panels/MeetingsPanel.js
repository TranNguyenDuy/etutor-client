import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Button, ListGroup, ListGroupItem } from "reactstrap";
import { loadMeetings } from "../../../redux/actions";

class MeetingsPanel extends React.Component {
  componentDidMount() {
    this.props.loadMeetings();
  }

  render() {
    const { meetings } = this.props.meeting;
    const TODAY = moment().startOf("day");
    const TOMORROW = moment().add(1, "day").startOf("day");
    let todayMeetings = meetings.filter((meeting) =>
      moment(meeting.start_time).startOf("day").isSame(TODAY)
    );
    let tomorrowMeetings = meetings.filter((meeting) =>
      moment(meeting.start_time).startOf("day").isSame(TOMORROW)
    );
    let futureMeetings = meetings.filter((meeting) =>
      moment(meeting.start_time).startOf("day").isAfter(TOMORROW.endOf("day"))
    );
    let pastMeetings = meetings.filter((meeting) => meeting.status === "past");
    let canceledMeetings = meetings.filter(
      (meeting) => meeting.status === "canceled"
    );
    return (
      <ListGroup className="list-group-accent" tag={"div"}>
        <ListGroupItem className="p-0">
          <Button
            color="link"
            className="w-100 text-center"
            onClick={() => {
              this.props.history.push("/meetings/new");
            }}
          >
            <i className="fa fa-plus"></i> New Meeting
          </Button>
        </ListGroupItem>
        {!!todayMeetings.length && (
          <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
            Today
          </ListGroupItem>
        )}
        {todayMeetings.map((meeting, index) => (
          <ListGroupItem
            key={index}
            action
            className="list-group-item-accent-warning list-group-item-divider"
            style={{
              cursor: "pointer",
            }}
            onClick={() => this.props.history.push(`/meetings/${meeting.id}`)}
          >
            <div>{meeting.name}</div>
            <small className="text-muted mr-3">
              <i className="icon-calendar"></i>&nbsp;{" "}
              {moment(meeting.start_time).local().format("hh:mm A")} -{" "}
              {moment(meeting.end_time).local().format("hh:mm A")}
            </small>
          </ListGroupItem>
        ))}
        {!!tomorrowMeetings.length && (
          <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
            Tomorrow
          </ListGroupItem>
        )}
        {tomorrowMeetings.map((meeting, index) => (
          <ListGroupItem
            key={index}
            action
            className="list-group-item-accent-success list-group-item-divider"
            style={{
              cursor: "pointer",
            }}
            onClick={() => this.props.history.push(`/meetings/${meeting.id}`)}
          >
            <div>{meeting.name}</div>
            <small className="text-muted mr-3">
              <i className="icon-calendar"></i>&nbsp;{" "}
              {moment(meeting.start_time).local().format("hh:mm A")} -{" "}
              {moment(meeting.end_time).local().format("hh:mm A")}
            </small>
          </ListGroupItem>
        ))}
        {!!futureMeetings.length && (
          <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
            Future
          </ListGroupItem>
        )}
        {futureMeetings.map((meeting, index) => (
          <ListGroupItem
            key={index}
            action
            className="list-group-item-accent-success list-group-item-divider"
            style={{
              cursor: "pointer",
            }}
            onClick={() => this.props.history.push(`/meetings/${meeting.id}`)}
          >
            <div>{meeting.name}</div>
            <small className="text-muted mr-3">
              <i className="icon-calendar"></i>&nbsp;{" "}
              {moment(meeting.start_time).local().format("hh:mm A")} -{" "}
              {moment(meeting.end_time).local().format("hh:mm A")}
            </small>
          </ListGroupItem>
        ))}
        {!!pastMeetings.length && (
          <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
            Past
          </ListGroupItem>
        )}
        {pastMeetings.map((meeting, index) => (
          <ListGroupItem
            key={index}
            action
            className="list-group-item-accent-success list-group-item-divider"
            style={{
              cursor: "pointer",
            }}
            onClick={() => this.props.history.push(`/meetings/${meeting.id}`)}
          >
            <div>{meeting.name}</div>
            <small className="text-muted mr-3">
              <i className="icon-calendar"></i>&nbsp;{" "}
              {moment(meeting.start_time).local().format("hh:mm A")} -{" "}
              {moment(meeting.end_time).local().format("hh:mm A")}
            </small>
          </ListGroupItem>
        ))}
        {!!canceledMeetings.length && (
          <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
            Canceled
          </ListGroupItem>
        )}
        {canceledMeetings.map((meeting, index) => (
          <ListGroupItem
            key={index}
            action
            className="list-group-item-accent-danger list-group-item-divider"
            style={{
              cursor: "pointer",
            }}
            onClick={() => this.props.history.push(`/meetings/${meeting.id}`)}
          >
            <div>{meeting.name}</div>
            <small className="text-muted mr-3">
              <i className="icon-calendar"></i>&nbsp;{" "}
              {moment(meeting.start_time).local().format("hh:mm A")} -{" "}
              {moment(meeting.end_time).local().format("hh:mm A")}
            </small>
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  }
}

const mapStateToProps = (state) => ({
  meeting: state.meeting,
});

const mapDispatchToProps = (dispatch) => ({
  loadMeetings: () => dispatch(loadMeetings()),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MeetingsPanel)
);
