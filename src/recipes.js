import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "./recipes.css";
import ViewRecipePopup from './modals/ViewRecipe';
import RecipeCards from './RecipeCards';
import RecipeSearchBar from './RecipeSearchBar';

// home page of the recipes screen
export default function RecipesHome(props) {
    
    // searchInput for the search bar
    const [searchInput, setSearchInput] = useState("");
    
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
            
            {/* search bar */}
            <RecipeSearchBar searchInput={searchInput} setSearchInput={setSearchInput} placeholder="Search by title or ingredient"></RecipeSearchBar>

            {/* recipe cards */}
            <div className='recipe-cards'>
                <RecipeCards recipes={props.recipes.filter((recipe) => (recipe.title?.toLowerCase().match(searchInput.toLowerCase().trim()) || recipe.ingredients?.join(", ").toLowerCase().match(searchInput.toLowerCase().trim())))} setRecipes={props.setRecipes} onClickFunction={handleOpenViewPopup} groceryList={props.personalGroceryList} addToGL={props.addToGL} view={true}/>
            </div>

            {/* the add button that appears on the home page */}
            <button id='add-button' onClick={handleOpenAddPopup}>add</button>

            {/* popups */}
            <AddRecipePopup recipes={props.recipes} setRecipes={props.setRecipes} showAddPopup={showAddPopup} handleCloseAddPopup={handleCloseAddPopup}></AddRecipePopup>
            <ViewRecipePopup recipes={props.recipes} showViewPopup={showViewPopup} handleCloseViewPopup={handleCloseViewPopup} indexOfRecipeToView={indexOfRecipeToView} setRecipes={props.setRecipes} view={true} groceryList={props.personalGroceryList} addToGL={props.addToGL}> </ViewRecipePopup>
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
        if (!("minsRequired" in inputs)) {
            setInputs(values => ({...values, ["minsRequired"]: 0}))
        }
        if (!("hoursRequired" in inputs)) {
            setInputs(values => ({...values, ["hoursRequired"]: 0}))
        }
        const nextRecipes = [...props.recipes, {title: inputs.title, picture: inputs.picture, energyRequired: inputs.energyRequired, hoursRequired: inputs.hoursRequired, minsRequired: inputs.minsRequired, tags: inputs.tags.split(",").map(s => s.trim()), ingredients: inputs.ingredients, notes: inputs.notes}];
        console.log(inputs.tags.split(",").map(s => s.trim()));
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
                        
                        {/* energy entry */}
                        <Form.Label>Energy Required:</Form.Label>
                        
                        <div className='information'>
                            <div className='info-tooltip'>
                                &#x1F6C8;
                                <span className="info-tooltip-text">How much energy this recipe will take for you; consider time, complexity, cleanup, etc!</span>
                            </div>
                        </div>

                        <br></br>
                        <select name="energyRequired" onChange={handleChange}>
                            <option id="select-energy-level">Select an Energy Level</option>
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <br></br>

                        {/* time required entry - TODO: only take number */}
                        <Form.Label>Time Required:</Form.Label>
                        <div className='row'>
                            <div className="col-3">
                                <Form.Control 
                                    type="text" 
                                    name="hoursRequired"
                                    value={inputs.hoursRequired || ""}
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
                                    value={inputs.minsRequired || ""}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-2">
                                <p>mins</p>
                            </div>
                        </div>
                        

                        {/* tags entry - TODO: format differently */}
                        <Form.Label>Tags:</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="tags"
                            value={inputs.tags || ""}
                            onChange={handleChange}
                        />

                        {/* ingredients entry - TODO: format differently */}
                        <Form.Label>Ingredients with Focus Word/Phrase:</Form.Label>
                        <div className='information'>
                            <div className='info-tooltip'>
                                &#x1F6C8;
                                <span className="info-tooltip-text">Put the focus word or phrase in all caps (i.e. 12 TORTILLAS, flour or corn). The focus word is what will show up in your grocery list or inventory!</span>
                            </div>
                        </div>
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

    // energy levels mapped to checkboxes
    const energyLevels = ["low", "medium", "high"];
    const energyLevelCheckboxes = energyLevels.map((energyLevel, index) => 
    {
        const id = "energyCheck" + index;
        
        return (
            <div className="form-check" key={index}>
                <input className="form-check-input" type="checkbox" value="" id={id}></input>
                <label className="form-check-label" htmlFor={id}>
                    {energyLevel}
                </label>
            </div>
        )
    })

    // time levels mapped to checkboxes
    const timeLevels = ["< 10 mins", "10-20 mins", "20-40 mins", "40-60 mins", "> 1 hour"];
    const timeLevelCheckboxes = timeLevels.map((timeLevel, index) => 
    {
        const id = "timeCheck" + index;
        
        return (
            <div className="form-check" key={index}>
                <input className="form-check-input" type="checkbox" value="" id={id}></input>
                <label className="form-check-label" htmlFor={id}>
                    {timeLevel}
                </label>
            </div>
        )
    })

    // inventory levels mapped to checkboxes
    const inventoryLevels = ["100%", "75%-100%", "50%-75%", "25%-50%", "0%-25%"];
    const inventoryLevelCheckboxes = inventoryLevels.map((inventoryLevel, index) => 
    {
        const id = "inventoryCheck" + index;
        
        return (
            <div className="form-check" key={index}>
                <input className="form-check-input" type="checkbox" value="" id={id}></input>
                <label className="form-check-label" htmlFor={id}>
                    {inventoryLevel}
                </label>
            </div>
        )
    })

    return (
        <>
            {/* filter popup modal */}
            <Modal show={props.showFilterPopup} onHide={props.handleCloseFilterPopup}>
                
                {/* modal header with title and close button */}
                <Modal.Header closeButton>
                    <Modal.Title>Filter Recipes</Modal.Title>
                </Modal.Header>

                {/* modal body with sort and filter options */}
                <Modal.Body>
                    
                    {/* sorting options */}
                    <h6>Sort By:</h6>
                    <select className="form-select">
                        <option>Title (A to Z)</option>
                        <option>Energy Required (Low to High)</option>
                        <option>Time Required (Low to High)</option>
                        <option>Percent of Owned Ingredients (High to Low)</option>
                    </select>
                    <br></br>
                    
                    {/* filtering options */}
                    <h6>Filter:</h6>
                    <p>Energy Required</p>
                    <div>{energyLevelCheckboxes}</div>
                    <p>Time Required</p>
                    <div>{timeLevelCheckboxes}</div>
                    <p>Ingredients Already Owned</p>
                    <div>{inventoryLevelCheckboxes}</div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" type="submit" onClick={props.handleCloseFilterPopup}>
                        Reset
                    </Button>
                    <Button variant="primary" type="submit" onClick={props.handleCloseFilterPopup}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}