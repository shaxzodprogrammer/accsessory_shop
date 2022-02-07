import React, {Component} from 'react';
import Navbar from "../components/Navbar";
import {getRoleNameFromJWT} from "../utills/UsefullFunctions";
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import AdminRequests from "../components/catalog_components/AdminRequests";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class SellerDefect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            item: '',
            showDefectModal: false,
            showItemModal: false,
            pwa: [],
            warehouseDto: {
                id: 0
            },
            warehouses: [],
            page: 0,
            size: 10,
            totalElements: 0,
            defects: [],
            accepted: false,
            warehouseId: 0,
            showAcceptModal:false,
            showRemoveDefectModal:false,
            startDate: '',
            endDate : ''
        }
    }

    componentDidMount() {
        AdminRequests.allWarehouseWithoutPageable().then(res => {
            console.log(res, "allALL")
            this.setState({warehouses: res})
        })
        console.log(this.state.startDate,'STARTDATE')
        console.log(this.state.endDate,'ENDDATE')
            AdminRequests.allDefects({
                page: this.state.page,
                size: this.state.size, accepted: this.state.accepted,
                warehouseId: this.state.warehouseId,
                startDate: '', endDate:''
            }).then(res => {
                console.log(res, 'RESRESRES')
                this.setState({
                    defects: res.object,
                    totalElements: res.totalElements
                })
            })
    }

    render() {
        const {history} = this.props;
        const openDefectModal = (item) => {
            let temp = [
                {
                    id: '',
                    productDto: '',
                    amount: 1,
                    productCount: 0,
                    realSoldPrice: 0
                }
            ]
            let s = {
                id: 0
            }

            this.setState({
                item,
                showDefectModal: !this.state.showDefectModal,
                pwa: temp,
                warehouseDto: s
            })
        }
        const addPwa = () => {
            let tempPwa = this.state.pwa;
            let s = {
                id: '',
                productDto: '',
                amount: 1,
                productCount: 0,
                realSoldPrice: 0
            }
            tempPwa.push(s);
            this.setState({pwa: tempPwa})
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
            }, 100);
        };
        const getProdId = (val) => {
            AdminRequests.searchProduct(val).then(res => {
                this.setState({products: res})
            })
        }
        const handleChange = (e, index) => {
            let tempArr = [...this.state.pwa]
            tempArr[index].productDto = e
            tempArr[index].realSoldPrice = e.salePrice
            this.setState({pwa: tempArr})

        }
        const getAmount = (e, index) => {
            let el = e.target.value;
            let tempArr = this.state.pwa
            if (Number(el) < 1) {
                e.target.value = undefined
            } else {
                tempArr[index].amount = e.target.value
                this.setState({pwa: tempArr})
            }

        }
        const removeItem = (item, index) => {
            let tempArr = this.state.pwa
            tempArr.splice(index, 1);
            this.setState({pwa: tempArr})
        }
        const saveDefect = () => {
            let s = {
                warehouseDto: this.state.warehouseDto,
                productWithAmountDtos: this.state.pwa
            }
            AdminRequests.saveOrEditDefect(s).then(response => {
                let temp = [
                    {
                        id: '',
                        productDto: '',
                        amount: 1,
                        productCount: 0,
                        realSoldPrice: 0
                    }
                ]
                let s = {
                    id: 0
                }
                AdminRequests.allDefects({
                    page: this.state.page,
                    size: this.state.size, accepted: this.state.accepted,
                    warehouseId: this.state.warehouseId
                }).then(res => {
                    console.log(res, 'RESRESRES')
                    this.setState({
                        defects: res.object,
                        totalElements: res.totalElements,
                        item: '',
                        showDefectModal: !this.state.showDefectModal,
                        pwa: temp,
                        warehouseDto: s
                    })
                })
            })
        }
        const getWarehouseId = (e) => {
            let temp = this.state.warehouseDto
            temp.id = e.target.value
            this.setState({
                warehouseDto: temp
            })
        }
        const openPwaModal=(item)=>{
            this.setState({
                item,
                showItemModal:!this.state.showItemModal
            })
        }
        const openAcceptModal=(item)=>{
            this.setState({
                item,
                showAcceptModal:!this.state.showAcceptModal
            })
        }
        const accept=()=>{
            AdminRequests.acceptDefect(this.state.item.id).then(response=>{
                let temp = [
                    {
                        id: '',
                        productDto: '',
                        amount: 1,
                        productCount: 0,
                        realSoldPrice: 0
                    }
                ]
                let s = {
                    id: 0
                }
                AdminRequests.allDefects({
                    page: this.state.page,
                    size: this.state.size, accepted: this.state.accepted,
                    warehouseId: this.state.warehouseId
                }).then(res => {
                    console.log(res, 'RESRESRES')
                    this.setState({
                        defects: res.object,
                        totalElements: res.totalElements,
                        item: '',
                        showAcceptModal: !this.state.showAcceptModal,
                        pwa: temp,
                        warehouseDto: s
                    })
                })
            })
        }
        const getByStatus=(e)=>{
            let s=e.target.value
            if (this.state.startDate&&this.state.endDate){
                AdminRequests.allDefects({
                    page: this.state.page,
                    size: this.state.size, accepted:s,
                    warehouseId: this.state.warehouseId,
                    startDate: this.state.startDate, endDate: this.state.endDate
                }).then(res => {
                    console.log(res, 'RESRESRES')
                    this.setState({
                        defects: res.object,
                        totalElements: res.totalElements,
                        accepted:s
                    })
                })
            }else {
                AdminRequests.allDefects({
                    page: this.state.page,
                    size: this.state.size, accepted: s,
                    warehouseId: this.state.warehouseId,
                    startDate: '', endDate:''
                }).then(res => {
                    console.log(res, 'RESRESRES')
                    this.setState({
                        defects: res.object,
                        totalElements: res.totalElements,
                        accepted:s
                    })
                })
            }
        }
        const handlePageChange=(pageNumber)=>{
            AdminRequests.allDefects({
                page: pageNumber-1,
                size: this.state.size,
                accepted: this.state.accepted,
                warehouseId: this.state.warehouseId
            }).then(res => {
                console.log(res, 'RESRESRES')
                this.setState({
                    defects: res.object,
                    page: pageNumber-1,
                    totalElements: res.totalElements
                })
            })
        }
        const getByFromWarehouse = (e) => {
            let s = e.target.value;
            if (this.state.startDate&&this.state.endDate){
                AdminRequests.allDefects({
                    page: this.state.page,
                    size: this.state.size, accepted: this.state.accepted,
                    warehouseId: s,
                    startDate: this.state.startDate, endDate: this.state.endDate
                }).then(res => {
                    console.log(res, 'RESRESRES')
                    this.setState({
                        defects: res.object,
                        totalElements: res.totalElements,
                        warehouseId:s
                    })
                })
            }else {
                AdminRequests.allDefects({
                    page: this.state.page,
                    size: this.state.size, accepted: this.state.accepted,
                    warehouseId:s,
                    startDate: '', endDate:''
                }).then(res => {
                    console.log(res, 'RESRESRES')
                    this.setState({
                        defects: res.object,
                        totalElements: res.totalElements,
                        warehouseId:s
                    })
                })
            }

        }
        const openRemoveDefectModal=(item)=>{
            this.setState({
                item,
                showRemoveDefectModal:!this.state.showRemoveDefectModal
            })
        }
        const removeDefect=()=>{
            AdminRequests.removeDefect(this.state.item.id).then(response=>{
                AdminRequests.allDefects({
                    page: this.state.page,
                    size: this.state.size, accepted: this.state.accepted,
                    warehouseId: this.state.warehouseId
                }).then(res => {
                    console.log(res, 'RESRESRES')
                    this.setState({
                        defects: res.object,
                        totalElements: res.totalElements,
                        item:'',
                        showRemoveDefectModal:!this.state.showRemoveDefectModal
                    })
                })
            })
        }
        const getStartDate=(startDate)=>{
            if (this.state.endDate){
                AdminRequests.allDefects({
                    page: this.state.page,
                    size: this.state.size, accepted: this.state.accepted,
                    warehouseId: this.state.warehouseId,
                    startDate: startDate, endDate: this.state.endDate
                }).then(res => {
                    console.log(res, 'RESRESRES')
                    this.setState({
                        defects: res.object,
                        totalElements: res.totalElements,
                        startDate
                    })
                })
            }else {
                this.setState({
                    startDate
                })
            }
        }
        const getEndDate=(endDate)=>{
            AdminRequests.allDefects({
                page: this.state.page,
                size: this.state.size, accepted: this.state.accepted,
                warehouseId: this.state.warehouseId,
                startDate: this.state.startDate, endDate: endDate
            }).then(res => {
                console.log(res, 'RESRESRES')
                this.setState({
                    defects: res.object,
                    totalElements: res.totalElements,
                    endDate
                })
            })
        }
        return (
            <div className='row'>
                <div className='col-md-2 col-2-style'>
                    <Navbar role={getRoleNameFromJWT()} history={history} tab="5"/>
                </div>
                <div className='col-md-10 col-10-style'>
                    <div className="row">
                        <div className="col-md-2">
                            <button className="btn btn-success" onClick={() => openDefectModal('')}>+Add</button>
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
                        <div className="col-md-2">
                            <select name="status" id="status" onChange={getByStatus}>
                                <option value="false">Tasdiqlanmagan</option>
                                <option value="true">Tasdiqlangan</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            {getRoleNameFromJWT() === 'ROLE_DIRECTOR' || getRoleNameFromJWT() === 'ROLE_MANAGER' ?
                                <select name="warehouse" id="warehouse" onChange={getByFromWarehouse}>
                                    <option value={0}>Barcha Omborlar :</option>
                                    {this.state.warehouses && this.state.warehouses.map(item =>
                                        <option value={item.id}>{item.name}</option>
                                    )}
                                </select> : ''
                            }
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
                    <div className="row">
                        <Table>
                            <tr>
                                <th>T/R</th>
                                <th>Ombor</th>
                                <th>Sana</th>
                                <th>Kim</th>
                                {
                                    getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                        <th>Summa</th>
                                        : ''
                                }
                                <th>Tasdiqlangan</th>
                                <th>Nimalar</th>
                                <th>Amallar</th>
                            </tr>
                            {this.state.defects&&this.state.defects.map((item,index)=>
                                <tr>
                                    <td>{index+1+(this.state.page*this.state.size)}</td>
                                    <td>{item.warehouseDto.name}</td>
                                    <td>{item.createdAt.substr(0, 10) + '  |  ' + item.createdAt.substr(11, 5)}</td>
                                    <td>{item.createdBy.firstName + ' ' + item.createdBy.lastName}</td>
                                    {
                                        getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                            <td><b>{item.totalDefectSum}</b>  UZS</td>
                                            : ''
                                    }
                                    <td><input type="checkbox" checked={item.accepted}/></td>
                                    <td><button className="btn btn-info" onClick={()=>openPwaModal(item)}>...</button></td>
                                    {
                                        item.accepted?
                                            ''
                                            :
                                            getRoleNameFromJWT()==='ROLE_DIRECTOR'?
                                                <div className="mt-2">
                                                    <button className="btn btn-success" onClick={()=>openAcceptModal(item)}>Tasdiqlash</button>
                                                    <button className="btn btn-danger ml-3" onClick={()=>openRemoveDefectModal(item)}>O'chirish</button>
                                                </div>
                                                :
                                                <button className="btn btn-danger">O'chirish</button>

                                    }
                                </tr>
                            )}
                        </Table>
                    </div>
                    <Modal size="lg" isOpen={this.state.showDefectModal} toggle={() => openDefectModal('')}>
                        <ModalBody>
                            <div className="row">
                                {getRoleNameFromJWT() === 'ROLE_DIRECTOR' || getRoleNameFromJWT() === 'ROLE_MANAGER' ?
                                    <div>
                                        <label htmlFor="warehouse">Ombor tanlang : </label>
                                        <select className="ml-3" name="warehouse" id="warehouse"
                                                onChange={getWarehouseId}>
                                            <option value={0}>Ombor tanlang :</option>
                                            {this.state.warehouses && this.state.warehouses.map(item =>
                                                <option value={item.id}>{item.name}</option>
                                            )}
                                        </select>
                                    </div> : ''
                                }
                            </div>
                            <div>

                                {this.state.pwa && this.state.pwa.map((item, index) =>
                                    <div key={index} className="row">
                                        <div className="col-md-12">

                                            <div className="row">
                                                <div className="col-md-4">
                                                    <label htmlFor="prodId">Maxsulot</label>
                                                    <AsyncSelect
                                                        name="prodId"
                                                        id="prodId"
                                                        cacheOptions
                                                        loadOptions={loadOptions}
                                                        defaultOptions
                                                        value={item.productDto ? item.productDto : ''}
                                                        onInputChange={getProdId}
                                                        onChange={(e) => handleChange(e, index)}
                                                    />
                                                </div>
                                                <div className="col-md-2 mr-2">
                                                    <label htmlFor="amount">Son</label>
                                                    <input value={item.amount} type="number" name="amount" id="amount"
                                                           min={1}
                                                           required={true}
                                                           onChange={(e) => getAmount(e, index)}/>
                                                </div>
                                                <div className="col-md-1 ml-3">
                                                    <div className="minusButton ml-5 mt-4"
                                                         onClick={() => removeItem(item, index)}>X
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                )}
                                <button className="btn btn-success mt-2" onClick={addPwa}> + Add</button>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick={() => openDefectModal('')}>Bekor qilish</button>
                            <button className="btn btn-success" onClick={saveDefect}>Saqlash</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.showItemModal} toggle={() => openPwaModal('')}>
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
                            <button className="btn btn-warning" onClick={() => openPwaModal('')}>Yopish</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.showAcceptModal} toggle={() => openAcceptModal('')}>
                        <ModalHeader>Tasdiqlamoqchimisiz?</ModalHeader>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick={() => openAcceptModal('')}>Bekor Qilish</button>
                            <button className="btn btn-warning" onClick={accept}>Tasdiqlash</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.showRemoveDefectModal} toggle={() => openRemoveDefectModal('')}>
                        <ModalHeader>O'chirasizmi?</ModalHeader>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick={() => openRemoveDefectModal('')}>Bekor Qilish</button>
                            <button className="btn btn-warning" onClick={removeDefect}>O'chirish</button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

SellerDefect.propTypes = {};

export default SellerDefect;