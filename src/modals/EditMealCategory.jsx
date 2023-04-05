import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'

const EditMealCategory = ({ open, onClose, prevMealCategory, quota, setQuota }) => {
    const [mealQuota, setMealQuota] = useState(0)
    const [mealCategory, updateMealCategory] = useState(prevMealCategory)
    useEffect(()=>{
      quota.map((item) => {
        if (item.id === mealCategory) {
          setMealQuota(item.quota)
        }})
      }, [])
  
    if (!open) return null
    


    const updateMeal = () => {
     // 1. Make a shallow copy of the items
     let quotas= [...quota];
      

     // 2. Make a shallow copy of the item you want to mutate
     
     let index = 0
     if (mealCategory===quotas[0].id)
       index = 0
     else if (mealCategory === quotas[1].id)
       index = 1
     else if (mealCategory === quotas[2].id)
       index = 2
     
     let item = {...quotas[index]};

     // 3. Replace the property you're intested in
      item.quota = mealQuota
      item.id = mealCategory
      // 4. Put it back into our array. N.B. we *are* mutating the array here, 
     //    but that's why we made a copy first
     quotas[index] = item;
      console.log(quotas)
     // 5. Set the state to our new copy
     //setQuota(quotas)
    }

    const handleQuotaChange = (newQuota) => {
      setMealQuota(newQuota)
 
    
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