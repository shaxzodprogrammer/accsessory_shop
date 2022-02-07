import React, {Component} from 'react';
import Navbar from "../components/Navbar";
import {connect} from 'react-redux'
import {NavLink, Redirect} from "react-router-dom";
import {getRoleNameFromJWT} from "../utills/UsefullFunctions";
import AddDefectProduct from "../components/DefectComponent/AddDefectProduct";
import NotAcceptedDefects from "../components/DefectComponent/NotAcceptedDefects";
import AcceptedDefects from "../components/DefectComponent/AcceptedDefects";
import AsyncSelect from "react-select/async/dist/react-select.esm";
import AdminRequests from "../components/catalog_components/AdminRequests";
import {Modal, ModalBody, ModalFooter, Table} from "reactstrap";
import Pagination from "react-js-pagination";
import {BASE_URL} from "../utills/constants";

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            item: '',
            productCount: [],
            page: 0,
            size: 10,
            productId: '',
            totalElements: 0,
            totalCashFlow: '',
            showCashFlowModal: false
        }
    }

    componentDidMount() {
        AdminRequests.productCount({
            page: this.state.page,
            size: this.state.size,
            productId: this.state.productId
        }).then(res => {
            console.log(res, "_______RREESS______")
            this.setState({
                productCount: res.object,
                totalElements: res.totalElements
            })
        })
        AdminRequests.totalCashFlow().then(response => {
            console.log(response, "TOTAL_CASH_FLOW")
            this.setState({
                totalCashFlow: response
            })
        })
    }

    render() {
        const {history} = this.props
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
        const handleChange = (e) => {
            AdminRequests.productCount({page: this.state.page, size: this.state.size, productId: e.id}).then(res => {
                console.log(res, "_______RREESS______")
                this.setState({
                    productCount: res.object,
                    totalElements: res.totalElements,
                    item: e,
                    productId: e.id
                })
            })
        }
        const getAllByPageable = () => {
            AdminRequests.productCount({page: 0, size: 10, productId: ''}).then(res => {
                console.log(res, "_______RREESS______")
                this.setState({
                    productCount: res.object,
                    totalElements: res.totalElements,
                    page: 0,
                    size: 10,
                    productId: '',
                    item: ''
                })
            })
        }
        const handlePageChange = (pageNumber) => {
            AdminRequests.productCount({
                page: pageNumber - 1,
                size: this.state.size,
                productId: this.state.productId
            }).then(res => {
                console.log(res, "_______RREESS______")
                this.setState({
                    productCount: res.object,
                    totalElements: res.totalElements,
                    page: pageNumber - 1
                })
            })
        }
        const getExel = () => {
            const url = BASE_URL + 'excel/productCountByWarehouse'
            const link = document.createElement('a');
            link.href = url;
            console.log(new Date(), "DATE")
            link.setAttribute('download', "Product Count by " + new Date() + ".xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        }
        const openTotalCashFlowModal = () => {
            this.setState({
                showCashFlowModal: !this.state.showCashFlowModal
            })
        }
        return (
            getRoleNameFromJWT() ?
                <div className='row row-style'>
                    <div className='col-md-2 col-2-style'>
                        <Navbar role={getRoleNameFromJWT()} history={history} tab="1"/>
                    </div>
                    <div className='col-md-10 col-10-style'>
                        <div className="row">
                            <div className="col-md-1">
                                <button className="btn btn-success" onClick={getAllByPageable}>Barchasi</button>
                            </div>
                            <div className="col-md-4">
                                <AsyncSelect
                                    name="prodId"
                                    cacheOptions
                                    loadOptions={loadOptions}
                                    defaultOptions
                                    value={this.state.item ? this.state.item : ''}
                                    onInputChange={getProdId}
                                    onChange={(e) => handleChange(e)}
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

                            <div className="col-md-2">
                                {
                                    getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                        <button className="btn btn-info" onClick={getExel}>Download</button>:''
                                }
                            </div>
                            <div className="col-md-2">
                                {
                                    getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                <button className="btn btn-warning" onClick={() => openTotalCashFlowModal()}>Tovar
                                    oborot
                                </button>:''}
                            </div>


                        </div>
                        <div className="row">
                            <Table>
                                <tr>
                                    <th>T/R</th>
                                    <th>Mahsulot Nomi</th>
                                    <th>Mahsulot Soni</th>
                                </tr>
                                {
                                    this.state.productCount && this.state.productCount.map((item, index) =>
                                        <tr>
                                            <td>{index + 1 + (this.state.page * this.state.size)}</td>
                                            <td>{item.productName}</td>
                                            <td>
                                                {item.warehouseProductCounts && item.warehouseProductCounts.map((item1, index1) =>
                                                    <p>{index1 + 1} {item1.name} : {item1.count}</p>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }
                            </Table>
                            <Modal isOpen={this.state.showCashFlowModal} toggle={openTotalCashFlowModal}>
                                <ModalBody>
                                    <Table>
                                        <tr>
                                            <th>
                                                T/R
                                            </th>
                                            <th>
                                                Ombor nomi
                                            </th>
                                            <th>
                                                Summa
                                            </th>
                                        </tr>
                                        {
                                            this.state.totalCashFlow ? this.state.totalCashFlow.warehouseCashFlowDtos && this.state.totalCashFlow.warehouseCashFlowDtos.map((item, index) =>
                                                <tr>
                                                    <td>{index + 1}</td>
                                                    <td>{item.warehouseDto.name}</td>
                                                    <td>{item.totalSum}</td>
                                                </tr>
                                            )
                                                : ''
                                        }
                                    </Table>
                                    <h3>Jami
                                        : {this.state.totalCashFlow ? this.state.totalCashFlow.totalSum : 0} UZS</h3>
                                </ModalBody>
                                <ModalFooter>
                                    <button className="btn btn-warning" onClick={openTotalCashFlowModal}>Yopish</button>
                                </ModalFooter>
                            </Modal>
                        </div>
                    </div>
                </div>
                :
                <Redirect to="/"/>


        )
    }
}

const states = state => ({
    currentUser: state.auth.currentUser
})

MainPage.propTypes = {};

export default connect(states, null)(MainPage);