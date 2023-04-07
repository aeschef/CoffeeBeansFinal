import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'

// Modal that appears when user wants to edit category's information
const EditMealCategory = ({ open, onClose, quotaIndex, prevQuota, setQuota}) => {
    const [mealQuota, setMealQuota] = useState(prevQuota[quotaIndex].quota)

    // Stores previous category name for the category being edited
    const [mealCategory, updateMealCategory] = useState(prevQuota[quotaIndex].id)
  
    // Will update the quota array to contain the category with the updated category name and quota amount
    const updateMeal = () => {
    // TODO:  ERROR CHECKING - Check if category name already exists
    // TODO: Make sure that quota amount is an integer and is greater than or equal to 0
      
    // Makes shallow copy of array of categories
    let quotas= [...prevQuota];
      
    // Make a shallow copy of the category whose info we need to change
    let item = {...quotas[quotaIndex]};

    // Update category name and quota
    item.quota = mealQuota
    item.id = mealCategory
    
    // Add the category back into the copy of the quotas
    quotas[quotaIndex] = item;
    console.log(quotas)
    
    // Update state variable so that it stores the copy
    setQuota(quotas)

    // Closes the edit category modal
    onClose(false)
    }

    const handleQuotaChange = (newQuota) => {
      setMealQuota(newQuota)

    }

    return (
      <>
      <Modal show={open} onHide={()=>onClose(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Category</Form.Label>
              
              {/* Displays the category name and allows user to edit. */}

              <Form.Control
                size="sm"
                type="text"
                placeholder=""
                autoFocus
              
                required
                onChange={(e)=>updateMealCategory(e.target.value)}
                value={mealCategory}
              />
              <Form.Label>Quota</Form.Label>
              
              {/* Displays the quota amount and allows user to edit. */}
              <Form.Control
              size="sm"
              type="text"
              placeholder=""
              autoFocus
              onChange={(e) => handleQuotaChange(e.target.value)}
              value={mealQuota}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={updateMeal}>
            Update category
          </Button>
        </Modal.Footer>
      </Modal>
    </>
      
    )

}

export default EditMealCategory