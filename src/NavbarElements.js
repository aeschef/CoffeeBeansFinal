import React, { Component } from 'react'
import { Navbar, Nav } from 'react'
import './nav_bar.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    BrowserRouter
} from "react-router-dom";

import grocery_list from './grocery_list';
import inventory from './inventory';
import meal_plan from './meal_plan';
import recipes from './recipes';
import account from './account';

export default class NavbarElements extends Component {
    render() {
        return (
            <div>
                <nav class="navbar fixed-bottom navbar-light">
                    <span class="navbar-text">
                        <img src="grocery_list.png"></img>
                        <Link to="/grocery_list" className='nav-link'>List</Link>
                    </span>
                    <span class="navbar-text">
                        <Link to="/inventory" className='nav-link'>Inventory</Link>
                        {/*<a class="nav-link" href="inventory.js">Inventory</a>*/}
                    </span>
                    <span class="navbar-text">
                        <Link to="/meal_plan" className='nav-link'>Meal Plan</Link>
                        {/*<a class="nav-link" href="meal_plan.js">Meal Plan</a>*/}
                    </span>
                    <span class="navbar-text">
                        <Link to="/recipes" className='nav-link'>Recipes</Link>
                        {/*<a class="nav-link" href="recipes.js">Recipes</a>*/}
                    </span>
                    <span class="navbar-text">
                        <Link to="/account" className='nav-link'>Account</Link>
                        {/*<a class="nav-link" href="account.js">Account</a>*/}
                    </span>
                </nav>
                <div>
                </div>
            </div>
        )
    }
}