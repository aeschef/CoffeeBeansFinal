import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "./recipes.css";
import ViewRecipePopup from './modals/ViewRecipe'

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

    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const handleOpenFilterPopup = () => setShowFilterPopup(true);
    const handleCloseFilterPopup = () => setShowFilterPopup(false);
    
    // mock database of recipes - TODO: make the pictures actual pictures!
    let [recipes, setRecipes] = useState([{title: "Lemon Dill Chicken Soup", picture: "R1 Picture", energyRequired: "Medium Energy", timeRequired: "35 min", tags: ["lunch", "soup season"], ingredients: ["5 cups bone broth (or low-sodium chicken broth)", "2 cups cooked rice", "2 egg yolks", "1/3 cup lemon juice", "2 cups chopped cooked chicken", "2 Tablespoons chopped fresh dill", "Salt and pepper (to taste)"], steps: ["In a large saucepan, bring the broth to a simmer and season with salt and pepper, to taste.", "Add ½ cup rice, egg yolks and lemon juice to a blender, slowly stream in 1 cup of hot broth and puree until smooth.", "Stir the puree into the simmering stock along with the chopped chicken and remaining rice", "Simmer until slightly thickened, approximately 10 minutes.", "Stir in the fresh dill and serve"], notes: ""},
                   {title: "Alfredo Pasta", picture: "R2 Picture", energyRequired: "Low Energy", timeRequired: "15 min", tags: ["lunch", "dinner"], ingredients: ["8 ounce pasta", "4 tablespoon butter", "2 cloves garlic minced", "1 1/2 cups milk", "1 cup heavy cream", "1/2 cup Parmesan cheese shredded", "1/4 teaspoon salt or to taste", "1/4 teaspoon pepper or to taste", "2 tabelspoon fresh parsley chopped"], steps: ["Cook the pasta according to the package instructions.", "Melt the butter in a large skillet over medium high heat.", "Add the garlic and cook for 30 seconds, or until fragrant.", "Pour in the milk and cream. Stir consistently to avoid burning on the bottom of the pan until the mixture comes to a boil", "Turn the heat down to medium, and mix in the parmesan cheese, salt, and pepper.", "Adjust the seasoning to your own taste", "Remove the pan from the heat and mix in the cooked pasta until the sauce begins to thicken.", "Garnish with parsley, and serve."], notes: "You can use a larger ratio of milk to cream if you'd like to cut down on calories. This can be served with chicken or mushrooms to add some protein."},
                   {title: "Pancakes", picture: "R3 Picture", energyRequired: "Medium Energy", timeRequired: "20 min", tags: ["breakfast", "comfort food"], ingredients: ["1 1/2 cups all-purpose flour", "3 1/2 teaspoons baking powder", "1 tablespoon white sugar", "1/4 teaspoon salt, or more to taste", "1 1/4 cups milk", "3 tablespoons butter, melted", "1 egg", "1/4 teaspoon pepper or to taste"], steps: ["Sift flour, baking powder, sugar, and salt together in a large bowl.", "Make a well in the center and add milk, melted butter, and egg; mix until smooth.", "Heat a lightly oiled griddle or pan over medium-high heat", "Pour or scoop the batter onto the griddle, using approximately 1/4 cup for each pancake", ">Cook until bubbles form and the edges are dry, about 2 to 3 minutes", "Flip and cook until browned on the other side", "Repeat with remaining batter"], notes: ""}]);

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
                <p className='tags'>{recipe.tags.join(", ")}</p>
            </div>
        </div>
        )
    })

    return (
        <>
            {/* header with title and filter button */}
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
            <ViewRecipePopup recipes={recipes} showViewPopup={showViewPopup} handleCloseViewPopup={handleCloseViewPopup} indexOfRecipeToView={indexOfRecipeToView} setRecipes={setRecipes}> </ViewRecipePopup>
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