import {LOGIN} from "../types/AuthTypes";

const initialState={
    currentUser:''
}
 const auth=(state=initialState,action)=>{
    switch (action.type){
        case LOGIN : return {...state,currentUser: action.payload}
        default :  return state
    }
}

export default auth