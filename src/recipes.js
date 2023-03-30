import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown'
import "./recipes.css";

export default function RecipesHome() {

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

            <AddPopup></AddPopup>

        </>
    )
}

function AddPopup() {

    const [showAddPopup, setShowAddPopup] = useState(false);

    const handleOpenAddPopup = () => setShowAddPopup(true);
    const handleCloseAddPopup = () => setShowAddPopup(false);

    return (
        <>
            <Modal show={showAddPopup} onHide={handleCloseAddPopup}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Picture:</Form.Label>
                        <button>Upload picture</button>
                        <br></br>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                        <Form.Label>Energy Required:</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select Energy Level
                            </Dropdown.Toggle>   
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Energy Level 1</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Energy Level 2</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Energy Level 3</Dropdown.Item>
                                <Dropdown.Item href="#/action-4">Energy Level 4</Dropdown.Item>
                                <Dropdown.Item href="#/action-5">Energy Level 5</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> 
                        <Form.Label>Time Required:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                        <Form.Label>Tags:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                        <Form.Label>Ingredients:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                        <Form.Label>Steps:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control type="text"></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={handleCloseAddPopup}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <button id='add-button' onClick={handleOpenAddPopup}>add</button>
        </>
    )
}

function EditPopup(show, handleClose) {
    return (
        <>
            <Modal show={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Picture:</Form.Label>
                        <button>Upload new picture</button>
                        <br></br>
                        <Form.Label>Title:</Form.Label>
                        <Form.Control placeholder="Old Title" type="text"></Form.Control>
                        <Form.Label>Energy Required:</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Old Energy Level
                            </Dropdown.Toggle>   
                            <Dropdown.Menu>
                                <Dropdown.Item href="#/action-1">Energy Level 1</Dropdown.Item>
                                <Dropdown.Item href="#/action-2">Energy Level 2</Dropdown.Item>
                                <Dropdown.Item href="#/action-3">Energy Level 3</Dropdown.Item>
                                <Dropdown.Item href="#/action-4">Energy Level 4</Dropdown.Item>
                                <Dropdown.Item href="#/action-5">Energy Level 5</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown> 
                        <Form.Label>Time Required:</Form.Label>
                        <Form.Control placeholder="Old Time Required" type="text"></Form.Control>
                        <Form.Label>Tags:</Form.Label>
                        <Form.Control placeholder="Old Tags" type="text"></Form.Control>
                        <Form.Label>Ingredients:</Form.Label>
                        <Form.Control placeholder="Old Ingredients" type="text"></Form.Control>
                        <Form.Label>Steps:</Form.Label>
                        <Form.Control placeholder="Old Steps" type="text"></Form.Control>
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control placeholder="Old Notes" type="text"></Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

function ViewPopup(show, handleClose) {
    return (
        <>
            <Modal show="true">
                <Modal.Header closeButton>
                    <Modal.Title>Recipe Title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className='col-6'>
                            <div id="image"></div>
                        </div>
                        <div className='col-6'>
                            <p>Energy Level</p>
                            <p>Time Required</p>
                        </div>
                    </div>

                    <p>tag 1 tag 2 tag 3</p>
                    <h6>Ingredients</h6>
                    <ul>
                        <li>Ingredient 1</li>
                        <li>Ingredient 2</li>
                        <li>Ingredient 3</li>
                        <li>Ingredient 4</li>
                        <li>Ingredient 5</li>
                        <li>Ingredient 6</li>
                        <li>Ingredient 7</li>
                        <li>Ingredient 8</li>
                        <li>Ingredient 9</li>
                        <li>Ingredient 10</li>
                    </ul>
                    <h6>Instructions</h6>
                    <ol>
                        <li>Step 1</li>
                        <li>Step 2</li>
                        <li>Step 3</li>
                        <li>Step 4</li>
                        <li>Step 5</li>
                        <li>Step 6</li>
                        <li>Step 7</li>
                        <li>Step 8</li>
                        <li>Step 9</li>
                        <li>Step 10</li>
                    </ol>
                    <h6>Notes</h6>
                    <p>Notes will appear here</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}