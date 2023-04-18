import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import "../recipes.css";
import { createPath } from 'react-router-dom';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, set } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


function DeleteAlert() {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Warning!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        You are about to delete a recipe from the database!
                        Do you mean to delete this?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShow(false)}>
                        No
                    </Button>
                    <Button class="float-right" id="delete" variant="secondary" type="delete" onClick={() => setShow(false)}>
                        Yes
                    </Button>
                </Modal.Footer>


            </Modal>
            <Button variant="secondary" type="submit" onClick={handleShow}>
                        Delete
                    </Button>
            {/*<Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
                <Alert.Heading>Warning!</Alert.Heading>
                <p>You are about to delete a recipe from the database!
                    Do you mean to delete this?
                </p>
                <hr />
                <div class="text-right">
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        No
                    </Button>
                    <Button class="float-right" id="delete" variant="secondary" type="delete">
                        Yes
                    </Button>
                </div>
            </Alert>

    {!show && <Button class="float-right" onClick={() => setShow(true)}>Delete</Button>}*/}
        </>
    );
}

// popup for editing a recipe
export default function EditRecipePopup(props) {

    const findQuotedWord = (word) => {
        const indexOfFirstQuote = word.indexOf("\"");
        const indexOfSecondQuote = word.slice(indexOfFirstQuote + 1).indexOf("\"") + indexOfFirstQuote + 1;
        if (indexOfFirstQuote === -1 || indexOfSecondQuote === -1) {
            return null;
        } else {
            return word.slice(indexOfFirstQuote + 1, indexOfSecondQuote);
        }
    }

    // handler for change to a form element (https://www.w3schools.com/react/react_forms.asp)
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        if (name === "tags") {
            props.setTagsInStringForm(value);
            props.setInputs(values => ({ ...values, ["tags"]: value.split(",").map(s => s.trim()).filter((str) => str !== '') }));
        } else if (name === "ingredients") {
            props.setIngredientsInStringForm(value);
            props.setInputs(values => ({ ...values, ["ingredients"]: 
                    value.
                    split("\n").
                    map(s => s.trim()).
                    filter((str) => str !== '').
                    map((ingredientPhrase) => ({
                        "phrase": ingredientPhrase, 
                        "focus": findQuotedWord(ingredientPhrase)})) 
                    }));
        } else if (name === "steps") {
            props.setStepsInStringForm(value);
            props.setInputs(values => ({ ...values, ["steps"]: value.split("\n").map(s => s.trim()).filter((str) => str !== '') }));
        } else {
            props.setInputs(values => ({ ...values, [name]: value }))
        }
    }

    const handleSubmit = () => {        
        if (props.inputs.ingredients.length !== props.inputs.ingredients.filter((ingredient) => ingredient.focus).length) {
            alert("All ingredients must have a focus word or phrase in quotes!");
        } else {
            
            // database info
            const auth = getAuth(props.app)
            const db = getDatabase(props.app)
            
            // getting a reference to the 'recipes' section of this user's area of the database
            const dbRecipeRef = ref(db, '/users/' + auth.currentUser.uid + '/recipes/' + props.inputs.key + '/');
            set(dbRecipeRef, props.inputs)

            props.handleCloseEditPopup();
        }
    }

    return (
        <>
            {/* edit popup modal */}
            <Modal show={props.showEditPopup} onHide={props.handleCloseEditPopup}>

                {/* modal header with title and close button */}
                <Modal.Header closeButton>
                    <Modal.Title>Edit Recipe</Modal.Title>
                </Modal.Header>

                {/* modal body with recipe details */}
                <Modal.Body>
                    <Form.Group className="recipe-input">

                        {/* picture input */}
                        <Form.Label>Picture:</Form.Label>
                        <Form.Control
                            type="text"
                            name="picture"
                            value={props.inputs?.picture || ""}
                            onChange={handleChange}
                        />
                        {/* TODO: turn back to actual photo upload
                      <button>Upload new picture</button>
                      <br></br> */}

                        {/* title input */}
                        <Form.Label>Title:</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={props.inputs?.title || ""}
                            onChange={handleChange}
                        />

                        {/* energy input */}
                        <Form.Label>Energy Required:</Form.Label>
                        <div className='information'>
                            <div className='info-tooltip'>
                                &#x1F6C8;
                                <span className="info-tooltip-text">How much energy this recipe will take for you; consider time, complexity, cleanup, etc!</span>
                            </div>
                        </div>
                        <br></br>
                        <select name="energyRequired" onChange={handleChange} defaultValue={props.inputs?.energyRequired || ""}>
                            <option value="" id="select-energy-level">Select an Energy Level</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <br></br>

                        {/* time required input - TODO: only take number */}
                        <Form.Label>Time Required:</Form.Label>
                        <div className='row'>
                            <div className="col-3">
                                <Form.Control 
                                    type="text" 
                                    name="hoursRequired"
                                    value={props.inputs?.hoursRequired}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-2">
                                <p>hours</p>
                            </div>
                            <div className="col-3">
                                <Form.Control 
                                    type="text" 
                                    name="minsRequired"
                                    value={props.inputs?.minsRequired}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-2">
                                <p>mins</p>
                            </div>
                        </div>

                        {/* tags input */}
                        <Form.Label>Tags:</Form.Label>
                        <Form.Control
                            type="text"
                            name="tags"
                            value={props.tagsInStringForm || ""}
                            onChange={handleChange}
                        />

                        {/* ingredients input */}
                        <Form.Label>Ingredients with Focus Word/Phrase:</Form.Label>
                        <div className='information'>
                            <div className='info-tooltip'>
                                &#x1F6C8;
                                <span className="info-tooltip-text">Put the focus word or phrase in all caps (i.e. 12 "tortillas", flour or corn). The focus word is what will show up in your grocery list or inventory!</span>
                            </div>
                        </div>
                        <Form.Control
                            type="text"
                            as="textarea"
                            name="ingredients"
                            value={props.ingredientsInStringForm || ""}
                            onChange={handleChange}
                        />

                        {/* steps input */}
                        <Form.Label>Steps:</Form.Label>
                        <Form.Control
                            type="text"
                            as="textarea"
                            name="steps"
                            value={props.stepsInStringForm || ""}
                            onChange={handleChange}
                        />

                        {/* notes input */}
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control
                            type="text"
                            as="textarea"
                            name="notes"
                            value={props.inputs?.notes || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>

                {/* modal footer with submit button */}
                <Modal.Footer>
                    <DeleteAlert></DeleteAlert>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
