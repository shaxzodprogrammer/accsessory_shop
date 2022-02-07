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

class Transfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            showModal: false,
            showRemoveModal: false,
            currentItem: '',
            transfers: [],
            totalElements: 0,
            currentPage: 0,
            isAccepted: false
        }
    }


    componentDidMount() {
        let tempRole = getRoleNameFromJWT();
        if (tempRole === 'ROLE_MANAGER') {
            this.setState({activeTab: '1'})
        }
        this.getTransfers()
    }

    getTransfers = () => {
        axios({
            method: 'GET',
            url: BASE_URL + apiPath.getAllTransferByPageable,
            ...configHeader,
            params: {
                accepted: this.state.isAccepted
            }
        }).then(res => {
                this.setState({
                    transfers: res.data.object,
                    totalElements: res.data.object.totalElements
                })
            }
        ).catch(ignore => {
            // console.log("ERROR: " + ignore)
        })
    }

    updateTransfer = (id) => {
        axios({
            method: 'PUT',
            url: BASE_URL + apiPath.saveOrEditTransfer + id,
            headers: {
                'Authorization': localStorage.getItem(TOKEN),
                'Access-Control-Allow-Origin': '*'
            },
            params: {
                accepted: this.state.isAccepted
            }
        }).then(res => {
                this.getTransfers()
                toast.success(res.data.message)
            }
        ).catch(ignore => {
            // console.log("ERROR: " + ignore)
        })
    }

    _onChange = (e) => {
        this.state.isAccepted = e.target.value
        this.getTransfers()
    };

    render() {
        const {history} = this.props
        const toggle = tab => {
            if (this.state.activeTab !== tab) this.setState({activeTab: tab});
        }

        return (
            getRoleNameFromJWT() ?
                <div className='row'>
                    <div className='col-md-2' style={{backgroundColor: "#eceff1"}}>
                        <Navbar role={getRoleNameFromJWT()} history={history}/>
                    </div>
                    <div className='col-md-10' style={{backgroundColor: "#e2e1e1"}}>
                        <Nav className="mt-2" tabs>
                            <NavItem>
                                <NavLink
                                    className={{active: this.state.activeTab === '1'}}
                                    onClick={() => {
                                        toggle('1');
                                    }}
                                >
                                    Transferlar
                                </NavLink>
                            </NavItem>
                        </Nav>

                        <TabContent activeTab={this.state.activeTab} className="mt-3">
                            {getRoleNameFromJWT() === 'ROLE_DIRECTOR' || getRoleNameFromJWT() === 'ROLE_MANAGER' ?
                                <TabPane tabId="1">
                                    <Row>
                                        <Col sm="12">
                                            <form action="">
                                                <select className="form-control-sm"
                                                        style={{outline: "none", backgroundColor: "#92d4a5"}}
                                                        onChange={e => this._onChange(e)}>
                                                    <option  value={false}>Tasdiqlanmagan</option>
                                                    <option  value={true}>Tasdiqlangan</option>
                                                </select>
                                            </form>
                                            <Table striped>
                                                <thead>
                                                <tr>
                                                    <th>T/r</th>
                                                    <th>Qayerdan</th>
                                                    <th>Kimdan</th>
                                                    <th>Qayerga</th>
                                                    <th>Kimga</th>
                                                    <th>Soni</th>
                                                    <th>Accepted</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.transfers &&
                                                this.state.transfers.map((item, index) =>
                                                    <tr>
                                                        <th scope="row">{index + 1 + (this.state.currentPage * 10)}</th>
                                                        <td>{item.shopDto.name + '  ' + item.shopDto.address}</td>
                                                        <td>{item.sellerDto.firstName + '  ' + item.sellerDto.lastName}</td>
                                                        <td>{item.managerDto.firstName + '  ' + item.managerDto.lastName}</td>
                                                        {!item.accepted ? <td><Button onClick={()=>this.updateReport(item.id)} type="button"
                                                                                      className="btn btn-success">Tasdiqlash</Button>
                                                        </td> : null}
                                                        <td>{item.transfers}</td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </TabPane>
                                :''
                            }
                        </TabContent>

                        <TabContent activeTab={this.state.activeTab} className="mt-3">
                            {getRoleNameFromJWT() === 'ROLE_SELLER' ?
                                <TabPane tabId="1">
                                    <Row>
                                        <Col sm="12">
                                            <Table striped>
                                                <thead>
                                                <tr>
                                                    <th>T/R</th>
                                                    <th>Shop</th>
                                                    <th>Seller</th>
                                                    <th>Manager</th>
                                                    <th>Accepted</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {this.state.reports &&
                                                this.state.reports.map((item, index) =>
                                                    <tr>
                                                        <th scope="row">{index + 1 + (this.state.currentPage * 10)}</th>
                                                        <td>{item.shopDto.name + '  ' + item.shopDto.address}</td>
                                                        <td>{item.sellerDto.firstName + '  ' + item.sellerDto.lastName}</td>
                                                        <td>{item.managerDto.firstName + '  ' + item.managerDto.lastName}</td>
                                                        <td><input type="checkbox" checked={item.accepted}/></td>
                                                        <td>{item.reports}</td>
                                                    </tr>
                                                )}
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                </TabPane>
                                :''
                            }
                        </TabContent>

                    </div>
                </div>
                :
                <Redirect to="/"/>
        );
    }
}

Transfer.propTypes = {};

export default Transfer;
