import React from "react";
import './css/tags.css';
import Button from "react-bootstrap/Button"
import {useState} from "react"

const TagsInput = props => {
  const [chosen, setChosen] = useState(false)

  // Adds a tag to the selected tag list and when the user presses enter
  const addTags = event => {
      if ((event.key === "Enter" && event.target.value !== "") || chosen) {

          // tags contains the entire list of pre-existing tags that will be populated in a dropdown for user to chose from
          // Will only add the tag to the tags list if it was not in there yet
          if (props.tags?.indexOf(event.target.value) <= -1) {
            props.setTags([...props.tags, event.target.value])
          }
          console.log([...props.tags, event.target.value]);

          // selectedTags contains the tags that the user has selected so far
          if (props.setSelectedTags) {
            props.setSelectedTags([...props.selectedTags, event.target.value])

          } else {
            props.setSelectedTags([event.target.value])
          }
          event.target.value = "";
          setChosen(false)
      }
  };

  const removeTags = (index) => {
    props.setTags([...props.tags?.filter(tag => props.tags.indexOf(tag) !== index)]);

    // Removes the tag from the selected Tags list
    let arr = props.selectedTags.filter((tag, i) => i !== index)
    props.setSelectedTags(arr)
  };

  return (
    <div className="tags-input">
      {/* Will display the list of tags that the user has selected */}
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
        {/* Displays a dropdown of pre-existing tags */}
        <datalist id="meal-tags">
          {props.tags.map((tag) => (
            <option value={tag} onClick={event => addTags(event)}/>
          ))}
        </datalist>

    </div>
    );
};
export default TagsInput;