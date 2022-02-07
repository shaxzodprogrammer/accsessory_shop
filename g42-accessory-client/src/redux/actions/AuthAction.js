import {LOGIN} from "../types/AuthTypes";
import axios from "axios";
import {BASE_URL, TOKEN} from "../../utills/constants";

export const login=(currentUser)=>{
    return {
        type:LOGIN,
        payload:currentUser
    }
}