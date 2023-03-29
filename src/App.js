import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarElements from './NavbarElements';
import { BrowserRouter as Router, Route, Routes, render } from 'react-router-dom';
import grocery_list from './grocery_list';
import inventory from './inventory';
import meal_plan from './meal_plan';
import recipes from './recipes';
import account from './account';

{/*function App() {*/}
export default class App extends React.Component{
  render(){
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <div>
            <NavbarElements />
            <Routes path="/" component={App}>
              <Route path='grocery_list' render={() => <grocery_list></grocery_list>} />
              <Route exact path='inventory' render={() => <inventory></inventory>} />
              <Route exact path='meal_plan' render={() => <meal_plan></meal_plan>} />
              <Route exact path='recipes' render={() => <recipes></recipes>} />
              <Route exact path='account' render={() => <account></account>} />
            </Routes>
          </div>
        </Router>

      </header>
    </div>
  );
  }

}

{/*export default App;*/}
