import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Navbar from "../components/Navbar";
import {BASE_URL, ROLE, TOKEN} from "../utills/constants";
import {Redirect} from "react-router-dom";
import HomePage from "./HomePage";
import {getRoleNameFromJWT} from "../utills/UsefullFunctions";
import {
    NavLink,
    Button,
    Card,
    CardText,
    CardTitle,
    Col,
    Nav,
    NavItem,
    Row,
    TabContent,
    TabPane,
    Table, Modal, ModalHeader, ModalFooter, ModalBody
} from "reactstrap";
import classnames from 'classnames';
import axios from "axios";
import {apiPath} from "../apiPath/apiPath";
import {configHeader} from "../utills/congifHeader";
import {toast} from "react-toastify";
import {AvField, AvForm} from "availity-reactstrap-validation";
import AddEditModal from "../components/catalog_components/AddEditModal";
import CatalogTable from "../components/catalog_components/CatalogTable";
import AdminRequests from "../components/catalog_components/AdminRequests";
import UserPane from "../components/catalog_components/UserPane";
import ShopPane from "../components/catalog_components/ShopPane";
import WarehousePane from "../components/catalog_components/WarehousePane";
import CategoryPane from "../components/catalog_components/CategoryPane";
import ProductPane from "../components/catalog_components/ProductPane";

class Catalog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
        }

    }

    componentDidMount() {
        let tempRole = getRoleNameFromJWT();
        if (tempRole === 'ROLE_MANAGER') {
            this.setState({activeTab: '4'})
        }


    }

    setState(state, callback) {
        super.setState(state, callback);
    }


    render() {
        const {history} = this.props
        const toggle = tab => {
            if (this.state.activeTab !== tab) {
                this.setState({activeTab: tab});
                if (tab === '2') {

                }
            }
        }


        return (
            getRoleNameFromJWT() ?
                <div className='row row-style'>
                    <div className='col-md-2 col-2-style'>
                        <Navbar role={getRoleNameFromJWT()} history={history} tab="6"/>
                    </div>
                    <div className='col-md-10 col-10-style'>

                        {getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                            <Nav className="mt-2" tabs>
                                <NavItem className="ml-3">
                                    <NavLink
                                        className={{active: this.state.activeTab === '1'}}
                                        onClick={() => {
                                            toggle('1');
                                        }}
                                    >
                                        Hodimlar
                                    </NavLink>
                                </NavItem>

                                <NavItem className="ml-3">
                                    <NavLink
                                        className={{active: this.state.activeTab === '2'}}
                                        onClick={() => {
                                            toggle('2');
                                        }}
                                    >
                                        Magazinlar
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ml-3">
                                    <NavLink
                                        className={{active: this.state.activeTab === '3'}}
                                        onClick={() => {
                                            toggle('3');
                                        }}
                                    >
                                        Omborlar
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ml-3">
                                    <NavLink
                                        className={{active: this.state.activeTab === '4'}}
                                        onClick={() => {
                                            toggle('4');
                                        }}
                                    >
                                        Kategoriya
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ml-3">
                                    <NavLink
                                        className={{active: this.state.activeTab === '5'}}
                                        onClick={() => {
                                            toggle('5');
                                        }}
                                    >
                                        Maxsulotlar
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            : ''
                        }
                        {getRoleNameFromJWT() === 'ROLE_MANAGER' ?
                            <Nav className="mt-2" tabs>
                                <NavItem className="ml-3">
                                    <NavLink
                                        className={{active: this.state.activeTab === '4'}}
                                        onClick={() => {
                                            toggle('4');
                                        }}
                                    >
                                        Kategoriya
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ml-3">
                                    <NavLink
                                        className={{active: this.state.activeTab === '5'}}
                                        onClick={() => {
                                            toggle('5');
                                        }}
                                    >
                                        Maxsulotlar
                                    </NavLink>
                                </NavItem>
                            </Nav>
                            : ''
                        }

                        <TabContent activeTab={this.state.activeTab} className="mt-3">
                            {getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                <UserPane state={this.state} tabId={"1"}/>
                                : ''
                            }
                            {getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                <ShopPane state={this.state} tabId={"2"}/>
                                : ''
                            }
                            {getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                <WarehousePane state={this.state} tabId={"3"}/>
                                : ''
                            }
                            <CategoryPane state={this.state} tabId={"4"}/>

                            <ProductPane state={this.state} tabId={"5"}/>

                        </TabContent>


                        <Modal isOpen={this.state.showRemoveModal} toggle={() => this.setState({
                            showRemoveModal: !this.state.showRemoveModal,
                            currentItem: ''
                        })}>
                            <ModalHeader>O'chirishni istaysizmi ?</ModalHeader>
                            <ModalFooter>
                                <button type="button" onClick={() => this.setState({
                                    showRemoveModal: !this.state.showRemoveModal,
                                    currentItem: ''
                                })} className="btn btn-danger">Bekor qilish
                                </button>
                                <button type="button" onClick={""} className="btn btn-success">Ha</button>
                            </ModalFooter>
                        </Modal>


                    </div>
                </div>
                :
                <Redirect to="/"/>
        );
    }
}

Catalog.propTypes = {};

export default Catalog;