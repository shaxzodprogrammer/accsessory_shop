import React from 'react';
import {Route} from 'react-router-dom';
import {ORDER, NEW_USER_FOR_ORDER, ATTACHMENT, REGISTER_AGENT, PUSH_SERVICE} from "./constants";

const PublicRoute = ({component: Component, ...rest}) => {
    return (<Route
            {...rest}
            render={props =>
                <Component {...props}/>
            }
        />
    )
};
export default PublicRoute;
