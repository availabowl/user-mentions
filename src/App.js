import React, { useState } from 'react';
import { Container, Row, Col, Navbar, Nav, Alert, Form } from 'react-bootstrap';
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
    const [preventSelfTagging, setPreventSelfTagging] = useState(false);

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
                        <h4 style={{marginBottom:'24px'}}>Availabowl Mentioning Component, v1.5 -- sandbox</h4>
                        <UserMentionsInput 
                        searchForUser={searchForUser}
                        usernameMentions={usernameMentions}
                        setUsernameMentions={setUsernameMentions}
                        preventSelfTagging={preventSelfTagging}
                        currentUser={"evan"}
                        />
                        <Form style={{marginTop:'24px'}}>
                            <Form.Check type="checkbox" label="Prevent self-tagging (current user is evan)" onClick={() => setPreventSelfTagging(!preventSelfTagging)} />
                        </Form>
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
                <Row>
                    <Col>
                        <p><b>Disclaimer</b></p>
                        <Alert variant="warning">
                            Self-tagging can still occur if the username where typing @evan was a match while preventing it was changed during such. Since the case of making self-tagging
                            being toggleable on the client side is a rare situation, this is not seen as an issue.
                        </Alert>
                    </Col>
                </Row>
            </Container>
        </>
	)
}

export default App;
