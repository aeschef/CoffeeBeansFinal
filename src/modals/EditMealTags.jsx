


const EditMealTags = ({open, onClose, tags, setTags}) => {

const [remove, setRemove] = useState([])

return (            
<Modal show={show} onHide={handleExit} centered>
  <Modal.Header closeButton>
      <Modal.Title>Filter Options</Modal.Title>
  </Modal.Header>
  <Modal.Body>

  {tags.map((x, i) => (

    <label key={x} className="color-checked">
    {/* Checkbox that keeps track of whether meal was completed or not. */}
    <input
    type="checkbox"
    name="lang"
    value={x}
    checked={x.value.completed}
    onChange={()=>handleChecked(category.key, x.key, x.value.completed, i, j)}
    /> 
  </label>))}
  <Button variant="secondary" onClick={handleFilter}>Filter out checked off buttons</Button>
  </Modal.Body>
</Modal>)

} 

export default EditMealTags