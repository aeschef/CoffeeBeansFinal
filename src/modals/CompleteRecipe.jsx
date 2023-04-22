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



/* Retrieve's the current recipe's ingredients from database and displays them 
    in an unordered list with checkboxes*/
const IngredientItems = ({ ingList, setIngredients, recipes, index}) => {

    // add ingredient to list if checked
    const addIngredient = (event) => {
        setIngredients([
            ...ingList,
            event.target.value
        ]);
    }

    //display list
    return (
        <>
            {recipes[index].ingredients.map((ingredient)=>(
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


/**
 * In charge of displaying Modal that allows user to add meal to their meal plan.
 */
const CompleteRecipe = (props) => {
    
    const [show, setShow] = useState(false);

    const [remInv, setRemInv] = useState(false);

    const [addToGL, setAddToGL] = useState(false);

    // database info
    const auth = getAuth(props.app)
    const db = getDatabase(props.app)
    
    const [ingList, setIngredients] = useState([]);

    const showModal = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    /* Removes all ingredients of the recipe from the inventory. */
    const handleSelect = () => {
        handleClose();

        const auth = getAuth(props.app)
        const database = getDatabase();
        let inventoryRef = ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories');

        // for every ingredient in the recipe
        onValue(inventoryRef, (snapshot) => {
            props.recipes[props.index].ingredients.map( item => {
                snapshot.forEach((childSnapshot) =>{
                    let category = childSnapshot.key;
                    childSnapshot.forEach((thing)=>{
                        // is it a match?
                        if(item.focus === thing.val().item_name){
                            // remove
                            remove(ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories/' + category +'/' + thing.key));
                        }
                    })                    
                })
            });
        })        
    };

    /**
     * Removes selected ingredients of the recipe from the inventory
     */
    const handleSave = () => {
        handleClose();
        const auth = getAuth(props.app)
        const database = getDatabase();
        let inventoryRef = ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories');
        
        // for every ingredient in ingredients list check database
        onValue(inventoryRef, (snapshot) => {
            ingList.map( item => {
                snapshot.forEach((childSnapshot) =>{
                    let category = childSnapshot.key;
                    childSnapshot.forEach((thing)=>{
                        // is it a match?
                        if(item === thing.val().item_name){
                            remove(ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories/' + category +'/' + thing.key));
                        }
                    })                    
                })
            });
        })        
    };                  

    return (        
        <>
            {/*  */}
            <Button id='ran-out-of-ingredient' onClick={showModal}>Recipe Complete</Button>

             {/* add to GL popup modal */}
            <Modal show={show} onHide={handleClose} centered  
                    fullscreen={true} >
              
              {/* modal header with title */}
              <Modal.Header closeButton>
                  <Modal.Title>Recipe Complete</Modal.Title>
              </Modal.Header> 

              {/* modal body with dropdown checkers and submit button */}
              <Modal.Body>
                <Container> 
                    <h5>Remove Ingredients from Inventory</h5>

                    <Button onClick={handleSelect}> Add All </Button>
                    <IngredientItems ingList={ingList} 
                                setIngredients={setIngredients}
                                recipes={props.recipes}
                                index={props.index}></IngredientItems>
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

export default CompleteRecipe



