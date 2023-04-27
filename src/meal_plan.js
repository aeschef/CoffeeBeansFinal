
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
import FilterMealTags from './modals/FilterMealTags';

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
// If it is a recipe, will contain key for recipe
const [currentMealDetails, setCurrentMealDetails] = useState(null)

  // Passed as varialbe to editing category popup so we know which category to edit
  const [quotaIndex, setQuotaIndex] = useState(0)

  // Stores information of newly created meal, will be reset once 
  const [addedMeal, setAddedMeal] = useState({ id: "Category" }, { day: "tag" }, { mealDetails: "" })

  const [categoriesList, setCategoriesList] = useState([])

  const [mealRefresh, setMealRefresh] = useState(false)

// Indicates when recipes should be retrieved from database
const [retrieveRecipes, setRetrieveRecipes] = useState(true)

// Prepopulates recipes with the recipes loaded upon logging in
const [recipes, setRecipes] = useState(null)

const [refresh, setRefresh] = useState(false)

// Keeps track of which tags should be displayed
const [showTags, setShowTags] = useState(null)

// Determines when we show show or hide the filter tag modal
const [showFilterTags, setShowFilterTags] = useState(false)

 // Stores category names after retrieving from database
const [categories, setCategories] = useState([])


  // Updates database for a meal when user checks or unchecks the checkbox
  function handleChecked(category, mealKey, value, mealIndex, categoryIndex) {
    // const newValue = !value
    const db = getDatabase()

    console.log("Value is " + value)
    const mealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/" + category + "/meals/" + mealKey + "/completed")
    set(mealRef, !value)
    setRefresh(true)
  }

  // Retrieves the recipes
  useEffect(() => {
    if (retrieveRecipes) {
      console.log("here")
      const db = getDatabase()
      const recipesRef = ref(db, 'users/' + getAuth().currentUser.uid + "/recipes")
      let arrMeals = []
      // Stores all of the meal categories and pushes them to an array
      onValue(recipesRef, (snapshot) => {

        // getting data from the spot in the db that changes
        // good source: https://info340.github.io/firebase.html#firebase-arrays
        const allRecipesObject = snapshot.val();
        const allRecipesKeys = Object.keys(allRecipesObject);
        const allRecipesArray = allRecipesKeys.map((key) => {
          const singleRecipeCopy = { ...allRecipesObject[key] }; // copying the element at that key
          singleRecipeCopy.key = key; // save the key string so you have it later
          return singleRecipeCopy;
      })
      console.log("recipes")
      console.log(allRecipesArray)
      setRecipes(allRecipesArray);
      // snapshot.forEach((childsnapshot) => {
      //   data.push({key: childsnapshot.key, value: childsnapshot.val()})
        
      // });

    })
    setRetrieveRecipes(false)
    }
  }, [retrieveRecipes])

  const tagShouldShow = (meal) => {
    console.log(meal)
    console.log(showTags?.indexOf(meal.value.tags))
    if ((meal.value.tags && showTags?.indexOf(meal.value.tags) > -1) || (!showTags)) {
      console.log("should show tag ")
      return true
    } else {
      return false
    }
  }

  useEffect(()=> {
    if (recipes) {
      console.log(recipes)
      console.log("will now get meals")
      setRefresh(true)
      setMealRefresh(true)
    }
  }, [recipes])
  useEffect(()=> {
    const db = getDatabase()

    // Ensures that the recipes have been retrieved before retrieving the meal info for each category
    if (refresh && mealRefresh) {

      console.log("in here")
      // Reference to categories in the meal plan
      const categoryRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories")

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
            dataMeals = []
          } else {
            let keys = Object.keys(childsnapshot.val()?.meals);
            keys.forEach((id) => {
              console.log("i am here")
              if (recipes && childsnapshot.val().meals[id].type === "Recipe") {
                let index = -1;
                console.log(recipes)
                recipes.forEach((recipe, i) => {
                  console.log("mapping recipe ot meal info ")

                  // If there was a meal selected that was a recipe, update its content
                  if (currentMealDetails && currentMealDetails.value.label == recipe.key) {
                    setCurrentMealDetails({ key: id, value: childsnapshot.val().meals[id], title: recipes[i].title })
                  }
                  console.log("child " + childsnapshot.val().meals[id].label)
                  console.log("recipe " + recipe.key)
                  if (recipe.key == childsnapshot.val().meals[id].label) {
                    console.log("recipe found")
                    index = i
                  }
                })
                if (index !== -1) {
                  dataMeals.push({ key: id, value: childsnapshot.val().meals[id], title: recipes[index].title })
                }

              } else {
                dataMeals.push({ key: id, value: childsnapshot.val().meals[id] })

              }
            })
          }

          // pushes meal item to array
          dataCategories.push({ key: childsnapshot.key, quota: childsnapshot.val().quota, length: dataMeals.length, meals: dataMeals })
        });

        setCategories(dataCategories)
        setCategoriesList(catList)
      })

      setRefresh(false)
      setMealRefresh(false)
    } 
    
  }, [refresh, mealRefresh])

  // Populates state variables with needed information to display view meal popup once the meal is selected. 
  function handleViewMealPopup(categoryIndex, mealInfo, mealIndex) {
    setCurrentCategoryIndex(categoryIndex)
    // TODO: change back to this once recipe page is hooked up to database
    console.log(mealInfo.value)
    setCurrentMealDetails(mealInfo)


    // TODO: change back to this once recipe page is hooked up to database
    setCurrentMealIndex(mealIndex)

    setShowViewMealPopup(true)
  }

  // Handler that is called when a user presses the pencil icon to edit a category
  function handleEditCategory(index) {
    setEdit(true)
    setQuotaIndex(index)
  }

  // Clears meals that are completed
  function handleClear() {
    const db = getDatabase()
    setRecipes([...recipes])
      // Reference to categories in the meal plan
      const categoryRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories")
      // Stores all of the meal categories and pushes them to an array, while removing meals that are completed
      onValue(categoryRef, (snapshot) => {

        const dataCategories = []
        const catList = []
      
        snapshot.forEach((childsnapshot) => {
          
          // Stores all of the meal categories and pushes them to an array
          let dataMeals = []
          catList.push(childsnapshot.key)

          // Checks to see if category has any meals associated with it
          if (!childsnapshot.val().meals) {
            dataMeals=[]
          } else {
              
            let keys = Object.keys(childsnapshot.val()?.meals);
            keys.forEach((id) => {
                // Nulls out keys for meals that are completed
                if (childsnapshot.val().meals[id].completed) {
                  set(ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+childsnapshot.key+"/meals/"+id), null)
                
                // Includes meals that have not been completed yet
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
    }, {
      onlyOnce: true
    });
  }

return (
  <Container fluid="md">
    
    <div className="title">
        <Row>
            
            <Col>    
             <svg fill="#525252" height="20px" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"  
              viewBox="0 0 457.503 457.503" onClick={handleClear}>
            <g>
              <g>
                <path d="M381.575,57.067h-90.231C288.404,25.111,261.461,0,228.752,0C196.043,0,169.1,25.111,166.16,57.067H75.929
                  c-26.667,0-48.362,21.695-48.362,48.362c0,26.018,20.655,47.292,46.427,48.313v246.694c0,31.467,25.6,57.067,57.067,57.067
                  h195.381c31.467,0,57.067-25.6,57.067-57.067V153.741c25.772-1.02,46.427-22.294,46.427-48.313
                  C429.936,78.761,408.242,57.067,381.575,57.067z M165.841,376.817c0,8.013-6.496,14.509-14.508,14.509
                  c-8.013,0-14.508-6.496-14.508-14.509V186.113c0-8.013,6.496-14.508,14.508-14.508c8.013,0,14.508,6.496,14.508,14.508V376.817z
                  M243.26,376.817c0,8.013-6.496,14.509-14.508,14.509c-8.013,0-14.508-6.496-14.508-14.509V186.113
                  c0-8.013,6.496-14.508,14.508-14.508c8.013,0,14.508,6.496,14.508,14.508V376.817z M320.679,376.817
                  c0,8.013-6.496,14.509-14.508,14.509c-8.013,0-14.509-6.496-14.509-14.509V186.113c0-8.013,6.496-14.508,14.509-14.508
                  s14.508,6.496,14.508,14.508V376.817z"/>
              </g>
            </g>
            </svg>      
       
            </Col>  

            <Col xs={5}>
              <h1 className="meal-title">Meal Plan</h1>
            </Col>
              
            
            <Col>
            
            <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" version="1.1" viewBox="0 0 600 600" onClick={()=>setShowFilterTags(true)} >
                        <g fill-rule="evenodd">
                            <path fill="#525252" d="m262.5 280c-42.125 0-77.551 30.195-85.723 70h-54.277c-4.6406 0-9.0938 1.8438-12.375 5.125s-5.125 7.7344-5.125 12.375 1.8438 9.0938 5.125 12.375 7.7344 5.125 12.375 5.125h54.277c8.1719 39.805 43.598 70 85.723 70s77.551-30.195 85.723-70h229.28c4.6406 0 9.0938-1.8438 12.375-5.125s5.125-7.7344 5.125-12.375-1.8438-9.0938-5.125-12.375-7.7344-5.125-12.375-5.125h-229.28c-8.1719-39.805-43.598-70-85.723-70z" />
                            <path fill="#525252" d="m437.5 105c-42.125 0-77.551 30.195-85.723 70h-229.28c-4.6406 0-9.0938 1.8438-12.375 5.125s-5.125 7.7344-5.125 12.375 1.8438 9.0938 5.125 12.375 7.7344 5.125 12.375 5.125h229.28c8.1719 39.805 43.598 70 85.723 70s77.551-30.195 85.723-70h54.277c4.6406 0 9.0938-1.8438 12.375-5.125s5.125-7.7344 5.125-12.375-1.8438-9.0938-5.125-12.375-7.7344-5.125-12.375-5.125h-54.277c-8.1719-39.805-43.598-70-85.723-70z" />
                        </g>
            </svg>
            </Col>
 
        </Row>      
    </div>

    {showFilterTags && 
      <FilterMealTags 
      open={showFilterTags} onClose={()=>setShowFilterTags(false)} 
      showTags={showTags} setShowTags={setShowTags} />}

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
              <div className="d-flex justify-content-end">
                {/* Displays number of meals planned out of quota amount */}

                {category.quota !== 0 ? category.length + " out of " + category.quota : null}

                {/* Displays the edit icon next to each category name so its name and quota amount can be edited*/}
                <a href="#" onClick={() => handleEditCategory(j)} className="pe-auto left-spacing">
                  <img src={PencilIcon} alt="Edit Pencil Icon" className="pencil-icon" />
                </a>
              </div>
            </Col>
          </div>

     {category.meals
     .filter((x) => tagShouldShow(x) || !showTags)
     .map((x, i) => (
      
      <div className="left-spacing">
          <div className="box-custom"> 
            <div>
            <label key={x} className="color-checked">
            {/* Checkbox that keeps track of whether meal was completed or not. */}
            <input
            type="checkbox"
            name="lang"
            value={x}
            checked={x.value.completed}
            onChange={()=>handleChecked(category.key, x.key, x.value.completed, i, j)}
            /> 
          </label>
          </div>
          <div>   
            {/* Allows user to select the meal name in order to view additional details about the meal*/}
            <div className={"m-1 popup " + (x.value.completed ? "completed-item" : "not-completed")} onClick={()=> handleViewMealPopup(category.key, {key:x.key, value:x.value, title:x.title}, i)}>
            
              {/* Displays meal title if the meal is made from ingredients, otherwise uses meal label as key to retrieve index to return the title for recipe */}
              {x.value.type === "Ingredients" ? x.value.label : x?.title}
            </div>
          </div>
        </div>
        <Row className="left-spacing">
          <div className="tag">{x.value.tags}</div>  
        </Row>
      </div>))}
      {/* Displays the list of meals for the current category. */}
      </div> 
      ))}

      {/* Shows meal details if the meal is selected. */}
      {showViewMealPopup &&
        <ViewMeal open={showViewMealPopup} onClose={setShowViewMealPopup} categories={categories} setCategories={setCategories}
          currentCategoryIndex={currentCategoryIndex} currentMealDetails={currentMealDetails} setCurrentMealDetails={setCurrentMealDetails} currentMealIndex={currentMealIndex} recipes={recipes} setRecipes={setRecipes}
          refresh={refresh} setRefresh={setRefresh} />}

      {/* Displays modal to create a meal if the add button is pressed */}
      <a class="fixedButton" href="#" onClick={() => setShowCreateMealPopup(true)}>
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
        personalGroceryList={props.itemsInPersonalGL}
        addToGL={props.addPersonalItemGL}
        refresh={refresh}
        setRefresh={setRefresh}
        categoriesList={categoriesList}
        setCategoriesList={setCategoriesList}
      />

      {/* Displays popup to edit category name and quota for the selected category. */}
      {editCategory && <EditMealCategory open={editCategory} onClose={setEdit} categoryIndex={quotaIndex} setCategoryIndex={setQuotaIndex}
        categories={categories} setCategories={setCategories} refresh={refresh} setRefresh={setRefresh} categoriesList={categoriesList} setCategoriesList={setCategoriesList} />}
    </Container>
  );
};

export default MealPlanHome;