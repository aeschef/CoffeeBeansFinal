import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import ViewRecipePopup from './ViewRecipe';
import RecipeCards from '../RecipeCards'
import TagsInput from '../TagsInput';
import Creatable from 'react-select/creatable';
import { getDatabase, ref, set, onValue, update, push, child} from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

// Modal that appears when a user selects a meal and presses the edit meal button. 
const EditMeal = ({ viewPopup, closeViewPopup, open, onClose, categories, setCategories, currentCategoryIndex, currentMealDetails, currentMealIndex, recipes, setRecipes,
  refresh, setRefresh,
  groceryList, addToGL}) => {
  const auth = getAuth()

  // Saves category selected when planning a meal, stored in format so that it can appear in dropdown
  const [selectedCategory, setCategory] = useState({label: currentCategoryIndex, value: currentCategoryIndex})

  // Saves the tags selected when planning a meal, has to be in right format so that it can populate in dropdown
  const [selectedTags, setSelectedTags] = useState({label: currentMealDetails.value.tags, value:currentMealDetails.value.tags})
  
  const [categoryChanged, setCategoryChanged] = useState(false)
  const [tagChanged, setTagChanged] = useState(false)

  // Determines when a meal's details were changed so we know to update it. 
  const [mealDetailsChanged, setMealDetailsChanged] = useState(false)

  // Stores notes information for meal ideas and determines when the user has changed the entry
  const [notes, setNotes] = useState(currentMealDetails.value.notes)
  const [notesChanged, setNotesChanged] = useState(false)

  const [newMeal, setNewMeal] = useState(false)

  // Set to true when the user wants to view the recipe or edit it. 
  const [viewRecipe, setViewRecipe] = useState(false)

  // Stores either the name of the meal if it is by ingredients or the index of the recipe. 
  const [mealDetails, setMealDetails] = useState(currentMealDetails.value.label)
  const [updatedMeal, setUpdatedMeal] = useState(null)

  // Days of the week used for tag names
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const [tags, setTags] = useState([])

  useEffect(()=> {
    const db = getDatabase()
    console.log(auth.currentUser.uid)
    
    // updates tags state variable so that it stores the saved tags from the user's database
    const tagRef = ref(db, 'users/' + auth.currentUser.uid + "/meal_plan/tags");
    
    // Updates state variable so that it stores the list of tags from database
    onValue(tagRef, (snapshot) => {
      const data = snapshot.val();
      console.log("data")
      console.log(data);
      setTags(data);
    }); 

  }, [])

  // Keeps track if user changed tag. 
  useEffect(()=> {
    console.log(selectedTags)
    if (selectedTags !== currentMealDetails.value.tags) {
      setTagChanged(true)
    } else {
      setTagChanged(false)
    }
  }, [selectedTags])


  // Keeps track if user changes the meal category, meaning that the meal needs to be inserted into another category's list of meals
  // and removed from old category's list
  useEffect(()=> {
    if (selectedCategory.label !== currentCategoryIndex) {
      setCategoryChanged(true)
    } else {
      setCategoryChanged(false)
    }
  }, [selectedCategory])


  // Keeps track when user changes the notes section for a meal idea so that we know to update its old entry in a meal category's list
  useEffect(()=> {
    if (notes && notes !== currentMealDetails.value.notes) {
      setNotesChanged(true)
    }
  }, [notes])



  // Keeps track if user changed meal description, meaning that it needs to be reinserted into the category's list of meals
  useEffect(()=> {
    if (mealDetails !== currentMealDetails.value.description) {
      setMealDetailsChanged(true)
    } else {
      setMealDetailsChanged(false)
    }
  }, [mealDetails])

  // Updates meal's information in the database
  useEffect(()=> {
    if (newMeal) {
      console.log(updatedMeal)
      const db = getDatabase()
      console.log("meal key" + currentMealDetails.key)
      const mealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+currentCategoryIndex+"/meals/"+currentMealDetails.key)
      
      const newMeal = {
        label:updatedMeal.description,
        tags:updatedMeal.tags,
        notes: updatedMeal.notes,
        type:updatedMeal.type,
        completed: updatedMeal.completed }
      
      // Checks to see if label changed, meaning that the meal has to be added to a new category
      if (categoryChanged) {
        // Adds meal to another category
        let categoryIndex = -1
        for(var i = 0 ; i < categories.length ; i++){
          if (categories[i].key === selectedCategory.label) {
            categoryIndex = i
          }
        }

        // If the category was already found, this means that it already exists in the list of categories
        if (categoryIndex !== -1) {
          console.log("Category was found. ")

          // Creates a new key for the meal so that it can be added to the category's list of meals
          const newMealKey = push(child(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+selectedCategory.label), 'meals')).key;
          const updates = {};

          // Maps the key to the meal object
          updates['/meals/' + newMealKey] = newMeal;

          // Pushes the changes to the category in database
          update(ref(db), updates)



        // Otherwise, if the category was not found, this means it needs to be added to the database
        } else {

          // Creates basic structure for new category
          const mealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+selectedCategory.label)
          const newCategory = {
            quota: 0,
            meals: []
          }
          set(mealRef, newCategory);

          // Creates key for meal and pushes it to new category's list of meals
          const newMealKey = push(child(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+selectedCategory.label), 'meals')).key;
          const updates = {};

          updates['/meals/' + newMealKey] = newMeal;

          update(ref(db), updates)
          
          console.log("New category will be added to database. ")
        }

        // Deletes the meal's entry in the old category
        // set(mealRef, null)


      // Doesn't need to create new key for meal, but just updates its key to map to the updated object
      } else if (tagChanged || mealDetailsChanged || notesChanged) {
        // Updates meal in current category so that it stores updated information

        // Checks to see if the tags were changed, and if so, will add new tags to the tags list. 
        if (tagChanged && tags.indexOf(selectedTags.label) <= -1) {
          let arr = [...tags, selectedTags.label]
          console.log(arr)

          const tagRef = ref(db, 'users/' + auth.currentUser.uid + "/meal_plan/tags");
          set(tagRef, arr)
        }

        // updates meal information for the category
          
        set(mealRef, newMeal);
        setRefresh(true)
        console.log("success")

        // pushes meal item to array
        
      }
      setNewMeal(false)
      onClose(false)
      closeViewPopup()
    }

  }, [newMeal])

  if (!open) return null


  // When user selects the update button, this handler will execute and will set the eupdated meal variable so that it
  // contains the information needed to add the meal to the list again.
  const handleUpdate = async (e) => {
    e.preventDefault()

    // If the category, tag info or meal was changed, it will be reinserted into the quota.
    if (categoryChanged || tagChanged || mealDetailsChanged || notesChanged) {
      setUpdatedMeal({label: selectedCategory.label, tags:selectedTags.label, description: mealDetails, notes: notes, type: currentMealDetails.value.type, completed: currentMealDetails.value.completed})
      console.log("added meal")
      setNewMeal(true)
    }

    // If nothing was changed, the modal will close
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
            <Form.Label className="edit-modal-header">Meal Name</Form.Label>
            
            {/* Shows meal title if meal type is Ingredients*/}
            {currentMealDetails.value.type === "Ingredients" && 
                  <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Title"
                  autoFocus
                  onChange={(e) => setMealDetails(e.target.value)}
                  value={mealDetails}
                />
                }

              {/* Shows title of recipe */}
              {currentMealDetails.value.type === "Recipe" && 
              <Row>
                <Form.Label>
                  {recipes[mealDetails].title}
                </Form.Label>
              </Row> }
          

            <Form.Label className="edit-modal-header">Category</Form.Label>

            {/* Displays the dropdown of tags for te user to choose from. */}
            <Creatable 

                  defaultValue={{value: selectedCategory, label: selectedCategory}}
                  value={selectedCategory}
                  options={categories?.map(category => ({ label: category.key, value: category.key}))}
                  onChange={opt =>setCategory(opt)}

            />

            
            <Form.Label className="edit-modal-header">Day</Form.Label>
            
            {/* Displays the dropdown of tags for te user to choose from. */}
            <Creatable 

                  defaultValue={{value: selectedTags, label: selectedTags}}
                  value={selectedTags}
                  options={tags.map(opt => ({ label: opt, value: opt}))}
                  onChange={opt =>setSelectedTags(opt)}

            />

            {/* If the type of the meal is a recipe, then the view recipe button will be displayed. */}
            {currentMealDetails.value.type === "Recipe" && 
                  <Row className="my-3">

                    {/* Displays card for the recipe associated with the meal*/}
                    <RecipeCards recipes={recipes.filter((recipe, index) => (index === mealDetails))} 
                    setRecipes={setRecipes} onClickFunction={()=>setViewRecipe(true)} groceryList={groceryList} addToGL={addToGL} view={true}/>
                  
                    {/* Modal that appears if the user selects the view button recipe. 
                        Displays recipe information. */}
                    <ViewRecipePopup 
                    recipes={recipes} showViewPopup={viewRecipe} 
                    handleCloseViewPopup={()=>setViewRecipe(false)} 
                    indexOfRecipeToView={mealDetails} 
                    setRecipes={setRecipes} groceryList={groceryList} addToGL={addToGL}> </ViewRecipePopup>
                  </Row>
            }

            {currentMealDetails.value.type === "Ingredients" && 
            <>
              {/* Displays the note information associated with the user's inputted meal idea */} 
              <Form.Label className="edit-modal-header">Notes</Form.Label>
              <div class="input-group">
                <textarea class="form-control" aria-label="With textarea" value={notes} 
                onChange={(e)=>setNotes(e.target.value)}></textarea>
              </div>
            </>}
                  

          </Form.Group>
        </Form> 

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