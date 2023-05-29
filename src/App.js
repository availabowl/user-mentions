import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Alert } from 'react-bootstrap';
import Fuse from 'fuse.js'

import UserMentionsInput from './UserMentionsInput';
import './App.css';

let userBank = [
    {
        name: "bob"
    },
    {
        name: "apple"
    },
    {
        name: "trevor"
    },
    {
        name: "thomas"
    },
	{
		name: "trevor2"
	},
	{ 
		name: "travis"
	},
    {
        name: "billybob"
    },
    {
        name: "evan"
    }
];

function searchForUser(value) {
    const options = {
        includeScore: true,
        shouldSort: true,
        threshold:.35,
        isCaseSensitive:false,
        keys: ['name']
    }

    let fuse = new Fuse(userBank, options);
    let result = fuse.search(value);
    return result;
}

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
                                <Nav.Link href="https://portfolio-sepia-sigma-68.vercel.app/">Portfolio</Nav.Link>
                            </Nav>
                        </Col>
                    </Row>
                </Container>
            </Navbar>
            <Container style={{marginTop:'48px'}}>
                <Row>
                    <Col>
                        <h4 style={{marginBottom:'24px'}}>Availabowl Mentioning Component, v1.4 -- sandbox</h4>
                        <UserMentionsInput 
                        searchForUser={searchForUser}
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
                        <p style={{marginTop:'24px'}}><b>Users in dummy database</b></p>
                        {
                            userBank.map((user, i) => <p style={{fontFamily:"monospace"}} key={i}>{JSON.stringify(user)}</p>)
                        }
                    </Col>
                </Row>
            </Container>
        </>
	)
}

export default App;
