import React, { useState } from 'react';
import "../recipes.css";
import EditRecipePopup from './EditRecipe'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/DropDown';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, remove } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

import HandleAddtoMealPlan from './MealComplete';

// popup for viewing a recipe
export default function ViewRecipePopup(props) {
  
  // variables and functions for Edit Recipe popup
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [inputs, setInputs] = useState(null); // these are what show up in the inputs originally
  const [indexOfRecipeToEdit, setIndexOfRecipeToEdit] = useState(props.indexOfRecipeToView);
  const [tagsInStringForm, setTagsInStringForm] = useState("");
  const [ingredientsInStringForm, setIngredientsInStringForm] = useState("");
  const [stepsInStringForm, setStepsInStringForm] = useState("");
  const handleOpenEditPopup = (index) => {
      setIndexOfRecipeToEdit(index);
      setInputs(props.recipes[index]);
      setShowEditPopup(true);
      setTagsInStringForm(props.recipes[index].tags?.join(", ") || null);
      setIngredientsInStringForm(props.recipes[index].ingredients.map((ingredient) => ingredient.phrase).join("\n"));
      setStepsInStringForm(props.recipes[index].steps?.join("\n"));
  }
  const handleCloseEditPopup = () => setShowEditPopup(false);

  // saving a reference to the current recipe being viewed
  const currentRecipe = props.recipes[props.indexOfRecipeToView];

  const recipeIngredients = currentRecipe?.ingredients?.map(
          (ingredient, index) => <li key={index}>{ingredient.phrase.replaceAll("\"", "")}</li>);

  const recipeSteps = currentRecipe?.steps?.map(
          (step, index) => <li key={index}>{step}</li>);

  return (
    
      <>
          {/* view popup modal */}
          <Modal show={props.showViewPopup} onHide={props.handleCloseViewPopup}>
              
              {/* modal header with title, edit button, and close button */}
              <Modal.Header closeButton>
                  <Modal.Title>{currentRecipe?.title}</Modal.Title>
                  <button onClick={() => handleOpenEditPopup(props.indexOfRecipeToView)}>Edit</button>
              </Modal.Header>
              
              {/* modal body with recipe info - NEXT */}
              <Modal.Body>
                  <div className="row">
                      
                      {/* recipe image */}
                      <div className='col-6'>
                          <div id="image">{currentRecipe?.picture}</div>
                      </div>
                      
                      {/* energy and time required for this recipe */}
                      <div className='col-6'>
                          <h6>Energy Required</h6>
                          <p>{currentRecipe?.energyRequired !== "" ? currentRecipe?.energyRequired + " Energy" : ""}</p>
                          <h6>Time Required</h6>
                          <p>{currentRecipe?.hoursRequired !== "0" ? currentRecipe?.hoursRequired + " hours " : ""}{currentRecipe?.minsRequired !== "0" ? currentRecipe?.minsRequired + " mins" : ""}</p>
                      </div>
                  </div>

                  {/* recipe tags */}
                  <h6>Tags</h6>
                  <p>{currentRecipe?.tags?.join(", ")}</p>
                  
                  {/* recipe ingredients */}
                  <h6>Ingredients</h6>
                  <ul>{recipeIngredients}</ul>
                  
                  {/* recipes steps */}
                  <h6>Steps</h6>
                  <ol>{recipeSteps}</ol>
                  
                  {/* recipe notes */}
                  <h6>Notes</h6>
                  <p id="notes">{currentRecipe?.notes}</p>

                  <HandleAddtoMealPlan databaseCatGL={props.databaseCatGL}
                        auth={props.auth} recipeTitle={currentRecipe?.title}
                        app={props.app} 
                        recipes={props.recipes}
                        index={props.indexOfRecipeToView}
                        ></HandleAddtoMealPlan>
              </Modal.Body>
          </Modal>
          <EditRecipePopup app={props.app} recipes={props.recipes} setRecipes={props.setRecipes} showEditPopup={showEditPopup} handleCloseEditPopup={handleCloseEditPopup} setInputs={setInputs} inputs={inputs} indexOfRecipeToEdit={indexOfRecipeToEdit} tagsInStringForm={tagsInStringForm} setTagsInStringForm={setTagsInStringForm} ingredientsInStringForm={ingredientsInStringForm} setIngredientsInStringForm={setIngredientsInStringForm} stepsInStringForm={stepsInStringForm} setStepsInStringForm={setStepsInStringForm}></EditRecipePopup>

      </>
      
  )
}
