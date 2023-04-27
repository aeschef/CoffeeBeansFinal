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
import { getDatabase, ref, push, remove, update, onValue, set } from "firebase/database"
import { getAuth } from "firebase/auth";
import './css/meal_plan.css'
//Import Style Sheet
import './css/grocery_list.css';

//Import modals
import FilterPopup from './modals/FilterItems';
import CategorysPopup from './modals/EditGLICategories';


/**
 * Handles incrementing and decrementing the number of items 
 * needed from the grocery store
 */
function IncDec({ cat, refresh, setRefresh, databaseArr, category, name, code, auth, database, index}) {
    let [num, setNum] = useState(cat.item_num);
    //console.log(val);
    //console.log("NUM: " + category);
    let inc_num = () => {
        setNum(Number(num) + 1);
        let updateNum = num + 1;
        updateDatabase(updateNum);
        //console.log(num + 1);
    }

    let dec_num = () => {
        setNum(Number(num) - 1);
        let updateNum = num - 1;
        if(updateNum <= 0){
            removeItem(cat, category);
        } else{
            updateDatabase(updateNum);
        }
    }

    /**
     * Remove item from inventory
     */
    const removeItem = (cat, category) => {
        //get first part of ref address
        let users = '/users/' + auth.currentUser.uid;
        let group = '/groups/' + code;
        let use = "";
        if (("" + code).length === 1) {
            use = users;
        } else {
            use = group;
        }
        
        let catRef = ref(getDatabase(), use + '/grocery_list/categories/' + category );
        remove(ref(getDatabase(), use + '/grocery_list/categories/' + category +'/'+ index));               
        setRefresh(true);
        
    }   

    const updateDatabase = (num) => {
        //console.log("HERE");
        databaseArr.map(categ => {
            //console.log("Inside: " + categ.value + " AND " + category)
            if (categ.value === category) {
                //console.log("I Inside")
                categ.data.map((c, i) => {
                    //console.log("WHY")
                    if (name === c.item_name) {
                        //console.log("HIIII BUTTT: " + i);
                        let users = '/users/' + auth.currentUser.uid;
                        let group = '/groups/' + code;
                        let use = "";
                        if (("" + code).length === 1) {
                            use = users;
                        } else {
                            use = group;
                        }
                        //console.log(use + '/grocery_list/categories/' + categ.value + '/' + i + '/item_name')
                        //console.log("NUM: " + Number(num));
                        set(ref(database, use + '/grocery_list/categories/' + categ.value + '/' + i + '/item_num'), num)
                        setRefresh(true);
                    }
                })
            }
        })
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
const ShowTab = ({ database, authentication, databaseArray_p, databaseArray_s, accessCode, refresh, setRefresh }) => {
    const [key, setKey] = useState('personal');
    // state determining if we should show personal tab
    const [showPersonal, setPersonal] = useState(true);
    const handlePersonal = () => {
        setPersonal(true)
        setKey('personal');
    };
    const handleShared = () => {
        setPersonal(false)
        setKey('shared');
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
            <ListCategory
                user={authentication}
                database={showPersonal ? databaseArray_p : databaseArray_s}
                refresh={refresh}
                setRefresh={setRefresh}
                accessCode={showPersonal ? 0 : accessCode}
                auth={authentication}
                data={database}></ListCategory>
            <AddItem
                database={database}
                auth={authentication}
                databaseArr={showPersonal ? databaseArray_p : databaseArray_s}
                accessCode={showPersonal ? 0 : accessCode}
                refresh={refresh}
                setRefresh={setRefresh}></AddItem>
        </Container>
    );

}

/**
 * displays the category name and the elements it contains
 * takes in the list of items in the gorcery list currently
 */
function ListCategory({ user, database, refresh, setRefresh, accessCode, auth, data}) {

    /*displays the item in the grocery list*/
    function DummyItem({ item_name, i, cat, refresh, setRefresh, databaseArr, category, accessCode, auth, data, checked }) {

        /** 
         * when an item is checked, add it to inventory, update checked field in database
         */
        const handleCheck = (event) => {
            //get first part of ref address
            let users = '/users/' + auth.currentUser.uid;
            let group = '/groups/' + accessCode;
            let use = "";
            if (("" + accessCode).length === 1) {
                use = users;
            } else {
                use = group;
            }

            if(event.target.checked){
                //checked! Add to Inv
                push(ref(getDatabase(), use + '/inventory/categories/' + category), { item_name: item_name} );
            } else{
                //unchecked ACK we need to remove!
                let catRef = ref(getDatabase(), use + '/inventory/categories/' + category );
                onValue(catRef, (snapshot) => {
                    snapshot.forEach((thing)=>{
                        if(thing.val().item_name === item_name){
                            remove(ref(getDatabase(), use + '/inventory/categories/' + category +'/'+ thing.key))
                        }
                    })
                });
            }

            // set checked in database
            update(ref(getDatabase(), use + '/grocery_list/categories/' + category + '/'  + i ), {
                checked: event.target.checked,
                item_name: item_name,
                item_num: cat.item_num
            });

            //re-render page
            setRefresh(true);
        }
    

        if (item_name.length === 0) {
            return null;
        }
        //console.log("CAT: " + category);
        return (
            <div className="left-spacing">
                <Row>
                    <Col>
                        <label key={i} className="color-checked">
                            <input
                                type="checkbox"
                                name="lang"
                                className="pl-1"
                                value={item_name}
                                checked={cat.checked}
                                onChange={handleCheck}
                            />
                            {item_name}
                        </label>
                    </Col>
                    <Col xs={{ span: 4 }}>
                        <IncDec cat={cat}
                            refresh={refresh}
                            setRefresh={setRefresh}
                            databaseArr={databaseArr}
                            category={category}
                            name={item_name}
                            code={accessCode}
                            auth={auth}
                            database={data}
                            index={i}></IncDec>
                    </Col>
                </Row>
            </div>
        )
    }

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
                                <DummyItem item_name={cat.item_name}
                                    i={i}
                                    cat={cat}
                                    refresh={refresh}
                                    setRefresh={setRefresh}
                                    databaseArr={database}
                                    category={category.value}
                                    accessCode={accessCode}
                                    auth={auth}
                                    data={data}
                                    checked={cat.checked}></DummyItem>
                                {/*<Col>
                                    <label key={i}>
                                        <input
                                            type="checkbox"
                                            name="lang"
                                            value={cat.item_name}
                                            onChange={handleCheck}
                                        />
                                        {cat.item_name}
                                        {console.log(cat.item_name + " AND " + cat.item_name.length)}
                                    </label>
                                </Col>
                                <Col xs={{ span: 4 }}>
                                    <IncDec val={cat.item_num}></IncDec>
                    </Col>*/}
                            </Row>
                        </div>
                    )}

                </Row>
            )}

        </div>

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

const AddItem = ({ database, auth, databaseArr, accessCode, refresh, setRefresh }) => {
    //console.log("Add Item");
    //console.log(databaseArr);
    /** constants storing state for this page until we have a database */
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState(false);
    const [itemName, setName] = useState(null);
    const [categoryName, setCategory] = useState(null);

    /* Closes the modal and saves the state to the list*/
    const handleClose = () => {
        setShow(false);

    };

    /*const handleSave = () => {
        setShow(false);
        const item = { value: itemName, label: itemName }
        console.log(item)
        addToList([
            ...list,
            { value: itemName, label: itemName }]);
    };*/

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
            let normal = category.value;
            let lowerCaseCategory = category.value.toLowerCase();
            console.log(category.value);
            if (categoryName === lowerCaseCategory) {
                category.value = normal;
                found = true;
                let count = 0;
                category.data.map((cat, i) => {
                    count += 1;
                })
                let obj = {}
                const item = { item_name: itemName, item_num: 1, checked: 'false' };
                obj[count] = item;
                let users = '/users/' + auth.currentUser.uid;
                let group = '/groups/' + accessCode;
                let use = "";
                if (("" + accessCode).length === 1) {
                    use = users;
                } else {
                    use = group;
                }
                //console.log("WTF: " + category.value);
                update(ref(database, use + '/grocery_list/categories/' + category.value), obj);
            }
            count_c += 1;
            setRefresh(true);
        })

        if (!found) {
            let add = {};
            const item = { item_name: itemName, item_num: 1, checked: 'false' };
            add[count_c] = { value: categoryName };
            console.log("not found");
            let itemAdd = {};
            itemAdd[0] = item;

            
            let users = '/users/' + auth.currentUser.uid;
            let group = '/groups/' + accessCode;
            let use = "";
            if (("" + accessCode).length === 1) {
                use = users;
            } else {
                use = group;
            }
            
            {/*if (("" + accessCode).length == 1) {
                update(ref(database, '/users/' + auth.currentUser.uid + '/grocery_list/categories/' + categoryName), itemAdd);
            } else {
                update(ref(database, '/groups/' + accessCode + '/grocery_list/categories/' + categoryName), itemAdd);
            }*/}
            update(ref(database, use + '/grocery_list/categories/' + categoryName), itemAdd);
            //set(ref(database, use + '/inventory/categories/'), categoryName);
            let invAdd = {};
            let dummy = { item_name: "" };
            invAdd[0] = dummy;
            update(ref(database, use + '/inventory/categories/' + categoryName), invAdd);
            setRefresh(true);
        }
    }

    return (
        <>

            {/*<Button className="fixedbutton" id="add-button" value="Add item" onClick={handleShow}>Add</Button>*/}
            <a class="fixedButton" id="add-button" value="Add item" href="#" onClick={handleShow}>
                <svg fill="#729701" height="50px" width="50px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 300.003 300.003" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M150,0C67.159,0,0.001,67.159,0.001,150c0,82.838,67.157,150.003,149.997,150.003S300.002,232.838,300.002,150 C300.002,67.159,232.839,0,150,0z M213.281,166.501h-48.27v50.469c-0.003,8.463-6.863,15.323-15.328,15.323 c-8.468,0-15.328-6.86-15.328-15.328v-50.464H87.37c-8.466-0.003-15.323-6.863-15.328-15.328c0-8.463,6.863-15.326,15.328-15.328 l46.984,0.003V91.057c0-8.466,6.863-15.328,15.326-15.328c8.468,0,15.331,6.863,15.328,15.328l0.003,44.787l48.265,0.005 c8.466-0.005,15.331,6.86,15.328,15.328C228.607,159.643,221.742,166.501,213.281,166.501z"></path> </g> </g> </g></svg>
            </a>

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


const GroceryListHome = ({ props, accessCode }) => {
    const auth = getAuth(props.app)
    const db = getDatabase(props.app)
    const [categories, setCategory] = useState([]);
    const [categories_s, setCategory_s] = useState([]);
    const [accessCode_s, setAccess] = useState("");

    /**
     * Controls when the page will refresh to display the list of items
     * Prevents the infinite population issue
     */
    const [refresh, setRefresh] = useState(true);

    /**
     * Creates the array that is later used to display the shared grocery list
     */
    useEffect(() => {
        if (accessCode_s) {
            const dbRefS = ref(db, '/groups/' + accessCode_s + '/grocery_list/categories');
            onValue(dbRefS, (snapshot) => {
                const accessData = []
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    accessData.push({ value: childKey, data: childData })
                });
                setCategory_s(accessData);
            }, {
                onlyOnce: true
            });
        }
        setRefresh(false);
    }, [accessCode_s, refresh])

    /**
     * Creates array that is used to display personal GL
     */
    useEffect(() => {
        const dbRefP = ref(db, '/users/' + auth.currentUser.uid + '/grocery_list/categories/');
        onValue(dbRefP, (snapshot) => {
            const dataCat = []
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                let dataGL = []
                const childData = childSnapshot.val();
                dataGL = { childData };
                dataCat.push({ value: childKey, data: childData })
            });
            setCategory(dataCat);
        }, {
            onlyOnce: true
        });
        setAccess(accessCode);
        setRefresh(false);
    }, [refresh])

    return (
        <Container fluid="md">
            <Row>
                <Col xs={{ span: 6, offset: 3 }}>
                    <h1>Grocery List</h1>
                </Col>
                <Col xs={{ span: 2 }}>
                    <FilterPopup itemsInPersonalGL={categories}
                        itemsInSharedGL={categories_s}></FilterPopup>
                </Col>
            </Row>
            <ShowTab
                database={db}
                authentication={auth}
                databaseArray_p={categories}
                databaseArray_s={categories_s}
                accessCode={accessCode_s}
                refresh={refresh}
                setRefresh={setRefresh}
            ></ShowTab>


        </Container>
    );
}

export default GroceryListHome
