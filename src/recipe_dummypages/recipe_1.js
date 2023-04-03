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

export default function defaultRecipe1(){
    const [showView, setShowView] = useState(false);
    const handleCloseView = () => setShowView(false);
    const handleOpenView = () => setShowView(true);
    return (
        <>
            <Modal show={showView} onHide={handleCloseView}>
                <Modal.Header closeButton>
                    <Modal.Title>Lemon Dill Chicken Soup</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className='col-6'>
                            <div id="image"></div>
                        </div>
                        <div className='col-6'>
                            <p>Energy Level: Medium Energy</p>
                            <p>Time Required: 35 min</p>
                        </div>
                    </div>

                    <p>lunch soup season</p>
                    <h6>Ingredients</h6>
                    <ul>
                        <li>5 cups bone broth (or low-sodium chicken broth)</li>
                        <li>2 cups cooked rice</li>
                        <li>2 egg yolks</li>
                        <li>1/3 cup lemon juice</li>
                        <li>2 cups chopped cooked chicke</li>
                        <li>2 Tablespoons chopped fresh dill</li>
                        <li>Salt and pepper (to taste)</li>
                    </ul>
                    <h6>Instructions</h6>
                    <ol>
                        <li>In a large saucepan, bring the broth to a simmer and
                             season with salt and pepper, to taste.</li>
                        <li>Add ½ cup rice, egg yolks and lemon juice to a 
                            blender, slowly stream in 1 cup of hot broth and puree until smooth.</li>
                        <li>Stir the puree into the simmering stock along with 
                            the chopped chicken and remaining rice</li>
                        <li>Simmer until slightly thickened, approximately 10 minutes.</li>
                        <li>Stir in the fresh dill and serve</li>
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
