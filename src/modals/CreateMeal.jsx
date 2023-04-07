import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import '../css/meal_plan.css'
import '../recipes.css'
import RecipeCards from '../RecipeCards';
import ChooseRecipe from './ChooseRecipe';

// Modal for creating a meal that appears when user wants to add a meal to the meal plan
const CreateMeal = ({ open, onClose, quota, setQuota, newMeal, setNewMeal, addedMeal, setAddedMeal, meal_category, setMealCategory, meal, setMeal, recipes, setRecipes }) => {
  
  // Saves category selected when planning a meal
  const [selectedCategory, setCategory] = useState(quota[0].id)

  // Saves the day selected when planning a meal
  const [selectedDay, setDay] = useState("Monday")

  // Stores all of the information about the meal once the user selects category, tags, and meal info
  const [mealDetails, setMealDetails] = useState("")

  // Indicates when the user wants to create a meal by choosing a recipe
  const [showRecipeModal, setShowRecipeModal] = useState(true)

  // Stores the index of the recipe that the user wants to use
  const [addedRecipe, setAddedRecipe] = useState(0)

  // Determines which screen of creating meal the user is viewing
  const [tab, setTab] = useState(0)

  // Days of the week used for tag names
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Indi
  useEffect(() => {
    if (tab === 2) {
      setShowRecipeModal(true)
    }
  }, [tab])

  // Once the user is done entering the information to create a meal, this function is called to then add the meal 
  // to the quota list for the specified category.
  function addNewMeal(categoryIndex) {

    // Based off which tab the user is on, determines if the created meal is a recipe or ingredients page
    let typeOfMeal = ""
    if (tab === 1) {
      typeOfMeal="Ingredients"

    } else {
      typeOfMeal="Recipe"
    }
    // TODO:  ERROR CHECKING - Check if category name already exists
    // TODO: Make sure that quota amount is an integer and is greater than or equal to 0
      
     // Make a shallow copy of the items
     let quotas= [...quota];
      
     // Make a shallow copy of the category that we are adding a meal to 
     let item = {...quotas[categoryIndex]};

    // Update the current category's array of meals so that it stores the new meal
    let copyMeals = [...item.items, 
      {value:addedMeal.description, label:addedMeal.description, day:addedMeal.day, type:typeOfMeal}]
    item.items = copyMeals
    console.log(item.items)

    // Put the copy of the category info back into the array
    quotas[categoryIndex] = item;
    console.log(quotas)
    
    // Set the state to our new copy
    setQuota(quotas)

    // Closes the modal for adding a meal
    onClose(false)
  }

  // When the modal is closed, the fields are reset. 
  useEffect(()=> {
    if (!open) {
      setTab(0)
      setMealDetails("")
    }
  }, [open])

  // Executed whenever the user is ready to add the new meal, meaning that they had selected the "add meal" button
  useEffect(()=> {
    if (newMeal) {
      console.log(addedMeal)

      // If meal category is the first in the categories list, adds meal to breakfast state array
      if (addedMeal.id === quota[0].id) {
        addNewMeal(0)
      
      // If meal category is lunch, adds meal to the lunch state array
      } else if (addedMeal.id  === quota[1].id) {
        addNewMeal(1)
      
        // If meal category is dinner, adds meal to the dinner state array
      } else if (addedMeal.id  === quota[2].id) {
        addNewMeal(2)
      }

      // Sets new meal to false once the meal is added
      setNewMeal(false)
    }
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
    if (mealDetails === null || selectedCategory === null || selectedDay === null) {
      console.log("error creating meal")
      return null
    }

    // If the user is adding meal from ingredients:
    else if (tab === 1){
      setAddedMeal({id: selectedCategory, day:selectedDay, description: mealDetails})
      console.log("added ingredients")
      setNewMeal(true)

    // If the user is adding a meal from recipe:
    } else if (tab === 2) {
      setAddedMeal({id: selectedCategory, day:selectedDay, description: addedRecipe})
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
                {days.map(day => (
                      <option key={day}
                        value={day}>
                        {day}
                      </option>
                    ))}
                <option value="None">None</option>
            </Form.Select>
              
            <Form.Label className="edit-modal-header">Meal Details</Form.Label>
            
            {/* If the current meal being added is a recipe, the recipe title will be populated on the page. */}
            {tab === 2 && addedMeal && !showRecipeModal && 
              <Row>
              <Form.Label>
              {recipes[addedRecipe].title}
              </Form.Label>
            </Row>
            }

            {/* Shows the two options that allows a user to choose between adding meal by ingredients or from recipes. */}
            {tab === 0 && 
              <div>
                <Col>
                  <Button variant="secondary" className="my-2" onClick={()=>setTab(1)}>Create Meal from Ingredients</Button>
                </Col>
                <Col>
                  <Button variant="secondary" className="my-2" onClick={()=>setTab(2)}>Choose Meal from Recipes</Button>
                </Col>
              </div> }
          </Form.Group>
        </Form> 
        
        {/* If the user wants to add by ingredients, will display text box that allows them to enter ingredients. */}
        {tab === 1 && 
          <Form.Control
          size="sm"
          type="text"
          placeholder="Enter ingredients"
          autoFocus
          onChange={(e) => setMealDetails(e.target.value)}
          value={mealDetails}
        />}

        {/* Popup that displays list of recipes to choose from if user is adding meal from a recipe */}
        {tab === 2 && <ChooseRecipe 
          showRecipeModal={showRecipeModal} 
          setShowRecipeModal={setShowRecipeModal} 
          recipes={recipes} setRecipes={setRecipes}
          addedRecipe={addedRecipe} setAddedRecipe={setAddedRecipe}/>}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handleNewMeal}>
          Add meal
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default CreateMeal