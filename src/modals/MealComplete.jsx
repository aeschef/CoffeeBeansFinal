import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Row';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, remove, set } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import ToggleButton from 'react-bootstrap/ToggleButton';



/* Retrieve ingredients for thsi recipe from the database Display in the */
const IngredientItems = ({ ingList, setIngredients, recipes, index, currentRecipe}) => {

    const addIngredient = (event) => {
        setIngredients([
            ...ingList,
            event.target.value
        ]);
    }

    return (
        <>
            {currentRecipe.ingredients.map((ingredient)=>(
               <label>
               <input type="checkbox"
                value={ingredient.focus}
                onChange={addIngredient}
               />
               {ingredient.focus}
           </label> 
            ))}
        </>
    )
}

const HandleAddtoMealPlan = (props) => {
    
    const [show, setShow] = useState(false);

    const [remInv, setRemInv] = useState(false);

    const [addToGL, setAddToGL] = useState(false);

    // database info
    const auth = getAuth(props.app)
    const db = getDatabase(props.app)

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const [tags, setTags] = useState(null)

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // getting a reference to the 'meal plan - categories' section of this user's area of the database
        const dbMPCategoriesRef = ref(db, '/users/' + auth.currentUser.uid + '/meal_plan/categories/');

        // runs upon startup and every time the data changes
        onValue(dbMPCategoriesRef, (snapshot) => {
            
            // getting data from the spot in the db that changes
            // good source: https://info340.github.io/firebase.html#firebase-arrays
            const allCategoriesObject = snapshot.val();
            const allCategoriesKeys = Object.keys(allCategoriesObject);
            console.log(allCategoriesKeys);
            setCategories(allCategoriesKeys);
        });

      const tagsRef = ref(db, '/users/' + auth.currentUser.uid + '/meal_plan/tags');
      onValue(tagsRef, (snapshot)=> {
        setTags(snapshot.val())
      }, {onlyOnce: true})

    }, []);
    
    const [ingList, setIngredients] = useState([]);

    const showModal = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleSelect = () =>{
        setIngredients(props.currentRecipe.ingredients);
    };

    const handleSave = () => {
        handleClose();
        const auth = getAuth(props.app)
        const database = getDatabase();
        let inventoryRef = ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories');
        // for every ingredient in ingredients list check database
        onValue(inventoryRef, (snapshot) => {
            console.log("inv" + snapshot.val());
            ingList.map( item => {
                console.log("map" + item);
                snapshot.forEach((childSnapshot) =>{
                    let category = childSnapshot.key;
                    childSnapshot.forEach((thing)=>{
                        console.log("thing: " + thing.val().item_name)
                        if(item === thing.val().item_name){
                            console.log("removing" + '/users/' + auth.currentUser.uid + '/inventory/categories/' + category +'/' + thing.key);
                            // remove

                            remove(ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories/' + category +'/' + thing.key));
                        }
                    })                    
                })
            });
        })

        // getting a reference to the 'meals' section of the selected category
        const dbCategoryMealsRef = ref(db, '/users/' + auth.currentUser.uid + '/meal_plan/categories/' + selectedCategory + '/meals/');

        // getting a reference to new place to post
        var newMealPostRef = push(dbCategoryMealsRef);

        set(newMealPostRef, {
            completed: false,
            label: props.index,
            notes: "",
            tags: selectedDay,
            type: "Recipe"
        });
    };                  

    return (        
        <>
            {/*  */}
            <Button id='ran-out-of-ingredient' onClick={showModal}>Recipe Complete</Button>

             {/* add to GL popup modal */}
            <Modal show={show} onHide={handleClose} centered  
                    keyboard={false} >
              
              {/* modal header with title */}
              <Modal.Header closeButton>
                  <Modal.Title>Recipe Complete</Modal.Title>
              </Modal.Header> 

              {/* modal body with dropdown checkers and submit button */}
              <Modal.Body>
                <Container> 
                    <h5>Add to Meal Plan</h5>
                    <h6>Category</h6>
                    <select defaultValue="default" onChange={(event) => setSelectedCategory(event.target.value)}>
                        <option value="default" hidden> </option>
                        {categories.map((category, index) => <option key={index} value={category}>{category}</option>)}
                    </select>

                    <h6>Tag</h6>
                    <select defaultValue="default" onChange={(event) => setSelectedDay(event.target.value)}>
                
                        <option value="default" hidden> </option>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                    </select>

                    <br></br>
                    <h5>Remove Ingredients from Inventory</h5>

                    <Button onClick={handleSelect}> Select All </Button>
                    <IngredientItems ingList={ingList} 
                                setIngredients={setIngredients}
                                recipes={props.recipes}
                                index={props.index}
                                currentRecipe={props.currentRecipe}>
                                </IngredientItems>
                    <Row>
                        <Col>
                            <Button variant="danger" onClick={handleClose}>Cancel</Button>
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
};

export default HandleAddtoMealPlan


