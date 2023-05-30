# Mentioning Component, v0.1.5
This open-sourced component from Availabowl is a textarea that supports username mentioning with the @ symbol. Although it does not exactly share the same UI as Availabowl does, it retains most of the functionality that it inherits when utilized on Availabowl. 

## Prerequisites
- Search method -- Availabowl utilizes MongoDB Atlas Search, while the sandbox example utilizes a [Fuse.js](https://fusejs.io/) fuzzy search algorithm among an array of user objects formatted as:

```
[
    {
        name: "bob"
    },
    {
        name: "apple"
    }   
]
```
You pass in the search function to the mentioning component via the *searchForUser* prop. This will fire when the regular expression detects a potential username match.

## Installation and Demo
The component is wrapped around a simple React app , so you can simply just clone, and then install all its dependencies with:
```
npm install
```

## Critical information before you tweak
When the Fuse.js algorithm is applied, it returns an array of objects where the original object is now a value of another object with the key item.

```
[
    {
        item: {
            name: "bob"
        }
    }
]
```
Therefore, when you decide to implement it with another search algorithm that returns matches not in this format, you must match the list to map out its results accordingly.

## API Reference

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `usernameMentions` | `Array` | **Required**. useState array that manages the saved users. |



| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `setUsernameMentions`      | `Function` | **Required**. useState setter that manages the saved users. |

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `preventSelfTagging` | `Boolean` | Prevents the client from tagging their own username. If this is specified to be true, then currentUser must be a provided String of the client's username.|

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `currentUser` | `String` | Username of the current user that is required to prevent self-tagging.|