
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CreateMeal from "./modals/CreateMeal"

//import { IoClose } from "react-icons/io5"


const MealPlanHome = () => {
const [quotas, setQuotas] = useState([{"breakfast": 0}, {"lunch": 0}, {"dinner": 0}])
const [editCategory, setEdit] = useState(false)

// Used to create a new meal and store meal information
const [newMeal, setNewMeal] = useState(null)
const [meal_category, setMealCategory] = useState("")
const [meal, setMeal] = useState([])
const [showMealPopup, setShowMealPopup] = useState(false)

// Stores meals for breakfast
const [breakfast, addBreakfast] = useState([
  {value:"bananas", label:"bananas"},
  {value:"soup", label: "soup"}
  ])

// Stores meals for lunch
const [lunch, addLunch] = useState([
  {value:"bananas", label:"bananas"},
  {value:"soup", label: "soup"}
  ])

// Stores meals for dinner
const [dinner, addDinner] = useState([
  {value:"bananas", label:"bananas"},
  {value:"soup", label: "soup"}
  ])


  // Updates meals on meal plan if there is a new meal to be displayed
  useEffect(() => {

    // If a new meal was successfully submitted via the popup:
    if (newMeal) {  
      
      // If meal category is breakfast, adds meal to breakfast state array
      if (meal_category === "breakfast") {
        console.log("here")
        const item = {value:meal, label:meal}
        console.log(item)
        addBreakfast([
          ...breakfast,
          {value:meal, label:meal}]) 
        console.log(breakfast)
      
      // If meal category is lunch, adds meal to the lunch state array
      } else if (meal_category === "lunch") {
        addLunch([
          ...lunch,
          {value:meal, label:meal}]) 
        console.log(breakfast)
      
      // If meal category is dinner, adds meal to the dinner state array
      } else if (meal_category === "dinner") {
        addDinner([
          ...dinner,
          {value:meal, label:meal}]) 
        
      } 
      setNewMeal(false)
    }
  }, [newMeal])

return(
  <Container fluid="md">
    <Row>
        <Col xs={{span:6, offset:3}}>
            <h1>Meal Plan</h1>
        </Col>      
    </Row>
    <Row>
      <Col>
        <button>---</button><div>March 1 Week</div>
      </Col>
    </Row>
    
    <Row>
      <Col>
          <div className="d-grid gap-2">
              Breakfast
          </div>
      </Col>
      <Col>
          <div className="d-grid gap-2">
            {breakfast.length} out of {quotas[0]["breakfast"]}
          </div>
      </Col>
      </Row>

      {breakfast.map((x, i) =>
      <Row> 
      <label key={i}>

      <input
      type="checkbox"
      name="lang"
      value={x.value}
      /> {x.label}
      </label>
      </Row>
      )}

    <Row>
        <Col>
            <div className="d-grid gap-2">
                Lunch
            </div>
        </Col>
        <Col>
            <div className="d-grid gap-2">
            {lunch.length} out of {quotas[1]["lunch"]}
            </div>
        </Col>
    </Row>

    {/* Displays check list of meals for lunch*/}
    {lunch.map((x, i) =>
    <Row> 
      <label key={i}>
    
      <input
        type="checkbox"
        name="lang"
        value={x.value}
      /> {x.label}
    </label>
    </Row>
    )}


    <Row>

        <Col>
          <div className="d-grid gap-2">
            Dinner
          </div>
        </Col>
        <Col>
          <div className="d-grid gap-2">
            {dinner.length} out of {quotas[2]["dinner"]}
           </div>
            
        </Col>
    </Row>
    
    {/* Displays checklist of meals for dinner. */}
    {dinner.map((x, i) =>
    <Row> 
      <label key={i}>
    
      <input
        type="checkbox"
        name="lang"
        value={x.value}
      /> {x.label}
    </label>
    </Row>
    )}

  {/* Displays modal to create a meal if the button is pressed*/}
  <Row>
    <button onClick={()=>setShowMealPopup(true)}>Add Meal</button>
    <CreateMeal
      open={showMealPopup}
      onClose={() => setShowMealPopup(false)}
      newMeal={newMeal}
      setNewMeal={setNewMeal}
      meal_category={meal_category}
      setMealCategory={setMealCategory}
      meal={meal}
      setMeal={setMeal}
    />
  </Row>
</Container>
  );
};

export default MealPlanHome;