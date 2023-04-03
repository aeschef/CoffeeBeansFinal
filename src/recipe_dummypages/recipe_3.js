import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown'
import { useNavigate } from 'react-router-dom'
import "./recipes.css";

export default function defaultRecipe3() {
    const [showView, setShowView] = useState(false);
    const handleCloseView = () => setShowView(false);
    const handleOpenView = () => setShowView(true);
    return (
        <>
            <Modal show={showView} onHide={handleCloseView}>
                <Modal.Header closeButton>
                    <Modal.Title>Pancakes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className='col-6'>
                            <div id="image"></div>
                        </div>
                        <div className='col-6'>
                            <p>Energy Level: Medium Energy</p>
                            <p>Time Required: 20 min</p>
                        </div>
                    </div>

                    <p>breakfast</p>
                    <h6>Ingredients</h6>
                    <ul>
                        <li>1 1/2 cups all-purpose flour</li>
                        <li>3 1/2 teaspoons baking powder</li>
                        <li>1 tablespoon white sugar</li>
                        <li>1/4 teaspoon salt, or more to taste</li>
                        <li>1 1/4 cups milk</li>
                        <li>3 tablespoons butter, melted</li>
                        <li>1 egg</li>
                        <li>1/4 teaspoon pepper or to taste</li>
                    </ul>
                    <h6>Instructions</h6>
                    <ol>
                        <li>Sift flour, baking powder, sugar, and salt together in a large bowl. </li>
                        <li>Make a well in the center and add milk, melted butter, and egg; mix until smooth.</li>
                        <li>Heat a lightly oiled griddle or pan over medium-high heat.</li>
                        <li>Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake</li>
                        <li>Cook until bubbles form and the edges are dry, about 2 to 3 minutes.</li>
                        <li>Flip and cook until browned on the other side.</li>
                        <li>Repeat with remaining batter.</li>
                    </ol>
                    <h6>Notes</h6>
                    <p>Notes will appear here</p>
                </Modal.Body>
                {/*<Modal.Footer>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>*/}
            </Modal>
            <div id="view">
                <button onClick={handleOpenView}></button>
            </div>
        </>
    )
}
