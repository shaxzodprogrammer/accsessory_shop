import React, {Component} from 'react';
import {connect} from "react-redux";
import {AvForm, AvField} from 'availity-reactstrap-validation'
import axios from 'axios'
import {BASE_URL, ROLE, TOKEN} from "../utills/constants";
import jwtDecode from "jwt-decode";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imgcar from '../assets/photo_2020-03-09_14-46-18.jpg';
import imgLogin from '../assets/photo_2020-03-09_14-46-12.jpg'
import {createPath} from "history";

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasError: false
        }
    }

    componentDidMount() {
        localStorage.removeItem(TOKEN)
        localStorage.removeItem(ROLE)
    }

    login = (e, v) => {
        axios.post(BASE_URL + 'auth/login', v).then(res => {
            localStorage.removeItem(TOKEN)
            toast.success("Successfully Login", "URA")
            console.log(res, 'RES LOGIN')
            localStorage.setItem(TOKEN, res.data.type + res.data.token)
            const parsedToken = jwtDecode(res.data.token)
            // localStorage.setItem(ROLE, parsedToken.roles[0].roleName)
            let roleName=parsedToken.roles[0].roleName
            if (roleName === 'ROLE_DIRECTOR'){
                this.props.history.push("/mainPage")
            }
            else if(roleName === 'ROLE_MANAGER'){
                this.props.history.push("/mainPage")
            }
            else if(roleName === 'ROLE_SELLER'){
                this.props.history.push("/sellerSale")
            }else {
                this.props.history.push("/")
            }
        }).catch(res => {
            toast.error('Error Message', 'Unauthorized')
        })
    }

    render() {
        let applying = {
            backgroundImage: 'url(' + imgcar + ')',
            backgroundRepeat: 'no-repeat, repeat',
            backgroundPosition: 'right center, left top',
            backgroundSize: '100%, 100%',
            width: '100%',
            height: '100vh',
        }
        let applying2 = {
            backgroundImage: 'url(' + imgLogin + ')',
            backgroundRepeat: 'no-repeat, repeat',
            backgroundPosition: 'left center, left top',
            backgroundSize: '270%, 100%',
            width: '100%',
            height: '100vh',
            padding: '17% 3%'
        }
        return (
            <div>

                <div className="row">
                    <div className="col-md-4" style={applying2}>
                        <AvForm onValidSubmit={this.login}>
                            <AvField
                                name="username"
                                placeholder="Login kiriting"
                            />
                            <AvField
                                type="password"
                                name="password"
                                placeholder="Parol kiriting"
                            />
                            <button type="submit" className="btn btn-info">
                                Kirish
                            </button>
                        </AvForm>
                    </div>
                    <div className="col-md-8" style={applying}>
                    </div>
                </div>
            </div>
        );
    }
}

HomePage.propTypes = {};

export default connect(null, null)(HomePage);