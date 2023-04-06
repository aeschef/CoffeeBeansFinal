import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'

const EditMealCategory = ({ open, onClose, quotaIndex, prevQuota, setQuota}) => {
    const [mealQuota, setMealQuota] = useState(prevQuota[quotaIndex].quota)

    // Stores previous category name for the category being edited
    const [mealCategory, updateMealCategory] = useState(prevQuota[quotaIndex].id)

  
    const updateMeal = () => {
    // TODO:  ERROR CHECKING - Check if category name already exists
    // TODO: Make sure that quota amount is an integer and is greater than or equal to 0
      
     // 1. Make a shallow copy of the items
     let quotas= [...prevQuota];
      

     // 2. Make a shallow copy of the item you want to mutate
     let item = {...quotas[quotaIndex]};

    // 3. Replace the property you're intested in
    item.quota = mealQuota
    item.id = mealCategory
    
    // 4. Put it back into our array. N.B. we *are* mutating the array here, 
    // but that's why we made a copy first
    quotas[quotaIndex] = item;
    console.log(quotas)
    
    // 5. Set the state to our new copy
    setQuota(quotas)
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