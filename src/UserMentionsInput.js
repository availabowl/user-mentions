import React, { useState, useRef, useCallback } from 'react';
import { Form, ListGroup, Image } from 'react-bootstrap';

const UserPfpComponent = ({user}) => {
    return <Image src="https://bucketeer-ba012f24-3291-4642-8fd0-677ac237a075.s3.amazonaws.com/public/u1z79m6E4o6f-9m66f2UaUloy-ecarmda1lZIx_pfp.jpg" style={{width:"36px",height:"36px",position:"relative",top:"3px",zIndex:30,backgroundColor:"#222"}} 
    roundedCircle alt={user.name} />
};

const UserListGroup = ({user}) => {
    return (
        <div className="d-flex">
            <UserPfpComponent user={user} />
            <div style={{marginLeft:'16px'}}>
                <p style={{lineHeight:'36px',marginBottom:0}}>{user.name}</p>
            </div>
        </div>
    )
}

const UserMentionsInput = ({searchForUser, usernameMentions, setUsernameMentions, preventSelfTagging, currentUser}) => {

    const pattern = /@(?=.{3,20}(?:\s|$))[a-z][a-z0-9]+(?:[_][a-z0-9]+)?/ig;
    const textareaRef = useRef(null);

    const [focusedValue, setFocusedValue] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);

    const [textareaContent, setTextareaContent] = useState('');

    const handleUsernameMention = useCallback((textContent) => {
        usernameMentions.forEach((username, i) => { // Go through each saved username in the state array
            if (textContent.indexOf(`@${username}`) === -1) { // If @username is no longer in the textarea's content, remove it and update state array
                let temp = [...usernameMentions.slice(0,i), ...usernameMentions.slice(i+1)];
                setUsernameMentions(temp);
            }
        })
    }, [usernameMentions, setUsernameMentions]);

    const handleOnChange = async (e) => {
        setTextareaContent(e.target.value);
        let usernameDetections = e.target.value.match(pattern) || [];

        if (usernameDetections.length > 0) {
            let focusedUserValue = usernameDetections.slice(-1)[0].substring(1);
            setFocusedValue(focusedUserValue);

            if (!usernameMentions.includes(focusedUserValue)) {                
                let prelimSearchResults = searchForUser(focusedUserValue);

                if (prelimSearchResults.length > 0 && !usernameMentions.includes(prelimSearchResults[0].item.name)) {
                    if (preventSelfTagging && currentUser !== undefined) {
                        prelimSearchResults = prelimSearchResults.filter(result => result.item.name !== currentUser);
                    }
                    // Prevent any duplicates from being inputted.
                    usernameMentions.forEach(username => {
                        prelimSearchResults = prelimSearchResults.filter(result => result.item.name !== username);
                    });

                    setResults(prelimSearchResults);
                    setShowResults(true);    
                }
            }        
        }
        
        if (e.target.value.substring(e.target.value.length-1) === ' ' || e.target.value.length === 0) {
            setShowResults(false);
        }

        return new Promise((resolve, _) => {
            resolve(e.target.value);
        })
    }

    const handleChainedOnchange = (e) => {
        handleOnChange(e).then(textContent => {
            handleUsernameMention(textContent);
        })
    }

    const handleCompleteMention = (username) => {
        let usernameDetections = textareaContent.match(pattern) || [];
        let mostRecentMention = usernameDetections[usernameDetections.length-1];
        let index = textareaContent.indexOf(mostRecentMention);

        let appendedUserTotextareaContent = textareaContent.substring(0, index) + '@' + username + ' ';
        textareaRef.current.value = appendedUserTotextareaContent;

        setUsernameMentions([...usernameMentions, username]);
        textareaRef.current.focus();
        setShowResults(false);
        setFocusedValue(null);
    };

    return (
        <div style={{position:"relative"}}>
            <Form>
                <Form.Control as="textarea" rows={5} style={{resize:'none'}} onChange={handleChainedOnchange} ref={textareaRef} placeholder="Enter some text here."/>
                {
                    showResults && focusedValue !== null && results.length > 0 &&
                    <ListGroup style={{position:"absolute",zIndex:999,width:"300px",height:"200px",overflowY:"auto",bottom:-225,right:0}}>
                        {
                            results.map((result) =>
                                <ListGroup.Item key={result.item.name} action onClick={() => handleCompleteMention(result.item.name)}>
                                    <UserListGroup user={result.item}/>
                                </ListGroup.Item>
                            )
                        }
                    </ListGroup>
                }
            </Form>
        </div>
    )
};

export default UserMentionsInput;