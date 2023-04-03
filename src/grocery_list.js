import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';
import './css/grocery_list.css';



function FilterPopup() {
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


/** popup for editing the Categorys */
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

const ShowTab = () => {
    // Stores items
    const [itemsInPersonal, addPersonalItem] = useState([
        {value:"hummus", label:"hummus"},
        {value:"strawberries", label: "Stawberries"}
        ]);
    
    const [itemsInShared, addSharedItem] = useState([
        {value:"almond milk", label:"almond milk"},
        {value:"flour", label: "flour"}
        ]);
    
 
    // stores if we should be showing the personal or shared tab
    const [showPersonal, setPersonal] = useState(true);
    const handlePersonal = () => setPersonal(true);
    const handleShared = () => setPersonal(false);

    return ( 
        <Container>
            <Row>
                <Col>
                    <div className="d-grid gap-2">
                        <Button onClick={() => handlePersonal}>personal</Button>
                    </div>
                </Col>
                <Col>
                    <div className="d-grid gap-2">
                        <Button onClick={() => handleShared}>shared</Button>
                    </div>
                </Col>
            </Row>
            <ListCategory list={showPersonal ? itemsInPersonal : itemsInShared}></ListCategory>
            <AddItem  list={showPersonal ? itemsInPersonal : itemsInShared} addToList={showPersonal ? addPersonalItem : addSharedItem}></AddItem>
        </Container>
    );

}

/**
 * container for list categories and their items
 */
function ListCategory({ list}) {
    return (
        <div className="category-rectangle">
            <Row>

                <Col>
                    <span>category name</span>
                </Col>
                <Col>
                    <CategorysPopup></CategorysPopup>
                </Col>
                    
                </Row>
                    {list.map((x, i) =>
                    <Row> 
                        <label key={i}>
                        <input
                        type="checkbox"
                        name="lang"
                        value={x.value}
                        /> {x.label}
                        </label>
                    </Row>
                    )}
                    <Col>
                        -  #  +
                    </Col>
                <Row>
                    
            </Row>
        </div>
    );
}

/**
 * 
 * Component contains the add item button and the popup 
 * that allows item to be added to grocery list
 */
const AddItem = ({list, addToList}) => {

    /** constants storing state for this page until we have a database */
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState(false);
    const [itemName, setName] = useState(null);
    const [categoryName, setCategory] = useState(null);
        
    /* Closes the modal and saves the state to the list*/
    const handleClose = () => {
        setShow(false)
        const item = {value:itemName, label:itemName}
        console.log(item)
        addToList([
          ...list,
          {value:itemName, label:itemName}]) 
    };
    
    const handleShow = () => setShow(true);
    
    const setItemName = (event)=>{
        setName(event.target.value);
    };

    const setCategoryName = (event)=>{
        setCategory(event.target.value);
    };


    return (
        <>
            <Button className="fixedbutton" value="Add item" onClick={handleShow}>Add</Button> 

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Item</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="Item Name"
                                    onChange={setItemName}
                                    autoFocus
                                />
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="Category Name"
                                    onChange={setCategoryName}
                                    autoFocus
                                />
                            </Form.Group>
                    </Form>
                    <ToggleButton
                        className="mb-2"
                        id="toggle-check"
                        type="checkbox"
                        variant="outline-secondary"
                        checked={checked}
                        value="1"
                        onChange={(e) => setChecked(e.currentTarget.checked)}
                    >
                        Filter out checked off buttons
                    </ToggleButton>
                    <Button variant="primary" onClick={handleClose}>Save</Button>
                </Modal.Body>
            </Modal>       
        </>
    );
};


export default class GroceryListHome extends Component {
    
  

    
    render() {
        

        return (
            <Container fluid="md">
                <Row>
                    <Col xs={{ span: 6, offset: 3 }}>
                        <h1>Grocery List</h1>
                    </Col>
                    <Col xs={{ span: 2 }}>
                        <FilterPopup></FilterPopup>
                    </Col>
                </Row>
                <ShowTab></ShowTab>
             

            </Container>
        )
    }
}