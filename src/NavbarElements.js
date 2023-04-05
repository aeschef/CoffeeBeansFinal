import React, { useState, Component } from 'react'
import { Navbar, Nav } from 'react'
import './nav_bar.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    BrowserRouter
} from "react-router-dom";


import GroceryListHome from './grocery_list.js';
import InventoryHome from './inventory.js';
import MealPlanHome from './meal_plan';
import RecipesHome from './recipes';
import AccountHome from './account';

function NavbarElements() {
    // Dummy items for now lol   
    const [itemsInPersonalInv, addPersonalItemInv] = useState([
        {value:"carrots", label:"carrots"},
        {value:"fruit snacks", label: "fruit snacks"}
        ]);
    
    const [itemsInSharedInv, addSharedItemInv] = useState([
        {value:"oat milk", label:"oat milk"},
        {value:"rice", label: "rice"}
        ]);

            // Dummy items for now lol
    const [itemsInPersonalGL, addPersonalItemGL] = useState([
        {value:"hummus", label:"hummus"},
        {value:"strawberries", label: "Stawberries"}
        ]);
    
    const [itemsInSharedGL, addSharedItemGL] = useState([
        {value:"almond milk", label:"almond milk"},
        {value:"flour", label: "flour"}
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
                <MealPlanHome /> 
            } />
            <Route path="/recipes.js" element={
                <RecipesHome /> 
            } />
            <Route path="/account.js" element={
                <AccountHome /> 
            } />
        </Routes>

        <nav className="navbar fixed-bottom navbar-light">
              <span className="navbar-text">
                  <img src="grocery_list.png"></img>
                  <Link to="/grocery_list.js" className='nav-link'>List</Link>
              </span>
              <span className="navbar-text">
                  <Link to="/inventory.js" className='nav-link'>Inventory</Link>
                  {}
              </span>
              <span className="navbar-text">
                  <Link to="/meal_plan.js" className='nav-link'>Meal Plan</Link>
                  {}
              </span>
              <span className="navbar-text">
                  <Link to="/recipes.js" className='nav-link'>Recipes</Link>
                  {}
              </span>
              <span className="navbar-text">
                  <Link to="/account.js" className='nav-link'>Account</Link>
                  {}
              </span>
          </nav>
          <div>
          </div>
        </BrowserRouter>  
    );
}

export default NavbarElements

//     //<div>
//     <nav class="navbar fixed-bottom navbar-light">
//     <span class="navbar-text">
//         <img src="grocery_list.png"></img>
//         <Link to="/grocery_list" className='nav-link'>List</Link>
//     </span>
//     <span class="navbar-text">
//         <Link to="/inventory" className='nav-link'>Inventory</Link>
//         {/*<a class="nav-link" href="inventory.js">Inventory</a>*/}
//     </span>
//     <span class="navbar-text">
//         <Link to="/meal_plan" className='nav-link'>Meal Plan</Link>
//         {/*<a class="nav-link" href="meal_plan.js">Meal Plan</a>*/}
//     </span>
//     <span class="navbar-text">
//         <Link to="/recipes" className='nav-link'>Recipes</Link>
//         {/*<a class="nav-link" href="recipes.js">Recipes</a>*/}
//     </span>
//     <span class="navbar-text">
//         <Link to="/account" className='nav-link'>Account</Link>
//         {/*<a class="nav-link" href="account.js">Account</a>*/}
//     </span>
// </nav>
// <div>
// </div>
// </div>
