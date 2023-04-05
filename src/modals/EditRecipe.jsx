import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";

// popup for editing a recipe
export default function EditRecipePopup(props) {

  // handler for change to a form element (https://www.w3schools.com/react/react_forms.asp)
  const handleChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      props.setInputs(values => ({...values, [name]: value}))
  }

  const handleSubmit = () => { // indexOfRecipeToEdit is correct here
      const nextRecipes = props.recipes;
      nextRecipes[props.indexOfRecipeToEdit] = props.inputs;
      props.setRecipes(nextRecipes);
      props.handleCloseEditPopup();
  }

  return (
      <>
          {/* edit popup modal */}
          <Modal show={props.showEditPopup} onHide={props.handleCloseEditPopup}>
              
              {/* modal header with title and close button */}
              <Modal.Header closeButton>
                  <Modal.Title>Edit Recipe</Modal.Title>
              </Modal.Header>
              
              {/* modal body with recipe details */}
              <Modal.Body>
                  <Form.Group className="recipe-input">
                      
                      {/* picture input */}
                      <Form.Label>Picture:</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="picture"
                          value={props.inputs?.picture || ""}
                          onChange={handleChange}
                      />
                      {/* TODO: turn back to actual photo upload
                      <button>Upload new picture</button>
                      <br></br> */}

                      {/* title input */}
                      <Form.Label>Title:</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="title"
                          value={props.inputs?.title || ""}
                          onChange={handleChange}
                      />

                      {/* energy input */}
                      <Form.Label>Energy Required:</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="energyRequired"
                          value={props.inputs?.energyRequired || ""}
                          onChange={handleChange}
                      />
                      {/* TODO: change back to dropdown
                          <Dropdown>
                          <Dropdown.Toggle variant="success" id="dropdown-basic">
                              Old Energy Level
                          </Dropdown.Toggle>   
                          <Dropdown.Menu>
                              <Dropdown.Item href="#/action-1">Energy Level 1</Dropdown.Item>
                              <Dropdown.Item href="#/action-2">Energy Level 2</Dropdown.Item>
                              <Dropdown.Item href="#/action-3">Energy Level 3</Dropdown.Item>
                              <Dropdown.Item href="#/action-4">Energy Level 4</Dropdown.Item>
                              <Dropdown.Item href="#/action-5">Energy Level 5</Dropdown.Item>
                          </Dropdown.Menu>
                      </Dropdown>  */}
                      
                      {/* time input */}
                      <Form.Label>Time Required:</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="timeRequired"
                          value={props.inputs?.timeRequired || ""}
                          onChange={handleChange}
                      />

                      {/* tags input */}
                      <Form.Label>Tags:</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="tags"
                          value={props.inputs?.tags || ""}
                          onChange={handleChange}
                      />

                      {/* tags input */}
                      <Form.Label>Ingredients:</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="ingredients"
                          value={props.inputs?.ingredients || ""}
                          onChange={handleChange}
                      />

                      {/* steps input */}
                      <Form.Label>Steps:</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="steps"
                          value={props.inputs?.steps || ""}
                          onChange={handleChange}
                      />

                      {/* notes input */}
                      <Form.Label>Notes:</Form.Label>
                      <Form.Control 
                          type="text" 
                          name="notes"
                          value={props.inputs?.notes || ""}
                          onChange={handleChange}
                      />
                  </Form.Group>
              </Modal.Body>
              
              {/* modal footer with submit button */}
              <Modal.Footer>
                  <Button variant="primary" type="submit" onClick={handleSubmit}>
                      Submit
                  </Button>
              </Modal.Footer>
          </Modal>
      </>
  )
}
