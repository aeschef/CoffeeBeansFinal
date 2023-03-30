import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
/** This Modal will serve as a pop-up to allow us to edit 
 * categories from the pencil icon */
function AddItemPopup() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" value="add item" onClick={handleShow}>Add</Button>
  
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder=""
                  autoFocus
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Category</Form.Label>
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
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

/** This Modal will serve as a pop-up to allow us to edit 
 * categories from the pencil icon */
function CategorysPopup() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" value="edit category" onClick={handleShow}>pencil icon</Button>
  
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

/**
 * Component containing actual eitems from the list
 */
function ItemList() {
    return (
        <div className="row">
            <div className="col">
                <button>checkbox</button>
            </div>
            <div className="col">
                <p>item name</p>
            </div>
        </div>
    );
}

/**
 * container for list categories and their items
 */
function ListCategory (){
    return (
        <div className="category-rectangle">
            <Row>
           
                <Col>
                    <span>category name</span>
                </Col>
                <Col>
                    <CategorysPopup></CategorysPopup>                       
                </Col>
            
                <ItemList></ItemList>
                <ItemList></ItemList>
                <ItemList></ItemList>
                <ItemList></ItemList>
            </Row>
        </div>
    );
}

const AddItem = () => {
    return  <AddItemPopup/>;
};

export default class InventoryHome extends Component {
    render() {
        return(
            <Container fluid="md">
                <Row>
                    <Col xs={{span:6, offset:3}}>
                        <h1>inventory</h1>
                    </Col>
                    <Col xs={{span:2}}>
                        <Button>filter</Button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button>personal</Button>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button>shared</Button>
                        </div>
                        
                    </Col>
                </Row>
                <ListCategory></ListCategory>
                <ListCategory></ListCategory>
                <ListCategory></ListCategory>
                <ListCategory></ListCategory>
                <AddItem></AddItem>

            </Container>
        );
    }
}