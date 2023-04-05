import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'


const EditMeal = ({ open, onClose, quota, setQuota, currentCategoryIndex, currentMealDetails, currentMealIndex}) => {
  
  // Saves category selected when planning a meal
  console.log("category" + quota)
  console.log("meal details" + currentMealDetails.day)
  console.log("meal details" + currentMealDetails.id)
  console.log("meal details" + quota[currentCategoryIndex].id)


  const [selectedCategory, setCategory] = useState(quota[currentCategoryIndex].id)

  // Saves the day selected when planning a meal
  const [selectedDay, setDay] = useState(currentMealDetails.day)
  
  const [categoryChanged, setCategoryChanged] = useState(false)
  const [tagChanged, setTagChanged] = useState(false)
  const [mealDetailsChanged, setMealDetailsChanged] = useState(false)


  const [newMeal, setNewMeal] = useState(false)

  const [mealDetails, setMealDetails] = useState(currentMealDetails.id)
  const [updatedMeal, setUpdatedMeal] = useState(null)


  // Days of the week used for tag names
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  function addNewMeal(categoryIndex) {
    // TODO:  ERROR CHECKING - Check if category name already exists
    // TODO: Make sure that quota amount is an integer and is greater than or equal to 0
    let quotas= [...quota];

     // 1. Make a shallow copy of the items
     if (categoryChanged) {
        
      // Updates previous category so that it removes the meal from its list of items
      let categoryList = {...quotas[currentCategoryIndex]}
      
      let oldItems = categoryList.items

      let newCategoryList = [
        ...oldItems.slice(0, currentMealIndex),
        ...oldItems.slice(currentMealIndex + 1)
      ]

      categoryList.items = newCategoryList

      quotas[currentCategoryIndex] = categoryList

      // 2. Make a shallow copy of the item you want to mutate
      let item = {...quotas[categoryIndex]};

      // 3. Update the current category's array of meals so that it stores the new meal
      
      let copyMeals = [...item.items, 
        {value:updatedMeal.description, label:updatedMeal.description, day:updatedMeal.day}]

      item.items = copyMeals

      console.log(item.items)

      // 4. Put it back into our array. N.B. we *are* mutating the array here, 
      // but that's why we made a copy first
      quotas[categoryIndex] = item;
      console.log(quotas)
      
      // 5. Set the state to our new copy
      setQuota(quotas)
    }
    else if (tagChanged || mealDetailsChanged) {

      // 2. Make a shallow copy of the item you want to mutate
      let prevCategoryInfo = {...quotas[currentCategoryIndex]};

      let oldItems = prevCategoryInfo.items

      
      let newCategoryList = [
        ...oldItems.slice(0, currentMealIndex), {value:updatedMeal.description, label:updatedMeal.description, day:updatedMeal.day}, 
        ...oldItems.slice(currentMealIndex + 1)
      ]

      // 3. Update the current category's array of meals so that it stores the meal with updated information
      prevCategoryInfo.items = newCategoryList

      // 4. Put it back into our array. N.B. we *are* mutating the array here, 
      // but that's why we made a copy first
      quotas[categoryIndex] = prevCategoryInfo;
      console.log(quotas)
      
      // 5. Set the state to our new copy
      setQuota(quotas)
    }
    onClose(false)
  }

  // Keeps track if user changed tag. 
  useEffect(()=> {
    console.log(selectedDay)
    if (selectedDay !== currentMealDetails.day) {
      setTagChanged(true)
    } else {
      setTagChanged(false)
    }
  }, [selectedDay])


  // Keeps track if user changes the meal category
  useEffect(()=> {
    if (selectedCategory !== quota[currentCategoryIndex].id) {
      setCategoryChanged(true)
    } else {
      setCategoryChanged(false)
    }
  }, [selectedCategory])


  // Keeps track if user changed meal description
  useEffect(()=> {
    if (mealDetails !== currentMealDetails.description) {
      setMealDetailsChanged(true)
    } else {
      setMealDetailsChanged(false)
    }
  }, [mealDetails])

  useEffect(()=> {
    if (newMeal) {
      console.log(updatedMeal)
      // If meal category is the first in the categories list, adds meal to breakfast state array
      if (updatedMeal.id === quota[0].id) {
        addNewMeal(0)
      
      // If meal category is lunch, adds meal to the lunch state array
      } else if (updatedMeal.id  === quota[1].id) {
        addNewMeal(1)
      // If meal category is dinner, adds meal to the dinner state array
      } else if (updatedMeal.id  === quota[2].id) {
        addNewMeal(2)
      }
      setNewMeal(false)
    }

  }, [newMeal])

  if (!open) return null

  const handleUpdate = async (e) => {
    e.preventDefault()
    console.log(mealDetails)
    console.log(selectedDay)
    console.log(selectedCategory)

    if (categoryChanged || tagChanged || mealDetailsChanged) {
      setUpdatedMeal({id: selectedCategory, day:selectedDay, description: mealDetails, type: currentMealDetails.type})
      console.log("added meal")
      setNewMeal(true)
    }
    else {
      onClose(false)
    }

  }



  return (



    <>

    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Meal</Modal.Title>
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
                        key={day}
                        value={day}>
                        {day}
                      </option>
                    ))}
                <option value="None">None</option>
            </Form.Select>

              <Form.Label>Meal Details</Form.Label>
              
          </Form.Group>
        </Form> 

        {currentMealDetails.type === "Ingredients" && 
        
          
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
        
        <Button variant="primary" onClick={handleUpdate}>
          Update meal
        </Button>
      </Modal.Footer>
    </Modal>
  </>
  )
}

export default EditMeal