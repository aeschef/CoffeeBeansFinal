import Button from 'react-bootstrap/Button';
import './App.css';
import './css/meal_plan.css';
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react';
import { getDatabase, ref, set } from "firebase/database";


const SignupHome = ({createUser, login, setLogin, auth}) => {

  // Stores the user email and password that user inputs in text fields. 
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [confirmUser, setConfirmUser] = useState("");

  // Keeps track of when user entered invalid login information
  const [error, setError] = useState(false)

  const handleCreateAcct = () => {
    if(password && user) {
      createUser(auth, user, password)
        .then((userCredential) => {
          //Loggedin
          setLogin(true);

          console.log("current user is " + auth.currentUser);
          console.log(auth.currentUser.uid);

          const db = getDatabase();
          console.log(auth.currentUser.uid)
          set(ref(db, 'users/' + auth.currentUser.uid), {
            account: {
              email:user,
              password:password,
              roommates: "",
              groupID:""
            },
            // only needs personal.. access shared through group#
            grocery_list: {
              categories: {
                Produce: {
                  0: {
                    item_name: "apples",
                    item_num: ""
                  },
                  1:{
                    item_name: "",
                    item_num: ""
                  }
                },
                Dairy: {
                  0: {
                    item_name: "yogurt",
                    item_num: 1
                  }
                },
                Meats: {
                  0: {
                    item_name: "turkey",
                    item_num: 1
                  }
                },
                Grains: {
                  0: {
                    item_name: "rice",
                    item_num: 1
                  }
                },
                Miscellaneous: {
                  0: {
                    item_name: "yogurt",
                    item_num: 1
                  }
                }
              }
            },
            inventory: {
              categories: {
                Produce: {
                  0: ""
                },
                Dairy: {
                  0: ""
                },
                Meats: {
                  0: ""
                },
                Grains: {
                  0: ""
                },
                Miscellaneous: {
                  0: ""
                }
              }
            },
    
            meal_plan:{
              categories:{0:""},
              meals: {0:""},
              tags:{0:""}
            },
            recipes: {0:""}  
          });
    
        })
        .catch(function(error){
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
        });

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
        </div>
      <div className="d-flex justify-content-center align-items-center"><h5>Don't have an account? <a href="./meal_plan">Sign up</a></h5></div>
    </div>
  );
};

export default SignupHome;