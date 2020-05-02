import {
  AppAside,
  AppBreadcrumb2 as AppBreadcrumb,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarNav2 as AppSidebarNav,
} from "@coreui/react";
import React, { Component, Suspense } from "react";
import { connect } from "react-redux";
import * as router from "react-router-dom";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "reactstrap";
import { addAlert } from "../../redux/actions";
import { setUser } from "../../redux/actions/auth";
// routes config
import routes from "../../routes";
import { OAuthService } from "../../services/oauth";
// sidebar nav config
import navigation from "../../_nav";

const DefaultAside = React.lazy(() => import("./DefaultAside"));
const DefaultHeader = React.lazy(() => import("./DefaultHeader"));

class DefaultLayout extends Component {
  state = {
    initialized: false,
  };

  loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  signOut(e) {
    e.preventDefault();
    OAuthService.logout().then(() => {
      this.props.logout();
      this.props.history.push("/login");
    });
  }

  welcome = () => {
    this.props.addAlert({
      message: `Wellcome, ${this.props.auth.user.firstName}!`,
    });
  };

  componentDidMount = () => {
    OAuthService.getMyProfile()
      .then((res) => {
        this.props.setUser(res.data);
        // this.welcome();
        this.setState({
          initialized: true,
        });
      })
      .catch((err) => {
        console.error(err.response || err);
        this.props.setUser(null);
        window.location.assign("#/login");
      });
  };

  render() {
    if (!this.state.initialized) return null;
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={(e) => this.signOut(e)} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
              <AppSidebarNav
                navConfig={navigation()}
                {...this.props}
                router={router}
              />
            </Suspense>
            <AppSidebarFooter />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <Switch>
                  {routes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={(props) => {
                          const { location } = props;
                          if (route.data) {
                            location.state = location.state
                              ? {
                                  ...location.state,
                                  ...route.data,
                                }
                              : route.data;
                          }
                          return (
                            <route.component {...props} location={location} />
                          );
                        }}
                      />
                    ) : null;
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside onLogout={(e) => this.signOut(e)} />
            </Suspense>
          </AppAside>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    alert: state.alert,
  };
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(setUser(null)),
  setUser: (user) => dispatch(setUser(user)),
  addAlert: (options) => dispatch(addAlert(options)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(router.withRouter(DefaultLayout));
