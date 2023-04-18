import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import '../css/meal_plan.css'
import '../recipes.css'
import RecipeCards from '../RecipeCards';
import ViewRecipePopup from './ViewRecipe';
import RecipeSearchBar from '../RecipeSearchBar';
import FilterPopup from './FilterItems';

// Modal that appears when user is trying to either choose a recipe or enter meal idea on meal plan page
export default function ChooseMeal({open, onClose, tab, setTab, recipes, setRecipes, mealDetails, setMealDetails, type, setType}) {
  
  // Used to display filter popup to filter the recipes 
  const [showFilterPopup, setShowFilterPopup] = useState(false)

  // Used for searching through recipes
  const [searchInput, setSearchInput] = useState("")

  // Stores info if user enters their own meal idea
  const [mealIdea, setMealIdea] = useState("")
  const [notes, setNotes] = useState("")
  const [custom, setCustom] = useState(true)

  // Stores recipe index if user chooses a recipe
  const [chosenRecipe, setChosenRecipe] = useState(-1)


  const sortRules = {
    title: "Title (A to Z)", 
    energy: "Energy Required (Low to High)", 
    time: "Time Required (Low to High)", 
    inventory: "Percent of Owned Ingredients (High to Low)"
  };

  // If the user chooses a recipe, then by default it will deselect the custom meal that they were entering, unless they
  // click it again. 
  useEffect(()=> {
    console.log(mealDetails)
  }, [mealDetails])

  // When user is done either selecting recipe or choosing meal, this handler will be executed to save the details. 
  function handleSaveMeal() {
    
    if (chosenRecipe !== -1) {
      setType("Recipe")
      setMealDetails(chosenRecipe)
      
    } else if (mealIdea) {
      setType("Ingredients")
      setMealDetails({mealIdea: mealIdea, notes: notes})
    }
    setTab(2)
    onClose()

  }

  useEffect(() => {
    if (tab === 0) {
      onClose()
    }
  }, [tab])

  function handleCustom () {
      setCustom(true)
      setChosenRecipe(-1)
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
    <div>
  {/* Modal for choosing a recipe or a meal idea. */}
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Meal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      
        <Form>
          <Form.Group className="mb-3">
            <h4 className="edit-modal-header">Custom Meal</h4>
              <div className={custom  ? "row pe-auto chosenRecipe" : "row pe-auto recipe-card"} onClick={handleCustom} key="custom">

                <div className='col-12' id='recipe-info'>
                <Form.Label>Meal idea</Form.Label>

                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="i.e avocado toast"
                  autoFocus
                  onChange={(e) => setMealIdea(e.target.value)}
                  value={mealIdea}
                />
              <Form.Label className="edit-modal-header">Notes</Form.Label>

              <div class="input-group">
                <textarea class="form-control" aria-label="With textarea" value={notes} onChange={(e)=>setNotes(e.target.value)}></textarea>
              </div>
              </div>
            </div>
 
         
            <h4 className="edit-modal-header">Choose Recipe</h4>
            <div className="d-flex justify-content-between p-2">
              Search
              <RecipeSearchBar searchInput={searchInput} setSearchInput={setSearchInput}></RecipeSearchBar>
            </div>

          <div>
            <RecipeCards 
              recipes={recipes}
              setRecipes={setRecipes} 
              view={false}
              searchInput={searchInput}
              sortFunction={sortFunction}
              shouldBeShown={shouldBeShown}
              addedRecipe={chosenRecipe} setAddedRecipe={setChosenRecipe} 
              custom={custom} setCustom={setCustom}
              />
          </div>

            {/* Only displays recipes if the user is not creating a custom meal. */}


          </Form.Group>
        </Form> 
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between fixed">
          
        <Button variant="primary" onClick={()=>setTab(0)}>
          Back
        </Button>
        <Button variant="primary" onClick={handleSaveMeal}>
          Next
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
  )
}