import Button from 'react-bootstrap/Button';
import React, { useState, Component,useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import '../css/grocery_list.css';
/** imports  */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import PencilIcon from "../pencil_icon.svg";


/** This modal is responsible for editing categories */
const CategorysPopup = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
//            <Button variant="primary" value="edit category" onClick={handleShow}>pencil icon</Button>

{/* <Col>
                <a href="#" onClick={handleShow} className="pe-auto left-spacing">
                    <img src={PencilIcon} alt="Edit Pencil Icon" className="pencil-icon"/>
                </a>          
            </Col> 
             */}
    return (
        <>
            
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Category Title</Form.Label>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder=""
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Delete Category
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CategorysPopup