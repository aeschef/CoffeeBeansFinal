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
  function addNewMeal(categoryIndex) {
    // TODO:  ERROR CHECKING - Check if category name already exists
    // TODO: Make sure that quota amount is an integer and is greater than or equal to 0
      
     // 1. Make a shallow copy of the items
     let quotas= [...quota];
      

     // 2. Make a shallow copy of the item you want to mutate
     let item = {...quotas[categoryIndex]};

    // 3. Update the current category's array of meals so that it stores the new meal
    
    let copyMeals = [...item.items, 
      {value:addedMeal.description, label:addedMeal.description, day:addedMeal.day}]
    item.items = copyMeals

    console.log(item.items)

    // 4. Put it back into our array. N.B. we *are* mutating the array here, 
    // but that's why we made a copy first
    quotas[categoryIndex] = item;
    console.log(quotas)
    
    // 5. Set the state to our new copy
    setQuota(quotas)
  }
  useEffect(()=> {
    console.log(selectedDay)
  }, [selectedDay])

  useEffect(()=> {
    if (newMeal) {
      console.log(addedMeal)
      // If meal category is the first in the categories list, adds meal to breakfast state array
      if (addedMeal.id === quota[0].id) {
        addNewMeal(0)
      
      // If meal category is lunch, adds meal to the lunch state array
      } else if (addedMeal.id  === quota[1].id) {
        addNewMeal(1)
      // If meal category is dinner, adds meal to the dinner state array
      } else if (addedMeal[0].id  === quota[2].id) {
        addNewMeal(2)
      }
      setNewMeal(false)
    }

  }, [newMeal])

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
          <Form.Group className="mb-3">
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