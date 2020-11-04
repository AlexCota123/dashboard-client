import React, {useEffect,useState} from 'react'
// import {TrashIcon, trashIconFill } from '../../icons'
import trashIcon from '../../icons/trash-icon.svg'
import trashIconFill from '../../icons/trash-icon-fill.svg'
import editIcon from '../../icons/edit-icon.svg'
// import {ProjectApi} from '../../api'
import {useQuery} from '@apollo/react-hooks'
import Modal from '../Modal/Modal'
import Forms from '../Forms/Forms'
import InputObject from '../InputObject/InputObject'
import './ListCardStyle.scss'

const CardList = (props) => {
    const TrashIcon = <img src={trashIcon} className="text-primary" width="20" height="20" />
    const TrashIconFill = <img src={trashIconFill} className="text-success" width="20" height="20" />

    const [dataList, setDataList] = useState(false)
    const [idDeleted, setIdDeleted] = useState(-1)
    const [idUpdated, setIdUpdated] = useState(-1)
    const [showModal, setShowModal] = useState(false)
    const [showDetalledModal, setShowDetalledModal] = useState(false)
    const [shoeEditModal, setShoeEditModal] = useState(false)
    
    const [isRead, setIsRead] = useState(true)
    const [readInputs, setReadInputs] = useState([])
    const [writeInputs, setWriteInputs] = useState([])

    useEffect(() => {
        setDataList(props.data)

    }, [props.data])

    const editInfo = (item) => {
        setIdUpdated(item.id)
        let dataAux = {...item}
        let inputsAux = JSON.parse(JSON.stringify(props.inputs))
        let writeInput = inputsAux.map(input => {
            if(input.type === 'select-multi') {
                input.options = input.options.map(option => {
                    option.checked = dataAux[input.name].some( data => data.id === option.id)
                    return {...option}
                })
            } else {
                input.defaultValue = dataAux[input.name] || null
            }
            return {...input}
        })
        setIsRead(false)
        setWriteInputs(writeInput)
        setShoeEditModal(true)
    }

    // useEffect(() => {
    //     if(readInputs.length) {
    //     }
    // }, [readInputs])

    const onDelete = (id) => {
        setIdDeleted(id)
        setShowModal(true)
    }

    const showInfo = (item) => {
        let dataAux = {...item}
        let inputsAux = JSON.parse(JSON.stringify(props.inputs))
        let inputin = inputsAux.map(input => {
            if (input.type === 'select-multi' ){
                input.options = dataAux[input.name].map(item => ({...item, ...{label: item.name + ' ' + (item.lastName || "")}}))
            }else {
                input.value = dataAux[input.name] || null
            }
            input.disabled = true
            return input
        })
        setIsRead(true)
        setReadInputs(inputin)
        setShowDetalledModal(true)

    }

    const onChange = ({name, value}) => {
        let formaAux = {...writeInputs}
        formaAux[name] = value
        setWriteInputs(formaAux)
    }

    const deleteModalOptions = {
        tittle: 'Confimación',
        onOk: () => {
            props.onDelete(idDeleted)
            setShowModal(false)
        },
        onCancel: () => {
            setShowModal(false)
        },
        okTittle: 'Si',
        cancelTittle: 'No',
        child: '¿Esta usted seguro de eliminar este registro?'
    }

    const detalledModalOptions = {
        tittle: 'Información',
        onOk: () => {
            setShowDetalledModal(false)
        },
        okTittle: 'Ok',
        child: <Forms inputs={readInputs} readOnlyForm={isRead} />
    }

    const editModalOptions = {
        tittle: 'Modificar',
        onCancel: () => {
            setShoeEditModal(false)
        },
        okTittle: 'Modificar',
        cancelTittle: 'Cancelar',
    }

    return <div className="d-flex">

        {/* {loading && <div> Cargando... </div> } */}
        {/* {errors && <div>Error: {errors} </div>} */}
        {dataList &&
            <div className="table">
                {props.nameList === 'proyecto'? 
                    dataList.map((item, index) => (
                        <div className="d-flex px-0">
                            <div className="d-flex col" onClick={() => showInfo(item)}>
                                <div className="col-2">{index} </div>
                                <div className="col">{item.name}</div>
                            </div>
                            <div className="d-flex ml-0 justify-content-center align-items-center" style={{cursor: 'pointer'}} onClick={() => editInfo(item)}>
                                <img src={editIcon} width="20" height="20" />
                            </div>
                            <div key={index} className=" d-flex ml-auto justify-content-center align-items-center pr-2 col-1" style={{cursor: 'pointer'}} onClick={() => onDelete(item.id)}> 
                                {TrashIconFill}
                            </div>
                        </div>
                    )):
                    dataList.map((item, index) => (
                        <div className="d-flex pr-0">
                            <div className="col-1">{index} </div>
                            <div className="col">{item.name} </div>
                            <div className="col-1">{item.lastName} </div>
                            <div className="d-flex ml-0 justify-content-center align-items-center" style={{cursor: 'pointer'}} onClick={() => editInfo(item)}>
                                <img src={editIcon} width="20" height="20" />
                            </div>
                            <div key={index} className=" d-flex ml-auto justify-content-center align-items-center pr-2" style={{cursor: 'pointer'}} onClick={() => onDelete(item.id)}> 
                                {TrashIconFill}
                            </div>
                        </div>
                    ))
                }
            </div>
            }

            {shoeEditModal && 
                 <InputObject inputs={writeInputs} objectName={props.nameList} 
                              onSubmit={(form) => {
                                  props.onEdit({...form, id: idUpdated })
                                  setShoeEditModal(false)}} 
                              onCancel={() => {setShoeEditModal(false)}} customModal={editModalOptions} />
            } 
            {showDetalledModal && 
                 <InputObject inputs={readInputs} objectName={props.nameList} 
                              onSubmit={() => {setShowDetalledModal(false)}}   />
            } 
            {showDetalledModal && 
                <Modal {...detalledModalOptions} />
            }
            {showModal && 
                <Modal {...deleteModalOptions} />
            }
    </div>
}

export default CardList