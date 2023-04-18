import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Row';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, remove } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import ToggleButton from 'react-bootstrap/ToggleButton';

const addIngredient = ({ingredient, ingredients, setIngredients}) => {
    setIngredients([
        ...ingredients,
        ingredient
    ]);
}

/* Retrieve ingredients for thsi recipe from the database Display in the */
const IngredientItems = ({ingredients, setIngredients, recipeRef, }) => {
    let database = getDatabase();        
    let ingredientRef = ref(database, recipeRef);
    const [checked, setChecked] = useState(false);
    return (
        <>
            {/* for every ingredient in ingredients list check database */}
            {onValue(ingredientRef, (snapshot) => {
                snapshot.forEach((childSnapshot) =>{
                    childSnapshot.forEach((ingredient) =>{
                        <Row>
                            <ToggleButton
                                className="mb-2"
                                id="toggle-check"
                                type="checkbox"
                                variant="outline-secondary"
                                checked={checked}
                                value="1"
                                onChange={() => addIngredient(ingredient, ingredients, setIngredients)}
                            >
                                {ingredient}
                            </ToggleButton>
                    </Row>
                    });
                });
            })}
        </>
    )
}

const HandleAddtoMealPlan = (props) =>{
    
    const [show, setShow] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [remInv, setRemInv] = useState(false);

    const [addToGL, setAddToGL] = useState(false);




    const showModal = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleAddGL = () => {
        setRemInv(!remInv);
    };

    const handleRemInv = () =>{
        setAddToGL(!addToGL);
    };

    const handleSave = () => {
        const database = getDatabase();
        if(remInv){
            let inventoryRef = ref(database, '/user/' + props.auth.currentUser.uid + '/inventory/');
            // for every ingredient in ingredients list check database
            onValue(inventoryRef, (snapshot) => {
                ingredients.map( item => {
                    snapshot.forEach((childSnapshot) =>{
                        if(item === childSnapshot.val()){
                            // remove
                            remove(ref(database, '/user/' + props.auth.currentUser.uid + '/inventory/'+ childSnapshot.key));
                        }
                    });
                }); 
            });
        } 

        // Add items in ingredients to the grocery list
        if(addToGL){
            let found  = false;
            let count_c = 0;
            // retrieve the categories from the database
            props.databaseCatGL.map(category => {
                let lowerCaseCategory = category.value.toLowerCase();
                // found category we need?
                if(lowerCaseCategory === 'ingredients'){
                    let count = 0;
                    //count the items already in the GL
                    category.data.map((cat, i) => {
                        count = cat;
                    })
                    console.log(count);
                    //need to do for every ingredient in..ingredients
                    ingredients.map( (itemName) => {
                        const item = {item_name: itemName, item_num: 1};
                        push(ref(database, '/users/' + props.auth.currentUser.uid + '/grocery_list/categories/Ingredients'), item);
                        found = true;
                    })
                    
                }
                count_c += 1;
            });

            // We did not already have ingredient tab... make one!
            if(!found){
                // add category + item
                let add={};
                const item = {item_name: ingredients[0], item_num:1};
                add[count_c] = {value: 'Ingredients'};
                console.log(add);
                let itemAdd= {};
                itemAdd[0] = item;
                update(ref(database, '/users/' + props.auth.currentUser.uid + '/grocery_list/categories/Ingredients'), item);
                //THEN add the rest of the items
                let count = 0;
                ingredients.map( (itemName) => {
                    //skip the first
                    if(count != 0){
                        // add the rest
                        const item = {item_name: itemName, item_num: 1};
                        update(ref(database, '/users/' + props.auth.currentUser.uid + '/grocery_list/categories/Ingredients'), item);
                        found = true;
                    }
                    count += 1;
                })

            }
        }
    };




    return (        
        <>
            {/*  */}
            <Button id='ran-out-of-ingredient' onClick={showModal}> Run out of something? click here! </Button>

             {/* add to GL popup modal */}
            <Modal show={show} onHide={handleClose} centered  
                    keyboard={false} >
              
              {/* modal header with title */}
              <Modal.Header closeButton>
                  <Modal.Title>Add Items to Grocery List?</Modal.Title>
              </Modal.Header> 

              {/* modal body with dropdown checkers and submit button */}
              <Modal.Body>
                <Container> 
                    <Button> Select All </Button>
                    <IngredientItems ingredients={ingredients} 
                                setIngredients={setIngredients} 
                                recipeRef={props.recipeRef}>stuff</IngredientItems>

                    
                    <Row>
                        {/* checkbox */}
                        <label >
                            <input
                                type="checkbox"
                                name="lang"
                                // value={x.value}
                                onChange={handleRemInv}
                            />
                            Remove this ingredient from my inventory.
                        </label>
                    </Row>
                    <Row>
                        {/* checkbox */}
                        <label>
                            <input
                                type="checkbox"
                                name="lang"
                                // value={}
                                onChange={handleAddGL}
                            />
                            Add this ingredient to my grocery list.
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
};

export default HandleAddtoMealPlan



