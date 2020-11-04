import React from 'react'

const Modal = (props) => {
    return (
        <div className={`modal fade show `} style={{display: 'block' }}  role="dialog" aria-hidden="true" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header" >
                        <h5 className="modal-title" >{props.tittle} </h5>
                    </div>
                    <div className="modal-body">
                        {props.child} 
                    </div>
                    <div className="modal-footer">
                        {props.cancelTittle && <button type="button" className="btn btn-secondary" onClick={props.onCancel} >{props.cancelTittle}</button>}
                        <button type="button" className="btn btn-primary" onClick={props.onOk} >{props.okTittle}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal
