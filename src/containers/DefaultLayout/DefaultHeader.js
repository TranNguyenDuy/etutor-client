import {
  AppAsideToggler,
  AppNavbarBrand,
  AppSidebarToggler,
} from "@coreui/react";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  UncontrolledDropdown,
} from "reactstrap";
import logo from "../../assets/img/brand/logo.png";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {
  auth: PropTypes.any,
};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const {
      children,
      auth: { user },
      ...attributes
    } = this.props;
    let avatarPath = "../../assets/img/avatars/7.jpg";
    if (user && user.avatar) {
      avatarPath = user.avatar.path || avatarPath;
    }

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand full={{ src: logo, height: 100, alt: "CoreUI Logo" }} />
        <AppSidebarToggler className="d-md-down-none" display="lg" />
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle className="d-md-down-none" nav>
              <img src={avatarPath} className="img-avatar" alt="" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center">
                <strong>{user && `${user.firstName} ${user.lastName}`}</strong>
              </DropdownItem>

              <DropdownItem onClick={(e) => this.props.onLogout(e)}>
                <i className="fa fa-lock"></i> Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <AppAsideToggler className="d-md-down-none" />
        <AppAsideToggler className="d-lg-none" mobile />
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DefaultHeader);
