import React, {Component, useEffect, useState} from "react";
import CatalogTable from "./CatalogTable";
import {TabPane} from "reactstrap";
import AdminRequests from "./AdminRequests";
import axios from "axios";
import {BASE_URL} from "../../utills/constants";
import {apiPath} from "../../apiPath/apiPath";
import {configHeader} from "../../utills/congifHeader";
import {toast} from "react-toastify";

export default class CategoryPane extends Component{

    constructor(props) {
        super(props);
        this.state = {
            activeTab: '4',
            showModal: false,
            showRemoveModal: false,
            currentItem: '',
            categories: [],
            sellers:[],
            totalElements: 0,
            currentPage: 0
        }

    }

    componentDidMount() {
        AdminRequests.allCategories().then(res=>{
            this.setState({
                categories:res.object,
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
            if (v.parentCategoryDto==='') v.parentCategoryDto=undefined
            console.log(this.state.categories)
            console.log(v.parentCategoryDto)
            console.log(this.state.categories.length,"length")
            // console.log(this.state.categories)
            if (v.parentCategoryDto!=null){
                for (let i=0; i<this.state.categories.length; i++){
                    if (this.state.categories[i].id==v.parentCategoryDto){
                        v.parentCategoryDto=this.state.categories[i];
                        break;
                    }
                }
            }



            AdminRequests.saveOrEditCategory(v)
                .then(res=>{
                    AdminRequests.allCategories().then(res=>{
                        this.setState({
                            categories:res.object,
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


        const remove=()=>{
            AdminRequests.removeCategory(this.state.currentItem.id)
                .then(res=>{
                    AdminRequests.allCategories().then(ress=>{
                        this.setState({
                            categories:ress.object,
                            totalElements:ress.totalElements,
                            currentPage:ress.currentPage,
                            currentItem:''
                        })
                    })

                    closeRemoveModal()
                })
                .catch(error=>{
                    closeRemoveModal()
                })
        }

        return(
            <TabPane tabId={this.props.tabId}>
                <CatalogTable state={this.state}
                              title={"Kategoriyalar"}
                              set={set}
                              names={
                                  ["T/R", "Nomi", "Tegishli", "Actions"]
                              }
                              currentPage={0}
                              dataType={"categories"}
                              datas={this.state.categories}
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