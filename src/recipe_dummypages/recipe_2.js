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

export default function defaultRecipe2() {
    const [showView, setShowView] = useState(false);
    const handleCloseView = () => setShowView(false);
    const handleOpenView = () => setShowView(true);
    return (
        <>
            <Modal show={showView} onHide={handleCloseView}>
                <Modal.Header closeButton>
                    <Modal.Title>Alfredo Pasta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className='col-6'>
                            <div id="image"></div>
                        </div>
                        <div className='col-6'>
                            <p>Energy Level: Low Energy</p>
                            <p>Time Required: 15 min</p>
                        </div>
                    </div>

                    <p>lunch dinner</p>
                    <h6>Ingredients</h6>
                    <ul>
                        <li>8 ounce pasta</li>
                        <li>4 tablespoon butter</li>
                        <li>2 cloves garlic minced</li>
                        <li>1 1/2 cups milk</li>
                        <li>1 cup heavy cream</li>
                        <li>1/2 cup Parmesan cheese shredded</li>
                        <li>1/4 teaspoon salt or to taste</li>
                        <li>1/4 teaspoon pepper or to taste</li>
                        <li>2 tabelspoon fresh parsley chopped</li>
                    </ul>
                    <h6>Instructions</h6>
                    <ol>
                        <li>Cook the pasta according to the package instructions.</li>
                        <li>Melt the butter in a large skillet over medium high heat.
                            Add the garlic and cook for 30 seconds, or until fragrant.</li>
                        <li>Pour in the milk and cream. Stir consistently to avoid
                            burning on the bottom of the pan until the mixture comes to a boil.</li>
                        <li>Turn the heat down to medium, and mix in the parmesan cheese, salt, and pepper.</li>
                        <li>Adjust the seasoning to your own taste</li>
                        <li>Remove the pan from the heat and mix in the cooked pasta
                            until the sauce begins to thicken.</li>
                        <li> Garnish with parsley, and serve.</li>
                    </ol>
                    <h6>Notes</h6>
                    <p>You can use a larger ratio of milk to cream if you'd like to cut down on calories.
                        You can use any type of pasta that you prefer.
                        This can be served with chicken or mushrooms to add some protein.</p>
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
