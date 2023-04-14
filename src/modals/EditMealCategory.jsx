import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'
import { getDatabase, ref, set, onValue, push, remove} from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


// Modal that appears when user wants to edit category's information
const EditMealCategory = ({ open, onClose, categoryIndex, categories, setCategories}) => {
    const [mealQuota, setMealQuota] = useState(categories[categoryIndex].quota)

    // Stores previous category name for the category being edited
    const [mealCategory, updateMealCategory] = useState(categories[categoryIndex].key)
  
    // Will update the quota array to contain the category with the updated category name and quota amount
    const updateMeal = () => {
    // TODO:  ERROR CHECKING - Check if category name already exists
    const db = getDatabase()

    // // Reference to categories in the meal plan
     set(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/" + categories[categoryIndex].key + "/quota"), 
         mealQuota
      );
    // update existing collection if category name didn't change
    if (mealCategory !== categories[categoryIndex].key) {
      const oldCategory = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/" + categories[categoryIndex].key)
      onValue(oldCategory, (snapshot) => { 
        console.log("snapshot will be here")
        console.log(snapshot.val())

       // Adds new category for new category
       set(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/" + mealCategory), 
        snapshot.val()
       );
      })

      const parent = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories")
      remove(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+categories[categoryIndex].key))

      // // Reference to categories in the meal plan
      // set(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/" + mealCategory + "/quota"), {
      //     mealQuota
      //   });
         
    }

    // 

    // TODO: Make sure that quota amount is an integer and is greater than or equal to 0
    // Makes shallow copy of array of categories
    let updatedCategories= [...categories];
      
    // Make a shallow copy of the category whose info we need to change
    let item = {...updatedCategories[categoryIndex]};

    // Update category name and quota
    item.quota = mealQuota
    item.key = mealCategory
    
    // Add the category back into the copy of the quotas
    updatedCategories[categoryIndex] = item;
    console.log(updatedCategories)
    
    // Update state variable so that it stores the copy
    setCategories(updatedCategories)
    

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