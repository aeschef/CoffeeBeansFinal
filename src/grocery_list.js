/** imports  */
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

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
/**
 * TO DO: Have the items in shared inventory and such figured out
 */
const ShowTab = ({ itemsInPersonalInv, itemsInSharedInv, addPersonalItemInv, addSharedItemInv, itemsInPersonalGL, itemsInSharedGL, addPersonalItemGL, addSharedItemGL, database, authentication, databaseArray_p, databaseArray_s }) => {
    const [key, setKey] = useState('personal');
    // state determining if we should show personal tab
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

    const [categories, setCategory] = useState([]);
    const handleCategory = (name) => {
        setCategory(categories => [
            ...categories,
            { value: name, label: name }
        ]);
    };

    const handleSelect = (key) => {
        if (key === 'personal') {
            setPersonal(true);
        } else if (key === 'shared') {
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
            <ListCategory groceryList={showPersonal ? itemsInPersonalGL : itemsInSharedGL}
                user={authentication}
                database={showPersonal ? databaseArray_p : databaseArray_s}
                inventoryList={showPersonal ? itemsInPersonalInv : itemsInSharedInv}
                addtoInventory={showPersonal ? addPersonalItemInv : addSharedItemInv}></ListCategory>
            <AddItem list={showPersonal ? itemsInPersonalGL : itemsInSharedGL}
                addToList={showPersonal ? addPersonalItemGL : addSharedItemGL}
                database={database}
                auth={authentication}
                databaseArr={showPersonal ? databaseArray_p : databaseArray_s}></AddItem>
        </Container>
    );

}

/**
 * displays the category name and the elements it contains
 * takes in the list of items in the gorcery list currently
 */
function ListCategory({ groceryList, user, database, inventoryList, addtoInventory }) {

    const handleCheck = (event) => {
        if (event.target.checked) {
            const itemName = event.target.value;
            const item = { value: itemName, label: itemName };
            console.log(item + "added to inventory");
            addtoInventory([
                ...inventoryList,
                { value: itemName, label: itemName }
            ]);

        } else {
            //TODO remove from inventory
        }
    }

    let count = 0;

    return (

        <div className="category-rectangle">
            {database.map(category =>
                <Row>
                    {count += 1}
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
                                        <input
                                            type="checkbox"
                                            name="lang"
                                            value={cat.item_name}
                                            onChange={handleCheck}
                                        />
                                        {cat.item_name}
                                    </label>
                                </Col>
                                <Col xs={{ span: 4 }}>
                                    <IncDec></IncDec>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {/*{groceryList.map((x, i) =>
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
                                <Col xs={{ span: 4 }}>
                                    <IncDec></IncDec>
                                </Col>
                            </Row>
                        </div>
                    )}*/}

                </Row>
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

    return (
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

const AddItem = ({ list, addToList, database, auth, databaseArr }) => {

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
        const item = { value: itemName, label: itemName }
        console.log(item)
        addToList([
            ...list,
            { value: itemName, label: itemName }]);
    };

    const handleShow = () => setShow(true);

    const setItemName = (event) => {
        setName(event.target.value);
        console.log(itemName);
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
                console.log(count);
                let obj = {}
                const item = { item_name: itemName, item_num: 1 };
                obj[count] = item;
                update(ref(database, '/users/' + auth.currentUser.uid + '/grocery_list/categories/' + category.value), obj);
                found = true;
            }
            count_c += 1;
        })

        if (!found) {
            let add = {};
            const item = { item_name: itemName, item_num: 1 };
            add[count_c] = { value: categoryName };
            console.log(add);
            let itemAdd = {};
            itemAdd[0] = item;
            update(ref(database, '/users/' + auth.currentUser.uid + '/grocery_list/categories/' + categoryName), itemAdd);
        }
    }

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
                    <Button variant="primary" onClick={addToDatabase}>Save</Button>
                </Modal.Body>
            </Modal>
        </>
    );
};

/**
 * Top level component for this page... simply holds title and the components that manage the rest of the pages functionality
 */
const GroceryListHome = ({ itemsInPersonalInv, itemsInSharedInv, addPersonalItemInv, addSharedItemInv, itemsInPersonalGL, itemsInSharedGL, addPersonalItemGL, addSharedItemGL, props, databaseArr_p, databaseArr_s }) => {
    const db = getDatabase(props.app)
    const auth = getAuth(props.app)
    return (
        <Container fluid="md">
            <Row>
                <Col xs={{ span: 6, offset: 3 }}>
                    <h1>Grocery List</h1>
                </Col>
                <Col xs={{ span: 2 }}>
                    <FilterPopup itemsInPersonalGL={itemsInPersonalGL}
                        itemsInSharedGL={itemsInSharedGL}></FilterPopup>
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
                databaseArray_p={databaseArr_p}
                databaseArray_s={databaseArr_s}></ShowTab>


        </Container>
    );
}
export default GroceryListHome
