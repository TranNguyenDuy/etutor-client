import React, { useState } from 'react';
import { Button, Col, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { AsyncTypeahead } from 'reactstrap-typeahead';
import { UserService } from '../../../services/user';

export const AssignStudentModal = (props) => {
    const [state, setState] = useState({
        allowNew: false,
        isLoading: false,
        multiple: false,
        options: [],
        query: "",
        isAssigningStudent: false,
        selectedStudents: []
    })

    const handleSearch = query => {
        setState({
            ...state,
            isLoading: true
        });
        UserService.getUserList("student", {
            page: 0,
            pageSize: 20,
            key: query
        })
            .then(res => {
                setState({
                    ...state,
                    isLoading: false,
                    options: res.data.data.filter(user => {
                        return ![...props.students, ...state.selectedStudents].find(student => student.id === user.id)
                    }).map(user => ({
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
        if (!option || state.selectedStudents.length >= 10) return;
        setState({
            ...state,
            selectedStudents: [...state.selectedStudents, option],
            query: ''
        })
    };

    const assignStudents = () => {
        setState({
            ...state,
            isAssigningStudent: true
        });
        UserService.assignTutor(state.selectedStudents.map(s => s.id), props.tutorId)
            .then(() => {
                setState({
                    ...state,
                    isAssigningStudent: false
                });
                if (props.postAssign) setTimeout(() => {
                    props.postAssign();
                }, 500);
            })
            .catch(() => {
                setState({
                    ...state,
                    isAssigningStudent: false
                });
            })
    };

    return (
        <Modal
            className="modal-primary"
            isOpen={props.isOpen}
            toggle={props.toggle}
            centered={true}
        >
            <ModalHeader toggle={props.toggle}>Assign Students</ModalHeader>
            <ModalBody>
                <Row>
                    <Col cols={12} className="d-flex justify-content-between">
                        <AsyncTypeahead
                            {...state}
                            className="w-75"
                            placeholder="Search..."
                            minLength={1}
                            maxResult={19}
                            labelKey="name"
                            onInputChange={handleInputChange}
                            onSearch={handleSearch}
                            renderMenuItemChildren={(student) => {
                                return (
                                    <div key={student.id}>
                                        <p>
                                            {student.firstName} {student.lastName}{" "}
                                            <small>({student.email})</small>
                                        </p>
                                    </div>
                                );
                            }}
                            useCache={false}
                        />
                        <Button disabled={state.isAssigningStudent || !state.query} color="primary" size="sm" onClick={assign}>
                            Assign student
                        </Button>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <Col cols={12}>
                        <ListGroup>
                            {state.selectedStudents.map((student, index) => (
                                <ListGroupItem
                                    key={index}
                                    className="d-flex justify-content-between"
                                >
                                    {student.name}
                                    <Button color="danger" size="sm" onClick={() => {
                                        setState({
                                            ...state,
                                            selectedStudents: [...state.selectedStudents.filter(s => s.id !== student.id)]
                                        })
                                    }}><i className="fa fa-trash"></i></Button>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={assignStudents} disabled={state.isAssigningStudent}>
                    Assign
                </Button>
                <Button
                    color="secondary"
                    onClick={props.onCancel}
                    disabled={state.isAssigningStudent}
                >
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    )
}