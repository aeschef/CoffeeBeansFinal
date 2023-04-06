
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "./recipes.css";
import ViewRecipePopup from './modals/ViewRecipe'

export default function RecipeCards(props) {
  console.log(props.recipes)
  // variables and functions for View Recipe popup
  const [showPopup, setShowPopup] = useState(false);
  const [indexOfRecipeToView, setIndexOfRecipeToView] = useState(0);
   
  const handleOpenViewPopup = (index) => {
      setIndexOfRecipeToView(index);
      setShowPopup(true);
  }

  const handleCloseViewPopup = () => setShowPopup(false);

  const handleClick = (index) => {
    if (props.view === true) {
      handleOpenViewPopup(index)
    } else  {
      props.setAddedRecipe(index)
      props.setShowPopup(false)
    }
  }

  return (
      <div>
      {props.recipes.map((recipe, index) => (
        
        <div className='row pe-auto' id='recipe-card' onClick={()=>handleClick(index)} key={index}>
            <div className='col-6' id='image'>{recipe.picture}</div>
            <div className='col-6' id='recipe-info'>
                <h4>{recipe.title}</h4>
                <div className='row'>
                    <div className='col-6'>{recipe.energyRequired}</div>
                    <div className='col-6'>{recipe.timeRequired}</div>
                </div>
                <p className='tags'>{recipe.tags?.join(", ")}</p>
            </div>
        </div>
      ))}
      {props.view && <ViewRecipePopup recipes={props.recipes} showViewPopup={showPopup} handleCloseViewPopup={handleCloseViewPopup} indexOfRecipeToView={indexOfRecipeToView} setRecipes={props.setRecipes} groceryList={props.groceryList} addToGL={props.addToGL}> </ViewRecipePopup>}

      </div>
  )
}