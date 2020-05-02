import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

export const ConfirmModal = (props) => {
  return (
    <Modal
      isOpen={props.isOpen}
      toggle={props.toggle}
      className={`modal-${props.type || "default"} ${props.className || ""}`}
    >
      <ModalHeader toggle={props.toggle}>{props.title}</ModalHeader>
      <ModalBody>{props.content}</ModalBody>
      <ModalFooter>
        <Button
          disabled={props.disableButtons}
          color={props.type || "primary"}
          onClick={() => {
            props.toggle();
            if (props.onConfirm) props.onConfirm();
          }}
        >
          Confirm
        </Button>{" "}
        <Button
          disabled={props.disableButtons}
          color="secondary"
          onClick={() => {
            props.toggle();
            if (props.onCancel) props.onCancel();
          }}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};
