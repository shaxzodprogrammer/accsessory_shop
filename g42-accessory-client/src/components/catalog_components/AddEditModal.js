import React, {useState} from "react";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {AvField, AvForm} from "availity-reactstrap-validation";

function AddEditModal({state,saveOrEdit,openModal,closeModal,saveOrEditShop, saveOrEditWarehouse}) {

    console.log(state.currentItem,"aaaaaaaaaaaaaaaaaaaaaaaaaaaa")

    switch (state.activeTab) {
        case '1':
            return(
                <Modal isOpen={state.showModal}
                       toggle={() => closeModal()}>
                    <ModalHeader>{state.currentItem ? 'Tahrirlash' : 'Yangi user qoshish'}</ModalHeader>
                    <AvForm onValidSubmit={saveOrEdit}>
                        <ModalBody>
                            <AvField
                                label="Ism kiriting :"
                                name="firstName"
                                placeholder="Ism kiriting"
                                defaultValue={state.currentItem ? state.currentItem.firstName : ''}
                            />
                            <AvField
                                label="Familiya kiriting :"
                                name="lastName"
                                placeholder="Familiya kiriting"
                                defaultValue={state.currentItem ? state.currentItem.lastName : ''}
                            />
                            <AvField
                                label="Telefon raqam kiriting :"
                                name="phoneNumber"
                                placeholder="Telefon raqamini kiriting"
                                defaultValue={state.currentItem?state.currentItem.phoneNumber:''}
                            />
                            <AvField
                                label="Login kiriting :"
                                name="username"
                                placeholder="Login kiriting"
                                defaultValue={state.currentItem?state.currentItem.username:''}
                            />
                            {/*{state.currentItem?'':*/}
                                <AvField
                                    label="Parol kiriting :"
                                    type="text"
                                    name="password"
                                    placeholder="Parol kiriting"
                                    defaultValue=''
                                />
                            {/*}*/}
                            {

                                state.currentItem && state.currentItem.roleName==='ROLE_DIRECTOR'?
                                   ''
                                    :
                                    <AvField
                                        label="Mansab tanlang:"
                                        type="select"
                                        name="roleName"
                                        placeholder="Mansab tanlang : "
                                        defaultValue={state.currentItem?state.currentItem.roleName:''}
                                    >
                                        <option value="" disabled={true}>Lavozim tanlang</option>
                                        <option value="ROLE_SELLER">Sotuvchi</option>
                                        <option value="ROLE_MANAGER">Manager</option>
                                    </AvField>
                            }

                        </ModalBody>

                        <ModalFooter>
                            <button type="button" onClick={() => closeModal()} className="btn btn-danger">Bekor qilish
                            </button>
                            <button type="submit" className="btn btn-success">Saqlash</button>
                        </ModalFooter>
                    </AvForm>
                </Modal>

            );
        case '2':
            return(
                <Modal isOpen={state.showModal}
                       toggle={() => openModal()}>
                    <ModalHeader>{state.currentItem ? 'Tahrirlash' : 'Yangi magazin qoshish'}</ModalHeader>
                    <AvForm onValidSubmit={saveOrEdit}>
                        <ModalBody>
                            <AvField
                                name="name"
                                placeholder="Nomi"
                                defaultValue={state.currentItem ? state.currentItem.name : ''}
                            />
                            <AvField
                                name="address"
                                placeholder="Address"
                                defaultValue={state.currentItem ? state.currentItem.address : ''}
                            />
                            {/*<AvField*/}
                            {/*    name="description"*/}
                            {/*    placeholder="Sharh"*/}
                            {/*    defaultValue={state.currentItem?state.currentItem.description:''}*/}
                            {/*/>*/}

                            <AvField
                                type="select"
                                name="seller"
                                placeholder="Sotuvchini tanlang"
                                defaultValue={state.currentItem&&state.currentItem.seller?state.currentItem.seller.id:''}
                            >
                                <option value="" disabled={true}>Sotuvchi tanlang</option>
                                {state.sellers?state.sellers.map((seller)=>
                                    <option key={seller.id} value={seller.id}>{seller.firstName+" "+seller.lastName}</option>
                                ):''

                                }

                            </AvField>
                        </ModalBody>

                        <ModalFooter>
                            <button type="button" onClick={() => openModal()} className="btn btn-danger">Bekor qilish
                            </button>
                            <button type="submit" className="btn btn-success">Saqlash</button>
                        </ModalFooter>
                    </AvForm>
                </Modal>

            );


        case '3':
            return(
                <Modal isOpen={state.showModal}
                       toggle={() => openModal()}>
                    <ModalHeader>{state.currentItem ? 'Tahrirlash' : 'Yangi ombor qoshish'}</ModalHeader>
                    <AvForm onValidSubmit={saveOrEdit}>
                        <ModalBody>
                            <AvField
                                name="name"
                                placeholder="Nomi"
                                defaultValue={state.currentItem ? state.currentItem.name : ''}
                            />
                            <AvField
                                name="address"
                                placeholder="Address"
                                defaultValue={state.currentItem ? state.currentItem.address : ''}
                            />
                            {/*<AvField*/}
                            {/*    name="description"*/}
                            {/*    placeholder="Sharh"*/}
                            {/*    defaultValue={state.currentItem?state.currentItem.phoneNumber:''}*/}
                            {/*/>*/}

                            {/*<AvField*/}
                            {/*    type="select"*/}
                            {/*    name="seller"*/}
                            {/*    placeholder="Sotuvchini tanlang"*/}
                            {/*    defaultValue={state.currentItem?state.currentItem.seller.id:''}*/}
                            {/*>*/}
                            {/*    <option value="" disabled={true}>Sotuvchi tanlang</option>*/}
                            {/*    {state.sellers.map((seller)=>*/}
                            {/*        <option key={seller.id} value={seller.id}>{seller.firstName+" "+seller.lastName}</option>*/}
                            {/*    )*/}

                            {/*    }*/}
                            {/*    /!*<option value="ROLE_SELLER">Sotuvchi</option>*!/*/}
                            {/*    /!*<option value="ROLE_MANAGER">Manager</option>*!/*/}
                            {/*</AvField>*/}
                        </ModalBody>

                        <ModalFooter>
                            <button type="button" onClick={() => openModal()} className="btn btn-danger">
                                Bekor qilish
                            </button>
                            <button type="submit" className="btn btn-success">Saqlash</button>
                        </ModalFooter>
                    </AvForm>
                </Modal>
            );


        case '4':
            return(
                <Modal isOpen={state.showModal}
                       toggle={() => openModal()}>
                    <ModalHeader>{state.currentItem ? 'Tahrirlash' : 'Yangi kategoriya qoshish'}</ModalHeader>
                    <AvForm onValidSubmit={saveOrEdit}>
                        <ModalBody>
                            <AvField
                                name="name"
                                placeholder="Nomi"
                                defaultValue={state.currentItem ? state.currentItem.name : ''}
                            />

                            <AvField
                                type="select"
                                name="parentCategoryDto"
                                placeholder="Sub kategoriya tanlang"
                                defaultValue={state.currentItem&&state.currentItem.parentCategoryDto?state.currentItem.parentCategoryDto.id:''}
                            >
                                <option value="" disabled={true}>Sub kategoriya tanlang</option>
                                {state.categories?state.categories.map((category)=>
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )
                                    :''
                                }

                            </AvField>
                        </ModalBody>

                        <ModalFooter>
                            <button type="button" onClick={() => openModal()} className="btn btn-danger">
                                Bekor qilish
                            </button>
                            <button type="submit" className="btn btn-success">Saqlash</button>
                        </ModalFooter>
                    </AvForm>
                </Modal>
            ) ;


        case '5':
            return(
                <Modal isOpen={state.showModal}
                       toggle={() => openModal()}>
                    <ModalHeader>{state.currentItem ? 'Tahrirlash' : 'Yangi produkt qoshish'}</ModalHeader>
                    <AvForm onValidSubmit={saveOrEdit}>
                        <ModalBody>
                            <AvField
                                name="name"
                                placeholder="Nomi"
                                defaultValue={state.currentItem ? state.currentItem.name : ''}
                            />
                            <AvField
                                type="number"
                                name="incomePrice"
                                placeholder="income price"
                                defaultValue={state.currentItem ? state.currentItem.incomePrice : ''}
                            />

                            <AvField
                                type="number"
                                name="salePrice"
                                placeholder="sale price"
                                defaultValue={state.currentItem ? state.currentItem.salePrice : ''}
                            />

                            <AvField
                                type="number"
                                name="norma"
                                placeholder="norma"
                                defaultValue={state.currentItem ? state.currentItem.norma : ''}
                            />
                            {/*<AvField*/}
                            {/*    name="description"*/}
                            {/*    placeholder="Sharh"*/}
                            {/*    defaultValue={state.currentItem?state.currentItem.description:''}*/}
                            {/*/>*/}

                            <AvField
                                type="select"
                                name="categoryDto"
                                placeholder="Kategoriyani tanlang"
                                defaultValue={state.currentItem&&state.currentItem.categoryDto?state.currentItem.categoryDto.id:''}
                            >
                                <option value="" disabled={true}>Kategoriyani tanlang</option>
                                {state.categories?state.categories.map((category)=>
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                )
                                    :''

                                }

                            </AvField>
                        </ModalBody>

                        <ModalFooter>
                            <button type="button" onClick={() => openModal()} className="btn btn-danger">Bekor qilish
                            </button>
                            <button type="submit" className="btn btn-success">Saqlash</button>
                        </ModalFooter>
                    </AvForm>
                </Modal>
            ) ;

        default:
            return ('')
    }


};

export default AddEditModal;