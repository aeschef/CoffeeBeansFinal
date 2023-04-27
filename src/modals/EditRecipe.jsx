import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import "../recipes.css";
import { createPath } from 'react-router-dom';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, set, remove } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import ImageUploading from "react-images-uploading";
import { defaultRecipePhoto } from '../defaultRecipePhoto';



function DeleteAlert(props) {

    return (
        <>
            <Modal show={props.showDeleteAlert} onHide={props.handleCloseDeleteAlert} centered>
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
                <Button variant="secondary" onClick={() => props.handleCloseDeleteAlert()}>
                        No
                    </Button>
                    <Button class="float-right" id="delete" variant="secondary" type="delete" onClick={() => props.handleDeleteRecipe()}>
                        Yes
                    </Button>
                </Modal.Footer>


            </Modal>
        </>
    );
}

// popup for editing a recipe
export default function EditRecipePopup(props) {

    const maxNumber = 1;
    const onImageListChange = (imageList, addUpdateIndex) => {
        props.setImages(imageList);
        props.setInputs(values => ({ ...values, ["picture"]: imageList[0]?.data_url || defaultRecipePhoto})); 
    };

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    const handleShowDeleteAlert = () => setShowDeleteAlert(true);
    const handleCloseDeleteAlert = () => setShowDeleteAlert(false);

    const handleDeleteRecipe = () => {
        
        // database info
        const auth = getAuth(props.app)
        const db = getDatabase(props.app)
        
        // getting a reference to the 'recipes' section of this user's area of the database and deleting the recipe
        const dbRecipeRef = ref(db, '/users/' + auth.currentUser.uid + '/recipes/' + props.keyOfRecipeToEdit + '/');
        remove(dbRecipeRef)
                
        // returning to main recipe page
        handleCloseDeleteAlert();
        props.handleCloseEditPopup();
        props.handleCloseViewPopup();
    }

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
        if (props.inputs.title === undefined || props.inputs.title === "") {
            alert("Please give your recipe a title!");
        } else if (!(["Low", "Medium", "High"].includes(props.inputs.energyRequired))) {
            alert("Please give your recipe an 'energy required' level!");
            console.log(props.inputs.energyRequired);
        } else if ((!props.inputs.hoursRequired || props.inputs.hoursRequired === "") && (props.inputs.minsRequired === "0")
                 ||(!props.inputs.minsRequired || props.inputs.minsRequired === "") && (props.inputs.hoursRequired === "0")
                 ||(props.inputs.hoursRequired === "0" && props.inputs.minsRequired === "0")
                 ||(props.inputs.hoursRequired === "" && props.inputs.minsRequired === "")) {
            alert("Please enter a non-zero value for the amount of time required!");
        } else if (props.inputs.ingredients?.length !== props.inputs.ingredients?.filter((ingredient) => ingredient.focus).length) {
            alert("All ingredients must have a focus word or phrase in quotes!");
        } else if (props.inputs.ingredients.length === 0) {
            alert("Please give your recipe at least one ingredient!");
        } else {
            
            // database info
            const auth = getAuth(props.app)
            const db = getDatabase(props.app)
            
            // getting a reference to the 'recipes' section of this user's area of the database
            const dbRecipeRef = ref(db, '/users/' + auth.currentUser.uid + '/recipes/' + props.keyOfRecipeToEdit + '/');
            set(dbRecipeRef, props.inputs)

            // Ensures that information in view modal is updated
            props.setRefresh(true)
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
                        <Form.Label><b>Picture:</b></Form.Label>
                        <ImageUploading
                            value={props.images}
                            onChange={onImageListChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                            acceptType={["jpg"]}
                        >
                        {({onImageUpload, onImageRemoveAll, imageList, onImageUpdate, onImageRemove}) => (
                            <div className="upload__image-wrapper">
                                <button className="upload-image-button" onClick={onImageUpload} style={imageList.length > 0 ? {display: "none"} : null}>
                                    Upload Image
                                </button>
                                {imageList.map((image, index) => (
                                    <div key={index} className="image-item">
                                    <img src={image.data_url} alt="" id="recipe-image" width="100" />
                                    <div className="image-item__btn-wrapper">
                                        <button className="picture-button" onClick={() => onImageUpdate(index)}>Change</button>
                                        <button className="picture-button" onClick={() => onImageRemove(index)}>Remove</button>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        </ImageUploading>
                        <br></br>

                        {/* TODO: turn back to actual photo upload
                      <button>Upload new picture</button>
                      <br></br> */}

                        {/* title input */}
                        <Form.Label><b>Title:</b></Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={props.inputs?.title || ""}
                            onChange={handleChange}
                        />
                        <br></br>

                        {/* energy input */}
                        <div className='label-and-tooltip'>
                            <Form.Label><b>Energy Required:</b></Form.Label>
                            <div className='information'>
                                <div className='info-tooltip'>
                                    &#x1F6C8;
                                    <span className="info-tooltip-text">How much energy this recipe will take for you; consider time, complexity, cleanup, etc!</span>
                                </div>
                            </div>
                        </div>

                        <select className="energy-required-dropdown" name="energyRequired" onChange={handleChange} defaultValue={props.inputs?.energyRequired || ""}>
                            <option value="" id="select-energy-level">Select an Energy Level</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <br></br><br></br>

                        {/* time required input - TODO: only take number */}
                        <Form.Label><b>Time Required:</b></Form.Label>
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
                        <br></br>

                        {/* tags input */}
                        <div className='label-and-tooltip'>
                            <Form.Label><b>Tags:</b></Form.Label>
                            <div className='information'>
                                <div className='info-tooltip'>
                                    &#x1F6C8;
                                    <span className="info-tooltip-text">Tags must be separated by commas.</span>
                                </div>
                            </div>
                        </div>
                        <br></br>

                        <Form.Control
                            type="text"
                            name="tags"
                            value={props.tagsInStringForm || ""}
                            onChange={handleChange}
                        />
                        <br></br>

                        {/* ingredients input */}
                        <div className="label-and-tooltip">
                            <Form.Label><b>Ingredients with Focus Phrases:</b></Form.Label>
                            <div className='information'>
                                <div className='info-tooltip'>
                                    &#x1F6C8;
                                    <span className="info-tooltip-text">Each ingredient should be on its own line. Put the focus word or phrase in all caps (i.e. 12 "tortillas", flour or corn). The focus word is what will show up in your grocery list or inventory!</span>
                                </div>
                            </div>
                        </div>

                        <Form.Control
                            type="text"
                            as="textarea"
                            name="ingredients"
                            value={props.ingredientsInStringForm || ""}
                            onChange={handleChange}
                        />
                        <br></br>

                        {/* steps input */}
                        <div className='label-and-tooltip'>
                            <Form.Label><b>Steps:</b></Form.Label>
                            <div className='information'>
                                <div className='info-tooltip'>
                                    &#x1F6C8;
                                    <span className="info-tooltip-text">Each step should be on its own line.</span>
                                </div>
                            </div>
                        </div>

                        <Form.Control
                            type="text"
                            as="textarea"
                            name="steps"
                            value={props.stepsInStringForm || ""}
                            onChange={handleChange}
                        />
                        <br></br>

                        {/* notes input */}
                        <Form.Label><b>Notes:</b></Form.Label>
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
                    <DeleteAlert showDeleteAlert={showDeleteAlert} handleCloseDeleteAlert={handleCloseDeleteAlert} handleDeleteRecipe={handleDeleteRecipe}></DeleteAlert>
                    <Button variant="secondary" type="submit" onClick={handleShowDeleteAlert}>
                        Delete
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}