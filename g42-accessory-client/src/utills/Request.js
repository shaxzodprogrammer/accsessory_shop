import axios from "axios";
import {BASE_URL, TOKEN} from "./constants";
import {apiPath} from "../apiPath/apiPath";
import {configHeader} from "./congifHeader";

export const request=(method,url,data)=>{
    const token=localStorage.getItem(TOKEN)
    const headers={
        'Authorization':token,
        'Access-Control-Allow-Origin': '*'
    }
     return axios({
         url:BASE_URL+url,method,data,headers})
}