import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown'
import "./recipes.css";

// home page of the recipes screen
export default function RecipesHome() {

    // variables and functions for Add Recipe popup
    const [showAddPopup, setShowAddPopup] = useState(false);
    const handleOpenAddPopup = () => setShowAddPopup(true);
    const handleCloseAddPopup = () => setShowAddPopup(false);

    // variables and functions for View Recipe popup
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [indexOfRecipeToView, setIndexOfRecipeToView] = useState(0);
    const handleOpenViewPopup = (index) => {
        setIndexOfRecipeToView(index);
        setShowViewPopup(true);
    }
    const handleCloseViewPopup = () => setShowViewPopup(false);

    // variables and functions for Edit Recipe popup
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [inputs, setInputs] = useState(null); // these are what show up in the inputs originally
    const [indexOfRecipeToEdit, setIndexOfRecipeToEdit] = useState(0);
    const handleOpenEditPopup = (index) => {
        setIndexOfRecipeToEdit(index);
        setInputs(recipes[index]);
        setShowEditPopup(true);
    }
    const handleCloseEditPopup = () => setShowEditPopup(false);

    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const handleOpenFilterPopup = () => setShowFilterPopup(true);
    const handleCloseFilterPopup = () => setShowFilterPopup(false);
    
    // mock database of recipes - TODO: make the pictures actual pictures!
    let [recipes, setRecipes] = useState([{title: "R1 Title", picture: "R1 Picture", energyRequired: "R1Energy", timeRequired: "R1Time", tags: ["R1Tag1", "R1Tag2", "R1Tag3"], ingredients: ["R1 Ingredient 1", "R1 Ingredient 2", "R1 Ingredient 3"], steps: ["R1 Step 1", "R1 Step 2", "R1 Step 3"], notes: "R1 Notes"},
                   {title: "R2 Title", picture: "R2 Picture", energyRequired: "R2Energy", timeRequired: "R2Time", tags: ["R2Tag1", "R2Tag2", "R2Tag3"], ingredients: ["R2 Ingredient 1", "R2 Ingredient 2", "R2 Ingredient 3"], steps: ["R2 Step 1", "R2 Step 2", "R2 Step 3"], notes: "R2 Notes"},
                   {title: "R3 Title", picture: "R3 Picture", energyRequired: "R3Energy", timeRequired: "R3Time", tags: ["R3Tag1", "R3Tag2", "R3Tag3"], ingredients: ["R3 Ingredient 1", "R3 Ingredient 2", "R3 Ingredient 3"], steps: ["R3 Step 1", "R3 Step 2", "R3 Step 3"], notes: "R3 Notes"}]);

    // recipe cards formed from database of recipes
    const recipeCards = recipes.map((recipe, index) => {
    return (
        <div className='row' id='recipe-card' onClick={() => handleOpenViewPopup(index)} key={index}>
            <div className='col-6' id='image'>{recipe.picture}</div>
            <div className='col-6' id='recipe-info'>
                <h4>{recipe.title}</h4>
                <div className='row'>
                    <div className='col-6'>{recipe.energyRequired}</div>
                    <div className='col-6'>{recipe.timeRequired}</div>
                </div>
                <p className='tags'>{recipe.tags}</p>
            </div>
        </div>
        )
    })

    return (
        <>
            {/* header with title and filter button - TODO: make filter button functional */}
            <div className='row' id='header'>
                <div className='col-3'>
                </div>
                <div className='col-6'>
                    <h1>Recipes</h1>
                </div>
                <div className='col-3'>
                    <button onClick={handleOpenFilterPopup}>filter</button>
                </div>
            </div>
            
            {/* search bar - TODO: make functional */}
            <div className='search-bar'>
                <input type='text' placeholder='Search'></input>
            </div>
            
            {/* recipe cards */}
            <div className='recipe-cards'>
                <div>{recipeCards}</div>
            </div>

            {/* the add button that appears on the home page */}
            <button id='add-button' onClick={handleOpenAddPopup}>add</button>

            {/* popups */}
            <AddRecipePopup recipes={recipes} setRecipes={setRecipes} showAddPopup={showAddPopup} handleCloseAddPopup={handleCloseAddPopup}></AddRecipePopup>
            <ViewRecipePopup recipes={recipes} showViewPopup={showViewPopup} handleCloseViewPopup={handleCloseViewPopup} indexOfRecipeToView={indexOfRecipeToView} handleOpenEditPopup={handleOpenEditPopup}> </ViewRecipePopup>
            <EditRecipePopup recipes={recipes} setRecipes={setRecipes} showEditPopup={showEditPopup} handleCloseEditPopup={handleCloseEditPopup} setInputs={setInputs} inputs={inputs} indexOfRecipeToEdit={indexOfRecipeToEdit}></EditRecipePopup>
            <FilterPopup showFilterPopup={showFilterPopup} handleCloseFilterPopup={handleCloseFilterPopup}></FilterPopup>
        </>
    )
}

// popup for adding a recipe - TODO: make (all?) fields in the form required
function AddRecipePopup(props) {

    // form inputs
    const [inputs, setInputs] = useState({});

    // handler for change to a form element (https://www.w3schools.com/react/react_forms.asp)
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    // handling submit by closing popup and updating the 'recipes' mock database
    const handleSubmit = () => {
        props.handleCloseAddPopup();
        const nextRecipes = [...props.recipes, {title: inputs.title, picture: inputs.picture, energyRequired: inputs.energyRequired, timeRequired: inputs.timeRequired, tags: inputs.tags, ingredients: inputs.ingredients, notes: inputs.notes}];
        props.setRecipes(nextRecipes);
    }

    return (
        <>
            {/* add popup modal */}
            <Modal show={props.showAddPopup} onHide={props.handleCloseAddPopup}>
                
                {/* modal header with title and close button */}
                <Modal.Header closeButton>
                    <Modal.Title>Add New Recipe</Modal.Title>
                </Modal.Header>
                
                {/* modal body with form */}
                <Modal.Body>
                    <Form.Group>
                        
                        {/* picture entry - TODO: change to upload photo */}
                        <Form.Label>Picture:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="picture"
                            value={inputs.picture || ""}
                            onChange={handleChange}
                        />
                        
                        {/* title entry */}
                        <Form.Label>Title:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="title"
                            value={inputs.title || ""}
                            onChange={handleChange}
                        />
                        
                        {/* energy entry - TODO: change back to dropdown */}
                        <Form.Label>Energy Required:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="energyRequired"
                            value={inputs.energyRequired || ""}
                            onChange={handleChange}
                        />
                        {/* <Dropdown>
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
                        </Dropdown>  */}

                        {/* time required entry - TODO: label mins/hrs, only take number */}
                        <Form.Label>Time Required:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="timeRequired"
                            value={inputs.timeRequired || ""}
                            onChange={handleChange}
                        />

                        {/* tags entry - TODO: format differently */}
                        <Form.Label>Tags:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="tags"
                            value={inputs.tags || ""}
                            onChange={handleChange}
                        />

                        {/* ingredients entry - TODO: format differently */}
                        <Form.Label>Ingredients:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="ingredients"
                            value={inputs.ingredients || ""}
                            onChange={handleChange}
                        />

                        {/* steps entry - TODO: format differently */}
                        <Form.Label>Steps:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="steps"
                            value={inputs.steps || ""}
                            onChange={handleChange}
                        />

                        {/* notes entry */}
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="notes"
                            value={inputs.notes || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                
                {/* footer with submit button */}
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// popup for viewing a recipe
function ViewRecipePopup(props) {

    // saving a reference to the current recipe being viewed
    const currentRecipe = props.recipes[props.indexOfRecipeToView];

    return (
        <>
            {/* view popup modal */}
            <Modal show={props.showViewPopup} onHide={props.handleCloseViewPopup}>
                
                {/* modal header with title, edit button, and close button */}
                <Modal.Header closeButton>
                    <Modal.Title>Recipe Title</Modal.Title>
                    <button onClick={() => props.handleOpenEditPopup(props.indexOfRecipeToView)}>Edit</button>
                </Modal.Header>
                
                {/* modal body with recipe info - NEXT */}
                <Modal.Body>
                    <div className="row">
                        
                        {/* recipe image */}
                        <div className='col-6'>
                            <div id="image">{currentRecipe.picture}</div>
                        </div>
                        
                        {/* energy and time required for this recipe */}
                        <div className='col-6'>
                            <h6>Energy Required</h6>
                            <p>{currentRecipe.energyRequired}</p>
                            <h6>Time Required</h6>
                            <p>{currentRecipe.timeRequired}</p>
                        </div>
                    </div>

                    {/* recipe tags */}
                    <h6>Tags</h6>
                    <p>{currentRecipe.tags}</p>
                    
                    {/* recipe ingredients */}
                    <h6>Ingredients</h6>
                    <ul>
                        <li>{currentRecipe.ingredients}</li>
                    </ul>
                    
                    {/* recipes steps */}
                    <h6>Steps</h6>
                    <ol>
                        <li>{currentRecipe.steps}</li>
                    </ol>
                    
                    {/* recipe notes */}
                    <h6>Notes</h6>
                    <p>{currentRecipe.notes}</p>

                    <button>Add Recipe to Meal Plan</button>
                    <button>Recipe Complete</button>
                </Modal.Body>
            </Modal>
        </>
    )
}

// popup for editing a recipe
function EditRecipePopup(props) {

    // handler for change to a form element (https://www.w3schools.com/react/react_forms.asp)
    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        props.setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = () => { // indexOfRecipeToEdit is correct here
        const nextRecipes = props.recipes;
        nextRecipes[props.indexOfRecipeToEdit] = props.inputs;
        props.setRecipes(nextRecipes);
        props.handleCloseEditPopup();
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
                    <Form.Group>
                        
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
                        <Form.Control 
                            type="text" 
                            name="energyRequired"
                            value={props.inputs?.energyRequired || ""}
                            onChange={handleChange}
                        />
                        {/* TODO: change back to dropdown
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
                        </Dropdown>  */}
                        
                        {/* time input */}
                        <Form.Label>Time Required:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="timeRequired"
                            value={props.inputs?.timeRequired || ""}
                            onChange={handleChange}
                        />

                        {/* tags input */}
                        <Form.Label>Tags:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="tags"
                            value={props.inputs?.tags || ""}
                            onChange={handleChange}
                        />

                        {/* tags input */}
                        <Form.Label>Ingredients:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="ingredients"
                            value={props.inputs?.ingredients || ""}
                            onChange={handleChange}
                        />

                        {/* steps input */}
                        <Form.Label>Steps:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="steps"
                            value={props.inputs?.steps || ""}
                            onChange={handleChange}
                        />

                        {/* notes input */}
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="notes"
                            value={props.inputs?.notes || ""}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Modal.Body>
                
                {/* modal footer with submit button */}
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

// popup for filtering all recipes
function FilterPopup(props) {
    return (
        <>
            {/* filter popup modal */}
            <Modal show={props.showFilterPopup} onHide={props.handleCloseFilterPopup}>
                
                {/* modal header with title and close button */}
                <Modal.Header closeButton>
                    <Modal.Title>Filter Recipes</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h6>Sort By:</h6>
                    <select class="form-select">
                        <option>Title (Default)</option>
                        <option>Energy Required</option>
                        <option>Time Required</option>
                        <option>Percent of Ingredients in Inventory</option>
                    </select>
                    <br></br>
                    <h6>Filter:</h6>
                    <p>Energy Required</p>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></input>
                        <label class="form-check-label" for="flexCheckDefault">
                            low
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></input>
                        <label class="form-check-label" for="flexCheckDefault">
                            medium
                        </label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></input>
                        <label class="form-check-label" for="flexCheckDefault">
                            high
                        </label>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    )
}