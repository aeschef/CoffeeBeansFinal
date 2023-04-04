import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import React, { useState, Component } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import './css/account.css';
import Stack from 'react-bootstrap/Stack'
import Alert from 'react-bootstrap/Alert';

/**
 * renders button to view roommates 
 */
function ViewRoommates() {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
 
    /** TODO starting next week roommate information will be retrieved through the database 
     * via a randomly generated access code BUT for now I will simply use dummy information*/
    const roommieList = ["Annabelle", "Luis", "Mirya", "Jane"];

    return (
        <Row>
            <Button onClick={handleShow}>Roommates</Button>
            <Modal show={show} fullscreen={true}>
                <Modal.Header>
                    <Modal.Title>Roommates</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                        <ol>
                            <Stack gap={5}>
                                {roommieList.map(reptile => (
                                    <li key={reptile}>{reptile}</li>
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
function SignOut(){
    return (
        <Row className="justify-content-md-center">
            <Col>
                <Button>Sign Out</Button>
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
            <Button onClick={handleShow}>Password</Button>
            <Modal show={show} fullscreen={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            
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
                        </Form.Group>
                    </Form>

                    <Button onClick={handlePassChange}>Save New Password</Button>
                </Modal.Body>
            </Modal>

            
        </Row>
    );
}

function Profile() {
    return (
        <Row>
            <Button>Profile</Button>
        </Row>
    );
}

export default class AccountHome extends Component {
    render() {
        return (
            <Container fluid>
                <Row>
                    <Col>
                        <h1>Account</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h1>Hi Mirya!</h1>
                    </Col>
                </Row>
                
                <Row>
                    <Stack gap={4} >
                        <ViewRoommates></ViewRoommates>
                        <Profile></Profile>
                        <ChangePassword></ChangePassword>
                    </Stack>
                </Row>
            
                <Row>
                <Alert key='success' variant='success'>
                    Access Code: 
                </Alert>
                </Row>
                <SignOut></SignOut>
                
               
        
            </Container>
        );
        
    }
}