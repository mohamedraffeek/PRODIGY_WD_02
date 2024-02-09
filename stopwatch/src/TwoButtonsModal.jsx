import React from "react";
import { Button, Modal } from "react-bootstrap";

const TwoButtonsModal = ({ show, onClose, resetResponseData, body }) => {
  const handleAll = () => {
    resetResponseData();
    onClose();
  };

  return (
    <>
      <Modal show={show} onHide={onClose}>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleAll}>
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TwoButtonsModal;
