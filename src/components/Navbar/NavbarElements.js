import React, { Component } from 'react'
import { Navbar, Nav } from 'react'
import './nav_bar.css';

export default class NavbarElements extends Component {
    render() {
        return (
            <div>
                <nav class="navbar fixed-bottom navbar-light">
                    <span class="navbar-text">
                        <img src="grocery_list.png"></img>
                        <a class="nav-link" href="grocery_list.js">List <span class="sr-only"></span></a>
                    </span>
                    <span class="navbar-text">
                        <a class="nav-link" href="inventory.js">Inventory</a>
                    </span>
                    <span class="navbar-text">
                        <a class="nav-link" href="meal_plan.js">Meal Plan</a>
                    </span>
                    <span class="navbar-text">
                        <a class="nav-link" href="recipes.js">Recipes</a>
                    </span>
                    <span class="navbar-text">
                        <a class="nav-link" href="account.js">Account</a>
                    </span>
                </nav>
            </div>
        )
    }
}