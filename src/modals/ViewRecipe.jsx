import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import EditRecipePopup from './EditRecipe'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Row';


function HandleAddtoMealPlan({groceryList, addToGL}) {
    const [isShowing, setShow] = useState(false);
    const [newList, addtoList] = useState([]);

    const list = [{value:"bonebroth", label:"bonebroth"},
    {value:"rice", label:"rice"},
    {value:"lemon juice", label:"lemon juice"},
    {value:"eggs", label:"eggs"},
    {value:"chicken", label:"chicken"},
    {value:"dill", label:"dil"}];

    const handleOpen =()=> {
        console.log(groceryList[0])
        setShow(true);
    };
    
    const closePopup =() => {
        setShow(false);
    };
    
    const handleSave = () => {
        addToGL([
            ...newList,
            ...groceryList
           ]);
        setShow(false);
    };

    const handleSaveAll = () => {
        addToGL([
            ...groceryList,
            ...list
        ]);
        setShow(false);
    };


    const handleCheck = (event) => {
        if(event.target.checked){
        const itemName = event.target.value;
           const item = {value:itemName, label:itemName};
           console.log(item + "added to inventory");
           addtoList([
            ...newList,
            {value:itemName, label:itemName}
           ]);
        }
    };
    return (
        <>
            <button onClick={handleOpen}>Add Recipe to Meal Plan</button>
            <Modal show={isShowing} onHide={closePopup} centered>
                <Modal.Header closeButton> Add to Grocery List? </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Button variant="secondary" onClick={handleSaveAll}>Select All & Add </Button>
                        </Row>
                        <Row>
                            <label>
                                <input
                                type="checkbox"
                                name="lang"
                                value="bone broth"
                                onChange={handleCheck}
                                />
                                bone broth
                            </label>
                            <label>
                                <input
                                type="checkbox"
                                name="lang"
                                value="rice"
                                onChange={handleCheck}
                                />
                                rice
                            </label>
                            <label>
                                <input
                                type="checkbox"
                                name="lang"
                                value="eggs"
                                onChange={handleCheck}
                                />
                                eggs
                            </label>
                            <label>
                                <input
                                type="checkbox"
                                name="lang"
                                value="lemon juice"
                                onChange={handleCheck}
                                />
                                lemon juice
                            </label>
                            <label>
                                <input
                                type="checkbox"
                                name="lang"
                                value="chicken"
                                onChange={handleCheck}
                                />
                                chicken
                            </label>
                            <label>
                                <input
                                type="checkbox"
                                name="lang"
                                value="dill"
                                onChange={handleCheck}
                                />
                                dill
                            </label>
                            
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="danger">Cancel</Button>
                            </Col>
                            <Col>
                                <Button variant="success" onClick={handleSave}>Save</Button>
                            </Col>
                        </Row>
                    </Container>

                </Modal.Body>
            </Modal>
        </>
    );
}

// popup for viewing a recipe
export default function ViewRecipePopup(props) {
  
  // variables and functions for Edit Recipe popup
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [inputs, setInputs] = useState(null); // these are what show up in the inputs originally
  const [indexOfRecipeToEdit, setIndexOfRecipeToEdit] = useState(props.indexOfRecipeToView);
  const [tagsInStringForm, setTagsInStringForm] = useState("");
  const [ingredientsInStringForm, setIngredientsInStringForm] = useState("");
  const [stepsInStringForm, setStepsInStringForm] = useState("");
  const handleOpenEditPopup = (index) => {
      setIndexOfRecipeToEdit(index);
      setInputs(props.recipes[index]);
      setShowEditPopup(true);
      setTagsInStringForm(props.recipes[index].tags?.join(", ") || null);
      setIngredientsInStringForm(props.recipes[index].ingredients.map((ingredient) => ingredient.phrase).join("\n"));
      setStepsInStringForm(props.recipes[index].steps?.join("\n"));
  }
  const handleCloseEditPopup = () => setShowEditPopup(false);

  // saving a reference to the current recipe being viewed
  const [currentRecipe, setCurrentRecipe] = useState([])

  useEffect(()=> {
    let item = props.recipes.filter((recipe) => recipe.key === props.indexOfRecipeToView)
    setCurrentRecipe(item)
  }, [])

  const recipeIngredients = currentRecipe?.ingredients?.map(
          (ingredient, index) => <li key={index}>{ingredient.phrase.replaceAll("\"", "")}</li>);

  const recipeSteps = currentRecipe?.steps?.map(
          (step, index) => <li key={index}>{step}</li>);

  return (
    
      <>
          {/* view popup modal */}
          <Modal show={props.showViewPopup} onHide={props.handleCloseViewPopup}>
              
              {/* modal header with title, edit button, and close button */}
              <Modal.Header closeButton>
                  <Modal.Title>Recipe Title</Modal.Title>
                  <button onClick={() => handleOpenEditPopup(props.indexOfRecipeToView)}>Edit</button>
              </Modal.Header>
              
              {/* modal body with recipe info - NEXT */}
              <Modal.Body>
                  <div className="row">
                      
                      {/* recipe image */}
                      <div className='col-6'>
                          <div id="image">{currentRecipe?.picture}</div>
                      </div>
                      
                      {/* energy and time required for this recipe */}
                      <div className='col-6'>
                          <h6>Energy Required</h6>
                          <p>{currentRecipe?.energyRequired !== "" ? currentRecipe?.energyRequired + " Energy" : ""}</p>
                          <h6>Time Required</h6>
                          <p>{currentRecipe?.hoursRequired !== "0" ? currentRecipe?.hoursRequired + " hours " : ""}{currentRecipe?.minsRequired !== "0" ? currentRecipe?.minsRequired + " mins" : ""}</p>
                      </div>
                  </div>

                  {/* recipe tags */}
                  <h6>Tags</h6>
                  <p>{currentRecipe?.tags?.join(", ")}</p>
                  
                  {/* recipe ingredients */}
                  <h6>Ingredients</h6>
                  <ul>{recipeIngredients}</ul>
                  
                  {/* recipes steps */}
                  <h6>Steps</h6>
                  <ol>{recipeSteps}</ol>
                  
                  {/* recipe notes */}
                  <h6>Notes</h6>
                  <p id="notes">{currentRecipe?.notes}</p>
                    <HandleAddtoMealPlan groceryList={props.groceryList} addToGL={props.addToGL}></HandleAddtoMealPlan>
                  <button>Recipe Complete</button>
              </Modal.Body>
          </Modal>
          <EditRecipePopup recipes={props.recipes} setRecipes={props.setRecipes} showEditPopup={showEditPopup} handleCloseEditPopup={handleCloseEditPopup} setInputs={setInputs} inputs={inputs} indexOfRecipeToEdit={indexOfRecipeToEdit} tagsInStringForm={tagsInStringForm} setTagsInStringForm={setTagsInStringForm} ingredientsInStringForm={ingredientsInStringForm} setIngredientsInStringForm={setIngredientsInStringForm} stepsInStringForm={stepsInStringForm} setStepsInStringForm={setStepsInStringForm}></EditRecipePopup>

      </>
      
  )
}
