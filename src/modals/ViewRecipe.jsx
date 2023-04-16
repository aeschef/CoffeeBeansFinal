import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import EditRecipePopup from './EditRecipe'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Row';
import OutOfIngredients from './AlternateButton';


function HandleAddtoMealPlan() {

    const list = [{value:"bonebroth", label:"bonebroth"},
    {value:"rice", label:"rice"},
    {value:"lemon juice", label:"lemon juice"},
    {value:"eggs", label:"eggs"},
    {value:"chicken", label:"chicken"},
    {value:"dill", label:"dil"}];
  
}

// popup for viewing a recipe
export default function ViewRecipePopup(props) {
  
  // variables and functions for Edit Recipe popup
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [inputs, setInputs] = useState(null); // these are what show up in the inputs originally
  const [indexOfRecipeToEdit, setIndexOfRecipeToEdit] = useState(props.indexOfRecipeToView);
  const handleOpenEditPopup = (index) => {
      setIndexOfRecipeToEdit(index);
      setInputs(props.recipes[index]);
      setShowEditPopup(true);
  }
  const handleCloseEditPopup = () => setShowEditPopup(false);

  // saving a reference to the current recipe being viewed
  const currentRecipe = props.recipes[props.indexOfRecipeToView];

  const recipeIngredients = currentRecipe?.ingredients?.map(
          (ingredient, index) => <li key={index}>{ingredient}</li>);

  const recipeSteps = currentRecipe?.steps?.map(
          (step, index) => <li key={index}>{step}</li>);

  return (
    
      <>
          {/* view popup modal */}
          <Modal show={props.showViewPopup} onHide={props.handleCloseViewPopup} fullscreen={true}>
              
              {/* modal header with title, edit button, and close button */}
              <Modal.Header closeButton>
                  <Modal.Title>Recipe Title</Modal.Title>
                  <button onClick={() => handleOpenEditPopup(props.indexOfRecipeToView)}>Edit</button>
              </Modal.Header>
              
              {/* modal body with recipe info - NEXT */}
              <Modal.Body>
                <Container>
                    <Row>
                        
                        {/* recipe image */}
                        <div className='col-6'>
                            <div id="image">{currentRecipe?.picture}</div>
                        </div>
                        
                        {/* energy and time required for this recipe */}
                        <div className='col-6'>
                            <h6>Energy Required</h6>
                            <p>{currentRecipe?.energyRequired}</p>
                            <h6>Time Required</h6>
                            <p>{currentRecipe?.timeRequired}</p>
                        </div>
                    </Row>
                    <Row>
                        {/* recipe tags */}
                        <h6>Tags</h6>
                        <p>{currentRecipe?.tags?.join(", ")}</p>
                    </Row>

                    <Row>
                        {/* recipe ingredients */}
                        <h6>Ingredients</h6>
                        <OutOfIngredients databaseCatGL={props.databaseCat
                        }
                            auth={props.auth}></OutOfIngredients>
                        <ul>{recipeIngredients}</ul>
                        
                    </Row>

                    <Row>
                        {/* recipes steps */}
                        <h6>Steps</h6>
                        <ol>{recipeSteps}</ol>
                    </Row>

                    <Row>
                        {/* recipe notes */}
                        <h6>Notes</h6>
                    </Row>
                    
                </Container>
                <p>{currentRecipe?.notes}</p>
              </Modal.Body>
          </Modal>
          <EditRecipePopup recipes={props.recipes} setRecipes={props.setRecipes} showEditPopup={showEditPopup} handleCloseEditPopup={handleCloseEditPopup} setInputs={setInputs} inputs={inputs} indexOfRecipeToEdit={indexOfRecipeToEdit}></EditRecipePopup>

      </>
      
  )
}
