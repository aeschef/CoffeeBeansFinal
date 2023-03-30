import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarElements from './NavbarElements';
import GroceryListHome from './grocery_list';
import inventory from './inventory';
import meal_plan from './meal_plan';
import recipes from './recipes';
import account from './account';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";

function App() {
{/*export default class App extends React.Component{*/}
  {/*render(){*/}
  return (
    
      <div>
          
            <NavbarElements></NavbarElements>
            
      </div>
  );
}

export default App;
