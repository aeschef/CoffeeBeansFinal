
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

  function addMealToCategory(category) {

  }

  useEffect(()=> {
    console.log(breakfast)
    console.log(quotas[0].items)
  }, [breakfast])

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
                <img src={PencilIcon} alt="Edit Pencil Icon" className="pencil-icon"/>
              </a>          
            </div>
        </Col>
      </div>

      {category.items.map((x, i) =>
        <div className="left-spacing">
        <Row> 
        <label key={i}>
  
        <input
        type="checkbox"
        name="lang"
        value={x.value}
        /> {x.label}
        </label>
        </Row>
        <Row className="left-spacing">
          <div className="tag">{x.day}</div>
        </Row>
        </div>
        )}
        
      </div>
      ))}
    

  {/* Displays modal to create a meal if the addbutton is pressed*/}
  <a class="fixedButton" href="#" onClick={()=>setShowMealPopup(true)}>
    <svg fill="#729701" height="70px" width="70px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 300.003 300.003" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M150,0C67.159,0,0.001,67.159,0.001,150c0,82.838,67.157,150.003,149.997,150.003S300.002,232.838,300.002,150 C300.002,67.159,232.839,0,150,0z M213.281,166.501h-48.27v50.469c-0.003,8.463-6.863,15.323-15.328,15.323 c-8.468,0-15.328-6.86-15.328-15.328v-50.464H87.37c-8.466-0.003-15.323-6.863-15.328-15.328c0-8.463,6.863-15.326,15.328-15.328 l46.984,0.003V91.057c0-8.466,6.863-15.328,15.326-15.328c8.468,0,15.331,6.863,15.328,15.328l0.003,44.787l48.265,0.005 c8.466-0.005,15.331,6.86,15.328,15.328C228.607,159.643,221.742,166.501,213.281,166.501z"></path> </g> </g> </g></svg>
  </a>
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


  {editCategory && <EditMealCategory open={editCategory} onClose={setEdit} quotaIndex={quotaIndex} setQuotaIndex={setQuotaIndex}
           prevQuota={quotas} setQuota={setQuotas} />}
</Container>
  );
};

export default MealPlanHome;