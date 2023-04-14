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

    // variables and functions for Filter Recipe popup
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [tags, setTags] = useState([]);
    
    
    // these two will be passed in as the current state!
    const [showAllRecipes, setShowAllRecipes] = useState(true);
    const [tagsToShow, setTagsToShow] = useState([]);
    const [tagCheckboxesValues, setTagCheckboxesValues] = useState([]);
    const [showAllRecipesCheckboxValue, setShowAllRecipesCheckboxValue] = useState(true);
    
    const handleOpenFilterPopup = () => {
        console.log(props.recipes); // TODO: why doesn't props.recipes include all recipes right here
        const newTags = [];
        for (const recipe of props.recipes) {
            for (const tag of recipe.tags) {
                if (!newTags.includes(tag)) {
                    newTags.push(tag);
                }
            }
        }
        console.log(newTags);
        setTags(newTags);
        setTagCheckboxesValues(new Array(newTags.length).fill(false));
        setShowFilterPopup(true);
    }

    const handleCloseFilterPopup = () => setShowFilterPopup(false);
    const energyLevels = ["low", "medium", "high"];
    const sortRules = {
        title: "Title (A to Z)", 
        energy: "Energy Required (Low to High)", 
        time: "Time Required (Low to High)", 
        inventory: "Percent of Owned Ingredients (High to Low)"
    };
    const [sortRule, setSortRule] = useState(sortRules["title"]);

    const sortFunction = (recipeA, recipeB) => { 
        if (sortRule == sortRules["title"]) {
            const titleA = recipeA.title.toLowerCase();
            const titleB = recipeB.title.toLowerCase();
            return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
        } else if (sortRule == sortRules["energy"]) {
            const energyLevelA = recipeA.energyRequired.toLowerCase();
            const energyLevelB = recipeB.energyRequired.toLowerCase();
            return energyLevels.indexOf(energyLevelA) - energyLevels.indexOf(energyLevelB);
        } else if (sortRule == sortRules["time"]) {
            const timeInMinsA = recipeA.minsRequired + (recipeA.hoursRequired * 60);
            const timeInMinsB = recipeB.minsRequired + (recipeB.hoursRequired * 60);
            return timeInMinsA - timeInMinsB;
        } else if (sortRule == sortRules["inventory"]) {
            const listOfItemsInSharedInventory = props.itemsInSharedInventory.map((item) => item.value);
            const listOfItemsInPersonalInventory = props.itemsInPersonalInventory.map((item) => item.value);
            const inInventoryA = recipeA.ingredients.filter((ingredient) => (listOfItemsInSharedInventory.includes(ingredient.focus) || listOfItemsInPersonalInventory.includes(ingredient.focus))).length;
            const inInventoryB = recipeB.ingredients.filter((ingredient) => (listOfItemsInSharedInventory.includes(ingredient.focus) || listOfItemsInPersonalInventory.includes(ingredient.focus))).length;
            const numIngredientsA = recipeA.ingredients.length;
            const numIngredientsB = recipeB.ingredients.length;
            const inventoryPercentageA = inInventoryA / numIngredientsA;
            const inventoryPercentageB = inInventoryB / numIngredientsB;
            return inventoryPercentageB - inventoryPercentageA; 
        }
    }

    const shouldBeShown = (recipe) => {
        console.log("title: " + recipe.title);
        if (showAllRecipes) {
            return true;
        } else {
            // console.log("recipe tags: " + recipe.tags);
            // console.log("tags to show: " + tagsToShow);
            const recipeTags = recipe.tags;
            const recipeTagsThatAreSelected = recipe.tags.filter((tag) => tagsToShow.includes(tag));
            // console.log("recipe tags to show: " + recipeTagsThatAreSelected);
            // console.log("-------------------------------------------");
            if (recipeTagsThatAreSelected.length > 0) {
                return true;
            } else {
                return false;
            }
        }
    }

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
                <RecipeCards 
                    filteredRecipes={(props.recipes.filter((recipe) => (recipe.title?.toLowerCase().match(searchInput.toLowerCase().trim()) || recipe.ingredients?.join(", ").toLowerCase().match(searchInput.toLowerCase().trim())))).
                        sort(sortFunction).
                        filter((recipe) => shouldBeShown(recipe))} 
                    recipes={props.recipes}
                    setRecipes={props.setRecipes} onClickFunction={handleOpenViewPopup} groceryList={props.personalGroceryList} addToGL={props.addToGL} view={true}/>
            </div>

            {/* the add button that appears on the home page */}
            <button id='add-button' onClick={handleOpenAddPopup}>add</button>

            {/* popups */}
            <AddRecipePopup recipes={props.recipes} setRecipes={props.setRecipes} showAddPopup={showAddPopup} handleCloseAddPopup={handleCloseAddPopup}></AddRecipePopup>
            <ViewRecipePopup recipes={props.recipes} showViewPopup={showViewPopup} handleCloseViewPopup={handleCloseViewPopup} indexOfRecipeToView={indexOfRecipeToView} setRecipes={props.setRecipes} view={true} groceryList={props.personalGroceryList} addToGL={props.addToGL}> </ViewRecipePopup>
            <FilterPopup recipes={props.recipes} showFilterPopup={showFilterPopup} handleCloseFilterPopup={handleCloseFilterPopup} tags={tags} sortRules={sortRules} sortRule={sortRule} setSortRule={setSortRule} energyLevels={energyLevels} showAllRecipes={showAllRecipes} setShowAllRecipes={setShowAllRecipes} tagsToShow={tagsToShow} setTagsToShow={setTagsToShow} tagCheckboxesValues={tagCheckboxesValues} setTagCheckboxesValues={setTagCheckboxesValues} showAllRecipesCheckboxValue={showAllRecipesCheckboxValue} setShowAllRecipesCheckboxValue={setShowAllRecipesCheckboxValue}></FilterPopup>
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

    const findQuotedWord = (word) => {
        const indexOfFirstQuote = word.indexOf("\"");
        const indexOfSecondQuote = word.slice(indexOfFirstQuote + 1).indexOf("\"") + indexOfFirstQuote + 1;
        if (indexOfFirstQuote === -1 || indexOfSecondQuote === -1) {
            return null;
        } else {
            return word.slice(indexOfFirstQuote + 1, indexOfSecondQuote);
        }
    }

    // handling submit by closing popup and updating the 'recipes' mock database
    const handleSubmit = () => {
        
        if (!("minsRequired" in inputs)) {
            setInputs(values => ({...values, ["minsRequired"]: 0}))
        }
        if (!("hoursRequired" in inputs)) {
            setInputs(values => ({...values, ["hoursRequired"]: 0}))
        }
        const nextRecipes = [...props.recipes, {
            title: inputs.title, 
            picture: inputs.picture, 
            energyRequired: inputs.energyRequired, 
            hoursRequired: inputs.hoursRequired || 0, 
            minsRequired: inputs.minsRequired || 0, 
            tags: inputs.tags?.split(",").map(s => s.trim()) || [], 
            ingredients: inputs.ingredients?.
                    split(",").
                    map(s => s.trim()).
                    filter((str) => str !== '').
                    map((ingredientPhrase) => ({
                        "phrase": ingredientPhrase, 
                        "focus": findQuotedWord(ingredientPhrase)
                    })) || [], 
            steps: inputs.steps,
            notes: inputs.notes}];
        
        if (nextRecipes[nextRecipes.length - 1].ingredients?.length !== nextRecipes[nextRecipes.length - 1].ingredients?.filter((ingredient) => ingredient.focus).length) {
            alert("All ingredients must have a focus word or phrase in quotes!");
        } else {
            props.handleCloseAddPopup();
            props.setRecipes(nextRecipes);
        }
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
                                <span className="info-tooltip-text">Put the focus word or phrase in quotes (i.e. 12 "tortillas", flour or corn). The focus word is what will show up in your grocery list or inventory!</span>
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
    
    const [sortRulesDropdownValue, setSortRulesDropdownValue] = useState(props.sortRules["title"]);
    const [checkboxDisabledString, setCheckboxDisabledString] = useState(true);

    // // tags mapped to checkboxes
    // const energyLevelCheckboxes = props.energyLevels.map((energyLevel, index) => 
    // {
    //     const id = "energyCheck" + index;
        
    //     return (
    //         <div className="form-check" key={index}>
    //             <input className="form-check-input" type="checkbox" value="" id={id}></input>
    //             <label className="form-check-label" htmlFor={id}>
    //                 {energyLevel}
    //             </label>
    //         </div>
    //     )
    // })

    // // time levels mapped to checkboxes
    // const timeLevels = ["< 10 mins", "10-20 mins", "20-40 mins", "40-60 mins", "> 1 hour"];
    // const timeLevelCheckboxes = timeLevels.map((timeLevel, index) => 
    // {
    //     const id = "timeCheck" + index;
        
    //     return (
    //         <div className="form-check" key={index}>
    //             <input className="form-check-input" type="checkbox" value="" id={id}></input>
    //             <label className="form-check-label" htmlFor={id}>
    //                 {timeLevel}
    //             </label>
    //         </div>
    //     )
    // })

    // // inventory levels mapped to checkboxes
    // const inventoryLevels = ["100%", "75%-100%", "50%-75%", "25%-50%", "0%-25%"];
    // const inventoryLevelCheckboxes = inventoryLevels.map((inventoryLevel, index) => 
    // {
    //     const id = "inventoryCheck" + index;
        
    //     return (
    //         <div className="form-check" key={index}>
    //             <input className="form-check-input" type="checkbox" value="" id={id}></input>
    //             <label className="form-check-label" htmlFor={id}>
    //                 {inventoryLevel}
    //             </label>
    //         </div>
    //     )
    // })

    // tags levels mapped to checkboxes
    const tagCheckboxes = props.tags.sort().map((tag, index) => 
    {
        const id = "tagCheck" + index;
        
        return (
            <div className="form-check" key={index}>
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value={tag} 
                    id={id}
                    checked={props.tagCheckboxesValues[index]}
                    onChange={() => handleTagCheckboxChange(index)}
                    disabled={checkboxDisabledString}>
                </input>
                <label className="form-check-label" htmlFor={id}>
                    {tag}
                </label>
            </div>
        )
    })

    const handleTagCheckboxChange = (position) => {
        const newTagCheckboxesValues = props.tagCheckboxesValues.map((value, index) =>
                index === position ? !value : value
        );

        props.setTagCheckboxesValues(newTagCheckboxesValues);
        console.log(newTagCheckboxesValues);
    }

    const handleShowAllCheckboxChange = () => {
        props.setShowAllRecipesCheckboxValue(!props.showAllRecipesCheckboxValue);
        if (checkboxDisabledString === true) {
            setCheckboxDisabledString(false);
        } else {
            setCheckboxDisabledString(true);
        }
    }

    const handleSubmit = () => {
        props.handleCloseFilterPopup();
        props.setSortRule(sortRulesDropdownValue);
        props.setTagsToShow(props.tags.filter((tag, index) => props.tagCheckboxesValues[index] === true));
        props.setShowAllRecipes(props.showAllRecipesCheckboxValue);
    }

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
                    <select defaultValue={props.sortRule} className="form-select" onChange={(event) => {setSortRulesDropdownValue(event.target.value)}}>
                        <option>{props.sortRules["title"]}</option>
                        <option>{props.sortRules["energy"]}</option>
                        <option>{props.sortRules["time"]}</option>
                        <option>{props.sortRules["inventory"]}</option>
                    </select>
                    <br></br>
                    
                    {/* filtering options */}
                    <h6>Filter by Tags:</h6>
                    {/* <p>Energy Required</p>
                    <div>{energyLevelCheckboxes}</div>
                    <p>Time Required</p>
                    <div>{timeLevelCheckboxes}</div>
                    <p>Ingredients Already Owned</p>
                    <div>{inventoryLevelCheckboxes}</div> */}
                    {/* TODO: 'deselect all' button */}
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="select-all" checked={props.showAllRecipesCheckboxValue} onChange={handleShowAllCheckboxChange}></input>
                        <label className="form-check-label" htmlFor="select-all">
                            <i><u>show all recipes</u></i>
                        </label>
                    </div>
                    <div>{tagCheckboxes}</div>
                    
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" type="submit" onClick={props.handleCloseFilterPopup}>
                        Reset
                    </Button>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}