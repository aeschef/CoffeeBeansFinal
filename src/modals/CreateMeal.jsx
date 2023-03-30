import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
// Ref to firebase reports collection
const categories = ["breakfast", "lunch", "dinner"]


const CreateMeal = ({ open, onClose, newMeal, setNewMeal, meal_category, setMealCategory, meal, setMeal }) => {
    if (!open) return null

    const handleNewMeal = async (e) => {
      e.preventDefault()
      // TODO: Check for any errors
      const allErrors = {}
      if (meal === null || meal_category === "") {
        console.log("error creating meal")
        return null
      }
      else {
        setNewMeal(true)
      }
    }
    return (



      <>

      <Modal show={open} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Meal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Category</Form.Label>
              <Form.Control
                size="sm"
                type="text"
                placeholder=""
                autoFocus
                onChange={(e)=>setMealCategory(e.target.value)}
                value={meal_category}
              />
                <Form.Label>Meal</Form.Label>
                <Col>
                <Button variant="secondary" onClick={onClose}>Choose Meal from Ingredients</Button></Col>
                <Col><Button variant="secondary" onClick={onClose}>Choose Meal from Recipes</Button></Col>

                <Form.Control
                size="sm"
                type="text"
                placeholder=""
                autoFocus
                onChange={(e) => setMeal(e.target.value)}
                value={meal}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
         
          <Button variant="primary" onClick={handleNewMeal}>
            Add meal
          </Button>
        </Modal.Footer>
      </Modal>
    </>

    )

}

export default CreateMeal