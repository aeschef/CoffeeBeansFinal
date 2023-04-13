import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ViewRecipePopup from './ViewRecipe';
import RecipeCards from '../RecipeCards'

// Modal that appears when a user selects a meal and presses the edit meal button. 
const EditMeal = ({ viewPopup, closeViewPopup, open, onClose, quota, setQuota, currentCategoryIndex, currentMealDetails, currentMealIndex, recipes, setRecipes, groceryList, addToGL}) => {
  
  // Saves category selected when planning a meal
  const [selectedCategory, setCategory] = useState(quota[currentCategoryIndex].id)

  // Saves the day selected when planning a meal
  const [selectedDay, setDay] = useState(currentMealDetails.day)
  
  const [categoryChanged, setCategoryChanged] = useState(false)
  const [tagChanged, setTagChanged] = useState(false)

  // Determines when a meal's details were changed so we know to update it. 
  const [mealDetailsChanged, setMealDetailsChanged] = useState(false)

  // Stores notes information for meal ideas and determines when the user has changed the entry
  const [notes, setNotes] = useState(currentMealDetails.notes)
  const [notesChanged, setNotesChanged] = useState(false)

  const [newMeal, setNewMeal] = useState(false)

  // Set to true when the user wants to view the recipe or edit it. 
  const [viewRecipe, setViewRecipe] = useState(false)

  // Stores either the name of the meal if it is by ingredients or the index of the recipe. 
  const [mealDetails, setMealDetails] = useState(currentMealDetails.id)
  const [updatedMeal, setUpdatedMeal] = useState(null)

  // Days of the week used for tag names
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  // Reinserts the meal into the quota array with updated information 
  function addNewMeal(categoryIndex) {
    // TODO:  ERROR CHECKING - Check if category name already exists
    // TODO: Make sure that quota amount is an integer and is greater than or equal to 0
    let quotas= [...quota];

     // if the category was changed, we need to insert the meal into the new category's list and remove it from the old category's list
     if (categoryChanged) {
        
      // Updates previous category so that it removes the meal from its list of items
      let categoryList = {...quotas[currentCategoryIndex]}
      
      let oldItems = categoryList.items

      // Removes the meal from old category's list
      let newCategoryList = [
        ...oldItems.slice(0, currentMealIndex),
        ...oldItems.slice(currentMealIndex + 1)
      ]
      categoryList.items = newCategoryList

      // Updates quota so that the category contains the list of meals with the updated meal removed
      quotas[currentCategoryIndex] = categoryList

      // Makes a copy of the category to which we need to add the meal
      let item = {...quotas[categoryIndex]};

      // Update the current category's array of meals so that it stores the new meal
      let copyMeals = [...item.items, 
        {value:updatedMeal.description, label:updatedMeal.description, day:updatedMeal.day, notes: updatedMeal.notes, type:updatedMeal.type}]
      item.items = copyMeals

      console.log(item.items)

      // Reinsert the category back into the copy of the quotas
      quotas[categoryIndex] = item;
      console.log(quotas)
      
      // Set the state to our new copy
      setQuota(quotas)
    }

    // If the tag or meal details were changed, then the meal just needs to be reinserted in the same category's list of meals
    else if (tagChanged || mealDetailsChanged) {

      // Makes a copy of the quota array 
      let prevCategoryInfo = {...quotas[currentCategoryIndex]};

      // Copies the old array of meals for the category
      let oldItems = prevCategoryInfo.items

      // Updates the meal so that it contains the new information      
      let newCategoryList = [
        ...oldItems.slice(0, currentMealIndex), {value:updatedMeal.description, label:updatedMeal.description, day:updatedMeal.day, notes:updatedMeal.notes, type:updatedMeal.type}, 
        ...oldItems.slice(currentMealIndex + 1)
      ]

      // Update the current category's array of meals so that it stores the meal with updated information
      prevCategoryInfo.items = newCategoryList

      // Adds the category back into the array
      quotas[categoryIndex] = prevCategoryInfo;
      console.log(quotas)
      
      // Set the state to our new copy
      setQuota(quotas)
    }
    onClose(false)
    closeViewPopup()
  }

  // Keeps track if user changed tag. 
  useEffect(()=> {
    console.log(selectedDay)
    if (selectedDay !== currentMealDetails.day) {
      setTagChanged(true)
    } else {
      setTagChanged(false)
    }
  }, [selectedDay])


  // Keeps track if user changes the meal category, meaning that the meal needs to be inserted into another category's list of meals
  // and removed from old category's list
  useEffect(()=> {
    if (selectedCategory !== quota[currentCategoryIndex].id) {
      setCategoryChanged(true)
    } else {
      setCategoryChanged(false)
    }
  }, [selectedCategory])


  // Keeps track when user changes the notes section for a meal idea so that we know to update its old entry in a meal category's list
  useEffect(()=> {
    if (notes && notes !== currentMealDetails.notes) {
      setNotesChanged(true)
    }
  }, [notes])



  // Keeps track if user changed meal description, meaning that it needs to be reinserted into the category's list of meals
  useEffect(()=> {
    if (mealDetails !== currentMealDetails.description) {
      setMealDetailsChanged(true)
    } else {
      setMealDetailsChanged(false)
    }
  }, [mealDetails])

  // Executed if the user 
  useEffect(()=> {
    if (newMeal) {
      console.log(updatedMeal)
      // If meal category is the first in the categories list, adds meal to breakfast state array
      if (updatedMeal.id === quota[0].id) {
        addNewMeal(0)
      
      // If meal category is lunch, adds meal to the lunch state array
      } else if (updatedMeal.id  === quota[1].id) {
        addNewMeal(1)
      // If meal category is dinner, adds meal to the dinner state array
      } else if (updatedMeal.id  === quota[2].id) {
        addNewMeal(2)
      }
      setNewMeal(false)
    }

  }, [newMeal])

  if (!open) return null


  // When user selects the update button, this handler will execute and will set the eupdated meal variable so that it
  // contains the information needed to add the meal to the list again.
  const handleUpdate = async (e) => {
    e.preventDefault()

    // If the category, tag info or meal was changed, it will be reinserted into the quota.
    if (categoryChanged || tagChanged || mealDetailsChanged || notesChanged) {
      setUpdatedMeal({id: selectedCategory, day:selectedDay, description: mealDetails, notes: notes, type: currentMealDetails.type})
      console.log("added meal")
      setNewMeal(true)
    }

    // If nothing was changed, the modal will close
    else {
      onClose(false)
    }

  }

  return (
    <>
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Meal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="edit-modal-header">Meal Name</Form.Label>
            
            {/* Shows meal title if meal type is Ingredients*/}
            {currentMealDetails.type === "Ingredients" && 
                  <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Title"
                  autoFocus
                  onChange={(e) => setMealDetails(e.target.value)}
                  value={mealDetails}
                />
                }

              {/* Shows title of recipe */}
              {currentMealDetails.type === "Recipe" && 
              <Row>
                <Form.Label>
                  {recipes[mealDetails].title}
                </Form.Label>
              </Row> }
          

            <Form.Label className="edit-modal-header">Category</Form.Label>
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
            
            {/* Displays the dropdown of tag sfo rhte user to choose from. */}
            <Form.Select 
              aria-label="Default select example" 
              as="select"
              value={selectedDay}
              onChange={e => {
                console.log("e.target.value", e.target.value);
                setDay(e.target.value);
              }}
              >
                {/* Displays the tags listed in the days array */ }
                {days.map(day => (
                      <option
                        key={day}
                        value={day}>
                        {day}
                      </option>
                    ))}
                {/* Allows user to not select tag */}
                <option value="None">None</option>
            </Form.Select>

            {/* If the type of the meal is a recipe, then the view recipe button will be displayed. */}
            {currentMealDetails.type === "Recipe" && 
                  <Row className="my-3">

                    {/* Displays card for the recipe associated with the meal*/}
                    <RecipeCards recipes={recipes.filter((recipe, index) => (index === mealDetails))} 
                    setRecipes={setRecipes} onClickFunction={()=>setViewRecipe(true)} groceryList={groceryList} addToGL={addToGL} view={true}/>
                  
                    {/* Modal that appears if the user selects the view button recipe. 
                        Displays recipe information. */}
                    <ViewRecipePopup 
                    recipes={recipes} showViewPopup={viewRecipe} 
                    handleCloseViewPopup={()=>setViewRecipe(false)} 
                    indexOfRecipeToView={mealDetails} 
                    setRecipes={setRecipes} groceryList={groceryList} addToGL={addToGL}> </ViewRecipePopup>
                  </Row>
            }

            {currentMealDetails.type === "Ingredients" && 
            <>
              {/* Displays the note information associated with the user's inputted meal idea */} 
              <Form.Label className="edit-modal-header">Notes</Form.Label>
              <div class="input-group">
                <textarea class="form-control" aria-label="With textarea" value={notes} 
                onChange={(e)=>setNotes(e.target.value)}></textarea>
              </div>
            </>}
                  

          </Form.Group>
        </Form> 

      </Modal.Body>
      <Modal.Footer>
        
        <Button variant="primary" onClick={handleUpdate}>
          Update meal
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default EditMeal