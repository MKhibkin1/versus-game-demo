import { configureStore } from '@reduxjs/toolkit'

const userState = {
    loggedIn: false, 
    users: {},
    currentUser: null,
}

const reducer = function(state = userState, action) { 
    const response = action.response;



    switch(action.type) {
        case "login":
            return {...state, loggedIn: true, currentUser: action.userName, users: action.users}


        case "UPDATE_LIKED_IMAGES":
            let tmpUsers = {...state.users}
            let tmpUser = {...state.users[state.currentUser]}
            tmpUser.likedImages = action.images
            tmpUsers[state.currentUser] = tmpUser

            return {...state, users: tmpUsers}

        default:
            return state;
        }
};


const store = configureStore({ reducer })

export default store