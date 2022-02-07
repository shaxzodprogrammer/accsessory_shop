import React from 'react';
import {connect} from 'react-redux';
import {Redirect, Route} from 'react-router-dom';

import axios from "axios";
import {me} from "../redux/actions/AuthAction";
import {toast} from "react-toastify";
import {BASE_URL, TOKEN} from "./constants";


const PrivateRoute = ({currentUser,component: Component, ...rest}) => {
    console.log(currentUser,'currentUser')

    return (

           currentUser?
               <Route
                   {...rest}
                   render={props => {
                       <Component {...props}/>
                   }
                   }
               />
               :
               <Redirect
                   to={{
                       pathname: '/'
                   }}
               />
    )
};

const mapStateToProps=state=>({
    currentUser:state.auth.currentUser
})
const mapDispatchToProps=state=>({

})
export default connect(mapStateToProps,mapDispatchToProps)(PrivateRoute)

