import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "./recipes.css";
import ViewRecipePopup from './modals/ViewRecipe';
import RecipeCards from './RecipeCards';
import RecipeSearchBar from './RecipeSearchBar';
import ImageUploading from "react-images-uploading";
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, set } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { getStorage } from '@firebase/storage';
import { defaultRecipePhoto } from './defaultRecipePhoto';

// home page of the recipes screen
export default function RecipesHome(props) {

    const [recipes, setRecipes] = useState([]);

    const [itemsInPersonalInventory, setItemsInPersonalInventory] = useState([]);
    const [itemsInSharedInventory, setItemsInSharedInventory] = useState([]);

    // database info
    const auth = getAuth(props.app)
    const db = getDatabase(props.app)

    // helper to get a list of items from a snapshot of an inventory
    // parameters: snapshot
    // returns: list
    const inventoryListHelper = ((snapshot) => {

        if (snapshot.val()) {
            var outputList = [];
        
            const allCategoriesObject = snapshot.val();
            console.log(allCategoriesObject);
            const allCategoriesKeys = Object.keys(allCategoriesObject);
            for (const categoryKey of allCategoriesKeys) {
                const allItemsInCategoryObject = {...allCategoriesObject[categoryKey]};
                const allItemsInCategoryKeys = Object.keys(allItemsInCategoryObject);
                for (const itemInCategoryKey of allItemsInCategoryKeys) {
                    const itemObject = {...allItemsInCategoryObject[itemInCategoryKey]};
                    outputList.push(itemObject.item_name);
                }
            }
        }

        return outputList;
    })

    // getting data from dp
    useEffect(() => {
                
        // getting a reference to the 'recipes' section of this user's area of the database
        const dbRecipeRef = ref(db, '/users/' + auth.currentUser.uid + '/recipes/');
        
        // runs upon startup and every time the data changes
        onValue(dbRecipeRef, (snapshot) => {
            
            // getting data from the spot in the db that changes
            // good source: https://info340.github.io/firebase.html#firebase-arrays
            const allRecipesObject = snapshot.val();
            const allRecipesKeys = Object.keys(allRecipesObject);
            const allRecipesArray = allRecipesKeys.map((key) => {
                const singleRecipeCopy = {...allRecipesObject[key]}; // copying the element at that key
                singleRecipeCopy.key = key; // save the key string so you have it later
                return singleRecipeCopy;
            })
            setRecipes(allRecipesArray);
        });

        // getting personal inventory from db!
        const dbPersonalListRef = ref(db, '/users/' + auth.currentUser.uid + '/inventory/categories/');
        onValue(dbPersonalListRef, (snapshot) => {
            const newItemsInPersonalInventory = inventoryListHelper(snapshot);
            setItemsInPersonalInventory(newItemsInPersonalInventory);
        })

        // getting group id from db
        var groupID;
        const dbGroupRef = ref(db, '/users/' + auth.currentUser.uid + '/account/groupID');
        onValue(dbGroupRef, (snapshot) => {
            groupID = snapshot.val();
        })

        // getting shared inventory from db!
        const dbSharedListRef = ref(db, '/groups/' + groupID + '/inventory/categories/');
        onValue(dbSharedListRef, (snapshot) => {
            const newItemsInSharedInventory = inventoryListHelper(snapshot);
            setItemsInSharedInventory(newItemsInSharedInventory);
        })
        
    }, []);

    // searchInput for the search bar
    const [searchInput, setSearchInput] = useState("");
    
    // variables and functions for Add Recipe popup
    const [showAddPopup, setShowAddPopup] = useState(false);
    const handleOpenAddPopup = () => setShowAddPopup(true);
    const handleCloseAddPopup = () => setShowAddPopup(false);

    // variables and functions for View Recipe popup
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [keyOfRecipeToView, setKeyOfRecipeToView] = useState(0);
    const handleOpenViewPopup = (index) => {
        setKeyOfRecipeToView(index);
        setShowViewPopup(true);
    }
    const handleCloseViewPopup = () => setShowViewPopup(false);

    // variables and functions for Filter Recipe popup
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [tags, setTags] = useState([]);
    
    
    // these two will be passed in as the current state!
    const [showAllRecipes, setShowAllRecipes] = useState(true);
    const [tagCheckboxesValues, setTagCheckboxesValues] = useState([]);
    const [showAllRecipesCheckboxValue, setShowAllRecipesCheckboxValue] = useState(true);
    
    const handleOpenFilterPopup = () => {
        const newTags = tags.slice();
        for (const recipe of recipes) {
            for (const tag of recipe.tags) {
                if (!(newTags.map(tag => tag.name).includes(tag))) {
                    newTags.push({name: tag, show: false});
                }
            }
        }
        newTags.sort((tagA, tagB) => tagA.name - tagB.name)
        setTags(newTags);
        setTagCheckboxesValues(newTags.map((tag) => tag.show));
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
            const inInventoryA = recipeA.ingredients.filter((ingredient) => (itemsInSharedInventory?.includes(ingredient.focus) || itemsInPersonalInventory.includes(ingredient.focus))).length;
            const inInventoryB = recipeB.ingredients.filter((ingredient) => (itemsInSharedInventory?.includes(ingredient.focus) || itemsInPersonalInventory.includes(ingredient.focus))).length;
            const numIngredientsA = recipeA.ingredients.length;
            const numIngredientsB = recipeB.ingredients.length;
            const inventoryPercentageA = inInventoryA / numIngredientsA;
            const inventoryPercentageB = inInventoryB / numIngredientsB;
            return inventoryPercentageB - inventoryPercentageA; 
        }
    }

    const shouldBeShown = (recipe) => {
        if (showAllRecipes) {
            return true;
        } else {
            var found = false;
            for (const recipeTag of recipe.tags) {
                for (const tag of tags) {
                    if (recipeTag === tag.name && tag.show === true) {
                        found = true;
                    }
                }
            }
            if (found === true) {
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
                    app={props.app}
                    recipes={recipes}
                    setRecipes={props.setRecipes} 
                    onClickFunction={handleOpenViewPopup} 
                    groceryList={props.personalGroceryList} 
                    addToGL={props.addToGL} 
                    view={true}
                    searchInput={searchInput}
                    sortFunction={sortFunction}
                    shouldBeShown={shouldBeShown}/>
            </div>

            {/* the add button that appears on the home page */}
            <button id='add-button' onClick={handleOpenAddPopup}>add</button>

            {/* popups */}
            <AddRecipePopup app={props.app} recipes={recipes} setRecipes={props.setRecipes} showAddPopup={showAddPopup} handleCloseAddPopup={handleCloseAddPopup}></AddRecipePopup>
            <ViewRecipePopup app={props.app} 
            recipes={recipes} 
            showViewPopup={showViewPopup} 
            handleCloseViewPopup={handleCloseViewPopup} 
            keyOfRecipeToView={keyOfRecipeToView} 
            setRecipes={props.setRecipes} 
            view={true} 
            groceryList={props.personalGroceryList}
            addToGL={props.addToGL}> </ViewRecipePopup>
            <FilterPopup recipes={recipes} showFilterPopup={showFilterPopup} handleCloseFilterPopup={handleCloseFilterPopup} tags={tags} setTags={setTags} sortRules={sortRules} sortRule={sortRule} setSortRule={setSortRule} energyLevels={energyLevels} showAllRecipes={showAllRecipes} setShowAllRecipes={setShowAllRecipes} tagCheckboxesValues={tagCheckboxesValues} setTagCheckboxesValues={setTagCheckboxesValues} showAllRecipesCheckboxValue={showAllRecipesCheckboxValue} setShowAllRecipesCheckboxValue={setShowAllRecipesCheckboxValue}></FilterPopup>
        </>
    )
}

// popup for adding a recipe - TODO: make (all?) fields in the form required
function AddRecipePopup(props) {

    const [images, setImages] = React.useState([]);
    const maxNumber = 1;
    const onImageListChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    // database info
    const auth = getAuth(props.app)
    const db = getDatabase(props.app)

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
        const newRecipe = {
            title: inputs.title, 
            picture: images[0]?.data_url || defaultRecipePhoto,
            energyRequired: inputs.energyRequired, 
            hoursRequired: inputs.hoursRequired || 0, 
            minsRequired: inputs.minsRequired || 0, 
            tags: inputs.tags?.split(",").map(s => s.trim()) || [], 
            ingredients: inputs.ingredients?.
                    split("\n").
                    map(s => s.trim()).
                    filter((str) => str !== '').
                    map((ingredientPhrase) => ({
                        "phrase": ingredientPhrase, 
                        "focus": findQuotedWord(ingredientPhrase)
                    })) || [], 
            steps: inputs.steps?.split("\n").map(s => s.trim()) || [],
            notes: inputs.notes
        };
        
        if (newRecipe.ingredients?.length !== newRecipe.ingredients?.filter((ingredient) => ingredient.focus).length) {
            alert("All ingredients must have a focus word or phrase in quotes!");
        } else {
            props.handleCloseAddPopup();
                    
            // getting a reference to the 'recipes' section of this user's area of the database
            const dbRecipesRef = ref(db, '/users/' + auth.currentUser.uid + '/recipes/');

            // getting a reference to new place to post
            var newRecipePostRef = push(dbRecipesRef);

            set(newRecipePostRef, newRecipe);
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
                        <ImageUploading
                            value={images}
                            onChange={onImageListChange}
                            maxNumber={maxNumber}
                            dataURLKey="data_url"
                            acceptType={["jpg"]}
                        >
                        {({onImageUpload, onImageRemoveAll, imageList, onImageUpdate, onImageRemove}) => (
                            <div className="upload__image-wrapper">
                                <button onClick={onImageUpload} style={imageList.length > 0 ? {display: "none"} : null}>
                                    Upload Image
                                </button>
                                {imageList.map((image, index) => (
                                    <div key={index} className="image-item">
                                    <img src={image.data_url} id="recipe-image" alt="" width="100" />
                                    <div className="image-item__btn-wrapper">
                                        <button onClick={() => onImageUpdate(index)}>Change</button>
                                        <button onClick={() => onImageRemove(index)}>Remove</button>
                                    </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        </ImageUploading>
                        
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
                        

                        {/* tags entry */}
                        <Form.Label>Tags:</Form.Label>
                        <div className='information'>
                            <div className='info-tooltip'>
                                &#x1F6C8;
                                <span className="info-tooltip-text">Tags must be separated by commas.</span>
                            </div>
                        </div>
                        <Form.Control 
                            type="text" 
                            name="tags"
                            value={inputs.tags || ""}
                            onChange={handleChange}
                        />

                        {/* ingredients entry */}
                        <Form.Label>Ingredients with Focus Word/Phrase:</Form.Label>
                        <div className='information'>
                            <div className='info-tooltip'>
                                &#x1F6C8;
                                <span className="info-tooltip-text">Each ingredient should be on its own line. Put the focus word or phrase in quotes (i.e. 12 "tortillas", flour or corn). The focus word is what will show up in your grocery list or inventory!</span>
                            </div>
                        </div>
                        <Form.Control 
                            type="text" 
                            as="textarea"
                            name="ingredients"
                            value={inputs.ingredients || ""}
                            onChange={handleChange}
                        />

                        {/* steps entry */}
                        <Form.Label>Steps:</Form.Label>
                        <div className='information'>
                            <div className='info-tooltip'>
                                &#x1F6C8;
                                <span className="info-tooltip-text">Each step should be on its own line.</span>
                            </div>
                        </div>
                        <Form.Control 
                            type="text"
                            as="textarea" 
                            name="steps"
                            value={inputs.steps || ""}
                            onChange={handleChange}
                        />

                        {/* notes entry */}
                        <Form.Label>Notes:</Form.Label>
                        <Form.Control 
                            type="text" 
                            as="textarea"
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

    // tags mapped to checkboxes
    const tagCheckboxes = props.tags.map((tag, index) => 
    {
        const id = "tagCheck" + index;
        
        return (
            <div className="form-check" key={index}>
                <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value={tag.name} 
                    id={id}
                    checked={props.tagCheckboxesValues[index]}
                    onChange={() => handleTagCheckboxChange(index)}
                    disabled={checkboxDisabledString}>
                </input>
                <label className="form-check-label" htmlFor={id}>
                    {tag.name}
                </label>
            </div>
        )
    })

    const handleTagCheckboxChange = (position) => {
        const newTagCheckboxesValues = props.tagCheckboxesValues.map((value, index) =>
                index === position ? !value : value
        );

        props.setTagCheckboxesValues(newTagCheckboxesValues);
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
        const newTags = props.tags.slice();
        for (var i = 0; i < props.tagCheckboxesValues.length; i++) {
            newTags[i].show = props.tagCheckboxesValues[i];
        }
        props.setTags(newTags);
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