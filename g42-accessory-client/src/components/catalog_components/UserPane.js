import React, {Component, useEffect, useState} from "react";
import CatalogTable from "./CatalogTable";
import {TabPane} from "reactstrap";
import AdminRequests from "./AdminRequests";
import axios from "axios";
import {BASE_URL} from "../../utills/constants";
import {apiPath} from "../../apiPath/apiPath";
import {configHeader} from "../../utills/congifHeader";
import {toast} from "react-toastify";

export default class UserPane extends Component{

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '1',
            showModal: false,
            showRemoveModal: false,
            currentItem: '',
            users: [],
            totalElements: 0,
            currentPage: 0
        }

    }

    componentDidMount() {
        AdminRequests.allUsers().then(res=>{
            console.log(res,"RES USER PANE")
            if (res){
                this.setState({
                    users:res.object,
                    totalElements:res.totalElements,
                    currentPage:res.currentPage,
                    currentItem:''
                })
            }



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
                if (v.password){

                }else{
                    v.password=null
                }
            }
            console.log(v,'vvvvvvvvvvvv')

            AdminRequests.saveOrEditUser(v)
                .then(res=>{

                    AdminRequests.allUsers().then(res=>{
                        this.setState({
                            users:res.object,
                            totalElements:res.object.totalElements,
                            currentPage:res.object.currentPage,
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

        const changeActive=(id,enable)=>{

            AdminRequests.changeUserActive(id,enable)
                .then(res=>{
                    if (enable){
                        toast.warning("Blocked")
                    }
                    else {
                        toast.success("Activate")
                    }
                    let users=this.state.users;
                    for (let i = 0; i < users.length; i++) {
                        if (users[i].id===id){
                            users[i].enable=!users[i].enable;
                        }
                    }
                    this.setState({
                        users:users
                    })

                })

        }

        const remove=()=>{
            AdminRequests.removeUser(this.state.currentItem.id)
                .then(res=>{
                    if (res){
                        this.setState({
                            users:this.state.users.filter(item=>item.id!==this.state.currentItem.id)
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
                              title={"Hodimlar Ro'yxati"}
                              currentPage={0}
                              set={set}
                              names={
                                  ["T/R", "FIO", "Phone Number", "Login", "Active", "Actions"]
                              }
                              dataType={"users"}
                              datas={this.state.users}
                              changeActive={changeActive}
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