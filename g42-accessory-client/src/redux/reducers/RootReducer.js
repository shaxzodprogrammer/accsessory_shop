import {combineReducers} from "redux";
import auth from './AuthReducer'

export const rootReducer=combineReducers({
    auth
})