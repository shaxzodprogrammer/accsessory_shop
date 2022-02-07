import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getRoleNameFromJWT} from "../../utills/UsefullFunctions";
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import AdminRequests from "../catalog_components/AdminRequests";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";

class WarehouseOutput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showAddModal: false,
            item: '',
            products: [],
            pwa: [
                {
                    id: '',
                    productDto: '',
                    amount: 0,
                    productCount:'0'
                }
            ],
            warehouses: [],
            fromWarehouseId: 0,
            toWarehouseId: 0,
            page: 0,
            size: 10,
            accepted: false,
            outcomeList: [],
            totalElements: 0,
            totalPages: 0,
            showItemModal:false,
            showRemoveModal:false,
            removeOutcomeId:'',
            startDate:'',
            endDate:''
        }
    }

    componentDidMount() {
        AdminRequests.allWarehouseWithoutPageable().then(res => {
            console.log(res, "allALL")
            this.setState({warehouses: res})
        })
        AdminRequests.getWarehouseIncomeByApprove({
            accepted: this.state.accepted,
            income: false,
            fromWarehouseId: this.state.fromWarehouseId,
            toWarehouseId: this.state.toWarehouseId,
            page: this.state.page,
            size: this.state.size,
            startDate:'',
            endDate:''
        }).then(res => {
            console.log(res, "RESRESRESRES===INCOMES")
            this.setState(
                {
                    outcomeList: res.object,
                    totalElements: res.totalElements,
                    totalPages: res.totalPages
                })
        })

    }

    render() {
        const openAddModal = (item) => {
            this.setState({
                showAddModal: !this.state.showAddModal,
                item: item
            })
        }
        const saveOrEdit = (e, v) => {
            e.preventDefault()
            let req = {
                fromWarehouseDto: {
                    id: v.fromWarehouseId
                },
                toWarehouseDto: {
                    id: v.toWarehouseId
                },
                productWithAmountDtos: this.state.pwa
            }
            console.log(req, 'REQTRANSFER')
            AdminRequests.saveOrEditTransfer(req).then(response => {
                AdminRequests.getWarehouseIncomeByApprove({
                    accepted: this.state.accepted,
                    income: false,
                    fromWarehouseId: this.state.fromWarehouseId,
                    toWarehouseId: this.state.toWarehouseId,
                    page: this.state.page,
                    size: this.state.size,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate
                }).then(res => {
                    console.log(res, "RESRESRESRES===INCOMES")
                    this.setState(
                        {
                            outcomeList: res.object,
                            totalElements: res.totalElements,
                            totalPages: res.totalPages,
                            showAddModal: !this.state.showAddModal,
                            item: '',
                            pwa: [],
                            products: []
                        })
                })
            })

        }
        const getProdId = (val) => {
            AdminRequests.searchProduct(val).then(res => {
                this.setState({products: res})
            })
        }
        const filterColors = (inputValue) => {
            if (inputValue) {
                return this.state.products.filter(i =>
                    i.label.toLowerCase().includes(inputValue.toLowerCase())
                );
            }
        };
        const loadOptions = (inputValue, callback) => {
            setTimeout(() => {
                callback(filterColors(inputValue));
            }, 500);
        };
        const handleChange = (e, index) => {
            console.log(e.id,'PROD ID')
            console.log(this.state.fromWarehouseId,'FROM W ID')
            AdminRequests.getProductCountByWarehouse(e.id,this.state.fromWarehouseId).then(res=>{
                let tempArr = this.state.pwa
                tempArr[index].productDto = e
                tempArr[index].productCount = res
                this.setState({pwa: tempArr})
            })

        }
        const getAmount = (e, index) => {
            let el= e.target.value;
            let tempArr = this.state.pwa
            console.log(Number(el)<1||Number(el)> tempArr[index].productCount,'EL')
            console.log(Number(el)<1,'AMOUNT')
            console.log(tempArr[index].productCount,'AMOUNT')
            console.log(tempArr[index].productCount,'AMOUNT')
             if (Number(el)<1||Number(el)> tempArr[index].productCount){
                 e.target.value=undefined

             }else {

                // console.log(el, "AMOUNTVVVVVVVVVVVVVVVV")
                // console.log(index, "AMOUNTIIIIIIIIIIIIIIIIII")

                tempArr[index].amount = e.target.value
                this.setState({pwa: tempArr})
              }

        }
        const removeItem = (item, index) => {
            console.log(item, 'ITEMMMMMMMMM')
            console.log(index, "INDEXXXXXXX")
            let tempArr = this.state.pwa
            tempArr.splice(index, 1);
            this.setState({pwa: tempArr})
        }
        const addToArray = () => {
            let tempArr = this.state.pwa
            let s = {
                id: '',
                productDto: '',
                amount: 0,
                productCount:'0'
            }
            console.log(s, "SSSSSSSSS")
            tempArr.push(s)
            console.log(tempArr, "TEMPARR")
            this.setState({pwa: tempArr})
        }
        const openPwaListModal=(item)=>{
            console.log(item,'ITEM TO SHOW PWA')
            this.setState({
                item,
                showItemModal:!this.state.showItemModal
            })
        }
        const openRemoveModal = (id) => {
            this.setState(
                {
                    showRemoveModal: !this.state.showRemoveModal,
                    removeOutcomeId: id
                })

        }
        const remove = () => {
            AdminRequests.removeWarehouseIncome(this.state.removeOutcomeId).then(response => {
                AdminRequests.getWarehouseIncomeByApprove({
                    accepted: this.state.accepted,
                    income: false,
                    fromWarehouseId: this.state.fromWarehouseId,
                    toWarehouseId: this.state.toWarehouseId,
                    page: this.state.page,
                    size: this.state.size,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate
                }).then(res => {
                    console.log(res, "RESRESRESRES===INCOMES")
                    this.setState(
                        {
                            outcomeList: res.object,
                            totalElements: res.totalElements,
                            totalPages: res.totalPages,
                            showRemoveModal: !this.state.showRemoveModal,
                            removeOutcomeId: ''
                        })
                })
            })
        }
        const getByFromWarehouse = (e) => {
            let s = e.target.value;
            AdminRequests.getWarehouseIncomeByApprove({
                accepted: this.state.accepted,
                income: false,
                fromWarehouseId: s,
                toWarehouseId: this.state.toWarehouseId,
                page: 0,
                size: this.state.size,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            }).then(res => {
                console.log(res, "RESRESRESRES===INCOMES")
                this.setState(
                    {
                        outcomeList: res.object,
                        totalElements: res.totalElements,
                        totalPages: res.totalPages,
                        fromWarehouseId: s,
                        page:0
                    })
            })
        }
        const getByApproved = (e) => {
            console.log(e.target.value, 'APPROVED')
            AdminRequests.getWarehouseIncomeByApprove({
                accepted: !this.state.accepted,
                income: false,
                fromWarehouseId: this.state.fromWarehouseId,
                toWarehouseId: this.state.toWarehouseId,
                page: 0,
                size: this.state.size,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            }).then(res => {
                console.log(res, "RESRESRESRES===INCOMES")
                this.setState(
                    {
                        outcomeList: res.object,
                        totalElements: res.totalElements,
                        totalPages: res.totalPages,
                        accepted: !this.state.accepted,
                        page:0
                    })
            })
        }
        const handlePageChange=(pageNumber)=>{
            AdminRequests.getWarehouseIncomeByApprove({
                accepted: !this.state.accepted,
                income: false,
                fromWarehouseId: this.state.fromWarehouseId,
                toWarehouseId: this.state.toWarehouseId,
                page: pageNumber-1,
                size: this.state.size,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            }).then(res => {
                console.log(res, "RESRESRESRES===INCOMES")
                this.setState(
                    {
                        outcomeList: res.object,
                        totalElements: res.totalElements,
                        totalPages: res.totalPages,
                        page:pageNumber-1
                    })
            })
        }
        const getFromWarehouseId=(e)=>{
            console.log(e.target.value,'FROM WAREHOUSE ID')
            this.setState({fromWarehouseId:e.target.value})
        }
        const getStartDate = (startDate) => {
            if (this.state.endDate) {
                AdminRequests.getWarehouseIncomeByApprove({
                    accepted: this.state.accepted,
                    income: false,
                    fromWarehouseId: this.state.fromWarehouseId,
                    toWarehouseId: this.state.toWarehouseId,
                    page: 0,
                    size: this.state.size,
                    startDate,
                    endDate:this.state.endDate
                }).then(res => {
                    console.log(res, "RESRESRESRES===INCOMES")
                    this.setState(
                        {
                            outcomeList: res.object,
                            totalElements: res.totalElements,
                            totalPages: res.totalPages,
                            startDate
                        })
                })
            } else {
                this.setState({
                    startDate
                })
            }
        }
        const getEndDate = (endDate) => {
            AdminRequests.getWarehouseIncomeByApprove({
                accepted: this.state.accepted,
                income: false,
                fromWarehouseId: this.state.fromWarehouseId,
                toWarehouseId: this.state.toWarehouseId,
                page: 0,
                size: this.state.size,
                startDate:this.state.startDate,
                endDate
            }).then(res => {
                console.log(res, "RESRESRESRES===INCOMES")
                this.setState(
                    {
                        outcomeList: res.object,
                        totalElements: res.totalElements,
                        totalPages: res.totalPages,
                        endDate
                    })
            })
        }
        return (
            <div className="mt-4">
                <div className="row">
                    <div className="col-md-6">
                        <button type="button" className="btn btn-success ml-5 mr-5" onClick={() => openAddModal('')}>
                            Chiqim qilish
                        </button>
                        {getRoleNameFromJWT() === 'ROLE_DIRECTOR' || getRoleNameFromJWT() === 'ROLE_MANAGER' ?
                            <select name="warehouse" id="warehouse" onChange={getByFromWarehouse}>
                                <option value={0}>Barcha Omborlar :</option>
                                {this.state.warehouses && this.state.warehouses.map(item =>
                                    <option value={item.id}>{item.name}</option>
                                )}
                            </select> : ''
                        }
                        <label htmlFor="accepted" className="ml-5">Tasdiqlangan:</label>
                        <input id="accepted" type="checkbox" checked={this.state.accepted} onChange={getByApproved}
                               className="ml-2"/>
                    </div>
                    <div className="col-md-3">
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={(date) => getStartDate(date)}
                            selectsStart
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                        />
                        <DatePicker
                            selected={this.state.endDate}
                            onChange={(date) => getEndDate(date)}
                            selectsEnd
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                            minDate={this.state.startDate}
                        />
                    </div>
                    <div className="col-md-3">
                        <Pagination
                            activePage={this.state.page+1}
                            itemsCountPerPage={this.state.size}
                            totalItemsCount={this.state.totalElements}
                            pageRangeDisplayed={5}
                            onChange={handlePageChange}
                            itemClass="page-item"
                            linkClass="page-link"
                        />
                    </div>

                </div>

                <Table>
                    <tr>
                        <th>T/R</th>
                        <th>Qayerdan</th>
                        <th>Qachon</th>
                        <th>Kim</th>
                        <th>Qayerga</th>
                        <th>Tasdiqlangan</th>
                        <th>Nimalar</th>
                        {this.state.accepted ? '' :
                            <th>Amallar</th>
                        }
                    </tr>
                    {this.state.outcomeList && this.state.outcomeList.map((item, index) =>
                        <tr>
                            <td>{index + 1 + (this.state.page * this.state.size)}</td>
                            <td>{item.fromWarehouseDto.name}</td>
                            <td>{item.createdAt.substr(0, 10) + '  |  ' + item.createdAt.substr(11, 5)}</td>
                            <td>{item.createdBy.firstName + ' ' + item.createdBy.lastName}</td>
                            <td>{item.toWarehouseDto ? item.toWarehouseDto.name : null}</td>
                            <td><input type="checkbox" checked={item.accepted}/></td>
                            <td>
                                <button onClick={() => openPwaListModal(item)}>...</button>
                            </td>
                            {!item.accepted ?
                                    <td>
                                        <button className="btn btn-danger"
                                                onClick={() => openRemoveModal(item.id)}>O'chirish
                                        </button>
                                    </td>
                                : ''
                            }
                        </tr>
                    )}
                </Table>


                <Modal size="lg" isOpen={this.state.showAddModal}
                       toggle={() => openAddModal('')}>
                    <AvForm onValidSubmit={saveOrEdit}>
                        <ModalBody>
                            {getRoleNameFromJWT() === 'ROLE_DIRECTOR' || getRoleNameFromJWT() === 'ROLE_MANAGER' ?
                                <div className="row">
                                    <div className="col-md-6">
                                        <AvField
                                            label="Qaysi ombordan chiqim qilmoqchisiz?"
                                            type="select"
                                            name="fromWarehouseId"
                                            onChange={getFromWarehouseId}
                                        >
                                            <option value="" disabled={true}>Ombor tanlang:</option>
                                            {this.state.warehouses && this.state.warehouses.map(item =>
                                                <option value={item.id}>{item.name}</option>
                                            )}
                                        </AvField>
                                    </div>
                                    <div className="col-md-6">
                                        <AvField
                                            label="Qaysi omborga chiqim qilmoqchisiz?"
                                            type="select"
                                            name="toWarehouseId"
                                        >
                                            <option value="" disabled={true}>Ombor tanlang:</option>
                                            {this.state.warehouses && this.state.warehouses.map(item =>
                                                <option value={item.id}>{item.name}</option>
                                            )}
                                        </AvField>
                                    </div>
                                </div>
                                :
                                <AvField
                                    label="Qaysi omborga chiqim qilmoqchisiz?"
                                    type="select"
                                    name="toWarehouseId"
                                >
                                    <option value="" disabled={true}>Ombor tanlang:</option>
                                    {this.state.warehouses && this.state.warehouses.map(item =>
                                        <option value={item.id}>{item.name}</option>
                                    )}
                                </AvField>
                            }


                            : ''

                            {
                                this.state.pwa && this.state.pwa.map((item, index) =>
                                    <div key={index} className="row">
                                        <div className="col-md-5">
                                            <AsyncSelect
                                                name="prodId"
                                                cacheOptions
                                                loadOptions={loadOptions}
                                                defaultOptions
                                                value={item.productDto ? item.productDto : ''}
                                                onInputChange={getProdId}
                                                onChange={(e) => handleChange(e, index)}
                                            />
                                        </div>
                                        <div className="col-md-5">
                                            <input value={item.amount}  type="number" name="amount"
                                                   min={0}
                                                   required={true}
                                                   max={item.productCount}
                                                   onChange={(e) => getAmount(e, index)}/>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="minusButton pb-2"
                                                 onClick={() => removeItem(item, index)}>X
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                            <div className="d-flex justify-content-center">
                                <button type="button" className="btn btn-success" onClick={addToArray}>+Add</button>
                            </div>

                        </ModalBody>
                        <ModalFooter>
                            <button type="button" onClick={() => openAddModal('')} className="btn btn-danger">Bekor
                                qilish
                            </button>
                            <button type="submit" className="btn btn-success">Saqlash</button>
                        </ModalFooter>
                    </AvForm>
                </Modal>
                <Modal isOpen={this.state.showItemModal} toggle={() => openPwaListModal('')}>
                    <ModalBody>
                        <Table>
                            <tr>
                                <th>T/R</th>
                                <th>Maxsulot Nomi</th>
                                <th>Soni</th>
                            </tr>
                            {this.state.item?this.state.item.productWithAmountDtos&&this.state.item.productWithAmountDtos.map((itemm,index)=>
                                <tr>
                                    <td>{index+1}</td>
                                    <td>{itemm.productDto.name}</td>
                                    <td>{itemm.amount}</td>
                                </tr>
                            )

                                :''
                            }
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-warning" onClick={() => openPwaListModal('')}>Yopish</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.showRemoveModal} toggle={() => openRemoveModal('')}>
                    <ModalHeader>O'chirmoqchimisiz?</ModalHeader>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => openRemoveModal('')}>Bekor Qilish</button>
                        <button className="btn btn-warning" onClick={remove}>O'chirish</button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

WarehouseOutput.propTypes = {};

export default WarehouseOutput;