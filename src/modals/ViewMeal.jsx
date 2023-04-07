import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ViewRecipePopup from './ViewRecipe';

import EditMeal from './EditMeal'

// Modal that will appear when the user clicks on a meal so that they can view details about the meal.
const ViewMeal = ({ open, onClose, quota, setQuota, currentCategoryIndex, currentMealDetails, currentMealIndex, recipes, setRecipes}) => {
  
  // Passed as variable to editing category popup so we know which category to edit
  const [quotaIndex, setQuotaIndex] = useState(0)

  // Saves category selected when planning a meal
  const selectedCategory = quota[currentCategoryIndex].id

  // Saves the day selected when planning a meal
  const selectedDay = currentMealDetails.day

  // Saves either meal title or the index of the recipe
  const mealDetails = currentMealDetails.id

  // Used to indicate when a popup should open to view recipe
  const [viewRecipe, setViewRecipe] = useState(false)

  // Indicates when modal should appear to edit the meal details
  const [editMeal, setEditMeal] = useState(false)

  // Days of the week used for tag names
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  if (!open) return null

  return (
    <>
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>View Meal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      
        <Form>
          <Form.Group className="mb-3">
            <Form.Label className="edit-modal-header">Meal Name</Form.Label>
            
            {/* Shows meal title */}
            <Row>
              <Form.Label>
                {/* If the meal is made by ingredients, will just display meal title. Otherwise, will index into recipes list to find recipe title. */}
                {currentMealDetails.type === "Ingredients" ? mealDetails : recipes[mealDetails].title}
              </Form.Label>
            </Row> 
          
            {/* Displays the category associated with the meal*/}
            <Form.Label className="edit-modal-header">Category</Form.Label>
            <Row><Form.Label>{selectedCategory}</Form.Label></Row>
        
            {/* Displays the tag associated with the meal. */}
            <Form.Label className="edit-modal-header">Day</Form.Label>
            <Row><Form.Label>{selectedDay}</Form.Label></Row>

            {/* If the type of the meal is a recipe, then the view recipe button will be displayed. */}
            {currentMealDetails.type === "Recipe" && 
                  <Row>
                    <Button onClick={()=>setViewRecipe(true)}>
                     View Recipe
                    </Button>
                    <ViewRecipePopup 
                      recipes={recipes} showViewPopup={viewRecipe} 
                      handleCloseViewPopup={()=>setViewRecipe(false)} 
                      indexOfRecipeToView={mealDetails} 
                      setRecipes={setRecipes}> 
                    </ViewRecipePopup>
                  </Row>
                
            }

          {/* Modal that will appear if the user wants to edit a meal's information. */}   
          {editMeal && <EditMeal viewPopup={open} closeViewPopup={onClose} open={editMeal} onClose={()=>setEditMeal(false)} quota={quota} setQuota={setQuota} quotaIndex={quotaIndex} setQuotaIndex={setQuotaIndex}
          currentCategoryIndex={currentCategoryIndex} currentMealDetails={currentMealDetails} currentMealIndex={currentMealIndex} recipes={recipes} setRecipes={setRecipes}/>}
        
          </Form.Group>
        </Form> 
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={()=>setEditMeal(true)} data-dismiss="modal">
          Edit meal
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default ViewMeal