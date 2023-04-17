
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import '../App.css';
import '../css/meal_plan.css';
import Modal from "react-bootstrap/Modal";
import Form from 'react-bootstrap/Form'
import { getDatabase, ref, set, onValue, push } from 'firebase/database';
import { getAuth} from "firebase/auth";


// Modal popup that warns a user before they delete a category on the meal plan screen
const DeleteMealCategoryPopup = ({ open, setOpen, openEdit, closeEdit, category, refresh, setRefresh}) => {

const [remove, setRemove] = useState(false)

// Deletes category and associated quota and meals
useEffect(()=> {
  if (remove) {
    const db = getDatabase()
    console.log(category)
    const deleteCategoryRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+category)
    set(deleteCategoryRef, null)
    closeEdit(false)
    setOpen(false)
    setRefresh(true)
  }
}, [remove])

return (
  <>
  <Modal show={open} onHide={()=>setOpen(false)} centered>
    <Modal.Header closeButton>
      <Modal.Title>Delete Category</Modal.Title>
    </Modal.Header>
    
    <Modal.Body>
      <Form>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>
            Are you sure you want to delete the category?
            Please note that all meals assigned with the category will also be deleted.
          </Form.Label>

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

export default DeleteMealCategoryPopup