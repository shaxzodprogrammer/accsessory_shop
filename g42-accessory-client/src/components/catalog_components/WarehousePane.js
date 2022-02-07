import React, {Component, useEffect, useState} from "react";
import CatalogTable from "./CatalogTable";
import {TabPane} from "reactstrap";
import AdminRequests from "./AdminRequests";
import axios from "axios";
import {BASE_URL} from "../../utills/constants";
import {apiPath} from "../../apiPath/apiPath";
import {configHeader} from "../../utills/congifHeader";
import {toast} from "react-toastify";

export default class WarehousePane extends Component{

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '3',
            showModal: false,
            showRemoveModal: false,
            currentItem: '',
            warehouses: [],
            totalElements: 0,
            currentPage: 0
        }

    }

    componentDidMount() {
        AdminRequests.allWarehouses().then(res=>{
            this.setState({
                warehouses:res.object,
                totalElements:res.totalElements,
                currentPage:res.currentPage,
                currentItem:''
            })
        })

    }

    render() {

        const openModal = item => {
            this.setState({currentItem: item,showModal: !this.state.showModal})
            // return AddEditModal({state:this.state, setState:this.setState,saveOrEdit:saveOrEdit})
        }
        const closeModal=()=>{
            this.setState({
                currentItem: '',
                showModal: false
            })
        }

        const openRemoveModal=(item)=>{
            this.setState({
                showRemoveModal: true,
                currentItem: item
            })
        }

        const closeRemoveModal=()=>{
            this.setState({
                showRemoveModal: false,
                currentItem: ''
            })
        }


        const saveOrEdit = (e, v) => {
            if (this.state.currentItem){
                v={...v,id:this.state.currentItem.id}
            }

            AdminRequests.saveOrEditWarehouse(v)
                .then(res=>{
                    AdminRequests.allWarehouses().then(res=>{
                        this.setState({
                            warehouses:res.object,
                            totalElements:res.totalElements,
                            currentPage:res.currentPage,
                            currentItem:''
                        })
                    })
                    closeModal()
                }).
            catch(err=>{
                closeModal()
            })

        }

        const set=(state)=> {
            this.setState(state)
        }

        const changeWarehouseActive=(id,active)=>{

            AdminRequests.changeWarehouseActive(id,active)
                .then(res=>{
                    if (active){
                        toast.warning("Blocked")
                    }
                    else {
                        toast.success("Activate")
                    }
                    AdminRequests.allWarehouses().then(res=>{
                        this.setState({
                            warehouses:res.object,
                            totalElements:res.totalElements,
                            currentPage:res.currentPage,
                            currentItem:''
                        })
                    })

                })

        }

        const remove=()=>{
            AdminRequests.removeWarehouse(this.state.currentItem.id)
                .then(res=>{
                    if (res){
                        this.setState({
                            warehouses:this.state.warehouses.filter(item=>item.id!=this.state.currentItem.id)
                        })
                    }

                    closeRemoveModal()
                })
                .catch(error=>{
                    closeRemoveModal()
                })
        }

        return(
            <TabPane tabId={this.props.tabId}>
                <CatalogTable state={this.state}
                              title={"Omborlar"}
                              set={set}
                              names={
                                  ["T/R", "name", "address", "shop", "Active", "Actions"]
                              }
                              currentPage={0}
                              dataType={"warehouses"}
                              datas={this.state.warehouses}
                              changeActive={changeWarehouseActive}
                              changeWarehouseActive={changeWarehouseActive}
                              openModal={openModal}
                              closeModal={closeModal}
                              openRemoveModal={openRemoveModal}
                              closeRemoveModal={closeRemoveModal}
                              saveOrEdit={saveOrEdit}
                              remove={remove}
                />
            </TabPane>
        )
    }






}