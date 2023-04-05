
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "./recipes.css";
import ViewRecipePopup from './modals/ViewRecipe'

export default function RecipeCards(props) {

  // variables and functions for View Recipe popup
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [indexOfRecipeToView, setIndexOfRecipeToView] = useState(0);
  const handleOpenViewPopup = (index) => {
      setIndexOfRecipeToView(index);
      setShowViewPopup(true);
  }
  const handleCloseViewPopup = () => setShowViewPopup(false);

  return (
      <div>
      {props.recipes.map((recipe, index) => (
        
        <div className='row' id='recipe-card' onClick={() => handleOpenViewPopup(index)} key={index}>
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
      <ViewRecipePopup recipes={props.recipes} showViewPopup={showViewPopup} handleCloseViewPopup={handleCloseViewPopup} indexOfRecipeToView={indexOfRecipeToView} setRecipes={props.setRecipes}> </ViewRecipePopup>

      </div>
  )
}