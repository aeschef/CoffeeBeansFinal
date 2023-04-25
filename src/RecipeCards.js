
import React, { useState } from 'react';
import "./recipes.css";
import ViewRecipePopup from './modals/ViewRecipe'

export default function RecipeCards(props) {
  
  // TODO: add a "no recipes to show" message if needed
  
  // variables and functions for View Recipe popup
  const [showPopup, setShowPopup] = useState(false);
  const [indexOfRecipeToView, setIndexOfRecipeToView] = useState(0);
  

  // dummy state variable that needs to be passed as parameter but isn't used
  const [currentMealDetails, setCurrentMealDetails] = useState([])

  // Sets the needed information in order to open the view recipe modal of the selected recipe
  const handleOpenViewPopup = (index) => {
      console.log("key of recipe " + index)
      setIndexOfRecipeToView(index);
      setShowPopup(true);
  }

  const handleCloseViewPopup = () => setShowPopup(false);

  // When user clicks a recipe, this handler determines the action that should be taken next.
  const handleClick = (index) => {
    
    // If view is true, this means that the view modal of the recipe should be displayed
    if (props.view === true) {
      handleOpenViewPopup(index)

    // Otherwise, if view is false, this means that the recipe is just selected to be added to the meal plan.
    // And therefore its index is being saved.
    } else  {
      // If the user had alreayd selected the recipe but clicked it again, the recipe will be deselected.
      if (props.addedRecipe === index ) {
        props.setAddedRecipe(-1)
      
      // Otherwise, added recipe will be set to store the key of the selected recipe
      } else {
        props.setAddedRecipe(index)

        // Sets custom to false to no longer select the custom meal option
        props.setCustom(false)
      }     
    }
  }
  {/* If the recipes are being shown on the meal plan page, the selected recipe will appear green. */}

  return (
      <div>
      {props.recipes.
        filter((recipe) => (recipe.title?.toLowerCase().match(props.searchInput.toLowerCase().trim()) || recipe.ingredients?.join(", ").toLowerCase().match(props.searchInput.toLowerCase().trim()))).
        sort(props.sortFunction).
        filter((recipe) => props.shouldBeShown(recipe)).
        map((recipe, index) => (
        <div className={props.addedRecipe === recipe.key ? "row pe-auto chosenRecipe" : "row pe-auto recipe-card"} id = "card_background" onClick={()=>handleClick(recipe.key)} key={index}>
            <div className='col-6' id='image'>{recipe.picture}</div>
            <div className='col-6' id='recipe-info'>
                <h4>{recipe.title}</h4>
                <div className='row'>
                    <div className='col-6'>{recipe.energyRequired + " Energy"}</div>
                    <div className='col-6'>
                      {recipe.hoursRequired !== "0" ? recipe.hoursRequired + " hours " : ""}{recipe.minsRequired !== "0" ? recipe.minsRequired + " mins" : ""}
                    </div>
                </div>
                <p className='tags'>{recipe.tags?.join(", ")}</p>
            </div>
        </div>
      ))}
      {props.view && <ViewRecipePopup app={props.app} recipes={props.recipes} 
      currentMealDetails={currentMealDetails} setCurrentMealDetails={setCurrentMealDetails}
      showViewPopup={showPopup} handleCloseViewPopup={handleCloseViewPopup} indexOfRecipeToView={indexOfRecipeToView}
       setRecipes={props.setRecipes} groceryList={props.groceryList} addToGL={props.addToGL}> </ViewRecipePopup>}

      </div>
  )
}