
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import ViewRecipePopup from './ViewRecipe'
import RecipeCards from '../RecipeCards'


export default function ChooseRecipe(props) {

const handleSubmit = () => console.log("hi")
console.log(props.showRecipeModal)

return (<Modal show={props.showRecipeModal} onHide={()=>props.setShowRecipeModal(false)}>
                
                {/* modal header with title and close button */}
                <Modal.Header closeButton>
                    <Modal.Title>Select a Recipe</Modal.Title>
                </Modal.Header>
                
                {/* modal body with form */}
                <Modal.Body>
                  <div className="recipe-cards">
                    <RecipeCards recipes={props.recipes} setRecipes={props.setRecipes} showPopup={props.showRecipeModal} setShowPopup={props.setShowRecipeModal} addedRecipe={props.addedRecipe} setAddedRecipe={props.setAddedRecipe} view={false} />
                  </div>
                </Modal.Body>
                
                {/* footer with submit button */}
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        
      )
  }