import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Navbar from "../components/Navbar";
import {BASE_URL, ROLE, TOKEN} from "../utills/constants";
import {login} from '../redux/actions/AuthAction'
import axios from "axios";
import {connect} from 'react-redux'
import {getRoleNameFromJWT} from "../utills/UsefullFunctions";
import {Redirect} from "react-router-dom";
import Pagination from "react-js-pagination";
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import AsyncSelect from "react-select/async";
import AdminRequests from "../components/catalog_components/AdminRequests";

class SellerSale extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSaleModal: false,
            showTradePwaModal: false,
            showCloseDayModal: false,
            showTradeRemoveModal: false,
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
            products: [],
            fromWarehouseId: 0,
            discount: '',
            hasDiscount: false,
            totalAmount: 0,
            totalDiscount: 0,
            accepted: false,
            trades: [],
            totalElements: 0,
            page: 0,
            size: 0
        }
    }

    componentDidMount() {
        AdminRequests.getTradesByAccepted().then(res => {
            console.log(res, "RES")
            this.setState({
                trades: res
            })
        })
    }

    render() {
        const setTotalAmount = () => {
            let temp = [...this.state.pwa]
            let total = temp.reduce(function (accumulator, currentValue) {
                return accumulator + (currentValue.realSoldPrice * currentValue.amount);
            }, 0)
            this.setState({totalAmount: total}, () => setTotalDiscount())
        }
        const setTotalDiscount = () => {
            const t = this.state.totalAmount
            console.log(t, 'totalAmount')
            console.log(this.state.discount, 'discount')
            let total = this.state.discount ? this.state.discount.discountType === 'PERCENT' ? (t * this.state.discount.amount) / 100 : this.state.discount.amount : 0
            console.log(total, 'totalDiscount')
            this.setState({
                totalDiscount: total
            })
        }
        const {history} = this.props
        const openSaleModal = (item) => {
            this.setState({
                showSaleModal: !this.state.showSaleModal,
                item,
                pwa: [
                    {
                        id: '',
                        productDto: '',
                        amount: 0,
                        productCount: 0,
                        realSoldPrice: 0
                    }
                ],
                discount: '',
                totalAmount: 0,
                hasDiscount: false,
                totalDiscount: 0
            })
        }
        const addPwa = () => {
            let tempPwa = this.state.pwa;
            let s = {
                id: '',
                productDto: '',
                amount: 0,
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
            console.log(e, 'PROD ID')
            console.log(this.state.fromWarehouseId, 'FROM W ID')
            AdminRequests.getProductCountByWarehouse(e.id, this.state.fromWarehouseId).then(res => {
                let tempArr = [...this.state.pwa]
                tempArr[index].productDto = e
                tempArr[index].realSoldPrice = e.salePrice
                tempArr[index].productCount = res
                this.setState({pwa: tempArr}, () => {
                    setTotalAmount()
                })
                console.log(tempArr, 'TEMPARR')
            })

        }
        const getAmount = (e, index) => {
            let el = e.target.value;
            let tempArr = this.state.pwa
            if (Number(el) < 1 || Number(el) > tempArr[index].productCount) {
                e.target.value = undefined
            } else {
                tempArr[index].amount = e.target.value
                this.setState({pwa: tempArr}, () => {
                    setTotalAmount()
                })
            }

        }
        const getRealSoldPrice = (e, index) => {
            let el = e.target.value;
            let tempArr = [...this.state.pwa];
            console.log(tempArr[index].productDto.incomePrice, 'XXXX')
            console.log(el, 'VALUE')
            tempArr[index].realSoldPrice = el;

            this.setState({pwa: tempArr}, () => {
                setTotalAmount()
            })
        }
        const removeItem = (item, index) => {
            let tempArr = this.state.pwa
            tempArr.splice(index, 1);
            this.setState({pwa: tempArr}, () => {
                setTotalAmount()
            })
        }
        const saveOrEditTrade = () => {
            let obj = {
                productWithAmountDtos: this.state.pwa,
            }
            if (this.state.discount) {
                obj.discountDto = this.state.discount
            }

            console.log(obj, 'OBJ FOR TradeDto')
            AdminRequests.saveOrEditTrade(obj).then(response => {
                AdminRequests.getTradesByAccepted().then(res => {
                    console.log(res, "RES")
                    this.setState({
                        trades: res,
                        showSaleModal: !this.state.showSaleModal,
                        item:'',
                        pwa: [
                            {
                                id: '',
                                productDto: '',
                                amount: 0,
                                productCount: 0,
                                realSoldPrice: 0
                            }
                        ],
                        discount: '',
                        totalAmount: 0,
                        hasDiscount: false,
                        totalDiscount: 0
                    })

                })

            })
        }
        const showDiscount = (e) => {
            let s = e.target.value
            console.log(s, 'SSSS')
            if (s == 'true') {
                console.log("TRUE")
                this.setState({
                    discount: '',
                    hasDiscount: false,
                    totalDiscount: 0
                })
            } else {
                console.log("FALSE")
                let temp = this.state.discount
                temp = {
                    id: '',
                    discountType: 'PERCENT',
                    amount: 1
                }
                this.setState({
                    discount: temp,
                    hasDiscount: true
                }, () => setTotalDiscount())
                setTotalDiscount()
            }
        }
        const changeDiscountAmount = (e) => {
            let temp = this.state.discount
            let s = e.target.value
            if (Number(s) < 1) {
                e.target.value = undefined
            } else {
                temp.amount = s
                this.setState({discount: temp}, () => setTotalDiscount())
                setTotalDiscount()
            }
        }
        const changeDiscountType = (e) => {
            let temp = this.state.discount
            let s = e.target.value
            temp.discountType = s
            this.setState({discount: temp}, () => setTotalDiscount())
            setTotalDiscount()
        }
        const showTradePwa = (item) => {
            this.setState({item, showTradePwaModal: !this.state.showTradePwaModal})
        }
        const showTradeRemove = (item) => {
            this.setState({item, showTradeRemoveModal: !this.state.showTradeRemoveModal})
        }
        const removeTrade = () => {
            AdminRequests.removeTrade(this.state.item.id).then(response => {
                AdminRequests.getTradesByAccepted().then(res => {
                    console.log(res, "RES")
                    this.setState({
                        trades: res,
                        item: '',
                        showTradeRemoveModal: !this.state.showTradeRemoveModal
                    })
                })
            })
        }
        const openCloseDayModal=()=>{
            this.setState({
                showCloseDayModal:!this.state.showCloseDayModal
            })
        }
        const closeDay=()=>{
            AdminRequests.closeDay(this.state.trades[0].id).then(response=>{
                AdminRequests.getTradesByAccepted().then(res => {
                    console.log(res, "RES")
                    this.setState({
                        trades: res,
                        showCloseDayModal:!this.state.showCloseDayModal
                    })
                })
            })
        }
        return (
            getRoleNameFromJWT() && getRoleNameFromJWT() === 'ROLE_SELLER' ?
                <div className='row'>
                    <div className='col-md-2 col-2-style'>
                        <Navbar role={getRoleNameFromJWT()} history={history} tab="1"/>
                    </div>
                    <div className='col-md-10 col-10-style pb-3'>
                        <div className="row">
                            <div className="col-md-4">
                                <button type="button" className="btn btn-success ml-5 mr-5"
                                        onClick={() => openSaleModal('')}>
                                    Sotish
                                </button>
                            </div>
                            <div className="col-md-4">
                                {this.state.trades.length ?
                                    <span><span>Jami : </span><b>{this.state.trades.reduce(function (accumulator, currentValue) {
                                        return accumulator + currentValue.afterDiscountTotalSum;
                                    }, 0)}</b> UZS</span>
                                    : ''
                                }
                            </div>
                            <div className="col-md-4">
                                {this.state.trades.length ?
                                    <button className="btn btn-warning float-right" onClick={openCloseDayModal}>Kunni yakunlash</button>
                                    : ''
                                }
                            </div>
                        </div>
                        <Table>
                            <tr>
                                <th>T/R</th>
                                <th>Sana</th>
                                <th>Jami savdo Summasi</th>
                                <th>Nimalar</th>
                                <th>Amallar</th>
                            </tr>
                            {this.state.trades && this.state.trades.map((item, index) =>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.createdAt.substr(0, 10) + '  |  ' + item.createdAt.substr(11, 5)}</td>
                                    <td>Jami Savdo : <b>{item.totalSum}</b> UZS <br/>Jami Skidka
                                        : <b>{item.discountDto !== null ? item.discountDto.amount : 0}</b> {item.discountDto !== null ? item.discountDto.discountType === 'PERCENT' ? '%' : 'UZS' : ''}
                                        <br/>Qoldiq: <b>{item.afterDiscountTotalSum}</b> UZS
                                    </td>
                                    <td>
                                        <button className="btn btn-info" onClick={() => showTradePwa(item)}>...</button>
                                    </td>
                                    <td>
                                        <button className="btn btn-danger"
                                                onClick={() => showTradeRemove(item)}>O'chirish
                                        </button>
                                    </td>
                                </tr>
                            )}

                        </Table>
                        <Modal size="lg" isOpen={this.state.showSaleModal} toggle={() => openSaleModal('')}>
                            <ModalBody>
                                <div>
                                    {this.state.pwa && this.state.pwa.map((item, index) =>
                                        <div key={index} className="row">
                                            <div className="col-md-4">
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
                                            <div className="col-md-2">
                                                <input value={item.amount} type="number" name="amount"
                                                       min={0}
                                                       required={true}
                                                       max={item.productCount}
                                                       onChange={(e) => getAmount(e, index)}/>
                                            </div>
                                            <div className="col-md-1">
                                                <span>{item.productDto.salePrice}</span>
                                            </div>
                                            <div className="col-md-2">
                                                <input
                                                    value={item.realSoldPrice ? item.realSoldPrice : item.productDto.salePrice}
                                                    type="number" name="realSoldPrice"
                                                    min={item.productDto.incomePrice}
                                                    required={true}
                                                    max={'1000000000'}
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
                                <div className="row mt-5">
                                    <div className="col-md-8">
                                        <div>
                                            <input type="checkbox" value={this.state.hasDiscount}
                                                   onChange={showDiscount}/>
                                        </div>
                                        <div>
                                            {this.state.discount ?
                                                <div>
                                                    <input type="number" value={this.state.discount.amount}
                                                           onChange={changeDiscountAmount}/>
                                                    <select value={this.state.discount.discountType} name="discounType"
                                                            id="discounType"
                                                            onChange={changeDiscountType}>
                                                        <option value='PERCENT'>%</option>
                                                        <option value='SOM'>SO'M</option>
                                                    </select>
                                                </div> : ''
                                            }
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div>Total :
                                            {console.log(this.state.totalAmount, 'amountTOTAL')}
                                            {console.log(this.state.totalDiscount, 'DiscountTOTAL')}
                                            {this.state.totalAmount - this.state.totalDiscount}
                                        </div>

                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <button className="btn btn-danger" onClick={() => openSaleModal('')}>Bekor qilish
                                </button>
                                <button className="btn btn-success" onClick={saveOrEditTrade}>Saqlash</button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state.showTradePwaModal} toggle={() => showTradePwa('')}>
                            <ModalBody>
                                <Table>
                                    <tr>
                                        <th>T/R</th>
                                        <th>Maxsulot Nomi</th>
                                        <th>Soni</th>
                                        <th>Real Sotilgan narxi</th>
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
                                <button className="btn btn-warning" onClick={() => showTradePwa('')}>Yopish</button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state.showTradeRemoveModal} toggle={() => showTradeRemove('')}>
                            <ModalHeader>O'chirmoqchimisiz?</ModalHeader>
                            <ModalFooter>
                                <button className="btn btn-danger" onClick={() => showTradeRemove('')}>Bekor Qilish
                                </button>
                                <button className="btn btn-warning" onClick={removeTrade}>O'chirish</button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state.showCloseDayModal} toggle={openCloseDayModal}>
                            <ModalHeader>Kunni yakunlamoqchimisiz?</ModalHeader>
                            <ModalFooter>
                                <button className="btn btn-danger" onClick={openCloseDayModal}>Bekor Qilish
                                </button>
                                <button className="btn btn-warning" onClick={closeDay}>Ha</button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>
                :
                <Redirect to="/"/>
        );
    }
}

const mapDispatchToProps = () => {
}

SellerSale.propTypes = {};

export default connect(null, null)(SellerSale);