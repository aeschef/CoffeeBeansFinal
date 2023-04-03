import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'


const CreateMeal = ({ open, onClose, quota, setQuota, newMeal, setNewMeal, addedMeal, setAddedMeal, meal_category, setMealCategory, meal, setMeal }) => {
  
  // Saves category selected when planning a meal
  const [selectedCategory, setCategory] = useState(quota[0].id)

  // Saves the day selected when planning a meal
  const [selectedDay, setDay] = useState("Monday")

  const [mealDetails, setMealDetails] = useState("")



  const [tab, setTab] = useState(0)
  // Days of the week used for tag names
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  useEffect(()=> {
    console.log(selectedDay)
  }, [selectedDay])

  if (!open) return null

  const handleNewMeal = async (e) => {
    e.preventDefault()
    console.log(mealDetails)
    console.log(selectedDay)
    console.log(selectedCategory)
    // TODO: Check for any errors
    const allErrors = {}
    if (mealDetails === null || selectedCategory === null || selectedDay === null) {
      console.log("error creating meal")
      return null
    }
    else {
      setAddedMeal({id: selectedCategory, day:selectedDay, description: mealDetails})
      console.log("added meal")
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
            <Form.Select 
              aria-label="Default select example" 
              as="select"
              value={selectedCategory}
              onChange={e => {
                console.log("e.target.value", e.target.value);
                setCategory(e.target.value);
              }}
                >
                {quota.map(option => (
                      <option
                        value={option.id}>
                        {option.id}
                      </option>
                    ))}
            </Form.Select>
            
            <Form.Label>Day</Form.Label>
            <Form.Select 
              aria-label="Default select example" 
              as="select"
              value={selectedDay}
              onChange={e => {
                console.log("e.target.value", e.target.value);
                setDay(e.target.value);
              }}
                
              >
                {days.map(day => (
                      <option
                        value={day}>
                        {day}
                      </option>
                    ))}
                <option value="None">None</option>
            </Form.Select>

              <Form.Label>Meal Details</Form.Label>
              <Col>
              <Button variant="secondary" onClick={()=>setTab(1)}>Create Meal from Ingredients</Button></Col>
              <Col><Button variant="secondary" onClick={()=>setTab(2)}>Choose Meal from Recipes</Button></Col>

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

        {tab === 1 && 
        
          
          <Form.Control
          size="sm"
          type="text"
          placeholder="Enter ingredients"
          autoFocus
          onChange={(e) => setMealDetails(e.target.value)}
          value={mealDetails}
        />
        
        }


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