import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Navbar from "../components/Navbar";
import {ROLE} from "../utills/constants";
import {Redirect} from "react-router-dom";
import {getRoleNameFromJWT} from "../utills/UsefullFunctions";
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import AdminRequests from "../components/catalog_components/AdminRequests";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";

class SellerReject extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showAddRejectModal: false,
            showRejectPwaModal: false,
            showDeleteRejectModal: false,
            showAcceptModal: false,
            item: '',
            pwa: [],
            warehouses: [],
            accepted: false,
            warehouseId: 0,
            page: 0,
            size: 10,
            rejects: [],
            totalElements: 0,
            startDate: '',
            endDate: ''
        }
    }

    componentDidMount() {
        AdminRequests.allWarehouses().then(response => {
            console.log(response, 'WAREHOUSES')
            this.setState({
                warehouses: response.object
            })
        })
        AdminRequests.allReject(
            {
                accepted: this.state.accepted,
                warehouseId: this.state.warehouseId,
                page: this.state.page,
                size: this.state.size,
                startDate: this.state.startDate,
                endDate: this.state.endDate
            }
        ).then(res => {
            this.setState({
                item: '',
                pwa: [
                    {
                        id: '',
                        productDto: '',
                        amount: 0,
                        productCount: 0,
                        realSoldPrice: 0
                    }
                ],
                rejects: res.object,
                totalElements: res.totalElements
            })
        })
    }

    render() {
        const {history} = this.props
        const openAddRejectModal = (item) => {
            this.setState({
                showAddRejectModal: !this.state.showAddRejectModal,
                item,
                pwa: [
                    {
                        id: '',
                        productDto: '',
                        amount: 0,
                        productCount: 0,
                        realSoldPrice: 0
                    }
                ]
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
        const getRealSoldPrice = (e, index) => {
            let el = e.target.value;
            let tempArr = [...this.state.pwa];
            console.log(tempArr[index].productDto.incomePrice, 'XXXX')
            console.log(el, 'VALUE')
            tempArr[index].realSoldPrice = el;

            this.setState({pwa: tempArr})
        }
        console.log(this.state.pwa, 'PWA')
        const saleReject = () => {
            if (this.state.pwa.length) {
                let obj = {
                    productWithAmountDtos: this.state.pwa
                }
                console.log(obj, "OBJ")
                AdminRequests.saveReject(obj).then(response => {
                    AdminRequests.allReject({
                        accepted: this.state.accepted,
                        warehouseId: this.state.warehouseId,
                        page: this.state.page,
                        size: this.state.size,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate
                    }).then(res => {
                        console.log(res, 'RESTES')
                        this.setState({
                            showAddRejectModal: !this.state.showAddRejectModal,
                            item: '',
                            pwa: [
                                {
                                    id: '',
                                    productDto: '',
                                    amount: 0,
                                    productCount: 0,
                                    realSoldPrice: 0
                                }
                            ],
                            rejects: res.object,
                            totalElements: res.totalElements
                        })
                    })
                })
            }
        }
        const openShowPwaModal = (item) => {
            console.log(item, "ITEM")
            this.setState({
                item: item,
                showRejectPwaModal: !this.state.showRejectPwaModal
            })
        }
        const getByStatus = (e) => {
            let s = e.target.value
            console.log(s, "SSSS")
            AdminRequests.allReject({
                accepted: s,
                warehouseId: this.state.warehouseId,
                page: this.state.page,
                size: this.state.size,
                startDate: this.state.startDate,
                endDate: this.state.endDate
            }).then(res => {
                this.setState({
                    item: '',
                    pwa: [
                        {
                            id: '',
                            productDto: '',
                            amount: 0,
                            productCount: 0,
                            realSoldPrice: 0
                        }
                    ],
                    rejects: res.object,
                    totalElements: res.totalElements,
                    accepted: s
                })
            })
        }
        const getByWarehouse = (e) => {
            let s = e.target.value
            console.log(s, "SSSS")
            AdminRequests.allReject({
                accepted: this.state.accepted,
                warehouseId: s,
                page: this.state.page,
                size: this.state.size,
                startDate: this.state.startDate,
                endDate: this.state.endDate
            }).then(res => {
                this.setState({
                    item: '',
                    pwa: [
                        {
                            id: '',
                            productDto: '',
                            amount: 0,
                            productCount: 0,
                            realSoldPrice: 0
                        }
                    ],
                    rejects: res.object,
                    totalElements: res.totalElements,
                    accepted: this.state.accepted,
                    warehouseId: s
                })
            })
        }
        const openRemoveRejectModal = (item) => {
            this.setState({
                item,
                showDeleteRejectModal: !this.state.showDeleteRejectModal
            })
        }
        const removeReject = () => {
            AdminRequests.removeReject(this.state.item.id).then(response => {
                AdminRequests.allReject({
                    accepted: this.state.accepted,
                    warehouseId: this.state.warehouseId,
                    page: this.state.page,
                    size: this.state.size
                }).then(res => {
                    this.setState({
                        item: '',
                        pwa: [
                            {
                                id: '',
                                productDto: '',
                                amount: 0,
                                productCount: 0,
                                realSoldPrice: 0
                            }
                        ],
                        rejects: res.object,
                        totalElements: res.totalElements,
                        showDeleteRejectModal: !this.state.showDeleteRejectModal
                    })
                })
            })
        }
        const handlePageChange = (pageNumber) => {
            AdminRequests.allReject({
                accepted: this.state.accepted,
                warehouseId: this.state.warehouseId,
                page: pageNumber - 1,
                size: this.state.size,
                startDate: this.state.startDate,
                endDate: this.state.endDate
            }).then(res => {
                this.setState({
                    item: '',
                    pwa: [
                        {
                            id: '',
                            productDto: '',
                            amount: 0,
                            productCount: 0,
                            realSoldPrice: 0
                        }
                    ],
                    rejects: res.object,
                    totalElements: res.totalElements,
                    page: pageNumber - 1
                })
            })
        }
        const openAcceptModal = (item) => {
            this.setState({
                item,
                showAcceptModal: !this.state.showAcceptModal
            })
        }
        const acceptReject = () => {
            AdminRequests.acceptReject(this.state.item.id).then(response => {
                AdminRequests.allReject({
                    accepted: this.state.accepted,
                    warehouseId: this.state.warehouseId,
                    page: this.state.page,
                    size: this.state.size,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate
                }).then(res => {
                    this.setState({
                        item: '',
                        pwa: [
                            {
                                id: '',
                                productDto: '',
                                amount: 0,
                                productCount: 0,
                                realSoldPrice: 0
                            }
                        ],
                        rejects: res.object,
                        totalElements: res.totalElements,
                        showAcceptModal: !this.state.showAcceptModal
                    })
                })
            })
        }
        const getStartDate = (startDate) => {
            console.log(startDate,'START_DATE')
            if (this.state.endDate) {
                AdminRequests.allReject(
                    {
                        accepted: this.state.accepted,
                        warehouseId: this.state.warehouseId,
                        page: this.state.page,
                        size: this.state.size,
                        startDate,
                        endDate: this.state.endDate
                    }
                ).then(res => {
                    this.setState({
                        item: '',
                        pwa: [
                            {
                                id: '',
                                productDto: '',
                                amount: 0,
                                productCount: 0,
                                realSoldPrice: 0
                            }
                        ],
                        rejects: res.object,
                        totalElements: res.totalElements,
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
            console.log(endDate,'END_DATE')
            AdminRequests.allReject(
                {
                    accepted: this.state.accepted,
                    warehouseId: this.state.warehouseId,
                    page: this.state.page,
                    size: this.state.size,
                    startDate: this.state.startDate,
                    endDate
                }
            ).then(res => {
                this.setState({
                    item: '',
                    pwa: [
                        {
                            id: '',
                            productDto: '',
                            amount: 0,
                            productCount: 0,
                            realSoldPrice: 0
                        }
                    ],
                    rejects: res.object,
                    totalElements: res.totalElements,
                    endDate
                })
            })
        }
        return (
            <div className='row'>
                <div className='col-md-2 col-2-style'>
                    <Navbar role={getRoleNameFromJWT()} history={history} tab="4"/>
                </div>
                <div className='col-md-10 col-10-style'>
                    <div className="row">
                        <div className="col-md-3">
                            {getRoleNameFromJWT() === 'ROLE_SELLER' ?
                                <div>
                                    <button className="btn btn-success" onClick={() => openAddRejectModal('')}>+Add
                                    </button>
                                </div>
                                :
                                <div>
                                    <select name="status" id="status" onChange={getByWarehouse}>
                                        <option value="0">Barchasi</option>
                                        {this.state.warehouses && this.state.warehouses.map(item =>
                                            <option value={item.id}>{item.name}</option>
                                        )}
                                    </select>
                                </div>
                            }

                        </div>
                        <div className="col-md-3">
                            <select name="status" id="status" onChange={getByStatus}>
                                <option value="false">Tasdiqlanmagan</option>
                                <option value="true">Tasdiqlangan</option>
                            </select>
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
                                activePage={this.state.page + 1}
                                itemsCountPerPage={this.state.size}
                                totalItemsCount={this.state.totalElements}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                            />
                        </div>
                    </div>
                    <div>
                        <Table>
                            <tr>
                                <th>T/R</th>
                                <th>Magazin</th>
                                <th>Sotuvchi</th>
                                <th>Kim tasdiqladi</th>
                                <th>Sana</th>
                                <th>Summa</th>
                                <th>Tasdiqlangan</th>
                                <th>Nimalar</th>
                                <th>Action</th>

                            </tr>
                            {this.state.rejects && this.state.rejects.map((item, index) =>
                                <tr>
                                    <td>{index + 1 + (this.state.page * this.state.size)}</td>
                                    <td>{item.warehouseDto.shopDto.name}</td>
                                    <td>{item.seller.firstName + ' ' + item.seller.lastName}</td>
                                    <td>{item.manager ? item.manager.firstName + ' ' + item.manager.lastName : ''}</td>
                                    <td>{item.createdAt.substr(0, 10) + '  |  ' + item.createdAt.substr(11, 5)}</td>
                                    <td>{item.rejectTotalSum}</td>
                                    <td><input type="checkbox" checked={item.accepted}/></td>
                                    <td>
                                        <button className="btn btn-info" onClick={() => openShowPwaModal(item)}>...
                                        </button>
                                    </td>
                                    <td>
                                        {getRoleNameFromJWT() === 'ROLE_SELLER' ?
                                            item.accepted ?
                                                '' :
                                                <button className="btn btn-danger"
                                                        onClick={() => openRemoveRejectModal(item)}>O'chirish</button>
                                            :
                                            item.accepted ?
                                                '' :
                                                <button className="btn btn-success"
                                                        onClick={() => openAcceptModal(item)}>Tasdiqlash</button>
                                        }
                                    </td>
                                </tr>
                            )}
                        </Table>
                    </div>
                    <Modal size="lg" isOpen={this.state.showAddRejectModal} toggle={() => openAddRejectModal('')}>
                        <ModalBody>
                            <div>
                                {this.state.pwa && this.state.pwa.map((item, index) =>
                                    <div key={index} className="row">
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
                                        <div className="col-md-2 ml-2">
                                            <label htmlFor="rejectSum">QaytarilganSumma/dona</label>
                                            <input
                                                id="rejectSum"
                                                value={item.realSoldPrice}
                                                type="number" name="realSoldPrice"
                                                required={true}
                                                onChange={(e) => getRealSoldPrice(e, index)}/>
                                        </div>
                                        <div className="col-md-1 ml-3">
                                            <div className="minusButton pb-2 ml-5"
                                                 onClick={() => removeItem(item, index)}>X
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button className="btn btn-success mt-2" onClick={addPwa}> + Add</button>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick={() => openAddRejectModal('')}>Bekor qilish
                            </button>
                            <button className="btn btn-success" onClick={saleReject}>Saqlash</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.showRejectPwaModal} toggle={() => openShowPwaModal('')}>
                        <ModalBody>
                            <Table>
                                <tr>
                                    <th>T/R</th>
                                    <th>Maxsulot Nomi</th>
                                    <th>Soni</th>
                                    <th>QaytarilganSumma/Dona</th>
                                </tr>
                                {this.state.item ? this.state.item.productWithAmountDtos && this.state.item.productWithAmountDtos.map((itemm, index) =>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{itemm.productDto.name}</td>
                                        <td>{itemm.amount}</td>
                                        <td>{itemm.realSoldPrice}</td>
                                    </tr>
                                )

                                    : ''
                                }
                            </Table>
                        </ModalBody>
                        <ModalFooter>
                            <button className="btn btn-warning" onClick={() => openShowPwaModal('')}>Yopish</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.showDeleteRejectModal} toggle={() => openRemoveRejectModal('')}>
                        <ModalHeader>O'chirmoqchimisiz?</ModalHeader>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick={() => openRemoveRejectModal('')}>Bekor Qilish
                            </button>
                            <button className="btn btn-warning" onClick={removeReject}>O'chirish</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={this.state.showAcceptModal} toggle={() => openAcceptModal('')}>
                        <ModalHeader>Tasdiqlamoqchimisiz?</ModalHeader>
                        <ModalFooter>
                            <button className="btn btn-danger" onClick={() => openAcceptModal('')}>Bekor Qilish
                            </button>
                            <button className="btn btn-success" onClick={acceptReject}>Tasdiqlash</button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

SellerReject.propTypes = {};

export default SellerReject;