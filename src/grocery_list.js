import React, { Component } from 'react'
import logo from './logo.svg';
import './App.css';

export default class grocery_list extends Component {
    render() {
        return (
            <div>
                <img src={logo} className="App-logo" alt="logo" />
                <h2> About</h2>
            </div>
        )
    }
}