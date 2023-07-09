import React, { useState, useRef, useCallback } from 'react';
import { Form, ListGroup, Image } from 'react-bootstrap';

const defaultImgUrl = "https://bucketeer-ba012f24-3291-4642-8fd0-677ac237a075.s3.amazonaws.com/public/u1z79m6E4o6f-9m66f2UaUloy-ecarmda1lZIx_pfp.jpg";

const UserPfpComponent = ({user}) => {
    return <Image src={user.imageUrl ? user.imageUrl : defaultImgUrl} style={{width:"36px",height:"36px",position:"relative",top:"3px",zIndex:30,backgroundColor:"#222"}} 
    roundedCircle alt={user.name} />
};

const UserListGroup = ({user}) => {
    return (
        <div className="d-flex">
            <UserPfpComponent user={user} />
            <div style={{marginLeft:'16px'}}>
                <p style={{lineHeight:'36px',marginBottom:0}}>{user.username}</p>
            </div>
        </div>
    )
}

const UserMentionsInput = ({searchForUser, usernameMentions, setUsernameMentions}) => {
    const textareaRef = useRef(null);
    const pattern = /@(?=.{2,20}(?:\s|$))[a-z][a-z0-9]+(?:[_][a-z0-9]+)?/ig;

    const [focusedValue, setFocusedValue] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState([]);

    const [textareaContent, setTextareaContent] = useState('');
    const [whiteSpaceIndexes, setWhiteSpaceIndexes] = useState([]);

    const [positions, setPositions] = useState(new Map());

    const handleDeleteUsernameMentions = useCallback((textContent) => {
        usernameMentions.forEach((username, i) => {
            if (textContent.indexOf(`@${username}`) === -1) {
                let temp = [...usernameMentions.slice(0,i), ...usernameMentions.slice(i+1)];
                setUsernameMentions(temp);
                let tempMap = new Map(positions);
                tempMap.delete(`@${username}`);
                setPositions(tempMap);
            }
        });
    }, [usernameMentions, setUsernameMentions, positions]);

    const handleUsernameMentions = useCallback(async (textContent) => {
        let usernameDetections = textContent.match(/@(?=.{1,20}(?:\s|$))[a-z][a-z0-9]+(?:[_][a-z0-9]+)?/ig) || [];

        if (showResults && usernameDetections.length === 0) {
            setShowResults(false);
        }

        if (usernameDetections.length > 0) {
            setFocusedValue(usernameDetections[0]);
            let prelimSearchResults = await searchForUser(usernameDetections[0]);
            if (!positions.has(usernameDetections[0])) {
                setResults(prelimSearchResults);
                setShowResults(true);
            }
        }

    }, [searchForUser, setResults, positions, showResults]);

    const handleOnChange = async (e) => {
        setTextareaContent(e.target.value);

        let temp = [];
        e.target.value.replace(/\s/g, function(_, index) {
            temp.push(index);
        });
        setWhiteSpaceIndexes(temp);

        let textareaContentTemp = e.target.value.substring(0, textareaRef.current.selectionStart);
        
        if (textareaContentTemp.substring(textareaContentTemp.length-1) === ' ' || textareaContentTemp.length === 0) {
            setShowResults(false);
            setFocusedValue(null);
            setResults([]);
        } else {
            let bounds = await determineSubstringBounds(textareaRef.current.selectionStart);
            handleUsernameMentions(e.target.value.substring(bounds.start, bounds.end).trim());
        }

        return new Promise((resolve, _) => {
            resolve(e.target.value);
        });
    };

    const handleCompleteMention = async (username) => {
        let bounds = await determineSubstringBounds(textareaRef.current.selectionStart);
        
        let newlyAppendedUsername = textareaContent.substring(0, bounds.start) + '@' + username;
        let newlyEndedTextareaPosition = bounds.start+username.length+1;

        let appendedUserTotextareaContent = newlyAppendedUsername;
        
        if (textareaContent.substring(newlyEndedTextareaPosition, newlyEndedTextareaPosition+1) !== ' ') {
            appendedUserTotextareaContent += ' ';
        }

        if (newlyEndedTextareaPosition !== textareaContent.length) {
            appendedUserTotextareaContent += textareaContent.substring(newlyEndedTextareaPosition);
        }

        textareaRef.current.value = appendedUserTotextareaContent;
        setTextareaContent(appendedUserTotextareaContent);

        setUsernameMentions(Array.from(new Set([...usernameMentions, username])));

        if (positions.has(`@${username}`)) {
            setPositions(new Map(positions).set(`@${username}`, [...positions.get(`@${username}`), bounds.start]));
        } else {
            setPositions(new Map(positions).set(`@${username}`, [bounds.start]));
        }

        textareaRef.current.focus();
        setShowResults(false);
        setFocusedValue(null);        

        return new Promise((resolve, _) => {
            resolve(textareaContent);
        });

    };

    const determineSubstringBounds = async (currentCursorPosition) => {
        // Case 1: no whitespaces
        if (whiteSpaceIndexes.length === 0) {
            return { start: 0 }
        }
        // Case 2a: one whitespace
        if (whiteSpaceIndexes.length === 1) {
            if (textareaContent.substring(textareaContent.length-1) === ' ') { // Case 2a: located at end
                return { start: 0 };
            } else if (textareaContent.indexOf(' ') !== textareaContent.length-1) { // Case 2b: in between
                if (currentCursorPosition <= whiteSpaceIndexes[0]) { // Case 2b.1: cursor is prior to the whitespace in between
                    return { start: 0, end: whiteSpaceIndexes[0] };
                } else { // Case 2b.2: cursor is after the whitespace in between
                    return { start: whiteSpaceIndexes[0]+1 }
                }
            }
        }

        // Case 3: multiple whitespaces (greater than 1)
        for (let i = 0; i < whiteSpaceIndexes.length; i++) {
            if (i === 0 && currentCursorPosition < whiteSpaceIndexes[i]) {
                return { start: 0, end: whiteSpaceIndexes[i]}
            }
            if (i === 0 && currentCursorPosition > whiteSpaceIndexes[i] && currentCursorPosition < whiteSpaceIndexes[i+1]) {
                console.log('3a.0')
                return { start: whiteSpaceIndexes[i]+1, end: whiteSpaceIndexes[i+1] }
            } else if (i === whiteSpaceIndexes.length-1) {
                if (textareaContent.substring(textareaContent.length-1) === ' ') { // Case 3a.1: the whitespace IS the last character
                    console.log('3a.1')
                    // Don't want to evaluate anything, honestly.
                } else { // Case 3a.2: the whitespace IS NOT the last character
                    // Evaluate what's after.
                    console.log('3a.2')
                    return { start: whiteSpaceIndexes[i]+1 }
                }
            } else if (whiteSpaceIndexes[i] <= currentCursorPosition && whiteSpaceIndexes[i+1] > currentCursorPosition) {
                // Need to differentiate when to look after, or look before.
                if (i < whiteSpaceIndexes.length-1 && i !== 0) {
                    console.log('4a')
                    return { start: whiteSpaceIndexes[i-1]+1, end: whiteSpaceIndexes[i] }
                }
                console.log('4b')
                return { start: whiteSpaceIndexes[i]+1, end: whiteSpaceIndexes[i+1] }
            }
        }
        return { start: 0, end: textareaContent.indexOf(' ') !== -1 ?  textareaContent.indexOf(' ') : undefined };
    }

    const handleOnClick = async (e) => {
        let currentCursorPosition = textareaRef.current.selectionStart; 
        let bounds = await determineSubstringBounds(currentCursorPosition);
        handleUsernameMentions(e.target.value.substring(bounds.start, bounds.end));
    };

    const handlePriorDeleteUsernameMention = async (e) => {
        let newString = e.target.value;

        if (e.keyCode === 8 || e.keyCode === 46) {
            let bounds = await determineSubstringBounds(textareaRef.current.selectionStart);
            let username = e.target.value.substring(bounds.start, bounds.end).trim().match(pattern) || [];
            if (username[0]) {
                let savedUserMentionPositions = positions.get(username[0]);

                if (savedUserMentionPositions !== undefined) {
                    for (let i = 0; i < savedUserMentionPositions.length; i++) {
                        let startIndex = savedUserMentionPositions[i];
                        let endIndex = startIndex+username[0].length;
                        if (textareaRef.current.selectionStart > startIndex && textareaRef.current.selectionStart <= endIndex) {
                            newString = e.target.value.substring(0, startIndex) + e.target.value.substring(endIndex+1);
                            textareaRef.current.value = newString;
                            handleDeleteUsernameMentions(newString);
                            return new Promise((resolve, _) => {
                                resolve(startIndex);
                            });
                        }
                    }
                }  
            }
        }
        return new Promise((resolve, _) => {
            resolve(-1);
        });
    };

    const handleChainedOnchange = async (e) => {
        handleOnChange(e).then(textContent => {
            handleDeleteUsernameMentions(textContent);
        })
    };

    const handleChainedCompleteMention = (username) => {
        handleCompleteMention(username).then(textContent => {
            handleDeleteUsernameMentions(textContent);
        })
    };

    const handleChainedPriorDeleteUsernameMention = (e) => {
        handlePriorDeleteUsernameMention(e).then(value => {
            if (value !== -1) {
                textareaRef.current.selectionStart = value;
                textareaRef.current.selectionEnd = value;
            }
        })
    };

    return (
        <>
            <div style={{position:"relative"}}>
                <Form>
                    <Form.Control as="textarea"
                    onClick={handleOnClick}
                    className="user-input form-control" ref={textareaRef}
                    onInput={handleChainedOnchange}
                    onBlur={e => setTextareaContent(e.target.value)}
                    onKeyDown={handleChainedPriorDeleteUsernameMention}
                    />
                    {
                        showResults && focusedValue !== null && results.length > 0 &&
                        <ListGroup style={{position:"absolute",zIndex:999,width:"300px",height:"200px",overflowY:"auto",bottom:-225,right:0}}>
                            {
                                results.map((result) =>
                                    <ListGroup.Item key={result.username} action onClick={() => handleChainedCompleteMention(result.username)}>
                                        <UserListGroup user={result}/>
                                    </ListGroup.Item>
                                )
                            }
                        </ListGroup>
                    }
                </Form>
            </div>
        </>
    )
};

export default UserMentionsInput;