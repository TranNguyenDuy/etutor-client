import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Card, CardBody, Col, Row } from "reactstrap";
import { DashboardService } from "../../../services/dashboard";

const Users = React.lazy(() => import("../Users/Users"));
const Tutees = withRouter((props) => (
  <Users
    {...props}
    location={{
      ...props.location,
      state: {
        role: "student",
      },
    }}
  />
));
const Blog = withRouter(React.lazy(() => import("../Blog/Blog")));

class Dashboard extends Component {
  state = {
    matrix: {},
  };

  backgrounds = ["info", "primary", "warning", "danger"];

  componentDidMount = () => {
    this.loadMatrix();
  };

  loadMatrix = async () => {
    const { data: matrix } = await DashboardService.getDashboardMatrix();
    this.setState({
      matrix,
    });
  };

  render() {
    const {
      auth: { user },
    } = this.props;

    return (
      <div className="animated fadeIn">
        <Row>
          {Object.keys(this.state.matrix).map((key, index) => {
            const numberOfMatrix = Object.keys(this.state.matrix).length;
            const matrix = this.state.matrix[key];
            return (
              <Col sm="12" lg={12 / numberOfMatrix} key={index}>
                <Card className={`text-white bg-${this.backgrounds[index]}`}>
                  <CardBody>
                    <div className="text-value">{matrix.count}</div>
                    <div>{matrix.label}</div>
                  </CardBody>
                </Card>
              </Col>
            );
          })}
        </Row>

        {user && user.role === "tutor" && <Tutees />}

        <Blog />

        {/* <Row>
          <Col>
            <Card>
              <CardBody>
                <Row>
                  <Col sm="5">
                    <CardTitle className="mb-0">Traffic</CardTitle>
                    <div className="small text-muted">November 2015</div>
                  </Col>
                  <Col sm="7" className="d-none d-sm-inline-block">
                    <Button color="primary" className="float-right">
                      <i className="icon-cloud-download"></i>
                    </Button>
                    <ButtonToolbar
                      className="float-right"
                      aria-label="Toolbar with button groups"
                    >
                      <ButtonGroup className="mr-3" aria-label="First group">
                        <Button
                          color="outline-secondary"
                          onClick={() => this.onRadioBtnClick(1)}
                          active={this.state.radioSelected === 1}
                        >
                          Day
                        </Button>
                        <Button
                          color="outline-secondary"
                          onClick={() => this.onRadioBtnClick(2)}
                          active={this.state.radioSelected === 2}
                        >
                          Month
                        </Button>
                        <Button
                          color="outline-secondary"
                          onClick={() => this.onRadioBtnClick(3)}
                          active={this.state.radioSelected === 3}
                        >
                          Year
                        </Button>
                      </ButtonGroup>
                    </ButtonToolbar>
                  </Col>
                </Row>
                <div
                  className="chart-wrapper"
                  style={{ height: 300 + "px", marginTop: 40 + "px" }}
                >
                  <Line data={mainChart} options={mainChartOpts} height={300} />
                </div>
              </CardBody>
              <CardFooter>
                <Row className="text-center">
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">Visits</div>
                    <strong>29.703 Users (40%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="success"
                      value="40"
                    />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
                    <div className="text-muted">Unique</div>
                    <strong>24.093 Users (20%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="info"
                      value="20"
                    />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">Pageviews</div>
                    <strong>78.706 Views (60%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="warning"
                      value="60"
                    />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0">
                    <div className="text-muted">New Users</div>
                    <strong>22.123 Users (80%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="danger"
                      value="80"
                    />
                  </Col>
                  <Col sm={12} md className="mb-sm-2 mb-0 d-md-down-none">
                    <div className="text-muted">Bounce Rate</div>
                    <strong>Average Rate (40.15%)</strong>
                    <Progress
                      className="progress-xs mt-2"
                      color="primary"
                      value="40"
                    />
                  </Col>
                </Row>
              </CardFooter>
            </Card>
          </Col>
        </Row> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
