import jwtDecode from "jwt-decode";
import {TOKEN} from "./constants";

export const getRoleNameFromJWT=()=>{
    if (localStorage.getItem(TOKEN)){
        const parsedToken = jwtDecode(localStorage.getItem(TOKEN))
        return parsedToken.roles[0].roleName
    }else {
        return ''
    }
}