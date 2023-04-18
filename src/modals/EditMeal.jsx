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
import { getDatabase, ref, set, onValue, update, push, child, remove} from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import RemoveMealWarning from './removeMealWarning';

// Modal that appears when a user selects a meal and presses the edit meal button. 
const EditMeal = ({ viewPopup, closeViewPopup, open, onClose, categories, setCategories, currentCategoryIndex, currentMealDetails, currentMealIndex, recipes, setRecipes,
  refresh, setRefresh,
  groceryList, addToGL, categoriesList, setCategoriesList, indexRecipe}) => {
  const auth = getAuth()

  const [currRecipe, setCurrRecipe] = useState([])

  useEffect(()=> {
    const db = getDatabase()
    const recipesRef = ref(db, 'users/' + getAuth().currentUser.uid + "/recipes")
    let arrMeals = []
    // Stores all of the meal categories and pushes them to an array
    onValue(recipesRef, (snapshot) => {
            
      // getting data from the spot in the db that changes
      // good source: https://info340.github.io/firebase.html#firebase-arrays
      const allRecipesObject = snapshot.val();
      const allRecipesKeys = Object.keys(allRecipesObject);
      allRecipesKeys.forEach((key)=> {
        if (key === indexRecipe) {
          setCurrRecipe(allRecipesObject[key])
        }
      })

    },  {
      onlyOnce: true
    });

  })

  // Popup that appears when user attempts to delete a meal
  const [openWarning, setOpenWarning] = useState(false)

  const [remove, setRemove] = useState(false)

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
    
    // updates tags state variable so that it stores the saved tags from the user's database
    const tagRef = ref(db, 'users/' + auth.currentUser.uid + "/meal_plan/tags");
    
    // Updates state variable so that it stores the list of tags from database
    onValue(tagRef, (snapshot) => {
      const data = snapshot.val();
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
    if (currentMealDetails.value.type === "Recipe") {
      setMealDetails(indexRecipe)
    } else {
      if (mealDetails !== currentMealDetails.value.description) {
        setMealDetailsChanged(true)
      } else {
        
        setMealDetailsChanged(false)
      }
    }
  }, [mealDetails])

 
  // Updates meal's information in the database
  useEffect(()=> {
    if (newMeal) {
      const db = getDatabase()
      const oldMealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+currentCategoryIndex+"/meals/"+currentMealDetails.key)
      
      const newMeal = {
        label:updatedMeal.description,
        tags:updatedMeal.tags,
        notes: updatedMeal.notes,
        type:updatedMeal.type,
        completed: updatedMeal.completed }
      
      // Checks to see if label changed, meaning that the meal has to be added to a new category
      if (categoryChanged) {
        // Adds meal to another category

        // If the category was already found, this means that it already exists in the list of categories
        if ((Array.isArray(categoriesList) && categoriesList.indexOf(selectedCategory.label) >= -1) || categoriesList === selectedCategory.label) {

          // Creates a new key for the meal so that it can be added to the category's list of meals
          // const newMealKey = push(child(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+selectedCategory.label), 'meals')).key;
          // const updates = {};

          // Pushes meal to the new category's array of meals
          const mealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+selectedCategory.label+"/meals")
          
          // Creates key to push new meal to
          const newMealRef = push(mealRef);

          // Sets meal information to the new generated key
          set(newMealRef,newMeal)

          // Removes the reference from the old category
          remove(oldMealRef)

          // Indicates that state variable should be refreshed
          setRefresh(true)

          

        // Otherwise, if the category was not found, this means it needs to be added to the database
        } else {
          // Creates basic structure for new category
          const categoryRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+selectedCategory.label)
          const newCategory = {
            quota: 0,
            meals: []
          }
          set(categoryRef, newCategory);     
        
          // Creates basic structure for new category
          const mealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+selectedCategory.label+'/meals')
          
          // Creates key to push new meal to
          const newMealRef = push(mealRef);

          // Sets meal information to the new generated key
          set(newMealRef, newMeal)

          // Removes the reference from the old category
          set(oldMealRef, null)

          // Indicates that state variable should be refreshed
          setRefresh(true)
        }

        // Deletes the meal's entry in the old category
        // set(mealRef, null)


      // Doesn't need to create new key for meal, but just updates its key to map to the updated object
      } else if (tagChanged || mealDetailsChanged || notesChanged) {
        // Updates meal in current category so that it stores updated information

        // Checks to see if the tags were changed, and if so, will add new tags to the tags list. 
        if (tagChanged && tags.indexOf(selectedTags.label) <= -1) {
          let arr = [...tags, selectedTags.label]

          const tagRef = ref(db, 'users/' + auth.currentUser.uid + "/meal_plan/tags");
          set(tagRef, arr)
        }

        // updates meal information for the category
        set(oldMealRef, newMeal);
        setRefresh(true)

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
      setNewMeal(true)
    }

    // If nothing was changed, the modal will close
    else {
      onClose(false)
    }

  }



  const sortFunction = (recipeA, recipeB) => { 
    const titleA = recipeA.title.toLowerCase();
    const titleB = recipeB.title.toLowerCase();
    return (titleA < titleB) ? -1 : (titleA > titleB) ? 1 : 0;
  }

  const shouldBeShown = (recipe) => {
    return true;
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
                  {currRecipe.title}
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
                    <RecipeCards recipes={recipes.filter((recipe, index) => (recipe.key === currentMealDetails.value.label))} 
                    setRecipes={setRecipes} 
                    onClickFunction={()=>setViewRecipe(true)} 
                    sortFunction={sortFunction}
                    shouldBeShown={shouldBeShown}
                    searchInput={""}
                    groceryList={groceryList} addToGL={addToGL} view={true}/>
                  
                    {/* Modal that appears if the user selects the view button recipe. 
                        Displays recipe information. */}
                    <ViewRecipePopup 
                      recipes={recipes} showViewPopup={viewRecipe} 
                      handleCloseViewPopup={()=>setViewRecipe(false)} 
                      indexOfRecipeToView={indexRecipe} 
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
     
      <Modal.Footer className="d-flex justify-content-between fixed">
        {/* Buttons that allow user to delete meal or update  */}
          <>
            <Button variant="primary" onClick={()=>setOpenWarning(true)}>
              Delete meal
            </Button>
            <Button variant="primary" onClick={handleUpdate}>
              Update meal
            </Button>
          </>
      </Modal.Footer>
    </Modal>
    {openWarning && 
      <RemoveMealWarning 
        viewPopup={viewPopup} closeViewPopup={closeViewPopup}
        open={openWarning} setOpen={setOpenWarning} 
        remove={remove} setRemove={setRemove} 
        category={currentCategoryIndex} mealId={currentMealDetails.key}
        openEdit={open} closeEdit={onClose}
        refresh={refresh} setRefresh={setRefresh} />}

  </>

  )
}

export default EditMeal