import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from "axios";
import {BASE_URL} from "../../utills/constants";
import {apiPath} from "../../apiPath/apiPath";
import {configHeader} from "../../utills/congifHeader";
import {toast} from "react-toastify";
import {request} from "../../utills/Request";

/** Admin requests **/
class AdminRequests {

    /** User operations **/
    static async allUsers() {
        let users = null;
        await request('get',apiPath.getAllUsersByPageable)
            .then(res => {
                users = res.data;
                console.log(users, 'RES USERS')
            })
            .catch(err => {
                console.log(err,"errorr")
            })
        return users
    }

    static async allUsersByRoleSeller() {
        let sellers = [];
        await request('get',apiPath.getAllUsersRoleSeller)
            .then(res => {
                sellers = res.data;
            })
            .catch(err => {

            })
        return sellers
    }

    static async saveOrEditUser(user){
        let response;
        await request('post',apiPath.saveOrEditUser,user)
            .then(res=>{
                console.log(res,'SAVE Or EDIT RES')
                axios.get(BASE_URL + apiPath.getAllUsersByPageable,
                    configHeader)
                    response=res.data
                toast.success(res.data.message)
            }).catch(res=>{
            toast.error('Error')
        })
        return response
    }

    static async removeUser(id){
        let bool=false;
        await request('get',apiPath.deleteUser+id)
            .then(res => {
                console.log(res, 'RES REMOVE USER')
                // toast.success(res.data.message)
                toast.success("Deleted")
                bool=true
            }).catch(error => {
            // toast.error(error.data.message?error.data.message:"Error")
            toast.error("Error")
            })
        return bool
    }

    static async changeUserActive(id,enable){
        let res="";
        await request('get',apiPath.changeUserActive+id)
            .then(result=>{
                res=result;
            });
        return res;
    }


    /** Shop operations **/
    static async allShops() {
        let shops = {};
        await request('get',apiPath.getAllShopsByPageable)
            .then(res => {
                console.log(res,"shops")
                shops = res.data;

            })
            .catch(err => {

            })
        return shops
    }

    static async saveOrEditShop(shop){
        let response;
        await request('post',apiPath.saveOrEditShop,shop)
            .then(res=>{
                console.log(res,'SAVE Or EDIT RES')
                axios.get(BASE_URL + apiPath.getAllShopsByPageable,
                    configHeader)
                response=res.data
                toast.success(res.data.message)
            }).catch(res=>{
                toast.error('Error')
            })
        return response
    }

    static async removeShop(id){
        let bool=false
         await request('delete',apiPath.deleteShop+id)
            .then(res => {
                console.log(res, 'RES REMOVE USER')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
            toast.error(error.data?error.data:"Error")
        })
        return bool
    }

    static async changeShopActive(id,active){
        let res="";
        await request('get',apiPath.changeShopActive+id)
            .then(result=>{
                res=result;
            });
        return res;
    }

    /** Warehouse operations **/
    static async allWarehouses() {
        let warehouses = {};
        await request('get',apiPath.getAllWarehousesByPageable)
            .then(res => {
                warehouses = res.data;
            })
            .catch(err => {

            })
        return warehouses
    }

    static async saveOrEditWarehouse(warehouse){
        let response;
        console.log(warehouse,"aaaaaaaaaa")
        await request('post',apiPath.saveOrEditWarehouse,warehouse)
            .then(res=>{
                console.log(res,'SAVE Or EDIT RES')
                axios.get(BASE_URL + apiPath.getAllWarehousesByPageable,
                    configHeader)
                response=res.data
                toast.success(res.data.message)
            }).catch(res=>{
                toast.error('Error')
            })
        return response
    }

    static async removeWarehouse(id){
        let bool=false
        await request('delete',apiPath.deleteWarehouse+id)
            .then(res => {
                console.log(res, 'RES REMOVE USER')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }

    static async changeWarehouseActive(id,active){
        let res="";
        await request('get',apiPath.changeWarehouseActive+id)
            .then(result=>{
                res=result;
            });
        return res;
    }

    static async getWarehouseIncomeByApprove(reqParams){
        let res;
        await request('get',apiPath.warehouseIncomes+'page='+reqParams.page+"&size="+reqParams.size+'&accepted='+reqParams.accepted+'&income='+reqParams.income+'&fromWarehouseId='+reqParams.fromWarehouseId+'&toWarehouseId='+reqParams.toWarehouseId+'&startDate='+reqParams.startDate+'&endDate='+reqParams.endDate)
            .then(result=>{
                res=result.data;
            });
        return res;
    }
    static async acceptWarehouseIncome(id){
        let res;
        await request('get',apiPath.acceptWarehouseIncome+'/'+id)
            .then(result=>{
                res=result.data;
            });
        return res;
    }
    static async removeWarehouseIncome(id){
        let res;
        await request('get',apiPath.removeWarehouseIncome+'/'+id)
            .then(result=>{
                res=result.data;
            });
        return res;
    }

    /** Category operations **/
    static async allCategories() {
        let categorys = [];
        await request('get',apiPath.getAllCategorysByPageable)
            .then(res => {
                categorys = res.data;
            })
            .catch(err => {

            })
        return categorys
    }

    static async saveOrEditCategory(category){
        let response;
        console.log(category,"category")
        await request('post',apiPath.saveOrEditCategory,category)
            .then(res=>{
                console.log(res,'SAVE Or EDIT RES')
                axios.get(BASE_URL + apiPath.getAllCategorysByPageable,
                    configHeader)
                response=res.data
                toast.success(res.data.message)
            }).catch(res=>{
                toast.error('Error')
            })
        return response
    }

    static async removeCategory(id){
        let bool=false
        await request('get',apiPath.deleteCategory + id)
            .then(res => {
                console.log(res, 'RES REMOVE CATEGORY')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }

    /** Product operations **/

    static async allProduct() {
        let products = {};
        await request('get', apiPath.getAllProductByPageable)
            .then(res => {
                products = res.data;
            })
            .catch(err => {

            })
        return products
    }

    static async saveOrEditProduct(product){
        let response;
        if (product.id){
            await request('post',apiPath.editProduct,product)
                .then(res=>{
                    console.log(res,'EDIT RES')
                    axios.get(BASE_URL + apiPath.getAllProductByPageable,
                        configHeader)
                    response=res.data
                    toast.success(res.data.message)
                }).catch(res=>{
                    response=res
                    toast.error('Error')
                })
        }
        else {
            await request('post',apiPath.addProduct,product)
                .then(res=>{
                    console.log(res,'EDIT RES')
                    axios.get(BASE_URL + apiPath.getAllProductByPageable,
                        configHeader)
                    response=res.data
                    toast.success(res.data.message)
                }).catch(res=>{
                    toast.error('Error')
                    response=res
                })
        }
        return response
    }

    static async removeProduct(id){
        let bool=false
        await request('get', apiPath.deleteProduct + id)
            .then(res => {
                console.log(res, 'RES REMOVE PRODUCT')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }

    static async changeProductActive(id,active){
        let res="";
        await request('get',apiPath.changeProductActive+id)
            .then(result=>{
                res=result;
            });
        return res;
    }

    static async allWarehouseWithoutPageable() {
        let warehouses = [];
        await request('get',apiPath.warehouses)
            .then(res => {
                warehouses = res.data.object;
            })
            .catch(err => {

            })
        return warehouses
    }

    static async searchProduct(val) {
        let products = [];
        await request('get',apiPath.searchProduct+'/'+val)
            .then(res => {
                products = res.data.object;
            })
            .catch(err => {

            })
        return products
    }

    static async saveOrEditTransfer(req) {

        await request('post',apiPath.saveOrEditTransfer,req)
            .then(res => {


            })
            .catch(err => {

            })
        return null
    }
    static async getProductCountByWarehouse(prodId,wId) {
        let count=0;
        await request('get',apiPath.productCountByWarehouseId+prodId+"&warehouseId="+wId)
            .then(res => {
                count=res.data.object
            })
            .catch(err => {

            })
        return count
    }

    static async saveOrEditTrade(obj){
        let response;
        await request('post',apiPath.saveOrEditTrade,obj)
            .then(res=>{
                response=res.data
                toast.success(res.data.message)
            }).catch(res=>{
                toast.error('Error')
            })
        return response
    }

    static async getTradesByAccepted() {
        let trades = [];
        await request('get',apiPath.getAllByFalseReport)
            .then(res => {
                trades = res.data.object;
            })
            .catch(err => {

            })
        return trades
    }
    static async removeTrade(id){
        let bool=false
        await request('delete', apiPath.deleteTrade + id)
            .then(res => {
                console.log(res, 'RES REMOVE PRODUCT')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }
    static async closeDay(id){
        let bool=false
        await request('get', apiPath.closeDay + id)
            .then(res => {
                console.log(res, 'RES REMOVE PRODUCT')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }

    static async getAllReportByStatus(params) {
        let resp = '';
        await request('get',apiPath.getAllReportByStatus+
            '?page='+params.page+'&size='+params.size+'&status='+params.status+'&startDate='+params.startDate + '&endDate=' + params.endDate+'&shopId='+params.shopId)
            .then(res => {
                resp = res.data;
            })
            .catch(err => {

            })
        return resp
    }

    static async acceptReport(id){
        let bool=false
        await request('put', apiPath.acceptReport + id)
            .then(res => {
                console.log(res, 'RES REMOVE PRODUCT')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }

    static async saveReject(obj){
        let response;
        await request('post',apiPath.saveReject,obj)
            .then(res=>{
                response=res.data
                toast.success(res.data.message)
            }).catch(res=>{
                toast.error('Error')
            })
        return response
    }
    static async allReject(params) {
        let resp = '';
        await request('get',apiPath.allReject+'page='+params.page+
            '&size='+params.size+'&accepted='+params.accepted+'&warehouseId='+params.warehouseId)
            .then(res => {
                resp = res.data;
            })
            .catch(err => {

            })
        return resp
    }

    static async removeReject(id){
        let bool=false
        await request('delete', apiPath.removeReject + id)
            .then(res => {
                console.log(res, 'RES REMOVE PRODUCT')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }
    static async acceptReject(id){
        let bool=false
        await request('get', apiPath.acceptReject + id)
            .then(res => {
                console.log(res, 'RES REMOVE PRODUCT')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }

    static async saveOrEditDefect(obj){
        let response;
        await request('post',apiPath.saveOrEditDefect,obj)
            .then(res=>{
                response=res.data
                toast.success(res.data.message)
            }).catch(res=>{
                toast.error('Error')
            })
        return response
    }

    static async allDefects(params) {
        let resp = '';
        if (params.startDate&&params.endDate){
            await request('get',apiPath.allDefects+'page='+params.page+
                '&size='+params.size+'&accepted='+params.accepted+'&warehouseId='+params.warehouseId+
                '&startDate='+params.startDate + '&endDate=' + params.endDate)
                .then(res => {
                    resp = res.data;
                })
                .catch(err => {

                })
        }else {
            await request('get', apiPath.allDefects + 'page=' + params.page +
                '&size=' + params.size + '&accepted=' + params.accepted + '&warehouseId=' + params.warehouseId)
                .then(res => {
                    resp = res.data;
                })
                .catch(err => {
                })
        }
        return resp
    }
    static async acceptDefect(id){
        let bool=false
        await request('get', apiPath.acceptDefect + id)
            .then(res => {
                console.log(res, 'RES REMOVE PRODUCT')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }

    static async removeDefect(id){
        let bool=false
        await request('delete', apiPath.removeDefect + id)
            .then(res => {
                console.log(res, 'RES REMOVE PRODUCT')
                toast.success(res.data.message)
                bool=true
            }).catch(error => {
                toast.error(error.data?error.data:"Error")
            })
        return bool
    }

    static async productCount(params){
        let resp = '';
        await request('get',apiPath.productCount+'page='+params.page+
            '&size='+params.size+'&' +
            'productId='+params.productId)
            .then(res => {
                resp = res.data;
            })
            .catch(err => {
            })
        return resp
    }

    static async totalCashFlow(){
        let resp = '';
        await request('get',apiPath.totalCashFlow)
            .then(res => {
                resp = res.data;
            })
            .catch(err => {
            })
        return resp
    }
}

export default AdminRequests;