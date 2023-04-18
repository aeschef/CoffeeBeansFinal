import React from "react";
import './css/tags.css';
import Button from "react-bootstrap/Button"
import {useState} from "react"

const TagsInput = props => {
  const [chosen, setChosen] = useState(false)
  const addTags = event => {
      if ((event.key === "Enter" && event.target.value !== "") || chosen) {

          // TODO: prevent adding duplicate labels to the tags list
          props.setTags([...props.tags, event.target.value])
          console.log([...props.tags, event.target.value]);
          props.setSelectedTags([...props.selectedTags, event.target.value])
          event.target.value = "";
          setChosen(false)
      }
  };

  const removeTags = index => {
    props.setTags([...props.tags?.filter(tag => props.tags.indexOf(tag) !== index)]);
    props.setSelectedTags(...props.selectedTags?.filter(tag => props.selectedTags.indexOf(tag) !== index))
  };

  return (
    <div className="tags-input">
        {props.selectedTags?.map((tag, index) => (
            <div className="tag-listed">
                <span id="tags">{tag}</span>
                  <i
                      className=""
                      onClick={() => removeTags(index)} 
                  >
                      <Button variant="btn-close">X</Button>
                  </i>
              </div> 
           
          ))}
        <input
            type="text"
            onKeyUp={event => addTags(event)}
            placeholder="Press enter to add tags"
            className="enter-tags"
            list="meal-tags"
        />
        <datalist id="meal-tags">
          {props.tags.map((tag) => (
            <option value={tag} onClick={event => addTags(event)}/>
          ))}
        </datalist>

    </div>
    );
};
export default TagsInput;