import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import EditRecipePopup from './EditRecipe'

// popup for viewing a recipe
export default function ViewRecipePopup(props) {
  
  // variables and functions for Edit Recipe popup
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [inputs, setInputs] = useState(null); // these are what show up in the inputs originally
  const [indexOfRecipeToEdit, setIndexOfRecipeToEdit] = useState(0);
  const handleOpenEditPopup = (index) => {
      setIndexOfRecipeToEdit(index);
      setInputs(props.recipes[index]);
      setShowEditPopup(true);
  }
  const handleCloseEditPopup = () => setShowEditPopup(false);

  // saving a reference to the current recipe being viewed
  const currentRecipe = props.recipes[props.indexOfRecipeToView];

  const recipeIngredients = currentRecipe.ingredients?.map(
          (ingredient, index) => <li key={index}>{ingredient}</li>);

  const recipeSteps = currentRecipe.steps?.map(
          (step, index) => <li key={index}>{step}</li>);

  return (
      <>
          {/* view popup modal */}
          <Modal show={props.showViewPopup} onHide={props.handleCloseViewPopup}>
              
              {/* modal header with title, edit button, and close button */}
              <Modal.Header closeButton>
                  <Modal.Title>Recipe Title</Modal.Title>
                  <button onClick={() => handleOpenEditPopup(props.indexOfRecipeToView)}>Edit</button>
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
                  <p>{currentRecipe.tags?.join(", ")}</p>
                  
                  {/* recipe ingredients */}
                  <h6>Ingredients</h6>
                  <ul>{recipeIngredients}</ul>
                  
                  {/* recipes steps */}
                  <h6>Steps</h6>
                  <ol>{recipeSteps}</ol>
                  
                  {/* recipe notes */}
                  <h6>Notes</h6>
                  <p>{currentRecipe.notes}</p>

                  <button>Add Recipe to Meal Plan</button>
                  <button>Recipe Complete</button>
              </Modal.Body>
          </Modal>
          <EditRecipePopup recipes={props.recipes} setRecipes={props.setRecipes} showEditPopup={showEditPopup} handleCloseEditPopup={handleCloseEditPopup} setInputs={setInputs} inputs={inputs} indexOfRecipeToEdit={indexOfRecipeToEdit}></EditRecipePopup>

      </>
      
  )
}
