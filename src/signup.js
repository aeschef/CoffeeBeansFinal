import Button from 'react-bootstrap/Button';
import './App.css';
import './css/meal_plan.css';
import Form from 'react-bootstrap/Form'
import { useEffect, useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { getDatabase, ref, get, set, onValue, orderByChild, update, push, child } from "firebase/database";




const SignupHome = ({createUser, login, setLogin, auth}) => {

  // Stores the user email and password that user inputs in text fields. 
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [confirmUser, setConfirmUser] = useState("");
  
  //was the account successfully created
  const [created, setAccountCreated] = useState(false);

  //stores info required for group to be created/joined
  const [groupName, setGroupName] = useState("");
  const [accessCode, setAccess] = useState("");
  const [curUser, setCurUser] = useState("");


  // Keeps track of when user entered invalid login information
  const [error, setError] = useState(false)


    const handleGroupClose = () => {
      setLogin(true);
    };
  

  //Allows this user to join groups! 
  const joinGroup =() => {
      let joined = false;
      //find The group indicated by the access code
      const dbRef = ref(getDatabase(), 'groups/');
      onValue(dbRef, (snapshot)=>{
        snapshot.forEach((childSnapshot) => {
          console.log("ac" + accessCode);
          console.log("cs"+childSnapshot.key);
          if(childSnapshot.key === accessCode){
            if(!joined){

              //add to group
              console.log("equal");
              joined = true;
              set(ref(getDatabase(), 'users/' + curUser + '/account/'), {
                groupID: accessCode
              });
              
              //count number of members in group right now
              let count = 0;
              const dbRef = ref(getDatabase(), 'groups/' +accessCode + '/members');
                onValue(dbRef, (snapshot)=>{
                  snapshot.forEach((childSnapshot) => {
                    count+=1;
                  });
              });
              
              // add this member to the group
              let obj = {}
              obj[count] = user;
              update(ref(getDatabase(), 'groups/' + accessCode +'/members/'), obj);

              //display normal page
              setLogin(true);
            }
          }
        });
        if (!joined) {
          alert("group does not exist");
        } 
      });  
  };

  /* Creates a new Roommate Group in the database with a semi-randoml, 
    semi-unique Group Id*/
  const createNewGroup = () => {
    //TODO make it ACTUALLY unique
    let uniqueGroupID = Math.random().toString(6).slice(2, 7); 
    
    const db = getDatabase();
    set(ref(db, 'groups/' + uniqueGroupID), {
      group_name: {groupName},
      members: {0: user},
      // only needs shared.. other in the account
      grocery_list: {
        categories: {
          Produce: {
            0: {
              item_name: "grapes",
              item_num: 1
            }
          },
          Dairy: {
            0: {
              item_name: "milk",
              item_num: 1
            }
          },
          Meats: {
            0: {
              item_name: "ham",
              item_num: 1
            }
          },
          Grains: {
            0: {
              item_name: "bread",
              item_num: 1
            }
          },
          Miscellaneous: {
            0: {
              item_name: "Hot Fries",
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
      }
    });
    setLogin(true);
  };
  
  /* interacts with the database to authorize the current user with this email 
     and password  */
  const handleCreateAcct = () => {
    if(password && user) {
      // values in both boxes so create account
      createUser(auth, user, password)
        .then((userCredential) => {
          //logged in
          setCurUser(auth.currentUser.uid);
          console.log("current user is " + auth.currentUser);
          console.log(auth.currentUser.uid);
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
                    item_name: "Cheetos",
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
              categories:{
                Breakfast: {quota: 7, meals:[]}, 
                Lunch: {quota: 7, meals:[]},
                Dinner: {quota: 7, meals:[]}},
              tags:{0:"Monday", 1:"Tuesday", 2:"Wednesday", 3: "Thursday", 4:"Friday", 5:"Saturday", 6:"Sunday"}
            },
            recipes: {0:""}  
          });
        })
        .catch(function(error){
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorMessage);
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
            {/* Enter User Email */}
            <Form.Group className="mb-3">
                <Form.Label >Email Address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" value={user} onChange={(e)=>setUser(e.target.value)}/>
            </Form.Group>

            {/* Confirm User Email */}
            <Form.Group className="mb-3" >
              <Form.Label>Confirm Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" value={confirmUser} onChange={(e)=>setConfirmUser(e.target.value)}/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else. Except Google because that is where our database is.
              </Form.Text>
            </Form.Group>

            {/* Enter Password */}
            <Form.Group className="mb-3" >
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            </Form.Group>

            <Button variant="primary" onClick={handleCreateAcct}>
              Submit
            </Button>
          </Form>

          {/* Join/Create Group Modal onHide={handleGroupClose}*/}
          <Modal show={created}  centered>
            <Modal.Header closeButton>
              <Modal.Title>Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>

                {/* Create  a Group*/}
                <Form.Group className="mb-3">
                  <Form.Label >Create New Group</Form.Label>
                  <Form.Control type="text" placeholder="Group Name" value={groupName} onChange={(e)=>setGroupName(e.target.value)}/>
                </Form.Group>
                <Button variant="primary" onClick={createNewGroup}>
                  Create 
                </Button>

                {/* Join an existing Group */}
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