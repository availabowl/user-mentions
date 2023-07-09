import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Alert } from 'react-bootstrap';

import UserMentionsInput from './UserMentionsInput';
import './App.css';

async function fetchUsers(query) {
    const data = await fetch(`${process.env.REACT_APP_PRODUCTION ? "https://rmdh-app.herokuapp.com" : "http://localhost:3002"}/api/user/search?text=${query}&onlyUsers=true`, { json: true }).then(res => { return res.json() })
    .catch(err => console.error(err));
    return data;
};

const App = () => {

	const [usernameMentions, setUsernameMentions] = useState([]);

	return (
		<>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Row style={{width:"125%"}}>
                        <Col className="d-flex justify-content-between">
                            <Navbar.Brand>Nam Tran</Navbar.Brand>
                            <Nav>
                                <Nav.Link href="https://github.com/availabowl/user-mentions">Code repo</Nav.Link>
                                <Nav.Link href="https://portfolio-sepia-sigma-68.vercel.app/">Portfolio</Nav.Link>
                            </Nav>
                        </Col>
                    </Row>
                </Container>
            </Navbar>
            <Container style={{marginTop:'48px'}}>
                <Row>
                    <Col>
                        <h4 style={{marginBottom:'24px'}}>Mentioning Component, v1.8.0 Sandbox</h4>
                        <UserMentionsInput 
                        searchForUser={fetchUsers}
                        usernameMentions={usernameMentions}
                        setUsernameMentions={setUsernameMentions}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col style={{marginBottom:'24px'}}>
                        <Alert variant="secondary" style={{marginTop:'24px'}}>
                            <b>Saved username mentions</b>: {JSON.stringify(usernameMentions)}
                        </Alert>
                    </Col>
                </Row>
            </Container>
        </>
	)
}

export default App;
