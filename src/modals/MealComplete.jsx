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



/* Retrieve ingredients for thsi recipe from the database Display in the */
const IngredientItems = ({ ingList, setIngredients, recipes, index}) => {

    const addIngredient = (event) => {
        setIngredients([
            ...ingList,
            event.target.value
        ]);
    }

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

const HandleAddtoMealPlan = (props) =>{
    
    const [show, setShow] = useState(false);
    const [ingList, setIngredients] = useState([]);

    const showModal = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    const handleSave = () => {
        const auth = getAuth(props.app)
        const database = getDatabase();
        let inventoryRef = ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories');
        // for every ingredient in ingredients list check database
        onValue(inventoryRef, (snapshot) => {
            console.log("inv" + snapshot.val());
            ingList.map( item => {
                console.log("map" + item);
                snapshot.forEach((childSnapshot) =>{
                    console.log("child" + childSnapshot.val());
                    if(item === childSnapshot.val()){
                        // remove
                        remove(ref(database, '/user/' + auth.currentUser.uid + '/inventory/'+ childSnapshot.key));
                    }
                });
            }); 
        });
    }

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
                    <IngredientItems ingList={ingList} 
                                setIngredients={setIngredients}
                                recipes={props.recipes}
                                index={props.index}></IngredientItems>
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



