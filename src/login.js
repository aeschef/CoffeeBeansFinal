import Button from 'react-bootstrap/Button';
import './App.css';
import './css/meal_plan.css';
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react';
import SignupHome from './signup'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import Modal from 'react-bootstrap/Modal';
import { getDatabase, ref, set, onValue, push } from 'firebase/database';


// Screen that is displayed when user is first logging in
const LoginHome = ({login, setLogin, auth}) => {
  // Stores the user email and password that user inputs in text fields. 
  const [password, setPassword] = useState("")
  const [user, setUser] = useState("")

  // Keeps track of when user entered invalid login information
  const [error, setError] = useState(false)

  // Handles login errors and user verification. 
  const handleLogin = () => {
    if (password && user) {
      // console.log(auth.currentUser.uid);
      // Method ensures that hte entered email and password are valid. 
      // Has to concatenate fake domain name to the user's username in order to login
        signInWithEmailAndPassword(auth, user, password)
        
        // If the login was valid: 
        .then(() => {
          // console.log(auth.currentUser.uid);
          // auth.currentUser keeps track of who is currently logged in 
          setUser(auth.currentUser)

          // Indicates that the home screen can be displayed
          setLogin(true)

          // auth.currentUser keeps track of who is currently logged in 
          console.log("current user is " + auth.currentUser)
          // console.log(auth.currentUser.uid)

        })

        // If the user entered the wrong email or password:
        .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        // If the user's login was not valid, display error message
        if (errorCode === 'auth/wrong-password') {
          // alert('Wrong password.');
          setError(true)
        } else {
          setError(true)
          // alert(errorMessage);
        }
      });
    } else {
      setError(true)
    }
  };


  return (
    <div>
      {/* Modal that appears when 7 error occurs for user logging in. */}
      <Modal show={error} onHide={()=>setError(false)}>
              
        {/* modal header with title, edit button, and close button */}
        <Modal.Header closeButton>
            <Modal.Title>Error Logging In</Modal.Title>
        </Modal.Header>
        
        {/* modal body with info - NEXT */}
        <Modal.Body>
          <div>An error occurred with your login. Your email or password may be incorrect. Try again! </div>
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={()=>setError(false)}>Close</Button>
        </Modal.Footer>
      </Modal>


    <div className="d-flex justify-content-center align-items-center"><h3>Sign In</h3></div>
    <div className="d-flex justify-content-center align-items-center">
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        
        {/* Field where user enters their username */}
        <Form.Label>Email</Form.Label>
        <Form.Control type="text" placeholder="Enter email" value={user} onChange={(e)=>setUser(e.target.value)}/>
      </Form.Group>

      {/* Field where user enters password */}
      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Check me out" />
      </Form.Group>
      <Button variant="primary" onClick={handleLogin}>
        Submit
      </Button>
    </Form></div>
    <div className="d-flex justify-content-center align-items-center"><h5>Don't have an account? 
    <BrowserRouter>
        <Routes>
            <Route path="/signup.js" element={
                <SignupHome createUser={createUserWithEmailAndPassword} login={login} setLogin={setLogin} auth={auth} /> 
            }/>
        </Routes>
        <Link to="/signup.js">Sign up</Link>
    </BrowserRouter>

      </h5></div>
    </div>
  );
};

export default LoginHome;