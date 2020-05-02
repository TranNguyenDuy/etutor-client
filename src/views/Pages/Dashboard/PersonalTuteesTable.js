import React from "react";
import { Card, CardBody, CardHeader, Col, Row, Table } from "reactstrap";

class PersonalTuteesTable extends React.Component {
  render() {
    return (
      <Row>
        <Col cols={12}>
          <Card>
            <CardHeader>
              <i className="fa fa-users"></i>
              Tutees
            </CardHeader>
            <CardBody>
              <Table responsive>
                <thead>
                  <th>First name</th>
                  <th>Last name</th>
                  <th>Email</th>
                  <th>Phone number</th>
                </thead>
              </Table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default PersonalTuteesTable;
