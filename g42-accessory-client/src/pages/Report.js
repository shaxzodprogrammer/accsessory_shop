import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Navbar from "../components/Navbar";
import {BASE_URL, ROLE} from "../utills/constants";
import {getRoleNameFromJWT} from "../utills/UsefullFunctions";
import {Redirect} from "react-router-dom";
import AdminRequests from "../components/catalog_components/AdminRequests";
import {Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import Pagination from "react-js-pagination";
import DatePicker from "react-datepicker";

class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            status: 'NEW',
            reports: [],
            totalElements: 0,
            item: '',
            showPwaModal: false,
            showAcceptModal: false,
            reportId: '',
            shopId: 0,
            startDate: '',
            endDate: '',
            shopList:[]
        }
    }

    componentDidMount() {
        AdminRequests.allShops().then(res=>{
            console.log(res,'ALL_SHOPS')
            this.setState({
                shopList:res.object
            })
        })
        AdminRequests.getAllReportByStatus({
            page: this.state.page,
            size: this.state.size,
            status: this.state.status,
            startDate: '', endDate: '',
            shopId: this.state.shopId
        }).then(res => {
            console.log(res, 'REPORTS')
            this.setState({
                reports: res.object,
                totalElements: res.totalElements
            })
        })
    }

    render() {
        const {history} = this.props

        const openPwa = (item) => {
            console.log(item, 'ITEMMMMMM')
            this.setState({
                item,
                showPwaModal: !this.state.showPwaModal
            })
        }

        const openAccept = (id) => {
            this.setState({
                showAcceptModal: !this.state.showAcceptModal,
                reportId: id
            })
        }
        const accept = () => {
            AdminRequests.acceptReport(this.state.reportId).then(response => {
                AdminRequests.getAllReportByStatus({
                    page: this.state.page,
                    size: this.state.size,
                    status: this.state.status
                }).then(res => {
                    console.log(res, 'REPORTS')
                    this.setState({
                        reports: res.object,
                        totalElements: res.totalElements,
                        showAcceptModal: !this.state.showAcceptModal,
                        reportId: ''
                    })
                })
            })
        }
        const getByStatus = (e) => {
            let s = e.target.value
            AdminRequests.getAllReportByStatus({
                page: this.state.page,
                size: this.state.size,
                status: s,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                shopId: this.state.shopId
            }).then(res => {
                console.log(res, 'REPORTS')
                this.setState({
                    reports: res.object,
                    totalElements: res.totalElements,
                    status: s
                })
            })
        }
        const handlePageChange = (pageNumber) => {
            AdminRequests.getAllReportByStatus({
                page: pageNumber - 1,
                size: this.state.size,
                status: this.state.status,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                shopId: this.state.shopId
            }).then(res => {
                console.log(res, 'REPORTS')
                this.setState({
                    reports: res.object,
                    totalElements: res.totalElements,
                    page: pageNumber - 1
                })
            })
        }
        const getStartDate = (startDate) => {
            if (this.state.endDate) {
                AdminRequests.getAllReportByStatus({
                    page: this.state.page,
                    size: this.state.size,
                    status: this.state.status,
                    startDate,
                    endDate: this.state.endDate,
                    shopId: this.state.shopId
                }).then(res => {
                    console.log(res, 'REPORTS')
                    this.setState({
                        reports: res.object,
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
            AdminRequests.getAllReportByStatus({
                page: this.state.page,
                size: this.state.size,
                status: this.state.status,
                startDate: this.state.startDate,
                endDate,
                shopId: this.state.shopId
            }).then(res => {
                console.log(res, 'REPORTS')
                this.setState({
                    reports: res.object,
                    totalElements: res.totalElements,
                    endDate
                })
            })
        }
        const getByShopId=(e)=>{
            let s=e.target.value;
            console.log(s,'SHOP ID')
            AdminRequests.getAllReportByStatus({
                page:this.state.page,
                size: this.state.size,
                status: this.state.status,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                shopId: s
            }).then(res => {
                console.log(res, 'REPORTS')
                this.setState({
                    reports: res.object,
                    totalElements: res.totalElements,
                    shopId:s
                })
            })
        }
        return (
            getRoleNameFromJWT() ?
                <div className='row row-style'>
                    <div className='col-md-2 col-2-style'>
                        <Navbar role={getRoleNameFromJWT()} history={history} tab="2"/>
                    </div>
                    <div className='col-md-10 col-10-style'>
                        <div className="row">
                            <div className="col-md-3">
                                <select name="status" id="status" onChange={getByStatus}>
                                    <option value="NEW">Tasdiqlanmagan</option>
                                    <option value="ACCEPTED">Tasdiqlangan</option>
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
                                {
                                    getRoleNameFromJWT()==='ROLE_DIRECTOR'
                                    ||
                                        getRoleNameFromJWT()==='ROLE_MANAGER'?
                                        <select name="status" id="status" onChange={getByShopId}>
                                            <option value="0">Barchasi</option>
                                            {
                                                this.state.shopList&&this.state.shopList.map((item)=>
                                                    <option value={item.id}>{item.name}</option>
                                                )
                                            }
                                        </select>
                                        :''
                                }

                            </div>
                            <div className="col-md-3">
                                {
                                    this.state.startDate && this.state.endDate ?
                                        '' :
                                        <Pagination
                                            activePage={this.state.page + 1}
                                            itemsCountPerPage={this.state.size}
                                            totalItemsCount={this.state.totalElements}
                                            pageRangeDisplayed={5}
                                            onChange={handlePageChange}
                                            itemClass="page-item"
                                            linkClass="page-link"
                                        />
                                }

                            </div>
                        </div>
                        <div className="mt-5">
                            <Table>
                                <tr>
                                    <th>T/R</th>
                                    <th>Magazin</th>
                                    <th>Sana</th>
                                    <th>Summa</th>
                                    <th>Kim qabul qilgan</th>
                                    <th>Tasdiqlangan</th>
                                    <th>Maxsulotlar</th>
                                    {
                                        getRoleNameFromJWT() === 'ROLE_MANAGER'
                                        || getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                            <th>Action</th> : ''
                                    }

                                </tr>
                                {this.state.reports && this.state.reports.map((item, index) =>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.shopDto.name}</td>
                                        <td>{item.createdAt.substr(0, 10) + '  |  ' + item.createdAt.substr(11, 5)}</td>
                                        <td>{item.sum}</td>
                                        <td>{item.managerDto ? item.managerDto.firstName + ' ' + item.managerDto.lastName : ''}</td>
                                        <td><input type="checkbox" checked={item.status === 'ACCEPTED'}/></td>
                                        <td>
                                            <button className="btn btn-info" onClick={() => openPwa(item)}>...</button>
                                        </td>
                                        {
                                            getRoleNameFromJWT() === 'ROLE_MANAGER'
                                            || getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                                item.status === 'NEW' ?
                                                    <td>
                                                        <button className="btn btn-success"
                                                                onClick={() => openAccept(item.id)}>Tasdiqlash
                                                        </button>
                                                    </td> : '' : ''
                                        }
                                    </tr>
                                )}
                            </Table>
                        </div>
                        <Modal isOpen={this.state.showPwaModal} toggle={() => openPwa('')}>
                            <ModalBody>
                                <Table>
                                    <tr>
                                        <th>T/R</th>
                                        <th>Maxsulot Nomi</th>
                                        <th>Soni</th>
                                        <th>Real Sotilgan narxi</th>
                                    </tr>
                                    {this.state.item ? this.state.item.pwa && this.state.item.pwa.map((itemm, index) =>
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
                                <button className="btn btn-warning" onClick={() => openPwa('')}>Yopish</button>
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={this.state.showAcceptModal} toggle={() => openAccept('')}>
                            <ModalHeader>Tasdiqlaysizmi?</ModalHeader>
                            <ModalFooter>
                                <button className="btn btn-danger" onClick={() => openAccept('')}>Bekor Qilish
                                </button>
                                <button className="btn btn-warning" onClick={accept}>Ha</button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </div>
                :
                <Redirect to="/"/>
        );
    }
}

Report.propTypes = {};

export default Report;