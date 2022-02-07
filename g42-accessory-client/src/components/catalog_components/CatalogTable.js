import React from "react";
import {Col, Row, Table} from "reactstrap";
import AddEditModal from "./AddEditModal";
import RemoveModal from "./RemoveModal";
import {getRoleNameFromJWT} from "../../utills/UsefullFunctions";

function catalogTable(props) {

    return (

        <Row>
            <Col sm="12">
                <h4>{props.title}</h4>
                {
                    props.dataType === "products" && getRoleNameFromJWT()==='ROLE_MANAGER'?
                        '':
                        <button type="button" className="btn btn-success"
                                onClick={() => props.openModal('')}>
                            <AddEditModal state={props.state} saveOrEdit={props.saveOrEdit} openModal={props.openModal}
                                          closeModal={props.closeModal}/>
                            Add
                        </button>
                }

                <Table striped>
                    <thead>
                    <tr>
                        {props.names.map(item =>
                            <th>{item}</th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {props.datas &&
                    props.datas.map((item, index) =>
                        <tr>
                            <th scope="row">{index + 1 + (props.currentPage * 10)}</th>


                            {
                                props.dataType === 'users' ? [
                                        <td>{item.firstName + " " + item.lastName}</td>,
                                        <td>{item.phoneNumber}</td>,
                                        <td>{item.username}</td>
                                    ]
                                    :
                                    props.dataType === 'shops' ? [
                                            <td>{item.name}</td>,
                                            <td>{item.address}</td>,
                                            // <td>{item.seller.firstName+" "+item.seller.lastName}</td>
                                            <td>{item.seller ? item.seller.firstName + " " + item.seller.lastName : ''}</td>
                                        ]
                                        :
                                        props.dataType === 'warehouses' ? [
                                                <td>{item.name}</td>,
                                                <td>{item.address}</td>,
                                                <td>{item.shopDto ? item.shopDto.name : ''}</td>
                                            ]
                                            :
                                            props.dataType === "categories" ? [
                                                    <td>{item.name}</td>,
                                                    // <td>{item.address}</td>,
                                                    <td>{item.parentCategoryDto ? item.parentCategoryDto.name : ''}</td>
                                                ]
                                                :
                                                props.dataType === "products" ?
                                                    getRoleNameFromJWT() === 'ROLE_DIRECTOR' ?
                                                        [
                                                            <td>{item.name}</td>,
                                                            <td>{item.incomePrice}</td>,
                                                            <td>{item.salePrice}</td>,
                                                            <td>{item.norma}</td>,
                                                            <td>{item.categoryDto ? item.categoryDto.name : ''}</td>
                                                        ] :
                                                        [
                                                            <td>{item.name}</td>,
                                                            <td>{item.salePrice}</td>,
                                                            <td>{item.norma}</td>,
                                                            <td>{item.categoryDto ? item.categoryDto.name : ''}</td>
                                                        ]
                                :
                                ""
                            }


                            <td>
                                <div className="custom-control custom-switch">
                                    {props.dataType === "users" ?
                                        item.roleName==='ROLE_DIRECTOR'?
                                        '' :
                                            [
                                                <input type="checkbox" className="custom-control-input"
                                                       id={item.name + item.id} checked={item.enable}
                                                       onClick={() => props.changeActive(item.id, item.enable)}/>,
                                                <label className="custom-control-label"
                                                       htmlFor={item.name + item.id}/>
                                            ]
                                        :

                                        props.dataType === "warehouses" ? [

                                                !item.shopDto ? [
                                                        <input type="checkbox" className="custom-control-input"
                                                               id={item.name + item.id} checked={item.active}
                                                               onClick={() => props.changeWarehouseActive(item.id, item.active)}/>,
                                                        <label className="custom-control-label"
                                                               htmlFor={item.name + item.id}/>
                                                    ]
                                                    : ''
                                            ]
                                            :
                                            props.dataType === "categories" ?
                                                ''
                                                :


                                                [
                                                    <input type="checkbox" className="custom-control-input"
                                                           id={item.name + item.id} checked={item.active}
                                                           onClick={() => props.changeActive(item.id, item.active)}/>,
                                                    <label className="custom-control-label"
                                                           htmlFor={item.name + item.id}/>
                                                ]


                                    }


                                </div>
                            </td>
                            {
                                getRoleNameFromJWT()==='ROLE_DIRECTOR'?
                                    <td>
                                        <button type="button" className="btn btn-warning"
                                                onClick={() => props.openModal(item)}>Edit
                                        </button>
                                        {
                                            item.roleName==='ROLE_DIRECTOR'?
                                                '':
                                                <button type="button" className="btn btn-danger"
                                                        onClick={() => props.openRemoveModal(item)}

                                                >
                                                    <RemoveModal closeRemoveModal={props.closeRemoveModal}
                                                                 showRemoveModal={props.state.showRemoveModal} remove={props.remove}/>
                                                    Delete
                                                </button>
                                        }

                                    </td>
                                    :''
                            }

                        </tr>
                    )}

                    </tbody>
                </Table>
            </Col>
        </Row>

    )

}

export default catalogTable