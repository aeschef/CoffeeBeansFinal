import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import EditRecipePopup from './EditRecipe'
import "../recipes.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/DropDown';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, remove } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import OutOfIngredients from './AlternateButton';
import CompleteRecipe from './CompleteRecipe';
import LowEnergyIcon from '../svg/low_energy.svg'
import MediumEnergyIcon from '../svg/medium_energy.svg'
import HighEnergyIcon from '../svg/high_energy.svg'
import TimeIcon from '../svg/time_icon.svg';

import HandleAddtoMealPlan from './MealComplete';

// popup for viewing a recipe
export default function ViewRecipePopup(props) {

  const energyIcons = [LowEnergyIcon, MediumEnergyIcon, HighEnergyIcon];
  const energyLevels = ["Low", "Medium", "High"];
  
  // variables and functions for Edit Recipe popup
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [inputs, setInputs] = useState(null); // these are what show up in the inputs originally
  const [images, setImages] = useState([]);

  // Contains the key value for the recipe
  const [keyOfRecipeToEdit, setKeyOfRecipeToEdit] = useState(props.keyOfRecipeToView);
  const [tagsInStringForm, setTagsInStringForm] = useState("");
  const [ingredientsInStringForm, setIngredientsInStringForm] = useState("");
  const [stepsInStringForm, setStepsInStringForm] = useState("");

  const handleOpenEditPopup = (key) => {
      // contains the key value for the recipe
      setKeyOfRecipeToEdit(key);

      setInputs(currentRecipe);
      setShowEditPopup(true);
      setTagsInStringForm(currentRecipe.tags?.join(", ") || null);
      setIngredientsInStringForm(currentRecipe.ingredients?.map((ingredient) => ingredient.phrase).join("\n"));
      setStepsInStringForm(currentRecipe.steps?.join("\n"));
      setImages([{"data_url": currentRecipe.picture}]);
  }
  const handleCloseEditPopup = () => setShowEditPopup(false);

  // TODO: megan's code starts here
  const [currentRecipe, setCurrentRecipe] =useState([])
  const [refresh, setRefresh] = useState(true)
  
  // Retrieves recipe information when the view modal is supposed to be shown
  useEffect(()=> {
    if ((props.showViewPopup && refresh)) {
      const db = getDatabase()
      console.log("index " + props.keyOfRecipeToView)
      const recipesRef = ref(db, 'users/' + getAuth().currentUser.uid + "/recipes/"+props.keyOfRecipeToView)
      let arrMeals = []

      // Stores all of the meal categories and pushes them to an array
      onValue(recipesRef, (snapshot) => {
        console.log("in on aalue")
        setCurrentRecipe(snapshot.val())
          
      },  {
        onlyOnce: true
      });
      setRefresh(false)

    // Ensures that recipe information will be updated when the view recipe popup is open again
    } else if (!props.showViewPopup) {
      setRefresh(true)
    }
  }, [props.showViewPopup, refresh])
  // TODO: megan's code ends here

// TODO: julia's code starts here
// TODO: before committing new code, pls double check that both meal plan and recipes RecipeCards work! thank youuu
//   // saving a reference to the current recipe being viewed
//   const [currentRecipe, setCurrentRecipe] = useState([])

//   useEffect(()=> {
//     let item = props.recipes.filter((recipe) => recipe.key === props.indexOfRecipeToView)
//     setCurrentRecipe(item)
//   }, [])
// TODO: julia's code ends here

  const recipeIngredients = currentRecipe?.ingredients?.map(
          (ingredient, index) => <li key={index}>{ingredient.phrase.replaceAll("\"", "")}</li>);

  const recipeSteps = currentRecipe?.steps?.map(
          (step, index) => <li key={index}>{step}</li>);

  return (
    
      <>
          {/* view popup modal */}
          <Modal show={props.showViewPopup} onHide={props.handleCloseViewPopup} fullscreen={true}>
              
              {/* modal header with title, edit button, and close button */}
              <Modal.Header closeButton>
                  <Modal.Title>{currentRecipe?.title}</Modal.Title>
                  <button onClick={() => handleOpenEditPopup(props.keyOfRecipeToView)}>Edit</button>
              </Modal.Header>
              
              {/* modal body with recipe info - NEXT */}
              <Modal.Body>
                  <div className="row">
                      
                      {/* recipe image */}
                      <div className='col-6' id='image'>
                      <img src={currentRecipe?.picture} id="recipe-image" alt=""/>            
                      </div>
                      
                      {/* energy and time required for this recipe */}
                      <div className='col-6' id='time-and-energy'>
                        <div className='row'>
                          <div className='col-3'>
                            <img class="energy-icon" src={energyIcons[energyLevels.indexOf(currentRecipe?.energyRequired)]}></img>
                          </div>
                          <div className='col-9'>
                            <p>{currentRecipe?.energyRequired !== "" ? currentRecipe?.energyRequired + " Energy" : ""}</p>
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-3'>
                            <img class="time-icon" src={TimeIcon}></img>
                          </div>
                          <div className='col-9'>
                            <p>{currentRecipe?.hoursRequired !== "0" ? currentRecipe?.hoursRequired + " hours " : ""}{currentRecipe?.minsRequired !== "0" ? currentRecipe?.minsRequired + " mins" : ""}</p>
                          </div>
                        </div>
                      </div>
                  </div>

                  {/* recipe tags */}
                  <h6>Tags</h6>
                  <p>{currentRecipe?.tags?.join(", ")}</p>
                  
                  {/* recipe ingredients */}
                  <h6>Ingredients</h6>

                  {/* !!!!! Option B for AB Testing */}
                  <OutOfIngredients auth={props.auth} 
                        recipeTitle={currentRecipe?.title}
                        app={props.app} 
                        recipes={props.recipes}
                        index={props.keyOfRecipeToView}
                        currentRecipe={currentRecipe}> </OutOfIngredients>

                  <ul>{recipeIngredients}</ul>
                  
                  {/* recipes steps */}
                  <h6>Steps</h6>
                  <ol>{recipeSteps}</ol>
                  
                  {/* recipe notes */}
                  <h6>Notes</h6>
                  <p id="notes">{currentRecipe?.notes}</p>

                {/* Completed the recipe... run out of anything? */}
                {/* !!!!!!!!!!! A8 option A !!!!!!!!!!!!!!*/}
                {/* <CompleteRecipe databaseCatGL={props.databaseCatGL}
                    auth={props.auth} 
                    recipeTitle={currentRecipe?.title}
                    app={props.app} 
                    recipes={props.recipes}
                    currentRecipe={currentRecipe}
                    index={props.indexOfRecipeToView}></CompleteRecipe> */}
                    
                  <HandleAddtoMealPlan databaseCatGL={props.databaseCatGL}
                        auth={props.auth} recipeTitle={currentRecipe?.title}
                        app={props.app} 
                        recipes={props.recipes}
                        index={props.keyOfRecipeToView}
                        currentRecipe={currentRecipe}

                  ></HandleAddtoMealPlan>
              </Modal.Body>
          </Modal>
          <EditRecipePopup app={props.app} 
          recipes={props.recipes} setRecipes={props.setRecipes} 
          showEditPopup={showEditPopup} handleCloseEditPopup={handleCloseEditPopup} 
          setInputs={setInputs} inputs={inputs} keyOfRecipeToEdit={keyOfRecipeToEdit} 
          tagsInStringForm={tagsInStringForm} setTagsInStringForm={setTagsInStringForm} 
          ingredientsInStringForm={ingredientsInStringForm} setIngredientsInStringForm={setIngredientsInStringForm} 
          stepsInStringForm={stepsInStringForm} setStepsInStringForm={setStepsInStringForm}
          handleCloseViewPopup={props.handleCloseViewPopup}
          refresh={refresh} setRefresh={setRefresh}
          images={images} setImages={setImages}></EditRecipePopup>

      </>
      
  )
}