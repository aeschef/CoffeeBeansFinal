
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './App.css';
import './css/meal_plan.css';
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import CreateMeal from "./modals/CreateMeal"
import EditMealCategory from './modals/EditMealCategory';
import SignupHome from './signup'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";

const LoginHome = () => {
  return (
    <div>
    <div className="d-flex justify-content-center align-items-center"><h3>Sign In</h3></div>
    <div className="d-flex justify-content-center align-items-center">
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form></div>
    <div className="d-flex justify-content-center align-items-center"><h5>Don't have an account? 
    <BrowserRouter>
        <Routes>
            <Route path="/signup.js" element={
                <SignupHome/> 
            } />
        </Routes>
        <Link to="/signup.js">List</Link>
    </BrowserRouter>

      </h5></div>
    </div>
  );
};

export default LoginHome;