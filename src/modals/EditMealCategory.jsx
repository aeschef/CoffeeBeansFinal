import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'
import { getDatabase, ref, set, onValue} from 'firebase/database';
import {getAuth} from "firebase/auth";
import DeleteMealCategoryPopup from './DeleteMealCategoryPopup';

// Modal that appears when user wants to edit category's information
const EditMealCategory = ({ open, onClose, categoryIndex, categories, setCategories, refresh, setRefresh}) => {
    const [mealQuota, setMealQuota] = useState(categories[categoryIndex].quota)

    // Stores previous category name for the category being edited
    const [mealCategory, updateMealCategory] = useState(categories[categoryIndex].key)

    const [categoriesList, setCategoriesList] = useState([])

    // State variable that indicates when warning should appear if user tries deleting category
    const [deleteCategoryPopup, setDeleteCategoryPopup] = useState(false)
  
    // Error if category name is empty
    const [categoryError, setCategoryError] = useState(false)

    // Will update the quota array to contain the category with the updated category name and quota amount
    const updateMeal = () => {
      const db = getDatabase()
      console.log("category here" + categories[categoryIndex].key)
      const oldMealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/" + categories[categoryIndex].key)
      if (mealCategory === "") {
        setCategoryError(true)
      } else {
        setCategoryError(false)
      
        // copy information from old category to new category and delete old category
        if (mealCategory !== categories[categoryIndex].key) {

          // Checks to see if newly selected category already exists
          // let categoryIndex = -1
          // for(var i = 0 ; i < categories.length ; i++){
          //   console.log(categories[i])
          //   if (categories[i].key == mealCategory) {
          //     categoryIndex = i
          //   }
          // }
          let copyData = {}
          console.log("category before removing " + categories[categoryIndex].key)
          console.log(mealCategory)
          onValue(ref(db, '/users/' +  getAuth().currentUser.uid + "/meal_plan/categories/" + categories[categoryIndex].key), (snapshot) => {
            copyData = snapshot.val()
          
          }, {
            onlyOnce: true
          });
    
          // If the category already exists in database, do not add it again. 
          // if (categoryIndex !== -1) {
          //   console.log("should not add the category since it already exists")

          // // If the category does not exist in database, add it.
          // } else {
              // Creates basic structure for new category
    
              const categoryRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+mealCategory)
              set(categoryRef, copyData);     
            
              // Removes the reference from the old category
              set(oldMealRef, null)

              // Indicates that state variable should be refreshed
              setRefresh(true)
          
        // If the category did not change, just update old category's quota amount
        } else {
          set(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/" + categories[categoryIndex].key + "/quota"), 
          mealQuota);

          setRefresh(true)
          
        }
        onClose(false)

    }
      // Closes the edit category modal
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
              {categoryError && <div className="error-box">
                The category name cannot be empty.
                </div>}

              {/* Displays the category name and allows user to edit. */}

              <Form.Control
                size="sm"
                type="text"
                placeholder=""
                autoFocus
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

   
        <Modal.Footer className="d-flex justify-content-between fixed">
        {/* Buttons that allow user to delete meal or update  */}
          <>
            <Button variant="primary" onClick={()=>setDeleteCategoryPopup(true)}>
              Delete category
            </Button>
            <Button variant="primary" onClick={updateMeal}>
              Update category
            </Button>
          </>
        </Modal.Footer>
      </Modal>
      {deleteCategoryPopup && <DeleteMealCategoryPopup 
        openEdit={open} closeEdit={onClose} 
        open={deleteCategoryPopup} setOpen={setDeleteCategoryPopup} 
        refresh={refresh} setRefresh={setRefresh} 
        category={categories[categoryIndex].key}/>} 
    </>
    )

}

export default EditMealCategory