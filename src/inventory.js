import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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
const ShowTab = ({ itemsInPersonalInv, itemsInSharedInv, addPersonalItemInv, addSharedItemInv, itemsInPersonalGL, itemsInSharedGL, addPersonalItemGL, addSharedItemGL, database, authentication, databaseArr_p, databaseArr_s }) => {

    const [key, setKey] = useState('personal');
    // stores if we should be showing the personal or shared tab
    const [showPersonal, setPersonal] = useState(true);
    const handlePersonal = () => {
        console.log("personal button pressed");
        setPersonal(true)
        setKey('personal');
    };
    const handleShared = () => {
        console.log("shared button pressed");
        setPersonal(false)
        setKey('shared');
    };
    // displays the toggle buttons and handles switching functionality
    const handleSelect = (key) => {
        if (key == 'personal') {
            setPersonal(true);
        } else if (key == 'shared') {
            setPersonal(false);
        }
    };

    return (
        <Container>
            <Tabs defaultActiveKey={'personal'} animation={false} onSelect={handleSelect} className="mb-2">
                <Tab eventKey='personal' title="personal" onSelect={handlePersonal}>
                </Tab>
                <Tab eventKey='shared' title="shared" onSelect={handleShared}>
                </Tab>
            </Tabs>
            <ListCategory list={showPersonal ? itemsInPersonalInv : itemsInSharedInv}
                user={authentication}
                database={showPersonal ? databaseArr_p : databaseArr_s}></ListCategory>
            <AddItem list={showPersonal ? itemsInPersonalInv : itemsInSharedInv}
                addToList={showPersonal ? addPersonalItemInv : addSharedItemInv}
                database={database}
                authentication={authentication}
                databaseArr={showPersonal ? databaseArr_p : databaseArr_s}></AddItem>
            {/*<Row>
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
            <ListCategory list={showPersonal ? itemsInPersonalInv : itemsInSharedInv}></ListCategory>
            <AddItem  list={showPersonal ? itemsInPersonalInv : itemsInSharedInv} 
    addToList={showPersonal ? addPersonalItemInv : addSharedItemInv}></AddItem>*/}
        </Container>
    );

}

/**
 * container for list categories and their items
 * list-> list that stores items
 */
function ListCategory({ list, user, database }) {
    let count = 0;

    return (

        <div className="category-rectangle">
            {database.map(category =>
                <Row>
                    <div className="d-flex justify-between category-header">
                        <Col>
                            <div className="mr-auto">
                                {category.value}
                            </div>
                        </Col>
                        <CategorysPopup></CategorysPopup>
                    </div>
                    {category.data.map((cat, i) =>
                        <div className="left-spacing">
                            <Row>
                                <Col>
                                    <label key={i}>
                                        {cat.item_name}
                                    </label>
                                </Col>
                            </Row>
                        </div>
                    )}

                </Row>
            )}

        </div>

    );

    {/*return (
        
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
    );*/}
}

/**
 * Remove item from inventory
 */
const RemoveItem = () => {
    // TODO find swipe library? 
    //button?
    //get event info then simply remove from the list

    return (
        <></>
    );
}

/**
 * Component contains the add item button and the popup 
 * that allows item to be added to grocery list
 * list -> list that contains items
 * addtoList-> function that allows list to be alteredd
 */
const AddItem = ({ list, addToList, database, authentication, databaseArr }) => {

    /** constants storing state for this page until we have a database */
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState(false);
    const [itemName, setName] = useState(null);
    const [categoryName, setCategory] = useState(null);

    /* Closes the modal and saves the state to the list*/
    const handleClose = () => {
        setShow(false)
        const item = { value: itemName, label: itemName }
        console.log(item)
        addToList([
            ...list,
            { value: itemName, label: itemName }])
    };

    const handleShow = () => setShow(true);

    const setItemName = (event) => {
        setName(event.target.value);
    };

    const setCategoryName = (event) => {
        let lowerCase = event.target.value.toLowerCase();
        setCategory(lowerCase);
    };

    const addToDatabase = () => {
        setShow(false);
        let found = false;
        let count_c = 0;
        databaseArr.map(category => {
            let lowerCaseCategory = category.value.toLowerCase();
            if (categoryName === lowerCaseCategory) {
                let count = 0;
                category.data.map((cat, i) => {
                    count += 1;
                })
                const item = {item_name: itemName};
                //TODO: figure out how to do push
                found = true;
            }
            count_c += 1;
        })
        if(!found){
            const item =  {item_name: itemName};
            let itemAdd = {};
            itemAdd[0] = item;
            //TODO: figure out to push
        }
    }

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


const InventoryHome = ({ itemsInPersonalInv, itemsInSharedInv, addPersonalItemInv, addSharedItemInv, itemsInPersonalGL, itemsInSharedGL, addPersonalItemGL, addSharedItemGL, props, databaseArr_p, databaseArr_s }) => {
    const db = getDatabase(props.app)
    const auth = getAuth(props.app)
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
            <ShowTab itemsInPersonalGL={itemsInPersonalGL}
                itemsInSharedGL={itemsInSharedGL}
                addPersonalItemGL={addPersonalItemGL}
                addSharedItemGL={addSharedItemGL}
                itemsInPersonalInv={itemsInPersonalInv}
                itemsInSharedInv={itemsInSharedInv}
                addPersonalItemInv={addPersonalItemInv}
                addSharedItemInv={addSharedItemInv}
                database={db}
                authentication={auth}
                databaseArr_p={databaseArr_p}
                databaseArr_s={databaseArr_s}></ShowTab>


        </Container>
    )
}

export default InventoryHome