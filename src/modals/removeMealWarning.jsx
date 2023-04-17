
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect } from 'react';
import '../App.css';
import '../css/meal_plan.css';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

const RemoveMealWarning = ({ open, setOpen, viewPopup, closeViewPopup, remove, setRemove, category, mealId, openEdit, closeEdit, refresh, setRefresh}) => {


useEffect(()=> {
  if (remove) {
    const db = getDatabase()
    console.log(mealId)
    console.log(category)
    const deleteMealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+category+"/meals/"+mealId)
    set(deleteMealRef, null)
    closeEdit(false)
    setOpen(false)
    closeViewPopup(false)
    setRefresh(true)
  }
}, [remove])
return (
  <>
  <Modal show={open} onHide={()=>setOpen(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Delete Meal</Modal.Title>
    </Modal.Header>
    
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Are you sure you want to delete the meal? This action cannot be undone.</Form.Label>

        </Form.Group>
      </Form>
    </Modal.Body>

    <Modal.Footer className="d-flex justify-content-between fixed">
      <Button variant="primary" onClick={()=>setOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={()=>setRemove(true)}>
        Confirm
      </Button>
    </Modal.Footer>
  </Modal>
</>
  
)

}

export default RemoveMealWarning