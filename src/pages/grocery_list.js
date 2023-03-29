import React, { Component } from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState } from "react";
import Button from 'react-bootstrap/Button';




/**
 * actually displays items in the grocery list
 */
function ItemList() {
    return (
        <div className="row">
            <div className="col">
                <button>checkbox</button>
            </div>
            <div className="col">
                <p>item name</p>
            </div>
            <div className="col">
                -  #  +
            </div>
        </div>
    );
}

/**
 * container for list categories and their items
 */
function ListCategory (){
    return (
        <div className="category-rectangle">
            <Row>
           
                <Col>
                    <span>category name</span>
                </Col>
                <Col>
                    <button>pencil icon</button>
                </Col>
            
                <ItemList></ItemList>
                <ItemList></ItemList>
                <ItemList></ItemList>
                <ItemList></ItemList>
            </Row>
        </div>
    );
}


export default class GroceryListHome extends Component {
    
    render() {
        return (
            <Container fluid="md">
                <Row>
                    <Col xs={{span:6, offset:3}}>
                        <h1>Grocery List</h1>
                    </Col>
                    <Col xs={{span:2}}>
                        <Button>filter</Button>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button>personal</Button>
                        </div>
                    </Col>
                    <Col>
                        <div className="d-grid gap-2">
                            <Button>shared</Button>
                        </div>
                        
                    </Col>
                </Row>
                <ListCategory></ListCategory>
                <ListCategory></ListCategory>
                <ListCategory></ListCategory>
                <ListCategory></ListCategory>
                


            </Container>
        )
    }
}