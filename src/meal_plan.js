
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './App.css';
import './css/meal_plan.css';
import PencilIcon from "./pencil_icon.svg";
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CreateMeal from "./modals/CreateMeal"
import EditMealCategory from './modals/EditMealCategory';

//import { IoClose } from "react-icons/io5"


const MealPlanHome = () => {


const [editCategory, setEdit] = useState(false)

// Used to create a new meal and store meal information
const [newMeal, setNewMeal] = useState(null)
const [meal_category, setMealCategory] = useState("")
const [meal, setMeal] = useState([])
const [showMealPopup, setShowMealPopup] = useState(false)

// Passed as varialbe to editing category popup so we know which category to edit
const [quotaIndex, setQuotaIndex] = useState(0)

// Stores information of newly created meal 
const [addedMeal, setAddedMeal] = useState({id: "Category"}, {day:"tag"}, {mealDetails:""})

// Stores meals for breakfast
const [breakfast, addBreakfast] = useState([
  {value:"bananas", label:"bananas", day:"Monday"},
  {value:"soup", label: "soup", day:"Monday"}
  ])

// Stores meals for lunch
const [lunch, addLunch] = useState([
  {value:"bananas", label:"bananas", day:"Tuesday"},
  {value:"soup", label: "soup", day:"Tuesday"}
  ])

// Stores meals for dinner
const [dinner, addDinner] = useState([
  {value:"bananas", label:"bananas", day:"Wednesday"},
  {value:"soup", label: "soup", day:"Wednesday"}
  ])

const [quotas, setQuotas] = useState([
  {id:"Breakfast",quota:0, value:0, items:breakfast}, 
  {id:"Lunch",quota:0, value:1, items:lunch}, 
  {id:"Dinner", quota:0, value:2, items:dinner}])


  function handleEditCategory(currentCategory) {
    setQuotaIndex(currentCategory)
    setEdit(true)
  }

  // Updates meals on meal plan if there is a new meal to be displayed
  useEffect(() => {

    // If a new meal was successfully submitted via the popup:
    if (newMeal) {  
      console.log(addedMeal)
      // If meal category is the first in the categories list, adds meal to breakfast state array
      if (addedMeal.id === quotas[0].id) {
        console.log("here")
        const item = {value:meal, label:meal}
        console.log(addedMeal)
        addBreakfast([
          ...breakfast,
          {value:addedMeal.description, label:addedMeal.description, day:addedMeal.day}]) 
        console.log(breakfast)
      
      // If meal category is lunch, adds meal to the lunch state array
      } else if (addedMeal.id  === quotas[1].id) {
        console.log("here")
        console.log(addedMeal)
        addLunch([
          ...lunch,
          {value:addedMeal.description, label:addedMeal.description, day:addedMeal.day}]) 
        console.log(lunch)
      
      // If meal category is dinner, adds meal to the dinner state array
      } else if (addedMeal[0].id  === quotas[2].id) {
        addDinner([
          ...dinner,
          {value:addedMeal[0].description, label:addedMeal[0].description, day:addedMeal[0].day}]) 
        
      } 
      setNewMeal(false)
    }
  }, [newMeal])



return(
  <Container fluid="md" className="p-0">
    
    <Row className="d-flex align-center">
        <Col xs={{span:6, offset:5}}>
            <h1>Meal Plan</h1>
        </Col>      
    </Row>
    <Row>
      <Col xs={{span:6, offset:5}}>
        <div>March 1 Week</div>
      </Col>
    </Row>
      {console.log(quotas.length)}

      {quotas.map((category) =>  (
      <div>
      <div className="d-flex justify-between category-header">
        <Col>
            <div className="mr-auto">
                {category.id}
            </div>
        </Col>

        <Col>
            <div className="d-flex justify-content-end pr-1">
                {category.items.length} out of {category.quota}

              <a href="#" onClick={()=>handleEditCategory(category.value)} className="pe-auto left-spacing">
                <img src={PencilIcon} alt="Edit Pencil Icon" className="w-50"/>
              </a>          
            </div>
        </Col>
      </div>

      {category.items.map((x, i) =>
        <Row className="left-spacing"> 
        <label key={i}>
  
        <input
        type="checkbox"
        name="lang"
        value={x.value}
        /> {x.label}
        </label>
        </Row>
        )}
        
      </div>
      ))}
    

  {/* Displays modal to create a meal if the button is pressed*/}
  <Row>
    <button onClick={()=>setShowMealPopup(true)}>Add Meal</button>
    <CreateMeal
      open={showMealPopup}
      onClose={() => setShowMealPopup(false)}
      quota={quotas}
      setQuota={setQuotas}
      newMeal={newMeal}
      setNewMeal={setNewMeal}
      addedMeal={addedMeal}
      setAddedMeal={setAddedMeal}
      meal_category={meal_category}
      setMealCategory={setMealCategory}
      meal={meal}
      setMeal={setMeal}
    />
  </Row>

  {editCategory && <EditMealCategory open={editCategory} onClose={setEdit} quotaIndex={quotaIndex} setQuotaIndex={setQuotaIndex}
           prevQuota={quotas} setQuota={setQuotas} />}
</Container>
  );
};

export default MealPlanHome;