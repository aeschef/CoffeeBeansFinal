// credit: https://plainenglish.io/blog/how-to-implement-a-search-bar-in-react-js

import React, {useState} from 'react'
import SearchIcon from './svg/search.svg'
import './css/search.css'

export default function SearchBar(props) {
    
    const handleChange = (event) => {
        props.setSearchInput(event.target.value);
    }

    return (
        <div className='search-bar'>
            <img src={SearchIcon}></img>
            <input
                type="text"
                placeholder={props.placeholder}
                onChange={handleChange}
                value={props.searchInput}>
            </input>
        </div>
    )
}
