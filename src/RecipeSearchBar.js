// credit: https://plainenglish.io/blog/how-to-implement-a-search-bar-in-react-js

import React, {useState} from 'react'

export default function SearchBar(props) {
    
    const handleChange = (event) => {
        props.setSearchInput(event.target.value);
    }

    return (
        <input
            type="text"
            placeholder="Search"
            onChange={handleChange}
            value={props.searchInput}>
        </input>
    )
}
