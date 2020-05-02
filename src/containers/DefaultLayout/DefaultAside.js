import classNames from "classnames";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from "reactstrap";
import MeetingsPanel from "./aside-panels/MeetingsPanel";
import MessagesPanel from "./aside-panels/MessagesPanel";

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultAside extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1",
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    // eslint-disable-next-line
    const {
      auth: { user },
    } = this.props;

    return (
      <React.Fragment>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={classNames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              <i className="icon-list"></i>
            </NavLink>
          </NavItem>
          {user && (user.role === "student" || user.role === "tutor") && (
            <NavItem>
              <NavLink
                className={classNames({ active: this.state.activeTab === "2" })}
                onClick={() => {
                  this.toggle("2");
                }}
              >
                <i className="icon-speech"></i>
              </NavLink>
            </NavItem>
          )}
          <NavItem className="setting-nav-item">
            <NavLink
              className={classNames({ active: this.state.activeTab === "3" })}
              onClick={() => {
                this.toggle("3");
              }}
            >
              <i className="icon-settings"></i>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <MeetingsPanel />
          </TabPane>
          {user && (user.role === "student" || user.role === "tutor") && (
            <TabPane tabId="2" className="p-3">
              <MessagesPanel />
            </TabPane>
          )}
          <TabPane tabId="3">
            <ListGroup className="list-group-accent" tag={"div"}>
              <ListGroupItem className="list-group-item-accent-secondary bg-light text-center font-weight-bold text-uppercase small">
                {user && `${user.firstName} ${user.lastName}`}
              </ListGroupItem>
              <ListGroupItem
                action
                tag="a"
                href="#"
                className="list-group-item-accent-warning list-group-item-divider"
                onClick={this.props.onLogout}
              >
                Logout
              </ListGroupItem>
            </ListGroup>
          </TabPane>
        </TabContent>
      </React.Fragment>
    );
  }
}

DefaultAside.propTypes = propTypes;
DefaultAside.defaultProps = defaultProps;

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(DefaultAside);
