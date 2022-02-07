import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Navbar from "../components/Navbar";
import {ROLE} from "../utills/constants";
import {getRoleNameFromJWT} from "../utills/UsefullFunctions";
import {Redirect} from "react-router-dom";

class Settings extends Component {
    render() {
        const {history} = this.props
        return (
            getRoleNameFromJWT()?
                <div className='row'>
                    <div className='col-md-2'>
                        <Navbar role={getRoleNameFromJWT()} history={history}/>
                    </div>
                    <div className='col-md-10'>
                        This is Settings page for {getRoleNameFromJWT()}
                    </div>
                </div>
                :
                <Redirect to="/" />
        );
    }
}

Settings.propTypes = {};

export default Settings;