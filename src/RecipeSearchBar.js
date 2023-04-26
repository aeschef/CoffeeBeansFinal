// credit: https://plainenglish.io/blog/how-to-implement-a-search-bar-in-react-js

import React, { useState } from 'react'
import "./recipes.css";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function SearchBar(props) {

    const handleChange = (event) => {
        props.setSearchInput(event.target.value);
    }

    return (
        <div className='col-6'>
            <Col id='search_bar'>
                <input
                    type="text"
                    placeholder={props.placeholder}
                    onChange={handleChange}
                    value={props.searchInput}>
                </input>
            </Col>
        </div>


    )
}
