
import { useState, useEffect } from 'react'
import Modal from "react-bootstrap/Modal"
import Button from 'react-bootstrap/Button'
import '../css/meal_plan.css';
import { getDatabase, ref, set, onValue, push, child, remove} from 'firebase/database';
import { getAuth} from "firebase/auth";

// Sets filter to only display meals that have the checked off tags
const FilterMealTags = ({open, onClose,  showTags, setShowTags, refreshFilter, setRefreshFilter}) => {

const [remove, setRemove] = useState([])
const [selectedTags, setSelectedTags] = useState([])
const [tags, setTags] = useState([])
const [selectAll, setSelectAll] = useState(false)

// Keeps track of which tags are checked and unchecked
useEffect(()=> {


  if (open) {
    const db = getDatabase()
    let tagsArr = []
    // updates tags state variable so that it stores the saved tags from the user's database
    const tagRef = ref(db, 'users/' + getAuth().currentUser.uid + "/meal_plan/tags");
    onValue(tagRef, (snapshot) => {
      tagsArr = snapshot.val();
    });
    let arr = []
    tagsArr?.forEach((tag)=> {
      // If the current tag is already incluedd in the filter, keep it checked
      if ((showTags && showTags.indexOf(tag) > -1) || (showTags === null) || (showTags.length === 0)) {
        arr.push({value: tag, checked: true})
      } else {
        arr.push({value: tag, checked: false})
      }

    })
    if ((showTags === null) || (arr.length === showTags.length)) {
      setSelectAll(true)
    }
    setSelectedTags(arr)
  }
}, [open])


function handleAll() {
  
  const nextTags = selectedTags.map((tag, i) => {
      // Sets checkmark value to false to deselect
      return {value: tag.value, checked: !selectAll}
    
  });
  console.log(nextTags)
  setSelectedTags(nextTags)
  setSelectAll(!selectAll)
  
}
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

function handleFilter() {
  
  // Stores an array of all the checked off tags, aka the tags that should still be displayed
  let oldArr = selectedTags.filter((tag) => tag.checked ? tag : null)
  let arr = oldArr.map((tag)=>tag.value)
  console.log("included " + arr)
  setShowTags(arr)
  setRefreshFilter(true)
  onClose()
}

return (            
<Modal show={open} onHide={onClose} centered>
  <Modal.Header closeButton>
      <Modal.Title>Edit Tags</Modal.Title>
  </Modal.Header>
  <Modal.Body>
  <div className="left-spacing">

    {/* Allows user to select which tags they want to display */}
    {selectedTags && 
      <div className="color-checked">
        <input type="checkbox" value="All" checked={selectAll} onChange={handleAll}/>
        <span className="text-tag">Select all</span>
      </div>

    }

    {selectedTags?.map((x, i) => (
      x.value && 
      <div key={i} className="color-checked">
        <input type="checkbox" value={x.checked} checked={x.checked} onChange={()=>handleChecked(x, i)}/>
        <span className="text-tag">{x.value}</span>
      </div>
    ))}

    {/* Checkbox that keeps track of whether meal was completed or not. */}

  </div>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={()=>handleFilter()}>Confirm</Button>
  </Modal.Footer>
</Modal>)

} 
export default FilterMealTags