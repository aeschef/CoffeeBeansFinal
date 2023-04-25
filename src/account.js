import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState, Component, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './css/account.css';
import Stack from 'react-bootstrap/Stack'
import Alert from 'react-bootstrap/Alert';
import { getDatabase, ref, onValue } from 'firebase/database';


function ViewHelpPage() {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <Row>
            <Button variant="info" className="category-header" onClick={handleShow}>Frequently Asked Questions</Button>
            <Modal show={show} fullscreen={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Frequently Asked Questions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ol>
                        <li class="questions">What does the energy stand for?
                            <ul>
                                <li class="answers">The energy bar stands for how much overall energy it would take you to make the meal.
                                For example, a recipe like Thanksgiving has most of its cooking time spent in the oven and not so much time spent
                                with hands-on cooking so it would be a medium or low energy.</li>
                            </ul>
                        </li>
                        <li class="questions">Can I edit the categories?
                            <ul>
                                <li class="answers">Yes! The category headers are editable! You 
                                simply have to click on the pencil icon and it will allow you to edit
                                the category name.</li>
                            </ul>
                        </li>
                        <li class="questions">How do I add a new recipe?
                            <ul>
                                <li class="answers">To add a new recipe, you have to go to the recipe page. Then, by clicking the 
                                add button at the bottom right of the page, you can manually input the information. There are a few required fields
                                that do need to be filled out!</li>
                            </ul>
                        </li>
                    </ol>
                </Modal.Body>
            </Modal>
        </Row>
    );
}

/**
 * renders button to view roommates 
 */
function ViewRoommates({email}) {
    const [show, setShow] = useState(false);
    //const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
 
    /** TODO starting next week roommate information will be retrieved through the database 
     * via a randomly generated access code BUT for now I will simply use dummy information*/
    const roommieList = ["Annabelle", "Luis", "Mirya", "Jane"];

    const [members, setMembers] = useState([]);

    const CreateMembers = (email) => {
        const memb = []
        email.map(mem => {
            memb.push({name: mem.data});
        })
        setMembers(memb);
    }

    const handleShow = () =>{
        setShow(true);
        CreateMembers(email);
    }
   

    return (
        <Row>
            <Button variant="info" className="category_header" onClick={handleShow}>Roommates</Button>
            <Modal show={show} fullscreen={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Roommates</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                        <ol>
                            <Stack gap={5}>
                                {members.map(reptile => (
                                    <li key={reptile}>{reptile.name}</li>
                                ))}
                            </Stack>
                        </ol>
                        </Row>
                    </Container>
                    <Button onClick={handleClose}>Leave</Button>
                </Modal.Body>
            </Modal>
        </Row>
    );
}

/*render's signoutbutton and ability */
function SignOut({setLogin}){
    // bump user back to login page!
    const handleSignout = () => {
        setLogin(false);
    };    

    return (
        <Row className="justify-content-md-center">
            <Col>
                <Button onClick={handleSignout}>Sign Out</Button>
            </Col>
            
        </Row>
    );
}

function ChangePassword(){
    
    const placeholderPassword = "abc123";
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    //must match for password to reset
    const [pass1, setPass1] = useState(null);
    const [pass2, setPass2] = useState(null);
    const [newPass, setNew] = useState(null);

    //must match current password to allow for reset
    const [oldPass, setOld] = useState(null);

    /* checks to see if password change is valid and handles that */
    const handlePassChange = () => {
        if(oldPass !== placeholderPassword){
            alert("not valid login");
        } else if(pass1 === pass2){
            setNew(pass1);
            handleClose();
        } else{
            alert("passwords don't match");
        }
    };

    /* deletes password info and hides modal */
    const handleClose = () => {
        setPass1(null);
        setPass2(null);
        setOld(null);
        setShow(false);
    };

    const setOldPassword = (event)=>{
        setOld(event.target.value);
    };

    const setFirst = (event)=>{
        setPass1(event.target.value);
    };

    const setSecond = (event)=>{
        setPass2(event.target.value);
    };


    

    return (
        <Row>
            <Button variant="info" className="category-header" onClick={handleShow}>Password</Button>
            <Modal show={show} fullscreen={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Stack gap={4}>
                                <p>Username: Mirya@gmail.com</p>
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="Old Password"
                                    onChange={setOldPassword}
                                    autoFocus
                                />
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="New Password"
                                    onChange={setFirst}
                                />
                                <Form.Control
                                    size="sm"
                                    type="text"
                                    placeholder="Confirm"
                                    onChange={setSecond}
                                />
                            </Stack>
                        </Form.Group>
                    </Form>

                    <Button onClick={handlePassChange}>Save New Password</Button>
                </Modal.Body>
            </Modal>

            
        </Row>
    );
}

const AccountHome = ({login, setLogin, accessCode, props}) => {

    const db = getDatabase(props.app);
    const [emails, setEmails] = useState([]);
    const [refresh, setRefresh] = useState(true);

    useEffect(() => {
        if(accessCode){
            const dbRef = ref(db, '/groups/' + accessCode + '/members');
            onValue(dbRef, (snapshot) => {
                const accessData = []
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    //console.log("KEY" + childKey);
                    const childData = childSnapshot.val();
                    //console.log(childData);
                    accessData.push({ value: childKey, data: childData })
                });
                setEmails(accessData);
                //console.log(emails);
            }, {
                onlyOnce: true
            });
        }
        setRefresh(false);
    }, [accessCode, refresh])

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Account</h1>
                </Col>
            </Row>
            
            <Row>
                <Stack gap={4} >
                    <ViewRoommates
                    email={emails}></ViewRoommates>
                    <ChangePassword></ChangePassword>
                    <ViewHelpPage></ViewHelpPage>
                    <Alert key='success' variant='success'>
                        Access Code: {accessCode}
                    </Alert>
                </Stack>
            </Row>
            <SignOut login={login} setLogin={setLogin}></SignOut>
            
            
    
        </Container>
    );
        
};

export default AccountHome;