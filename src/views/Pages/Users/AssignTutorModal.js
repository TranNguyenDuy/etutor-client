import React, { useState } from "react";
import { Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import { AsyncTypeahead } from "reactstrap-typeahead";
import { UserService } from "../../../services/user";

export const AssignTutorModal = props => {
  const [state, setState] = useState({
    allowNew: false,
    isLoading: false,
    multiple: false,
    options: [],
    query: ""
  });

  const handleSearch = query => {
    setState({
      ...state,
      isLoading: true
    });
    UserService.getUserList("tutor", {
      page: 0,
      pageSize: 20,
      key: query
    })
      .then(res => {
        setState({
          ...state,
          isLoading: false,
          options: res.data.data.map(user => ({
            ...user,
            name: `${user.firstName} ${user.lastName} (${user.email})`
          }))
        });
      })
      .catch(err => {
        setState({
          ...state,
          isLoading: false
        });
      });
  };

  const handleInputChange = query => {
    setState({
      ...state,
      query
    });
  };

  const assign = () => {
    const option = state.options.find(option => option.name === state.query);
    if (!option) return;
    if (props.onAssign) props.onAssign(option);
  };

  return (
    <Modal
      className="modal-primary"
      isOpen={props.isOpen}
      toggle={props.toggle}
      centered={true}
    >
      <ModalHeader toggle={props.toggle}>Assign Tutor</ModalHeader>
      <ModalBody>
        <Row>
          <Col cols={12}>
            <Label>Tutor name</Label>
            <AsyncTypeahead
              {...state}
              minLength={1}
              maxResult={19}
              labelKey="name"
              onInputChange={handleInputChange}
              onSearch={handleSearch}
              placeholder="Search tutor..."
              renderMenuItemChildren={(tutor, props) => {
                return (
                  <div key={tutor.id}>
                    <p>
                      {tutor.firstName} {tutor.lastName}{" "}
                      <small>({tutor.email})</small>
                    </p>
                  </div>
                );
              }}
            />
          </Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={assign} disabled={props.disabled}>
          Assign
        </Button>
        <Button
          color="secondary"
          onClick={props.onCancel}
          disabled={props.disabled}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
