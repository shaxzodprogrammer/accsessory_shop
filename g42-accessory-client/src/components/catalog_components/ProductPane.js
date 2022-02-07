import React, {Component, useEffect, useState} from "react";
import CatalogTable from "./CatalogTable";
import {TabPane} from "reactstrap";
import AdminRequests from "./AdminRequests";
import axios from "axios";
import {BASE_URL} from "../../utills/constants";
import {apiPath} from "../../apiPath/apiPath";
import {configHeader} from "../../utills/congifHeader";
import {toast} from "react-toastify";
import {getRoleNameFromJWT} from "../../utills/UsefullFunctions";

export default class ProductPane extends Component{

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '5',
            showModal: false,
            showRemoveModal: false,
            currentItem: '',
            products: [],
            categories:[],
            totalElements: 0,
            currentPage: 0
        }

    }

    componentDidMount() {
        AdminRequests.allProduct().then(res=>{
            this.setState({
                products:res.object,
                totalElements:res.object.totalElements,
                currentPage:res.object.currentPage,
                currentItem:''
            })
        })
            .catch(err=>{
                this.setState({
                    totalElements:0,
                    currentPage:0,
                    currentItem:''
                })
            })

        AdminRequests.allCategories().then(res=>{
            this.setState({
                categories:res.object,
            })
        })
    }

    render() {



        const openModal = item => {
            AdminRequests.allCategories().then(res=>{
                this.setState({
                    categories:res.object,
                    currentItem: item,
                    showModal: !this.state.showModal
                })
            })
            // this.setState({currentItem: item,showModal: !this.state.showModal})
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

            if (v.categoryDto){
                for (let i=0; i<this.state.categories.length; i++){
                    if (this.state.categories[i].id==v.categoryDto){
                        v.categoryDto=this.state.categories[i];
                        break;
                    }
                }
            }
            if (v.categoryDto == '') v.categoryDto=null
            AdminRequests.saveOrEditProduct(v)
                .then(res=>{
                    AdminRequests.allProduct().then(res=>{
                        this.setState({
                            products:res.object,
                            totalElements:res.object.totalElements,
                            currentPage:res.object.currentPage,
                            currentItem:''
                        })
                    })
                        .catch(err=>{
                            this.setState({
                                totalElements:0
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

            AdminRequests.changeProductActive(id,active)
                .then(res=>{
                    if (active){
                        toast.warning("Blocked")
                    }
                    else {
                        toast.success("Activate")
                    }
                    let products=this.state.products;
                    for (let i = 0; i < products.length; i++) {
                        if (products[i].id===id){
                            products[i].active=!products[i].active;
                        }
                    }
                    this.setState({
                        products:products
                    })

                })

        }

        const remove=()=>{
            AdminRequests.removeProduct(this.state.currentItem.id)
                .then(res=>{
                    if (res){
                        this.setState({
                            products:this.state.products.filter(item=>item.id!=this.state.currentItem.id)
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
                              title={"Produktlar"}
                              set={set}
                              names={ getRoleNameFromJWT()==='ROLE_DIRECTOR'?
                                  ["T/R", "name", "incomePrice", "salePrice", "norma","kategoriya", "Active", "Actions"]
                                  :["T/R", "name", "salePrice", "norma","kategoriya", "Active", "Actions"]
                              }
                              currentPage={0}
                              dataType={"products"}
                              datas={this.state.products}
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