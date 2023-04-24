import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import "../recipes.css";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Row';
import Dropdown from 'react-bootstrap/DropDown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { getDatabase, ref, child, push, update, get, query, orderByChild, onValue, remove } from "firebase/database"
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


/* Retrieve ingredients for thsi recipe from the database Display in the */
const IngredientItems = ( { recipes, index, currentRecipe}) => {
    return (
        <>
            {currentRecipe.ingredients.map((ingredient)=>(
                <Dropdown.Item eventKey={ingredient.focus} key={ingredient.focus}>{ingredient.focus} </Dropdown.Item>
            ))}
        </>
    )
}

const OutOfIngredients = (props) =>{
    
    const [show, setShow] = useState(false);
    const [ingredients, setIngredients] = useState([]);
    const [ingList, setIngList] = useState([]);
    const [remInv, setRemInv] = useState(false);
    const [addToGL, setAddToGL] = useState(false);
    const [chosenItem, setChosenItem] = useState("");
    const [categories, setCategory] = useState([]);

    const showModal = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };
    
    const handleAddGL = () => {
        setAddToGL(!addToGL);
    };

    const handleRemInv = () =>{
        setRemInv(!remInv);
    };

    // stores the item user chose from dropdown
    const handleSelect = (e) => {
        console.log('saving' + e);
        setChosenItem(e);
    }

    /**
     * Creates array that is used to display personal GL
     */
    useEffect(() => {
        const auth = getAuth(props.app);
        const dbRefP = ref(getDatabase(), '/users/' + auth.currentUser.uid + '/grocery_list/categories/');
        onValue(dbRefP, (snapshot) => {
            const dataCat = []
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                let dataGL = []
                const childData = childSnapshot.val();
                dataGL = { childData };
                dataCat.push({ value: childKey, data: childData })
            });
            setCategory(dataCat);
        }, {
            onlyOnce: true
        });
    })

    /**
     *  Saves changes requested by user. Either adds selected item to the Grocery List or removes it 
     *  from the inventory, or both.
     */
    const handleSave = () => {
        handleClose();
        const auth = getAuth(props.app)
        const database = getDatabase();

        // remove item from the inventory
        if(remInv){
            console.log('removing from inventory ');
            let inventoryRef = ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories');

            // for every ingredient in the recipe
            onValue(inventoryRef, (snapshot) => {
                props.recipes[props.index].ingredients.map( item => {
                    snapshot.forEach((childSnapshot) =>{
                        let category = childSnapshot.key;
                        childSnapshot.forEach((thing)=>{
                            // is it a match?
                            if(chosenItem === thing.val().item_name){
                                // remove
                                remove(ref(database, '/users/' + auth.currentUser.uid + '/inventory/categories/' + category +'/' + thing.key));
                            }
                        })                    
                    })
                });
            })        
        } 



        // Add items in ingredients to the grocery list
        if(addToGL){
            console.log("adding to GL");
            let found  = false;
            let count_c = 0;
            // retrieve the categories from the database
            categories.map(category => {
                let lowerCaseCategory = category.value.toLowerCase();
                // found category we need?
                if(lowerCaseCategory === 'ingredients'){
                    let count = 0;
                    //count the items already in the GL
                    category.data.map((cat, i) => {
                        count = i;
                    })
                    
                    console.log(count);
                    count++;
                    // add chosenIngredient to grocery list
                    let itemAdd= {};
                    const item = {item_name: chosenItem, item_num: 1};
                    itemAdd[count] = item;
                    update(ref(database, '/users/' + auth.currentUser.uid + '/grocery_list/categories/Ingredients'), itemAdd);
                    found = true;                
                }
                count_c += 1;
            });

            // We did not already have ingredient tab... make one!
            if(!found){
                console.log("couldn't find");
                // add category + item
                let add = {};
                const item = {item_name: chosenItem, item_num:1};
                add[count_c] = {value: 'Ingredients'};

                console.log(add);

                let itemAdd= {};
                itemAdd[0] = item;

                update(ref(database, '/users/' + auth.currentUser.uid + '/grocery_list/categories/Ingredients'), itemAdd);
            }
        }
    };




    return (        
        <>
            <Button id='ran-out-of-ingredient-alt' variant='link' onClick={showModal}> Run out of something? click here! </Button>

            {/* add to GL popup modal */}
            <Modal show={show} onHide={handleClose} centered  
                    backdrop="static" keyboard={false}>
              
              {/* modal header with title */}
              <Modal.Header closeButton>
                  <Modal.Title>Ran Out of an Ingredient?</Modal.Title>
              </Modal.Header> 

              {/* modal body with dropdown checkers and submit button */}
              <Modal.Body>
                <Container> 
                    <Row>
                        <DropdownButton id='select-ingredients' 
                            title='select ingredient' 
                            onSelect={handleSelect}>

                            <IngredientItems ingList={ingList} 
                                setIngredients={setIngredients}
                                recipes={props.recipes}
                                index={props.index}
                                currentRecipe={props.currentRecipe}>

                            </IngredientItems>
                            
                        </DropdownButton>
                    </Row>
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
                                onChange={handleAddGL}
                            />
                            Add this ingredient to my grocery list.
                        </label>
                    </Row>
                    <Row>    
                        <Button variant='success' onClick={handleSave}>Submit</Button>
                    </Row>
                </Container>
              </Modal.Body>
          </Modal>
        </>

    );
};

export default OutOfIngredients
