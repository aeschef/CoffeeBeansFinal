import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ToggleButton from 'react-bootstrap/ToggleButton';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, remove } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import RecipeSearchBar from './RecipeSearchBar';

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
const ShowTab = ({ database, authentication, databaseArr_p, databaseArr_s, accessCode, refresh, setRefresh }) => {
    //console.log("SHOW TAB");
    //console.log(databaseArr_p);
    const [key, setKey] = useState('personal');
    // stores if we should be showing the personal or shared tab
    const [showPersonal, setPersonal] = useState(true);
    const handlePersonal = () => {
        setPersonal(true)
        setKey('personal');
    };
    const handleShared = () => {
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

    const [searchInput, setSearchInput] = useState("");

    const searchedPersonalList = databaseArr_p.map((category) => {
        return {...category, data: category.data.filter((item) => (item.item_name.toLowerCase().trim().match(searchInput.toLowerCase().trim())))}
    }).filter((category) => (category.data.length > 0));

    const searchedSharedList = databaseArr_s?.map((category) => {
        return {...category, data: category.data.filter((item) => (item.item_name?.toLowerCase().trim().match(searchInput.toLowerCase().trim())))}
    }).filter((category) => (category.data.length > 0)) || databaseArr_s;

    return (
        <>
            <Container>
                <Tabs defaultActiveKey={'personal'} animation={false} onSelect={handleSelect} className="mb-2">
                    <Tab eventKey='personal' title="personal" onSelect={handlePersonal}>
                    </Tab>
                    <Tab eventKey='shared' title="shared" onSelect={handleShared}>
                    </Tab>
                </Tabs>
                <RecipeSearchBar searchInput={searchInput} setSearchInput={setSearchInput} placeholder="Search"></RecipeSearchBar>
                <ListCategory
                    user={authentication}
                    accessCode={showPersonal ? 0 : accessCode}
                    database={database}
                    refresh={refresh}
                    setRefresh={setRefresh}             
                    databaseArr={showPersonal ? searchedPersonalList : searchedSharedList}></ListCategory>
                <AddItem
                    database={database}
                    authentication={authentication}
                    databaseArr={showPersonal ? databaseArr_p : databaseArr_s}
                    accessCode={showPersonal ? 0 : accessCode}
                    refresh={refresh}
                    setRefresh={setRefresh}></AddItem>
            </Container>
        </>
    );

}

/**
 * container for list categories and their items
 * list-> list that stores items
 */
function ListCategory({ user, databaseArr, database, accessCode, refresh, setRefresh }) {
    let count = 0;
    console.log(databaseArr);

    /**
     * Remove item from inventory
     */
    const removeItem = (cat, category) => {
        //get first part of ref address
        let users = '/users/' + user.currentUser.uid;
        let group = '/groups/' + accessCode;
        let use = "";
        if (("" + accessCode).length === 1) {
            use = users;
        } else {
            use = group;
        }
        
        let catRef = ref(getDatabase(), use + '/inventory/categories/' + category );
        onValue(catRef, (snapshot) => {
            snapshot.forEach((thing) => {
                if(thing.val().item_name === cat.item_name){
                    console.log("removeing: " + use + '/inventory/categories/' + category +'/'+ cat.key);
                    remove(ref(getDatabase(), use + '/inventory/categories/' + category +'/'+ cat.key));               
                    setRefresh(true);
                }
            })
        });
        
      
                         
    }
    

    const Remove  = ( {cat, categories} ) => {

        if(cat.key != 0)
        {
            return (
                <>
                    <Col>        
                       <svg onClick={() => removeItem(cat, categories.value)} fill="#000000" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 455 455">
                        <g>
                          <g>
                            <path fill="#525252" d="M227.5,0C101.761,0,0,101.75,0,227.5C0,353.239,101.75,455,227.5,455C353.239,455,455,353.25,455,227.5
                              C455.001,101.761,353.251,0,227.5,0z M310.759,268.333c11.715,11.716,11.715,30.711,0,42.427
                              c-5.858,5.858-13.536,8.787-21.213,8.787s-15.355-2.929-21.213-8.787L227.5,269.927l-40.832,40.832
                              c-5.858,5.858-13.536,8.787-21.213,8.787s-15.355-2.929-21.213-8.787c-11.715-11.716-11.715-30.711,0-42.427l40.832-40.832
                              l-40.832-40.832c-11.715-11.716-11.715-30.711,0-42.427c11.716-11.716,30.711-11.716,42.427,0l40.832,40.832l40.832-40.832
                              c11.716-11.716,30.711-11.716,42.427,0c11.715,11.716,11.715,30.711,0,42.427L269.927,227.5L310.759,268.333z"/>
                          </g>
                        </g>
                        </svg>
                    </Col>
                </> 
            )
            
        }
         else{
            return <></>
         }
                        
    }

    return (

        <div className="category-rectangle">
            {databaseArr.map(categories =>
                <Row>
                    {console.log(categories)}
                    <div className="d-flex justify-between category-header">
                        <Col>
                            <div className="mr-auto">
                                {categories.value}
                            </div>
                        </Col>
                        <CategorysPopup></CategorysPopup>
                    </div>
                    {categories.data.map((cat, i) =>
                        <div className="left-spacing">
                            <Row>
                                <Col>
                                    <label key={i}>
                                        {cat.item_name}
                                    </label>
                                </Col>
                                <Col>
                                    <Remove cat={cat} categories={categories}></Remove>
                                </Col>
                               
                            </Row>
                        </div>
                    )}
                </Row>
            )}

        </div>

    );

}



/**
 * Component contains the add item button and the popup 
 * that allows item to be added to grocery list
 * list -> list that contains items
 * addtoList-> function that allows list to be alteredd
 */
const AddItem = ({ database, authentication, databaseArr, accessCode, refresh, setRefresh }) => {

    /** constants storing state for this page until we have a database */
    const [show, setShow] = useState(false);
    const [checked, setChecked] = useState(false);
    const [itemName, setName] = useState(null);
    const [categoryName, setCategory] = useState(null);

    /* Closes the modal and saves the state to the list*/
    const handleClose = () => {
        setShow(false)
        /*const item = { value: itemName, label: itemName }
        console.log(item)
        addToList([
            ...list,
            { value: itemName, label: itemName }])*/
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
            let normal = category.value;
            let lowerCaseCategory = category.value.toLowerCase();
            if (categoryName === lowerCaseCategory) {
                category.value = normal;
                found = true;
                let count = 0;
                category.data.map((cat, i) => {
                    count += 1;
                })
                //const item = { item_name: itemName };
                let users = '/users/' + authentication.currentUser.uid;
                let group = '/groups/' + accessCode;
                let use = "";
                if (("" + accessCode).length === 1) {
                    use = users;
                } else {
                    use = group;
                }
                //TODO: figure out how to do push
                const dbRefIP = ref(database, use + '/inventory/categories/' + category.value);
                push(dbRefIP, {
                    item_name: itemName
                })

            }
            count_c += 1;
            setRefresh(true);
        })
        if (!found) {
            let obj = {};
            obj[count_c] = categoryName;
            let users = '/users/' + authentication.currentUser.uid;
            let group = '/groups/' + accessCode;
            let use = "";
            if (("" + accessCode).length === 1) {
                use = users;
            } else {
                use = group;
            }
            const dbRefIC = ref(database, use + '/inventory/categories/' + categoryName);
            push(dbRefIC, {
                item_name: itemName
            })
            let glAdd = {};
            let dummy = {item_name: ""};
            glAdd[0] = dummy;
            update(ref(database, use + '/grocery_list/categories/' + categoryName), glAdd);
            setRefresh(true);
        }
    }

    // modal to add element to inventory
    return (
        <>
            {/*<Button className="fixedbutton" value="Add item" onClick={handleShow}>Add</Button>*/}
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
                            <Form.Label>Item Name</Form.Label>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="i.e apples, rice, etc."
                                onChange={setItemName}
                                autoFocus
                            />
                            <Form.Label>Category Name</Form.Label>
                            <Form.Control
                                size="sm"
                                type="text"
                                placeholder="i.e produce, dairy, etc."
                                onChange={setCategoryName}
                            />
                        </Form.Group>
                    </Form>
                
                    <Button variant="primary" onClick={addToDatabase}>Save</Button>
                </Modal.Body>
            </Modal>
        </>
    );
};


const InventoryHome = ({ props, accessCode }) => {
    const db = getDatabase(props.app)
    const auth = getAuth(props.app)
    const [categories_i, setCategory_i] = useState([]);
    const [categories_is, setCategory_is] = useState([]);
    const [accessCode_s, setAccess] = useState("");

    /**
     * Controls when the page will refresh to display the list of items
     * Prevents the infinite population issue
     */
    const [refresh, setRefresh] = useState(true);

    /**
     * Creates the array that is later used to display the shared inventory
     */
    useEffect(() => {
        if (accessCode_s) {
            const dbRefS = ref(db, '/groups/' + accessCode_s + '/inventory/categories/');
            onValue(dbRefS, (snapshot) => {
                const accessData = []
                snapshot.forEach((childSnapshot) => {
                    const dbRefS = ref(db, '/groups/' + accessCode_s + '/inventory/categories/' + childSnapshot.key);
                    let dataI = []
                    const childData = childSnapshot.val();
                    let keys = Object.keys(childSnapshot.val());
                    keys.forEach((id) => {
                        dataI.push({ key: id, item_name: childData[id].item_name })
                    })
                    accessData.push({ value: childSnapshot.key, data: dataI })
                });
                setCategory_is(accessData);
            }, {
                onlyOnce: true
            });
        }
        setRefresh(false);
    }, [accessCode_s, refresh])

    /**
     * Creates array that is used to display personal inventory
     */
    useEffect(() => {
        const dbRefP = ref(db, '/users/' + auth.currentUser.uid + '/inventory/categories/');
        onValue(dbRefP, (snapshot) => {
            const dataCat = []
            snapshot.forEach((childSnapshot) => {
                const dbRefC = ref(db, '/users/' + auth.currentUser.uid + '/inventory/categories/' + childSnapshot.key);
                let dataI = []
                const childData = childSnapshot.val();
                let keys = Object.keys(childSnapshot.val());
                keys.forEach((id) => {
                    dataI.push({ key: id, item_name: childData[id].item_name })
                    console.log("Item_name: " + childData[id].item_name)
                })
                dataCat.push({ value: childSnapshot.key, data: dataI })
            });
            setCategory_i(dataCat);
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
                    <h1 className="inventory-title">Inventory</h1>
                </Col>
               
            </Row>
            <ShowTab
                database={db}
                authentication={auth}
                databaseArr_p={categories_i}
                databaseArr_s={categories_is}
                accessCode={accessCode_s}
                refresh={refresh}
                setRefresh={setRefresh}></ShowTab>


        </Container>
    )
}

export default InventoryHome