import React, {Component} from 'react';
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {getRoleNameFromJWT} from "../../utills/UsefullFunctions";
import AdminRequests from "../catalog_components/AdminRequests";
import AsyncSelect from 'react-select/async';
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";
// import "bootstrap/less/bootstrap.less";

class WarehouseIncome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            item: '',
            warehouses: [],
            products: [],
            pwa: [
                {
                    id: '',
                    productDto: '',
                    amount: 0
                }
            ],
            accepted: false,
            toWarehouseId: 0,
            fromWarehouseId: 0,
            incomeList: [],
            totalElements: 0,
            totalPages: 0,
            currentPage: 0,
            size: 10,
            acceptedIncomeId: '',
            showAcceptModal: false,
            removeIncomeId: '',
            showRemoveModal: false,
            showItemModal: false,
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
            income: true,
            fromWarehouseId: this.state.fromWarehouseId,
            toWarehouseId: this.state.toWarehouseId,
            page: this.state.currentPage,
            size: this.state.size,
            startDate:'',
            endDate:''
        }).then(res => {
            console.log(res, "RESRESRESRES===INCOMES")
            this.setState(
                {
                    incomeList: res.object,
                    totalElements: res.totalElements,
                    totalPages: res.totalPages
                })
        })
    }

    render() {

        const getByApproved = (e) => {
            console.log(e.target.value, 'APPROVED')
            AdminRequests.getWarehouseIncomeByApprove({
                accepted: !this.state.accepted,
                income: true,
                fromWarehouseId: 0,
                toWarehouseId: this.state.toWarehouseId,
                page: 0,
                size: this.state.size,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            }).then(res => {
                console.log(res, "RESRESRESRES===INCOMES")
                this.setState(
                    {
                        incomeList: res.object,
                        totalElements: res.totalElements,
                        totalPages: res.totalPages,
                        accepted: !this.state.accepted,
                        currentPage:0
                    })
            })
        }
        const openModal = (item) => {
            AdminRequests.allWarehouseWithoutPageable().then(res => {
                console.log(res, "allALL")
                this.setState({
                    warehouses: res,
                    showModal: !this.state.showModal,
                    item: item
                })
            })
        }
        const saveOrEdit = (e, v) => {
            e.preventDefault()
            console.log(v, 'VVVVVVVVVVVVVVVVVVVVVVV')
            let req = {
                toWarehouseDto: {
                    id: v.toWarehouseId
                },
                productWithAmountDtos: this.state.pwa
            }
            console.log(req, 'REQTRANSFER')
            AdminRequests.saveOrEditTransfer(req).then(response => {
                AdminRequests.getWarehouseIncomeByApprove({
                    accepted: this.state.accepted,
                    income: true,
                    fromWarehouseId: 0,
                    toWarehouseId: 0,
                    page: this.state.currentPage,
                    size: this.state.size,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate
                }).then(res => {
                    console.log(res, "RESRESRESRES===INCOMES")
                    this.setState(
                        {
                            incomeList: res.object,
                            totalElements: res.totalElements,
                            totalPages: res.totalPages,
                            showModal: !this.state.showModal,
                            item: '',
                            pwa: [],
                            products: []
                        })
                })
            })
        }
        const getProdId = (val) => {
            AdminRequests.searchProduct(val).then(res => {
                console.log(res, 'RESSEarchProduct')
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
            }, 1000);
        };
        const handleChange = (e, index) => {
            console.log(e, "PRODVVVVVVVVVVVVVVVV")
            console.log(index, "PRODIIIIIIIIIIIIIIIIII")
            let tempArr = this.state.pwa
            tempArr[index].productDto = e
            this.setState({pwa: tempArr})
        }
        const getAmount = (e, index) => {
            console.log(e.target.value, "AMOUNTVVVVVVVVVVVVVVVV")
            console.log(index, "AMOUNTIIIIIIIIIIIIIIIIII")
            let tempArr = this.state.pwa
            tempArr[index].amount = e.target.value
            this.setState({pwa: tempArr})
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
                amount: 0
            }
            console.log(s, "SSSSSSSSS")
            tempArr.push(s)
            console.log(tempArr, "TEMPARR")
            this.setState({pwa: tempArr})
        }
        const getByToWarehouse = (e) => {
            let s = e.target.value;
            AdminRequests.getWarehouseIncomeByApprove({
                accepted: this.state.accepted,
                income: true,
                fromWarehouseId: this.state.fromWarehouseId,
                toWarehouseId: s,
                page: 0,
                size: this.state.size,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            }).then(res => {
                console.log(res, "RESRESRESRES===INCOMES")
                this.setState(
                    {
                        incomeList: res.object,
                        totalElements: res.totalElements,
                        totalPages: res.totalPages,
                        toWarehouseId: s,
                        currentPage:0
                    })
            })
        }
        const openAcceptModal = (id) => {
            this.setState(
                {
                    showAcceptModal: !this.state.showAcceptModal,
                    acceptedIncomeId: id
                })

        }
        const accept = () => {
            AdminRequests.acceptWarehouseIncome(this.state.acceptedIncomeId).then(response => {
                AdminRequests.getWarehouseIncomeByApprove({
                    accepted: this.state.accepted,
                    income: true,
                    fromWarehouseId: this.state.fromWarehouseId,
                    toWarehouseId: this.state.toWarehouseId,
                    page: this.state.currentPage,
                    size: this.state.size,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate
                }).then(res => {
                    console.log(res, "RESRESRESRES===INCOMES")
                    this.setState(
                        {
                            incomeList: res.object,
                            totalElements: res.totalElements,
                            totalPages: res.totalPages,
                            showAcceptModal: !this.state.showAcceptModal,
                            acceptedIncomeId: ''
                        })
                })
            })
        }
        const openRemoveModal = (id) => {
            this.setState(
                {
                    showRemoveModal: !this.state.showRemoveModal,
                    removeIncomeId: id
                })

        }
        const remove = () => {
            AdminRequests.removeWarehouseIncome(this.state.removeIncomeId).then(response => {
                AdminRequests.getWarehouseIncomeByApprove({
                    accepted: this.state.accepted,
                    income: true,
                    fromWarehouseId: this.state.fromWarehouseId,
                    toWarehouseId: this.state.toWarehouseId,
                    page: this.state.currentPage,
                    size: this.state.size,
                    startDate:this.state.startDate,
                    endDate:this.state.endDate
                })
                    .then(res => {
                    console.log(res, "RESRESRESRES===INCOMES")
                    this.setState(
                        {
                            incomeList: res.object,
                            totalElements: res.totalElements,
                            totalPages: res.totalPages,
                            showRemoveModal: !this.state.showRemoveModal,
                            removeIncomeId: ''
                        })
                })
            })
        }
        const openPwaListModal=(item)=>{
            console.log(item,'ITEM TO SHOW PWA')
            this.setState({
                item,
                showItemModal:!this.state.showItemModal
            })
        }
        const handlePageChange=(pageNumber)=>{
            console.log(`active page is ${pageNumber}`);
            AdminRequests.getWarehouseIncomeByApprove({
                accepted: this.state.accepted,
                income: true,
                fromWarehouseId: this.state.fromWarehouseId,
                toWarehouseId: this.state.toWarehouseId,
                page: pageNumber-1,
                size: this.state.size,
                startDate:this.state.startDate,
                endDate:this.state.endDate
            })
                .then(res => {
                    console.log(res, "RESRESRESRES===INCOMES")
                    this.setState(
                        {
                            incomeList: res.object,
                            totalElements: res.totalElements,
                            totalPages: res.totalPages,
                            currentPage: pageNumber-1
                        })
                })
        }
        const getStartDate = (startDate) => {
            if (this.state.endDate) {
                AdminRequests.getWarehouseIncomeByApprove({
                    accepted: this.state.accepted,
                    income: true,
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
                            incomeList: res.object,
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
                income: true,
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
                        incomeList: res.object,
                        totalElements: res.totalElements,
                        totalPages: res.totalPages,
                        endDate
                    })
            })
        }
        return (
            <div className="mt-4">
                {getRoleNameFromJWT() === 'ROLE_DIRECTOR' || getRoleNameFromJWT() === 'ROLE_MANAGER' ?
                    <div className="row">
                        <div className="col-md-6">
                            <button type="button" className="btn btn-success ml-5 mr-5" onClick={() => openModal('')}> Kirim qilish
                            </button>
                            <select name="warehouse" id="warehouse" onChange={getByToWarehouse}>
                                <option value={0}>Barcha Omborlar :</option>
                                {this.state.warehouses && this.state.warehouses.map(item =>
                                    <option value={item.id}>{item.name}</option>
                                )}
                            </select>
                            <label htmlFor="accepted" className="ml-5">Tasdiqlangam:</label>
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
                                activePage={this.state.currentPage+1}
                                itemsCountPerPage={this.state.size}
                                totalItemsCount={this.state.totalElements}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>

                    </div>
                    :
                    <div className="row">
                        <div className="col-md-6">
                            <label htmlFor="accepted" className="ml-5">Tasdiqlangam:</label>
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
                                activePage={this.state.currentPage+1}
                                itemsCountPerPage={this.state.size}
                                totalItemsCount={this.state.totalElements}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    </div>
                }
                <Table>
                    <tr>
                        <th>T/R</th>
                        <th>Qayerga</th>
                        <th>Qachon</th>
                        <th>Kim</th>
                        <th>Qayerdan</th>
                        <th>Tasdiqlangan</th>
                        <th>Nimalar</th>
                        {getRoleNameFromJWT() === 'ROLE_SELLER' ?
                            ''
                            :
                            this.state.accepted?'':
                            <th>Amallar</th>
                        }
                    </tr>
                    {this.state.incomeList && this.state.incomeList.map((item, index) =>
                        <tr>
                            <td>{index + 1 + (this.state.currentPage * this.state.size)}</td>
                            <td>{item.toWarehouseDto!=null?item.toWarehouseDto.name:''}</td>
                            <td>{item.createdAt.substr(0, 10) + '  |  ' + item.createdAt.substr(11, 5)}</td>
                            <td>{item.createdBy.firstName + ' ' + item.createdBy.lastName}</td>
                            <td>{item.fromWarehouseDto ? item.fromWarehouseDto.name : null}</td>
                            {item.accepted ?
                                <td><input type="checkbox" checked={item.accepted}/></td>
                                :
                                <td><input type="checkbox" checked={item.accepted}
                                           onChange={() => openAcceptModal(item.id)}/></td>

                            }
                            <td>
                                <button onClick={()=>openPwaListModal(item)}>...</button>
                            </td>
                            {!item.accepted ?
                                getRoleNameFromJWT() === 'ROLE_SELLER' ?
                                    ''
                                    :
                                    <td>
                                        <button className="btn btn-danger" onClick={()=>openRemoveModal(item.id)}>O'chirish</button>
                                    </td>
                                : ''
                            }
                        </tr>
                    )}
                </Table>

                <Modal size="lg" isOpen={this.state.showModal}
                       toggle={() => openModal('')}>
                    <AvForm onValidSubmit={saveOrEdit}>
                        <ModalBody>

                            {getRoleNameFromJWT() === 'ROLE_DIRECTOR' || getRoleNameFromJWT() === 'ROLE_MANAGER' ?
                                <AvField
                                    label="Qaysi omborga kirim qilmoqchisiz?"
                                    type="select"
                                    name="toWarehouseId"
                                >
                                    <option value="" disabled={true}>Ombor tanlang:</option>
                                    {this.state.warehouses && this.state.warehouses.map(item =>
                                        <option value={item.id}>{item.name}</option>
                                    )}
                                </AvField>
                                : ''
                            }

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
                                            <input value={item.amount} type="number" name="amount"
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
                            <button type="button" onClick={() => openModal('')} className="btn btn-danger">Bekor qilish
                            </button>
                            <button type="submit" className="btn btn-success">Saqlash</button>
                        </ModalFooter>
                    </AvForm>
                </Modal>
                <Modal isOpen={this.state.showAcceptModal} toggle={() => openAcceptModal('')}>
                    <ModalHeader>Tasdiqlamoqchimisiz?</ModalHeader>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => openAcceptModal('')}>Bekor Qilish</button>
                        <button className="btn btn-success" onClick={accept}>Tasdiqlash</button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={this.state.showRemoveModal} toggle={() => openRemoveModal('')}>
                    <ModalHeader>O'chirmoqchimisiz?</ModalHeader>
                    <ModalFooter>
                        <button className="btn btn-danger" onClick={() => openRemoveModal('')}>Bekor Qilish</button>
                        <button className="btn btn-warning" onClick={remove}>O'chirish</button>
                    </ModalFooter>
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
            </div>
        );
    }
}

WarehouseIncome.propTypes = {};

export default WarehouseIncome;