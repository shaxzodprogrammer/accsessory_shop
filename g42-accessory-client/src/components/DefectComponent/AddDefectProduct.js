import React from 'react';
import {configHeader} from "../../utills/congifHeader";
import axios from "axios";
import {BASE_URL} from "../../utills/constants";
import {apiPath} from "../../apiPath/apiPath";
import {toast} from "react-toastify";


const AddDefectProduct = (props) => {

    const saveOrEdit = (e, v) => {
        if (this.state.currentItem){
            v={...v,id: this.props.currentItem.id}
        }
        axios.post(BASE_URL+apiPath.saveOrEditDefect,v,configHeader)
            .then(res=>{
                console.log(res,'SAVE Or EDIT DEEEEEEEEEFEEEEEEEEECT')

                toast.success(res.data.message)
            }).catch(res=>{
            toast.error('Error')
        })
    }

    return (
        <div >
            <div className="text-center ml-5 mt-4 mb-4">

                <form onSubmit={saveOrEdit} >
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                            <label className="sr-only" htmlFor="inlineFormInput">Name</label>
                            <input type="text" className="form-control mb-2" id="inlineFormInput"
                                   placeholder="Defect Mahsulot kiriting"/>
                        </div>
                        <div className="col-auto">
                            <label className="sr-only" htmlFor="inlineFormInputGroup">Username</label>
                            <div className="input-group mb-2">
                                <input type="number" className="form-control" id="inlineFormInputGroup"
                                       placeholder="Defectlar soni"/>
                            </div>
                        </div>

                        <div className="col-auto">
                            <button type="submit" className="btn btn-success mb-2"  >Qo'shish</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddDefectProduct;
