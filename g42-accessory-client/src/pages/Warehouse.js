import React, {Component} from 'react';
import Navbar from "../components/Navbar";
import {getRoleNameFromJWT} from "../utills/UsefullFunctions";
import {Redirect} from "react-router-dom";
import {NavLink, Nav, NavItem, TabContent, TabPane} from "reactstrap";
import UserPane from "../components/catalog_components/UserPane";
import ShopPane from "../components/catalog_components/ShopPane";
import WarehousePane from "../components/catalog_components/WarehousePane";
import CategoryPane from "../components/catalog_components/CategoryPane";
import ProductPane from "../components/catalog_components/ProductPane";
import CatalogTable from "../components/catalog_components/CatalogTable";
import WarehouseIncome from "../components/warehouseComponents/WarehouseIncome";
import WarehouseOutput from "../components/warehouseComponents/WarehouseOutput";

class Warehouse extends Component {
    constructor(props) {
        super(props);
        this.state={
            activeTab:'1'
        }
    }
    render() {
        const {history} = this.props
        const toggle = tab => {
            if(this.state.activeTab !== tab) this.setState({activeTab:tab});
        }
        return (
            getRoleNameFromJWT()?
                <div className='row row-style'>
                    <div className='col-md-2 col-2-style'>
                        <Navbar role={getRoleNameFromJWT()} history={history} tab="3"/>
                    </div>
                    <div className='col-md-10 col-10-style'>

                            <Nav className="mt-2" tabs>

                                <NavItem className="ml-4">
                                    <NavLink
                                        className={{active: this.state.activeTab === '1'}}
                                        onClick={() => {
                                            toggle('1');
                                        }}
                                    >
                                        Kirim
                                    </NavLink>
                                </NavItem>
                                <NavItem className="ml-4">
                                    <NavLink
                                        className={{active: this.state.activeTab === '2'}}
                                        onClick={() => {
                                            toggle('2');
                                        }}
                                    >
                                        Chiqim
                                    </NavLink>
                                </NavItem>
                            </Nav>

                        <TabContent activeTab={this.state.activeTab} className="mt-3">

                                <TabPane tabId={'1'} >
                                    <WarehouseIncome/>
                                </TabPane>

                                <TabPane tabId={'2'}>
                                    <WarehouseOutput/>
                                </TabPane>
                        </TabContent>
                    </div>
                </div>
                :
                <Redirect to="/" />
        );
    }
}


export default Warehouse;