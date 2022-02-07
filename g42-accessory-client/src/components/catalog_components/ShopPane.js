import React, {Component, useEffect, useState} from "react";
import CatalogTable from "./CatalogTable";
import {TabPane} from "reactstrap";
import AdminRequests from "./AdminRequests";
import axios from "axios";
import {BASE_URL} from "../../utills/constants";
import {apiPath} from "../../apiPath/apiPath";
import {configHeader} from "../../utills/congifHeader";
import {toast} from "react-toastify";

export default class ShopPane extends Component{

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '2',
            showModal: false,
            showRemoveModal: false,
            currentItem: '',
            shops: [],
            sellers:[],
            totalElements: 0,
            currentPage: 0
        }

    }

    componentDidMount() {
        AdminRequests.allShops().then(res=>{
            this.setState({
                shops:res.object,
                totalElements:res.totalElements,
                currentPage:res.currentPage,
                currentItem:''
            })
        })

        AdminRequests.allUsersByRoleSeller().then(res=>{
            this.setState({
                sellers:res!=null?res.object:[],
            })
        })
    }

    render() {



        const openModal = item => {
            console.log(item, "ITEM")
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
            if (v.seller==='') v.seller=undefined

            for (let i=0; i<this.state.sellers.length; i++){
                if (this.state.sellers[i].id===v.seller){
                    v.seller=this.state.sellers[i];
                    break;
                }
            }
            AdminRequests.saveOrEditShop(v)
                .then(res=>{
                    AdminRequests.allShops().then(res=>{
                        this.setState({
                            shops:res.object,
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

        const changeActive=(id,active)=>{
            console.log(id,'IDDDDD')

            AdminRequests.changeShopActive(id,active)
                .then(res=>{
                    if (active){
                        toast.warning("Blocked")
                    }
                    else {
                        toast.success("Activate")
                    }
                    let shops=this.state.shops;
                    for (let i = 0; i < shops.length; i++) {
                        if (shops[i].id===id){
                            shops[i].active=!shops[i].active;
                        }
                    }
                    console.log(shops)
                    console.log(this.state.shops)
                    this.setState({
                        shops:shops
                    })

                })

        }

        const remove=()=>{
            AdminRequests.removeShop(this.state.currentItem.id)
                .then(res=>{
                    if (res){
                        this.setState({
                            shops:this.state.shops.filter(item=>item.id!=this.state.currentItem.id)
                        })
                    }

                    closeRemoveModal()
                    console.log(this.state.currentItem,"RRRRRRRRRRRRRRRAAAA")
                })
                .catch(error=>{
                    closeRemoveModal()
                })
        }

        return(
            <TabPane tabId={this.props.tabId}>
                <CatalogTable state={this.state}
                              title={"Magazinlar"}
                              set={set}
                              names={
                                  ["T/R", "name", "address", "seller", "Active", "Actions"]
                              }
                              currentPage={0}
                              dataType={"shops"}
                              datas={this.state.shops}
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