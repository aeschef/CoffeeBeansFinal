import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "./recipes.css";

export default class RecipesHome extends Component {
    render() {
        return (
            <>
                <div className='row' id='header'>
                    <div className='col-3'>
                    </div>
                    <div className='col-6'>
                        <h1>Recipes</h1>
                    </div>
                    <div className='col-3'>
                        <button>filter</button>
                    </div>
                </div>
                <div className='search-bar'>
                    <input type='text' placeholder='Search'></input>
                </div>
                <div className='recipe-cards'>
                    <div className='row' id='recipe-card'>
                        <div className='col-6' id='image'>picture</div>
                        <div className='col-6' id='recipe-info'>
                            <h4>Recipe Name</h4>
                            <div className='row'>
                                <div className='col-6'>energy</div>
                                <div className='col-6'>time</div>
                            </div>
                            <p className='tags'>tags</p>
                        </div>
                    </div>
                    <div className='row' id='recipe-card'>
                        <div className='col-6' id='image'>picture</div>
                        <div className='col-6' id='recipe-info'>
                            <h4>Recipe Name</h4>
                            <div className='row'>
                                <div className='col-6'>energy</div>
                                <div className='col-6'>time</div>
                            </div>
                            <p className='tags'>tags</p>
                        </div>
                    </div>
                    <div className='row' id='recipe-card'>
                        <div className='col-6' id='image'>picture</div>
                        <div className='col-6' id='recipe-info'>
                            <h4>Recipe Name</h4>
                            <div className='row'>
                                <div className='col-6'>energy</div>
                                <div className='col-6'>time</div>
                            </div>
                            <p className='tags'>tags</p>
                        </div>
                    </div>
                    <div className='row' id='recipe-card'>
                        <div className='col-6' id='image'>picture</div>
                        <div className='col-6' id='recipe-info'>
                            <h4>Recipe Name</h4>
                            <div className='row'>
                                <div className='col-6'>energy</div>
                                <div className='col-6'>time</div>
                            </div>
                            <p className='tags'>tags</p>
                        </div>
                    </div>
                </div>

                <button id='add-button'>add</button>


            </>
        )
    }
}