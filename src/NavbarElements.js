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
import { getDatabase, ref, set, child, get, update, getReference, push } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


function NavbarElements(props) {
    const db = getDatabase(props.app)
    console.log(db)
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

    // Dummy items for now lol   
    const [itemsInPersonalInv, addPersonalItemInv] = useState([
        {value:"bone broth", label:"bone broth"},
        {value:"rice", label: "rice"},
        {value:"egg yolks", label: "egg yolks"},
        {value:"lemon juice", label: "lemon juice"},
        {value:"chicken", label: "chicken"},
        {value:"flour", label: "flour"},
        {value:"sugar", label: "sugar"},
        ]);
    
    const [itemsInSharedInv, addSharedItemInv] = useState([
        {value:"baking powder", label: "baking powder"}
        ]);

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

    // mock database of recipes - TODO: make the pictures actual pictures!  
    let [recipes, setRecipes] = useState([
        {
            title: "Lemon Dill Chicken Soup", 
            picture: "R1 Picture", 
            energyRequired: "Medium", 
            hoursRequired: "0", 
            minsRequired: "35", 
            tags: ["lunch", "soup season"], 
            ingredients: [
                {phrase: "5 cups \"bone broth\" (or low-sodium chicken broth)", focus: "bone broth"},
                {phrase: "2 cups cooked \"rice\"", focus: "rice"},
                {phrase: "2 \"egg yolks\"", focus: "egg yolks"},
                {phrase: "1/3 cup \"lemon juice\"", focus: "lemon juice"},
                {phrase: "2 cups chopped cooked \"chicken\"", focus: "chicken"},
                {phrase: "2 Tablespoons chopped fresh \"dill\"", focus: "dill"},
                {phrase: "\"Pepper\" (to taste)", focus: "pepper"},
                {phrase: "\"Salt\" (to taste)", focus: "salt"}
            ], 
            steps: ["In a large saucepan, bring the broth to a simmer and season with salt and pepper, to taste.", "Add ½ cup rice, egg yolks and lemon juice to a blender, slowly stream in 1 cup of hot broth and puree until smooth.", "Stir the puree into the simmering stock along with the chopped chicken and remaining rice", "Simmer until slightly thickened, approximately 10 minutes.", "Stir in the fresh dill and serve"], 
            notes: ""
        },
        {
            title: "Alfredo Pasta", 
            picture: "R2 Picture", 
            energyRequired: "Low", 
            hoursRequired: "0", 
            minsRequired: "15", 
            tags: ["lunch", "dinner"], 
            ingredients: [
                {phrase: "8 ounce \"pasta\"", focus: "pasta"},
                {phrase: "4 tablespoon \"butter\"", focus: "butter"},
                {phrase: "2 cloves \"garlic\" minced", focus: "garlic"},
                {phrase: "1 1/2 cups \"milk\"", focus: "milk"},
                {phrase: "1 cup \"heavy cream\"", focus: "heavy cream"},
                {phrase: "1/2 cup \"Parmesan cheese\" shredded", focus: "Parmesan cheese"},
                {phrase: "1/4 teaspoon \"salt\" or to taste", focus: "salt"},
                {phrase: "1/4 teaspoon \"pepper\" or to taste", focus: "pepper"},
                {phrase: "2 tabelspoon fresh \"parsley\" chopped", focus: "parsley"}
            ], 
            steps: ["Cook the pasta according to the package instructions.", "Melt the butter in a large skillet over medium high heat.", "Add the garlic and cook for 30 seconds, or until fragrant.", "Pour in the milk and cream. Stir consistently to avoid burning on the bottom of the pan until the mixture comes to a boil", "Turn the heat down to medium, and mix in the parmesan cheese, salt, and pepper.", "Adjust the seasoning to your own taste", "Remove the pan from the heat and mix in the cooked pasta until the sauce begins to thicken.", "Garnish with parsley, and serve."], 
            notes: "You can use a larger ratio of milk to cream if you'd like to cut down on calories. This can be served with chicken or mushrooms to add some protein."
        },
        {
            title: "Pancakes", 
            picture: "R3 Picture", 
            energyRequired: "Medium", 
            hoursRequired: "0", 
            minsRequired: "20", 
            tags: ["breakfast", "comfort food"], 
            ingredients: [
                {phrase: "1 1/2 cups all-purpose \"flour\"", focus: "flour"},
                {phrase: "3 1/2 teaspoons \"baking powder\"", focus: "baking powder"},
                {phrase: "1 tablespoon white \"sugar\"", focus: "sugar"},
                {phrase: "1/4 teaspoon \"salt\", or more to taste", focus: "salt"},
                {phrase: "1 1/4 cups \"milk\"", focus: "milk"},
                {phrase: "3 tablespoons \"butter\", melted", focus: "butter"},
                {phrase: "1 \"egg\"", focus: "egg"},
                {phrase: "1/4 teaspoon \"pepper\" or to taste", focus: "pepper"}
            ],
            steps: ["Sift flour, baking powder, sugar, and salt together in a large bowl.", "Make a well in the center and add milk, melted butter, and egg; mix until smooth.", "Heat a lightly oiled griddle or pan over medium-high heat", "Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake", ">Cook until bubbles form and the edges are dry, about 2 to 3 minutes", "Flip and cook until browned on the other side", "Repeat with remaining batter"], 
            notes: ""
        }
    ]);
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/grocery_list.js" element={
                    <GroceryListHome itemsInPersonalGL={itemsInPersonalGL}
                        itemsInSharedGL={itemsInSharedGL}
                        addPersonalItemGL={addPersonalItemGL}
                        addSharedItemGL={addSharedItemGL}
                        itemsInPersonalInv={itemsInPersonalInv}
                        itemsInSharedInv={itemsInSharedInv}
                        addPersonalItemInv={addPersonalItemInv}
                        addSharedItemInv={addSharedItemInv}> </GroceryListHome>
                } />
                <Route path="/inventory.js" element={
                    <InventoryHome itemsInPersonalInv={itemsInPersonalInv}
                        itemsInSharedInv={itemsInSharedInv}
                        addPersonalItemInv={addPersonalItemInv}
                        addSharedItemInv={addSharedItemInv}
                        itemsInPersonalGL={itemsInPersonalGL}
                        itemsInSharedGL={itemsInSharedGL}
                        addPersonalItemGL={addPersonalItemGL}
                        addSharedItemGL={addSharedItemGL}>  </InventoryHome>
                } />
                <Route path="/meal_plan.js" element={
                    <MealPlanHome personalGroceryList={itemsInPersonalGL} addToGL={addPersonalItemGL} />
                } />
                <Route path="/recipes.js" element={
                <RecipesHome 
                    recipes={recipes} 
                    setRecipes={setRecipes} 
                    personalGroceryList={itemsInPersonalGL} 
                    addToGL={addPersonalItemGL}
                    itemsInSharedInventory={itemsInSharedInv}
                    itemsInPersonalInventory={itemsInPersonalInv} 
                /> 
            } />
                <Route path="/account.js" element={
                    <AccountHome login={props.login} setLogin={props.setLogin}/>
                } />
            </Routes>

            <nav className="navbar fixed-bottom  navbar-light" id="navbar-background">
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <a href="#" className="">
                                <img src={GroceryListIcon} alt="Grocery List Navigation Bar Icon" />
                            </a>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/grocery_list.js" className='nav-link'>List</Link>
                        </Row>
                    </Col>
                </span>
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <a href="#" >
                                <img src={InventoryIcon}alt="Inventory Navigation Bar Icon" className="navbar-icon try" />
                            </a>
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
                            <a href="#" className="">
                                <img src={MealPlanIcon} alt="Meal Plan Navigation Bar Icon" className="navbar-icon" />
                            </a>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/meal_plan.js" className='nav-link'>Meal Plan</Link>
                            { }
                        </Row>
                    </Col>
                </span>
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <a href="#" className="">
                                <img src={RecipeIcon} alt="Recipe Navigation Bar Icon" className="navbar-icon" />
                            </a>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/recipes.js" className='nav-link'>Recipes</Link>
                            { }
                        </Row>
                    </Col>
                </span>
                <span className="navbar-text">
                    <Col>
                        <Row className="justify-content-md-center">
                            <a href="#" className="">
                                <img src={AccountIcon} alt="Account Navigation Bar Icon" className="navbar-icon" />
                            </a>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Link to="/account.js" className='nav-link'>Account</Link>
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
