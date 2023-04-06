/** imports  */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, {useEffect, useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';

//Import Style Sheet
import './css/grocery_list.css';

//Import modals
import FilterPopup from './modals/FilterItems';
import CategorysPopup from './modals/EditGLICategories';

/**
 * Handles incrementing and decrementing the number of items 
 * needed from the grocery store
 */
function IncDec() {
    let [num, setNum] = useState(0);
    let inc_num = () => {
        setNum(Number(num) + 1);
    }

    let dec_num = () => {
        setNum(Number(num) - 1);
    }

    let handleChange = (e) => {
        setNum(e.target.value);
    }

    return (
        <>
            <div className="input-group">
                <div className="input-group-prepend">
                    <button type="button" onClick={dec_num}>-</button>
                </div>
                <input className="form-control input-sm" size="2" value={num} onChange={handleChange} />
                <div className="input-group-prepend">
                    <button type="button" onClick={inc_num}>+</button>
                </div>
            </div>
        </>
    
    );
    
    }

/**
 * Component controls what is shown in content from top level. Primary 
 * job is determining if shared or personal content is displayed 
 */
const ShowTab = ({itemsInPersonalInv, itemsInSharedInv, addPersonalItemInv, addSharedItemInv, itemsInPersonalGL, itemsInSharedGL, addPersonalItemGL, addSharedItemGL}) => {

 
    // state determining if we should show personal tab
    const [showPersonal, setPersonal] = useState(true);
    const handlePersonal = () => {
        console.log("personal button pressed");
        setPersonal(true)
    };
    const handleShared = () => {
        console.log("shared button pressed");
        setPersonal(false)
    };

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
            <ListCategory groceryList={showPersonal ? itemsInPersonalGL : itemsInSharedGL} 
                inventoryList={showPersonal ? itemsInPersonalInv: itemsInSharedInv}
                addtoInventory={showPersonal ? addPersonalItemInv : addSharedItemInv}></ListCategory>
            <AddItem  list={showPersonal ? itemsInPersonalGL : itemsInSharedGL} 
                addToList={showPersonal ? addPersonalItemGL : addSharedItemGL}></AddItem>
        </Container>
    );

}

/**
 * displays the category name and the elements it contains
 * takes in the list of items in the gorcery list currently
 */
function ListCategory({groceryList, inventoryList, addtoInventory}) {

    const handleCheck = (event) => {
        if(event.target.checked){
           const itemName = event.target.value;
           const item = {value:itemName, label:itemName};
           console.log(item + "added to inventory");
           addtoInventory([
            ...inventoryList,
            {value:itemName, label:itemName}
           ]);

        } else{
            //TODO remove from inventory
        }
    }

    return (
        <div className="category-rectangle">
            <Row>
                 <div className="d-flex justify-between category-header">
                    <Col>
                        <div className="mr-auto">
                            Produce
                        </div>
                    </Col> 
                    <CategorysPopup></CategorysPopup>
                </div>
                
            </Row>

            
                {groceryList.map((x, i) =>
                <div className="left-spacing">
                    <Row>
                        <Col>
                            <label key={i}>
                                <input
                                type="checkbox"
                                name="lang"
                                value={x.value}
                                onChange={handleCheck}
                                />
                                  {x.label}
                            </label>
                        </Col>
                        <Col xs ={{span:4}}>
                            <IncDec></IncDec>
                        </Col> 
                    </Row>
                     
                </div>
                
                
                
                )}
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
 * 
 * Component contains the add item button and the modal 
 * that allows item to be added to grocery list
 * 
 * list -> list of items to add to
 * addToList -> function that allows altering of state variable
 */

const AddItem = ({list, addToList}) => {

    /** constants storing state for this page until we have a database */
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState(false);
    const [itemName, setName] = useState(null);
    const [categoryName, setCategory] = useState(null);
        
    /* Closes the modal and saves the state to the list*/
    const handleClose = () => {
        setShow(false);
         
    };

    const handleSave = () => {
        setShow(false);
        const item = {value:itemName, label:itemName}
        console.log(item)
        addToList([
          ...list,
          {value:itemName, label:itemName}]);
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
            <Button className="fixedbutton" id="add-button" value="Add item" onClick={handleShow}>Add</Button> 

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
                    <Button variant="primary" onClick={handleSave}>Save</Button>
                </Modal.Body>
            </Modal>       
        </>
    );
};

/**
 * Top level component for this page... simply holds title and the components that manage the rest of the pages functionality
 */
const GroceryListHome = ({itemsInPersonalInv, itemsInSharedInv, addPersonalItemInv, addSharedItemInv, itemsInPersonalGL, itemsInSharedGL, addPersonalItemGL, addSharedItemGL}) => {
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
                <ShowTab itemsInPersonalGL={itemsInPersonalGL}
                    itemsInSharedGL={itemsInSharedGL}
                    addPersonalItemGL={addPersonalItemGL}
                    addSharedItemGL={addSharedItemGL}
                    itemsInPersonalInv={itemsInPersonalInv}
                    itemsInSharedInv={itemsInSharedInv}
                    addPersonalItemInv={addPersonalItemInv}
                     addSharedItemInv={addSharedItemInv}></ShowTab>
             

            </Container>
        );
}
export default GroceryListHome