import React, { useState, Component, useEffect } from 'react'
import { Navbar, Nav } from 'react'
import './css/nav_bar.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    BrowserRouter
} from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import InventoryIcon from './svg/inventory.svg'
import MealPlanIcon from './svg/meal_plan.svg'
import RecipeIcon from './svg/recipes.svg'
import GroceryListIcon from './svg/grocery_list.svg'
import AccountIcon from './svg/account.svg'

import GroceryListHome from './grocery_list.js';
import InventoryHome from './inventory.js';
import MealPlanHome from './meal_plan';
import RecipesHome from './recipes';
import AccountHome from './account';
import { getDatabase, ref, set, child, get, update, getReference, push, onValue } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


function NavbarElements(props) {
    const db = getDatabase(props.app)
    //console.log(db)
    const auth = getAuth(props.app)
    
    // method called when user first signs up for our app in order to populate database with their collection
    function writeUserData() {

        // contains default structure to store data
        let dataStructure = require('./newUser.json');
        console.log("database")
        console.log(dataStructure)
        // set(ref(db, 'users/' + auth.currentUser.uid), dataStructure)) 

        // Uses the current user's UID (the user who is logged in) to retrieve their associated data in firebase. 
        get(child(ref(db), `users/` + auth.currentUser.uid)).then((snapshot) => {

            // If a collection exists for the specified user UID:
            if (snapshot.exists()) {
                console.log(snapshot.val());
                // addFavorites(snapshot.val().favorites);

                // If a collection does not exist for the user, create one. 
            }
        })
    }
    const [accessCode, setAccess] = useState("");

    // Populates pages with data for the current user
    useEffect(() => {
        const dbRef = ref(db);
        // Uses the current user's UID to retrieve their associated data in firebase. 
        get(child(dbRef, `users/` + auth.currentUser.uid)).then((snapshot) => {

            // If a collection exists for the specified user UID:
            if (snapshot.exists()) {
                console.log(snapshot.val());
                // addFavorites(snapshot.val().favorites);

                // If a collection does not exist for the user, create one. 
            } else {

                // Creates empty data structure for new user.
                // writeUserData()
                console.log("user does not yet have information")
            }
        })
    }, [])


    const dbRef = ref(db);
        get(child(dbRef, '/users/' + auth.currentUser.uid + '/account/groupID')).then((snapshot) => {
            if (snapshot.exists()) {
                setAccess(snapshot.val());
    //            console.log("HI" + accessCode + snapshot.val());
                console.log()
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
        
    // Dummy items for now lol
    const [itemsInPersonalGL, addPersonalItemGL] = useState([
        { value: "hummus", label: "hummus" },
        { value: "strawberries", label: "Stawberries" },
        { value: "raspberries", label: "raspberries" },
        { value: "milk", label: "milk" }
    ]);

    const [itemsInSharedGL, addSharedItemGL] = useState([
        { value: "almond milk", label: "almond milk" },
        { value: "flour", label: "flour" }
    ]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/grocery_list.js" element={
                    <GroceryListHome
                        props={props}
                        //databaseArr_p={categories}
                        //databaseArr_s={categories_s}
                        accessCode={accessCode}></GroceryListHome>
                } />
                <Route path="/inventory.js" element={
                    <InventoryHome
                        props={props}
                        //databaseArray_p={categories_i}
                        //databaseArray_s={categories_is}
                        accessCode={accessCode}>  </InventoryHome>
                } />
                <Route path="*" element={
                    <MealPlanHome personalGroceryList={itemsInPersonalGL} addToGL={addPersonalItemGL}/>
                } />
                <Route path="/recipes.js" element={
                <RecipesHome 
                    personalGroceryList={itemsInPersonalGL} 
                    addToGL={addPersonalItemGL}
                    app={props.app}
                    userAuth={auth}
                    storage={props.storage}
                /> 
            } />
                <Route path="/account.js" element={
                    <AccountHome login={props.login} 
                    setLogin={props.setLogin}
                    accessCode={accessCode}
                    props={props}/>
                } />
            </Routes>

            <nav className="navbar fixed-bottom  navbar-light" id="navbar-background">
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <Link to="/grocery_list.js" className="">
                                <img src={GroceryListIcon} alt="Grocery List Navigation Bar Icon" className='navbar-icon grocery_list'/>
                            </Link>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/grocery_list.js" className='nav-link text-style'>List</Link>
                        </Row>
                    </Col>
                </span>
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <Link to="/inventory.js" >
                                <img src={InventoryIcon}alt="Inventory Navigation Bar Icon" className="navbar-icon inventory" />
                            </Link>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/inventory.js" className='nav-link text-style'>Inventory</Link>
                            { }
                        </Row>
                    </Col>
                </span>
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <Link to="/meal_plan.js" className="">
                                <img src={MealPlanIcon} alt="Meal Plan Navigation Bar Icon" className="navbar-icon meal_plan" />
                            </Link>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/meal_plan.js" className='nav-link text-style'>
                              Meal Plan</Link>
                            { }
                        </Row>
                    </Col>
                </span>
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <Link to="/recipes.js" className="">
                                <img src={RecipeIcon} alt="Recipe Navigation Bar Icon" className="navbar-icon recipes" />
                            </Link>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/recipes.js" className='nav-link text-style'>Recipes</Link>
                            { }
                        </Row>
                    </Col>
                </span>
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <Link to="/account.js" className="">
                                <img src={AccountIcon} alt="Account Navigation Bar Icon" className="navbar-icon account" />
                            </Link>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/account.js" className='nav-link text-style' id="account">Account</Link>
                            { }
                        </Row>
                    </Col>
                </span>
            </nav>
            <div>
            </div>
        </BrowserRouter>
    );
}

export default NavbarElements
