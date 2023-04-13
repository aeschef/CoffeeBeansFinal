import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import '../css/meal_plan.css'
import '../recipes.css'
import RecipeCards from '../RecipeCards';
import ChooseMeal from './ChooseMeal';
import React from 'react'
import Select from 'react-select';

import Creatable from 'react-select/creatable'
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


// Modal for creating a meal that appears when user wants to add a meal to the meal plan
const CreateMeal = ({ app, open, onClose, quota, setQuota, newMeal, setNewMeal, addedMeal, setAddedMeal,
   meal_category, setMealCategory, meal, setMeal, recipes, setRecipes, personalGroceryList, addToGL}) => {
  const auth = getAuth(app);
  
  // Will be updated when user chooses a meal, stores either "Ingredients" or "Recipes"
  const [type, setType] = useState(null)

  // Used to show recipe popup once it is selected and its tile is displayed under meal details
  const [showViewPopup, setShowViewPopup] = useState(false);

  // Determines when we should open the modal to choose a recipe/add a meal idea
  const [openChooseMeal, setOpenChooseMeal] = useState(false)

  // Saves category selected when planning a meal
  const [selectedCategory, setCategory] = useState(quota[0].id)

  // Saves the day selected when planning a meal
  const [selectedDay, setDay] = useState("Monday")

  // Stores all of the information about the meal once the user selects category, tags, and meal info
  const [mealDetails, setMealDetails] = useState({mealIdea:"", notes:""})

  // Indicates when the user wants to create a meal by choosing a recipe
  const [showRecipeModal, setShowRecipeModal] = useState(true)

  // Stores the index of the recipe that the user wants to use
  const [addedRecipe, setAddedRecipe] = useState(0)

  // Determines which screen of creating meal the user is viewing
  const [tab, setTab] = useState(0)


  // Days of the week used for tag names, but users can also add their own 
  const [tags, setTags] = useState([])
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Stores list of categories so we know where to add the meal
  const [categories, setCategories] = useState([])

  // When page first loads, populates meals with information from user's database
  useEffect(()=> {
    const db = getDatabase()
    console.log(auth.currentUser.uid)
    // updates tags state variable so that it stores the saved tags from the user's database
    const tagRef = ref(db, 'users/' + auth.currentUser.uid + "/meal_plan/tags");
    onValue(tagRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      setTags(data);

    });

    // Reference to categories in the meal plan
    const categoryRef = ref(db, 'users/' + auth.currentUser.uid + "/meal_plan/categories")
    let dataCategories = []
    
    // Stores all of the meal categories and pushes them to an array
    onValue(categoryRef, (snapshot) => {
      snapshot.forEach((childsnapshot => {
        
        // pushes category name to array
        dataCategories.push(childsnapshot.key)
        console.log(childsnapshot.key)
        console.log(childsnapshot.val())
      }))

      // updates state variable to store list of categories
      setCategories(dataCategories)
    });

  }, [])

  
  // Will store the tag that the user selects for the new meal
  const [selectedTags, setSelectedTags] = useState([])

  // Once the user is done entering the information to create a meal, this function is called to then add the meal 
  // to the quota list for the specified category.
  function addNewMeal(categoryName) {

    // TODO:  ERROR CHECKING - Check if category name already exists
    // TODO: Make sure that quota amount is an integer and is greater than or equal to 0
    console.log(categoryName)

    // const categoryListRef = ref(getDatabase(), 'users/' + auth.currentUser.uid + "meal_plan/categories/" + categoryName + "/meals");
    // Autogenerates key to map to the new meal within the array that stores the meals for the existing
    // const newMealRef = push(categoryListRef);
    // set(newMealRef, {
    //   value:addedMeal.description,
    //   label:addedMeal.description,
    //   tags:addedMeal.tags,
    //   notes: addedMeal.notes,
    //   type:type  
    // });

    // Updates categories array in the case that a new category was added
    if (categories.indexOf(categoryName) <= -1) {
      setCategories([...categories, categoryName])
    }

    // Closes the modal for adding a meal
    onClose(false)
  }

  // Manages switching between modals
  useEffect(()=> {

    // If the user selected the next button, the tab will switch to display the modal to choose a recipe/meal idea. 
    if (tab === 1)  {
      setOpenChooseMeal(true)
    }
  }, [tab])

  useEffect(()=> {
    console.log(selectedTags)
  }, [selectedTags])
  // When the modal is closed, the fields are reset. 
  useEffect(()=> {
    if (!open) {
      setTab(0)
      setAddedRecipe(null)
    }
  }, [open])

  // Executed whenever the user is ready to add the new meal, meaning that they had selected the "add meal" button
  useEffect(()=> {
    if (newMeal) {
      console.log(addedMeal)

      // Adds meal to assigned category in database
      addNewMeal(addedMeal.id)

      // Sets new meal to false once the meal is added
      setNewMeal(false)

      // Resets information so that it is empty when user wants to add another meal
      setAddedRecipe(null)
      setTab(0)
    }
    setType("")

  }, [newMeal])

  if (!open) return null

  // When the user is ready to add a new meal, this handler is executed. 
  // Sets the addMeal variable so that it will store the information for the meal the user wants to add
  const handleNewMeal = async (e) => {
    e.preventDefault()
    console.log(mealDetails)
    console.log(selectedDay)
    console.log(selectedCategory)

    // TODO: Check for any errors
    const allErrors = {}
    if (mealDetails === null || selectedCategory === null || selectedTags === null) {
      console.log("error creating meal")
      return null
    }

    // If the user is adding meal from ingredients:
    else if (type === "Ingredients"){
      setAddedMeal({id: selectedCategory, tags:selectedTags.value, description: mealDetails.mealIdea, notes: mealDetails.notes, completed: false})
      console.log("added ingredients")
      setNewMeal(true)

    // If the user is adding a meal from recipe:
    } else if (type === "Recipe") {
      setAddedMeal({id: selectedCategory, tags:selectedTags.value, description: mealDetails, notes:"", completed: false})
      console.log("added recipe")
      setNewMeal(true)
    }
  }


  return (
    <>
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Meal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="edit-modal-header">Category</Form.Label>
            
            {/* Populates a dropdown menu that contains the list of categories for user to choose from. */}
            <Form.Select 
              aria-label="Default select example" 
              as="select"
              value={selectedCategory}
              onChange={e => {
                console.log("e.target.value", e.target.value);
                setCategory(e.target.value);
              }}
                >
                {quota.map(option => (
                      <option
                        value={option.id}>
                        {option.id}
                      </option>
                    ))}
            </Form.Select>
            
            <Form.Label className="edit-modal-header">Day</Form.Label>
            
            {/* Dropdown menu that populates a list of all the tags for the user to choose from */}
            <Form.Select 
              aria-label="Default select example" 
              as="select"
              value={selectedDay}
              onChange={e => {
                console.log("e.target.value", e.target.value);
                setDay(e.target.value);
              }}
              >
                {tags.map(tag => (
                      <option key={tag}
                        value={tag}>
                        {tag}
                      </option>
                    ))}
                <option value="None">None</option>
            </Form.Select>

            <Creatable 
                  options={tags.map(opt => ({ label: opt, value: opt}))}
                  onChange={opt =>setSelectedTags(opt)}

            />


            {/* If the type of the meal is a meal idea, then the meal idea and note input will be displayed. */}
            {type === "Ingredients" && !openChooseMeal && 
            <>
              {/* Displays the meal idea that the user had inputted. */}
              <Form.Label>Meal Details</Form.Label>
              <Form.Control
                    size="sm"
                    type="text"
                    placeholder="i.e avocado toast"
                    autoFocus
                    onChange={(e) => setMealDetails({mealIdea: e.target.value, notes: mealDetails.notes})}
                    value={mealDetails.mealIdea}
              />

              {/* Displays the note information associated with the user's inputted meal idea */} 
              <Form.Label className="edit-modal-header">Notes</Form.Label>
              <div class="input-group">
                <textarea class="form-control" aria-label="With textarea" value={mealDetails.notes} 
                onChange={(e)=>setMealDetails({mealIdea:mealDetails.mealIdea, notes: e.target.value})}></textarea>
              </div>
            </>
          }

          {/* If the type of the meal is a recipe, and the modal to choose a recipe isn't open, then the recipe card will be displayed. */}
          {type === "Recipe" && !openChooseMeal && 
            <>
            <Form.Label>Recipe</Form.Label>
            <RecipeCards recipes={recipes.filter((recipe, index) => (index === mealDetails))} 
            setRecipes={setRecipes} onClickFunction={()=>setShowViewPopup(true)} groceryList={personalGroceryList} addToGL={addToGL} view={true}/>
          </>
          }
          </Form.Group>
        </Form>


      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between fixed">
        {/* Buttons that should be displayed when the user is on the default first modal. */}
        {tab === 0 && 
          <>
            <Button variant="primary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={()=>setTab(1)}>
              Next
            </Button>
          </>
        }

        {/* Buttons that are displayed when the user has finished selecting a meal and is on the final screen before adding a meal. */}
        {tab === 2 &&   
          <>
            <Button variant="primary" onClick={()=>setTab(1)}>
              Back
            </Button>
            <Button variant="primary" onClick={handleNewMeal}>
              Add meal
            </Button> 
          </> }

      </Modal.Footer>
      {/* Popup that will be displayed when the user selects the next button, allowing them to choose a recipe or enter meal idea. */}
      <ChooseMeal open={openChooseMeal} onClose={()=>setOpenChooseMeal(false)} recipes={recipes} setRecipes={setRecipes} tab={tab} setTab={setTab}
          mealDetails={mealDetails} setMealDetails={setMealDetails} type={type} setType={setType} />
    </Modal>
  </>
  )
}

export default CreateMeal