
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './App.css';
import './css/meal_plan.css';
import PencilIcon from "./pencil_icon.svg";
import { useEffect, useState } from 'react';
import CreateMeal from "./modals/CreateMeal"
import EditMealCategory from './modals/EditMealCategory';
import ViewMeal from './modals/ViewMeal'
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


//import { IoClose } from "react-icons/io5"


const MealPlanHome = (props) => {

// Determines when popup should appear so that they can edit a category's name or quota amount 
const [editCategory, setEdit] = useState(false)

// Used to create a new meal and store meal information
const [newMeal, setNewMeal] = useState(null)
const [meal_category, setMealCategory] = useState("")
const [meal, setMeal] = useState([])
const [showCreateMealPopup, setShowCreateMealPopup] = useState(false)

// Determines when meal is clicked on to view popup
const [showViewMealPopup, setShowViewMealPopup] = useState(false)

// Stores the index of meal in the associated category's list of meal
const [currentMealIndex, setCurrentMealIndex] = useState(0)

// Stores category's index in the quotas state varaible so we know where to access the associated list of meals
const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)

// Will contain the meal information about the meal that is needing to be viewed in the popup
const [currentMealDetails, setCurrentMealDetails] = useState(null)

const [openMeal, setOpenMeal] = useState(null)

// Passed as varialbe to editing category popup so we know which category to edit
const [quotaIndex, setQuotaIndex] = useState(0)

// Stores information of newly created meal, will be reset once 
const [addedMeal, setAddedMeal] = useState({id: "Category"}, {day:"tag"}, {mealDetails:""})

const [categoriesList, setCategoriesList] = useState([])

const [refresh, setRefresh] = useState(true)

  // Stores category names after retrieving from database
  const [categories, setCategories] = useState([])
  const [meals, setMeals] = useState([])

  // Updates database for a meal when user checks or unchecks the checkbox
  function handleChecked(category, mealKey, value, mealIndex, categoryIndex) {
    // const newValue = !value
    const db = getDatabase()

    const mealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+category+"/meals/"+mealKey+"/completed")
    set(mealRef, !value)
    setRefresh(true)
  }

  useEffect(()=> {
    const db = getDatabase()
    if (refresh) {
      // Reference to categories in the meal plan
      const categoryRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories")
      let arrMeals = []
      // Stores all of the meal categories and pushes them to an array
      onValue(categoryRef, (snapshot) => {
        const dataCategories = []
        const catList = []
        snapshot.forEach((childsnapshot) => {
          
          // pushes meal item to array        
          let dataMeals = []
          // Stores all of the meal categories and pushes them to an array
          dataMeals = []
          catList.push(childsnapshot.key)
          // Checks to see if category has any meals associated with it
          if (!childsnapshot.val().meals) {
            dataMeals=[]
          } else {
            let keys = Object.keys(childsnapshot.val()?.meals);
            keys.forEach((id) => {
              dataMeals.push({key: id, value: childsnapshot.val().meals[id]})
            })
          }
          
          // pushes meal item to array
          dataCategories.push({key: childsnapshot.key, quota: childsnapshot.val().quota, length: dataMeals.length, meals: dataMeals})
          });

        setCategories(dataCategories)
        setCategoriesList(catList)
      },  {
        onlyOnce: true
      });

      setRefresh(false)
    }

    
  }, [refresh])

  // Populates state variables with needed information to display view meal popup once the meal is selected. 
  function handleViewMealPopup(categoryIndex, mealInfo, mealIndex) {
    setCurrentCategoryIndex(categoryIndex)
    setCurrentMealDetails(mealInfo)
    setCurrentMealIndex(mealIndex)
    setShowViewMealPopup(true)
  }

  // Handler that is called when a user presses the pencil icon to edit a category
  function handleEditCategory(index) {
    setEdit(true)
    setQuotaIndex(index)
  }

  function handleClear() {
      const db = getDatabase()

      // Reference to categories in the meal plan
      const categoryRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories")
      let arrMeals = []
      // Stores all of the meal categories and pushes them to an array
      onValue(categoryRef, (snapshot) => {
        const dataCategories = []
        const catList = []
      
        snapshot.forEach((childsnapshot) => {
          
          // pushes meal item to array        
          const mealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+childsnapshot.key+"/meals")
          let dataMeals = []
          // Stores all of the meal categories and pushes them to an array
          dataMeals = []
          catList.push(childsnapshot.key)
          // Checks to see if category has any meals associated with it
          if (!childsnapshot.val().meals) {
            dataMeals=[]
          } else {
              
            let keys = Object.keys(childsnapshot.val()?.meals);
            keys.forEach((id) => {
                if (childsnapshot.val().meals[id].completed) {
                  set(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+childsnapshot.key+"/meals/"+id), null)
                } else {
                  dataMeals.push({key: id, value: childsnapshot.val().meals[id]})
                }
            })

             
          }
          
          // pushes meal item to array
          dataCategories.push({key: childsnapshot.key, quota: childsnapshot.val().quota, length: dataMeals.length, meals: dataMeals})
          });

        setCategories(dataCategories)
        setCategoriesList(catList)
      },  {
        onlyOnce: true
      });
    }

return (
  <Container fluid="md" className="p-0">
    
    <div className="title">
        <Row>
            
                        
            <Button variant="primary" className="clear-button" onClick={handleClear}>
              Clear meals
            </Button>
                
              <h1>Meal Plan</h1>


            
        </Row>      
    </div>

    {/* For each category stored in the quotas array, will map the associated information to be displayed on the page. */}
    {categories.map((category, j) =>  (
    <div>
      <div className="d-flex justify-between category-header">
        <Col>
            {/* Displays the category name */}
            <div className="mr-auto">
                {category.key}
            </div>
        </Col>

        <Col>
            <div className="d-flex justify-content-end pr-1">
                {/* Displays number of meals planned out of quota amount */}

                {category.quota !== 0 ? category.length + " out of " + category.quota : null}
                
              {/* Displays the edit icon next to each category name so its name and quota amount can be edited*/}
              <a href="#" onClick={()=>handleEditCategory(j)} className="pe-auto left-spacing">
                <img src={PencilIcon} alt="Edit Pencil Icon" className="pencil-icon"/>
              </a>          
            </div>
        </Col>
      </div>

     

      {category.meals?.map((x, i) => (
      <div className="left-spacing">
          <Row> 
            <label key={x}>
            {/* Checkbox that keeps track of whether meal was completed or not. */}
            <input
            type="checkbox"
            name="lang"
            value={x}
            checked={x.value.completed}
            onChange={()=>handleChecked(category.key, x.key, x.value.completed, i, j)}
            /> 
            
            {/* Allows user to select the meal name in order to view additional details about the meal*/}
            <a href="#" className="m-1" onClick={()=> handleViewMealPopup(category.key, {key: x.key, value: x.value}, i)}>
            
              {/* Displays meal title if the meal is made from ingredients, otherwise uses meal label as index to find the title for recipe */}
              {x.value.type === "Ingredients" ? x.value.label : x.value.tags}
            </a>
          </label>
        </Row>
        <Row className="left-spacing">
          <div className="tag">{x.value.tags}</div>  
        </Row>
      </div>))}
      {/* Displays the list of meals for the current category. */}
      </div>
      ))}

    {/* Shows meal details if the meal is selected. */}
    {showViewMealPopup &&
       <ViewMeal open={showViewMealPopup} onClose={setShowViewMealPopup} categories={categories} setCategories={setCategories} quotaIndex={quotaIndex} setQuotaIndex={setQuotaIndex}
          currentCategoryIndex={currentCategoryIndex} currentMealDetails={currentMealDetails} currentMealIndex={currentMealIndex} recipes={props.recipes} setRecipes={props.setRecipes} 
          refresh={refresh} setRefresh={setRefresh}/>}
 
  {/* Displays modal to create a meal if the add button is pressed */}
  <a class="fixedButton" href="#" onClick={()=>setShowCreateMealPopup(true)}>
    <svg fill="#729701" height="70px" width="70px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 300.003 300.003" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M150,0C67.159,0,0.001,67.159,0.001,150c0,82.838,67.157,150.003,149.997,150.003S300.002,232.838,300.002,150 C300.002,67.159,232.839,0,150,0z M213.281,166.501h-48.27v50.469c-0.003,8.463-6.863,15.323-15.328,15.323 c-8.468,0-15.328-6.86-15.328-15.328v-50.464H87.37c-8.466-0.003-15.323-6.863-15.328-15.328c0-8.463,6.863-15.326,15.328-15.328 l46.984,0.003V91.057c0-8.466,6.863-15.328,15.326-15.328c8.468,0,15.331,6.863,15.328,15.328l0.003,44.787l48.265,0.005 c8.466-0.005,15.331,6.86,15.328,15.328C228.607,159.643,221.742,166.501,213.281,166.501z"></path> </g> </g> </g></svg>
  </a>

  {/* The component for modal that creates a meal. */}
  <CreateMeal
    app={props.app}
    open={showCreateMealPopup}
    onClose={() => setShowCreateMealPopup(false)}
    categories={categories}
    setCategories={setCategories}
    newMeal={newMeal}
    setNewMeal={setNewMeal}
    addedMeal={addedMeal}
    setAddedMeal={setAddedMeal}
    meal_category={meal_category}
    setMealCategory={setMealCategory}
    meal={meal}
    setMeal={setMeal}
    recipes={props.recipes}
    setRecipes={props.setRecipes}
    personalGroceryList={props.itemsInPersonalGL} 
    addToGL={props.addPersonalItemGL}
    refresh={refresh}
    setRefresh={setRefresh}
    categoriesList={categoriesList}
    setCategoriesList={setCategoriesList}
  />

  {/* Displays popup to edit category name and quota for the selected category. */}
  {editCategory && <EditMealCategory open={editCategory} onClose={setEdit} categoryIndex={quotaIndex} setCategoryIndex={setQuotaIndex}
           categories={categories} setCategories={setCategories} refresh={refresh} setRefresh={setRefresh} categoriesList={categoriesList} setCategoriesList={setCategoriesList}/>}
</Container>
  );
};

export default MealPlanHome;