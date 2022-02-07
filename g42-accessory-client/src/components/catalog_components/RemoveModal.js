import React from "react";
import {Modal, ModalFooter, ModalHeader} from "reactstrap";

function RemoveModal(props){



    return(
        <Modal isOpen={props.showRemoveModal} toggle={props.closeRemoveModal}>
            <ModalHeader>O'chirishni istaysizmi ?</ModalHeader>
            <ModalFooter>
                <button type="button" onClick={props.closeRemoveModal}
                        className="btn btn-danger">Bekor qilish
                </button>
                <button type="button" onClick={props.remove} className="btn btn-success">Ha</button>
            </ModalFooter>
        </Modal>
    )

}


export default RemoveModal