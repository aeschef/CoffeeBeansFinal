
import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal"
import Form from "react-bootstrap/Form"
import Button from 'react-bootstrap/Button'
import { getDatabase, ref, set, onValue, push, remove, child, get} from 'firebase/database';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import '../css/meal_plan.css';

const EditMealTags = ({open, onClose, tags, setTags, refresh, setRefresh, prevTag, setPrevTag, editPopup, closeEditPopup}) => {

const [remove, setRemove] = useState([])
const [selectedTags, setSelectedTags] = useState([])
const [addTag, setAddTag] = useState("")

useEffect(()=> {
  if (open) {
    let arr = []
    tags?.forEach((tag)=> {
      arr.push({value: tag, checked: false})
    })
    setSelectedTags(arr)
  }
}, [open])



function handleChecked(x, index) {

  // Updates state array to store the item passed as parameter with updated checked value
  const nextTags = selectedTags.map((tag, i) => {
    if (i === index && tag.value === x.value) {
      // Switches checkmark value 
      return {value: tag.value, checked: !tag.checked}
    } else {
      // Return original tag
      return tag
    }
  });
  console.log(nextTags)
  setSelectedTags(nextTags)

}

function handleAdd() {
  if (addTag) {
    const db = getDatabase()
    const tagRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/tags");

    // Adds new tag to the database if user creates a tag
    if (tags) {
    let arr = [...tags, addTag]

    set(tagRef, arr)

    } else {
      let newArr = [{value: addTag, checked:false}]
      set(tagRef, newArr)
    }

    // Updates state array
    setSelectedTags([...selectedTags, {value: addTag, checked: false}])
    setAddTag("")
  }
}

// Remove the tags from the meals in the meal plan
function handleRemove() {

  // Stores an array of all the checked off tags
  let oldArr = selectedTags.filter((tag) => tag.checked ? tag : null)
  let arr = oldArr.map((tag)=>tag.value)

  // determines if current meal being edited needs to have its tag reset
  if (arr.indexOf(prevTag) > -1) {
    setPrevTag({value:"", label:""})
  }
  
  console.log("array " + arr)
  const db = getDatabase()
  const categoryRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories")
  let arrMeals = []

  // Stores all of the meal categories and pushes them to an array
  onValue(categoryRef, (snapshot) => {
    const dataCategories = []
    const catList = []
    snapshot.forEach((childsnapshot) => {
      
      // pushes meal item to array        
      let dataMeals = []

      // Stores all of the meal categories and pushes them to an array
      dataMeals = []
      catList.push(childsnapshot.key)

      // Checks to see if category has any meals associated with it
      if (!childsnapshot.val().meals) {
        dataMeals=[]
      } else {
        let keys = Object.keys(childsnapshot.val()?.meals);
        keys.forEach((id) => {
        console.log("i am here")

        // Meal includes one of the tags that is needing to be removed
        if (arr.indexOf(childsnapshot.val().meals[id].tags) > -1) {
          console.log("tag of child " + childsnapshot.val().meals[id].tags)

          const mealRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/categories/"+childsnapshot.key+"/meals/"+id+"/tags")
          set(mealRef, "")
        }

        })
      }
    }) 
  }, {onlyOnce: true})

  let updatedTagList = selectedTags.filter((tag)=> !tag.checked ? tag : null) 
  let updatedTagListArr = updatedTagList.map((tag)=>tag.value)

  const tagsRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/tags")
  set(tagsRef, updatedTagListArr)
  onClose()
  closeEditPopup()
  setRefresh(true)
}
return (            
<Modal show={open} onHide={onClose} centered>
  <Modal.Header closeButton>
      <Modal.Title>Edit Tags</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div className="left-spacing">
  <Form className="d-flex justify-between">
    {/* Allows user to add a tag*/}
    <Button variant="primary" onClick={()=>handleAdd()} className="style-add">Add</Button>

    <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Create tag"
                  autoFocus
                  onChange={(e) => setAddTag(e.target.value)}
                  className="style-add"
                  value={addTag}
                />
    </Form>
    {/* Allows user to select pre-existing tags to delete them */}
    {selectedTags?.map((x, i) => (
      x.value && 
      <div key={i} className="color-checked">
      <input type="checkbox" value={x.checked} onChange={()=>handleChecked(x, i)}/>
      <span className="text-tag">{x.value}</span>
      </div>
    ))}

    {selectedTags.length === 0 && <div>No existing tags. Create one above! </div>}
    {/* Checkbox that keeps track of whether meal was completed or not. */}

  </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={()=>handleRemove()}>Delete selected tags</Button>
  </Modal.Footer>
</Modal>)

} 

export default EditMealTags