import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';

//Import Style Sheet
import './css/inventory.css';

//Import modals
import FilterPopup from './modals/FilterItems';
import CategorysPopup from './modals/EditGLICategories';

/**
 * 
 * Component determines which tab to show and calls 
 * the components necessary to display that tab. 
 */
const ShowTab = () => {
  // Dummy items for now lol   
  const [itemsInPersonal, addPersonalItem] = useState([
        {value:"carrots", label:"carrots"},
        {value:"fruit snacks", label: "fruit snacks"}
        ]);
    
    const [itemsInShared, addSharedItem] = useState([
        {value:"oat milk", label:"oat milk"},
        {value:"rice", label: "rice"}
        ]);
    
 
    // stores if we should be showing the personal or shared tab
    const [showPersonal, setPersonal] = useState(true);
    const handlePersonal = () => setPersonal(true);
    const handleShared = () => setPersonal(false);
    // displays the toggle buttons and handles switching functionality
    return ( 
        <Container>
            <Row>
                <Col>
                    <div className="d-grid gap-2">
                        <Button onClick={handlePersonal}>personal</Button>
                    </div>
                </Col>
                <Col>
                    <div className="d-grid gap-2">
                        <Button onClick={handleShared}>shared</Button>
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
 * list-> list that stores items
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
                         {x.label}
                        </label>
                    </Row>
                    )}
                <Row>
                    
            </Row>
        </div>
    );
}

/**
 * Remove item from inventory
 */
const RemoveItem = () => {
  // TODO find swipe library? 
  //button?
  //get event info then simply remove from the list

  return(
    <></>
  );
}

/**
 * Component contains the add item button and the popup 
 * that allows item to be added to grocery list
 * list -> list that contains items
 * addtoList-> function that allows list to be alteredd
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

    // modal to add element to inventory
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


export default class InventoryHome extends Component {
        
    render() {
        

        return (
            <Container fluid="md">
                <Row>
                    <Col xs={{ span: 6, offset: 3 }}>
                        <h1>Inventory</h1>
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