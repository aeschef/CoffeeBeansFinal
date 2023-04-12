import Button from 'react-bootstrap/Button';
import './App.css';
import './css/meal_plan.css';
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { getDatabase, ref, set } from "firebase/database";


const SignupHome = ({createUser, login, setLogin, auth}) => {

  // Stores the user email and password that user inputs in text fields. 
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [confirmUser, setConfirmUser] = useState("");
  const [created, setAccountCreated] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [accessCode, setAccess] = useState("");


  // Keeps track of when user entered invalid login information
  const [error, setError] = useState(false)


  const handleGroupClose = () => {

  };

  //Allows this user to join groups! 
  const joinGroup =() => {

    //
  };

  // Creates a new Roommate Group in the database
  const createNewGroup = () => {
    //TODO make it unique
    let uniqueGroupID = Math.random().toString(6).slice(2, 7); 
    
    const db = getDatabase();
    set(ref(db, 'groups/' + uniqueGroupID), {
      group_name: {groupName},
      members: {user},
      // only needs shared.. other in the account
      grocery_list: {0:""},
      inventory:{0:""}
    });
    setLogin(true);
  };
  
  //interacts with the database to authorize the current user with this email 
  // and password 
  const handleCreateAcct = () => {
    if(password && user) {
      // values in both boxes so create account
      createUser(auth, user, password)
        .then((userCredential) => {
          //logged in
          console.log("current user is " + auth.currentUser);
          console.log(auth.currentUser.uid);
        })
        .catch(function(error){
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
        });

      // populate this user's part of the database with structure...
      const db = getDatabase();
      set(ref(db, 'users/' + auth.currentUser.uid), {
        account: {
          email:user,
          password:password,
          roommates: "",
          groupID:""
        },
        // only needs personal.. access shared through group#
        grocery_list: {0:""},
        inventory:{0:""},
        meal_plan:{
          categories:{0:""},
          meals: {0:""},
          tags:{0:""}
        },
        recipes: {0:""}  
      });

      setAccountCreated(true);


    } else{
      setError(true);
      alert(error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center"><h3>Sign Up</h3></div>
        <div className="d-flex justify-content-center align-items-center">
          <Form>
            <Form.Group className="mb-3">
                <Form.Label >Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={user} onChange={(e)=>setUser(e.target.value)}/>
            </Form.Group>


            <Form.Group className="mb-3" >
              <Form.Label>Confirm Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={confirmUser} onChange={(e)=>setConfirmUser(e.target.value)}/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else. Except Google because that is where our database is.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" >
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </Form.Group>
            <Button variant="primary" onClick={handleCreateAcct}>
              Submit
            </Button>
          </Form>


          <Modal show={created} onHide={handleGroupClose} centered>
            <Modal.Header closeButton>
              <Modal.Title>Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label >Create New Group</Form.Label>
                  <Form.Control type="text" placeholder="Group Name" value={groupName} onChange={(e)=>setGroupName(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" onClick={createNewGroup}>
                  Create 
                </Button>

                <Form.Group className="mb-3">
                  <Form.Label >Join Group</Form.Label>
                  <Form.Control type="text" placeholder="Access Code" value={accessCode} onChange={(e)=>setAccess(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" onClick={joinGroup} >
                  Join
                </Button>

              </Form>
            </Modal.Body>
          </Modal>
        </div>
      <div className="d-flex justify-content-center align-items-center"><h5>Don't have an account? <a href="./meal_plan">Sign up</a></h5></div>
    </div>
  );
};

export default SignupHome;