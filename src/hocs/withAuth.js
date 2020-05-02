import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class ComponentWithAuth extends React.Component {
  componentDidMount = () => {
    this.checkAuth();
  };

  checkAuth = () => {
    const { auth, roles } = this.props;
    if (!auth.user) return this.props.history.push("/login");
    if (!roles || !roles.length) return;
    const matchedRole = roles.includes(auth.user.role);
    if (!matchedRole) return this.props.history.push("/404");
  };

  render() {
    const { children: Component } = this.props;
    return <Component {...this.props} />;
  }
}

export const withAuthorizedUser = (Component, roles) => {
  const mapStateToProps = state => ({
    auth: state.auth,
    roles
  });
  return connect(mapStateToProps)(
    withRouter(props => <ComponentWithAuth {...props} children={Component} />)
  );
};
