import {TOKEN} from "./constants";

export const configHeader=({headers:{
        'Authorization':localStorage.getItem(TOKEN),
        'Access-Control-Allow-Origin': '*'
    }})