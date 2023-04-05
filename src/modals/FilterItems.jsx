import Button from 'react-bootstrap/Button';
import React, { useState, Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import '../css/grocery_list.css';

/** this modal is responsible for allowing the user to filter the items by category */
const FilterPopup = () => {
    const [show, setShow] = useState(false);

    const handleExit = () => setShow(false);
    const handleAppear = () => setShow(true);

    return (
        <>
            <Button variant="primary" value="filtering" onClick={handleAppear}>filter</Button>
            <Modal show={show} onHide={handleExit} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Filter Options</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Button variant="secondary" onClick={handleExit}>Filter out checked off buttons</Button>
                </Modal.Body>
            </Modal>
        </>

    );
}

export default FilterPopup