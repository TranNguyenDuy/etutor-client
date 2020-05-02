import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";
import { OAuthService } from "../../../services/oauth";
import { setUser } from "../../../redux/actions/auth";
import { connect } from "react-redux";

class Login extends Component {
  state = {
    email: "",
    password: "",
    isSubmitting: false,
    requestError: "",
    redirectUrl: "/"
  };

  componentDidMount = () => {
    const {
      auth: { user },
      location: { state }
    } = this.props;
    this.setState(
      {
        redirectUrl: state && state.redirectUrl ? state.redirectUrl : "/"
      },
      () => {
        if (user) return this.props.history.push(this.state.redirectUrl);
      }
    );
  };

  handleSubmit = () => {
    const data = {
      email: this.state.email,
      password: this.state.password
    };
    if (!data.email || !data.password) return;
    this.setState({
      isSubmitting: true
    });
    OAuthService.login(data.email, data.password)
      .then(res => {
        this.props.setUser(res.data);
        return true;
      })
      .catch(({ response }) => {
        if (!response || !response.data) return false;
        this.setState({
          requestError:
            response.data.error_message || "Unexpected error occurred"
        });
        return false;
      })
      .then(isLoggedIn => {
        this.setState({
          isSubmitting: false
        });
        if (isLoggedIn) {
          this.props.history.push(this.state.redirectUrl);
        }
      });
  };

  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form
                      onSubmit={e => {
                        e.preventDefault();
                        this.handleSubmit();
                      }}
                    >
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-envelope"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          required
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          name="email"
                          value={this.state.email}
                          onChange={e => {
                            this.setState({
                              email: e.target.value
                            });
                          }}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock"></i>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          required
                          type="password"
                          name="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={this.state.password}
                          onChange={e => {
                            this.setState({
                              password: e.target.value
                            });
                          }}
                        />
                      </InputGroup>
                      {this.state.requestError && (
                        <Row>
                          <Col cols={12}>
                            <p className="text-danger">
                              {this.state.requestError}
                            </p>
                          </Col>
                        </Row>
                      )}
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            disabled={this.state.isSubmitting}
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
