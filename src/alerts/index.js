import React from "react";
import { Alert } from "reactstrap";
import { removeAlert } from "../redux/actions";
import { connect } from "react-redux";

class AlertContainer extends React.Component {
  state = {
    alerts: []
  };

  closeAlert = id => {
    this.props.removeAlert(id);
  };

  getAlertComponent = (options, index) => {
    let alert;
    const { message } = options;
    switch (options.type) {
      case "primary":
        alert = (
          <Alert key={index} color="primary">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
      case "secondary":
        alert = (
          <Alert key={index} color="secondary">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
      case "success":
        alert = (
          <Alert key={index} color="success">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
      case "danger":
        alert = (
          <Alert key={index} color="danger">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
      case "warning":
        alert = (
          <Alert key={index} color="warning">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
      case "info":
        alert = (
          <Alert key={index} color="info">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
      case "light":
        alert = (
          <Alert key={index} color="light">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
      case "dark":
        alert = (
          <Alert key={index} color="dark">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
      default:
        alert = (
          <Alert key={index} color="primary">
            <div className="close" onClick={() => this.closeAlert(options.id)}>
              &times;
            </div>
            {message}
          </Alert>
        );
        break;
    }
    return alert;
  };

  render() {
    return (
      <div className="alert-container">
        {this.props.alert.alerts.map((options, index) =>
          this.getAlertComponent(options, index)
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  alert: state.alert
});

const mapDispatchToProps = dispatch => ({
  removeAlert: index => dispatch(removeAlert(index))
});

export default connect(mapStateToProps, mapDispatchToProps)(AlertContainer);
