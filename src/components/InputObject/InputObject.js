import React, {useState, useEffect, Fragment,} from 'react'
import {useMutation} from '@apollo/client'
import Forms from '../Forms/Forms'
import Modal from '../Modal/Modal'

const InputObject = (props) => {
    const [showModal, setShowModal] = useState(false)
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [showCancelConfirmationModal, setShowCancelConfirmationModal] = useState(false)
    const [inputs, setInputs] = useState(props.inputs)
    const [form, setForm] = useState({})

    useEffect(() => {
        let formaAux = {}
        props.inputs.map(input => {
            if(input.type === 'select-multi'){
                formaAux[input.name] = input.options.filter( (item, index) => {
                    delete input.options[index].__typename
                    return item.checked 
                })
            } else {
                formaAux[input.name] = input.defaultValue || ''
            }
            return input
        })
        // console.log('props.getDataList: ', props.getDataList())
        setForm(formaAux)
    }, [])

    useEffect(() => {
        setInputs(props.inputs)
    },[props.inputs])

    const onChange = ({name, value}) => {
        let formaAux = {...form}
        formaAux[name] = value
        setForm(formaAux)
    }

    const onSubmit = () => {
        props.onSubmit(form)
    }
    
    const modalOptions = {
        tittle: 'Añadir '+ props.objectName,
        onOk: () => {setShowConfirmationModal(true)},
        onCancel: () => {
            setShowCancelConfirmationModal(true)
        },
        okTittle: 'Guardar',
        cancelTittle: 'Cancelar',
        child: <Forms inputs={inputs} onChange={onChange} readOnlyForm={false} />
    }
    

    const modalCancelConfirmationOptions = {
        tittle: 'Confirmación',
        onOk: () => {
            props.onCancel()
        },
        onCancel: () => {setShowCancelConfirmationModal(false)},
        okTittle: 'Si',
        cancelTittle: 'No',
        child: '¿Esta usted seguro de cancelar?, los datos sin guardar no se puede recuperar'
    }

    const modalConfirmationOptions = {
        ...modalCancelConfirmationOptions,
        onOk: () => {
            onSubmit()
            setShowConfirmationModal(false)
        },
        onCancel: () => {setShowConfirmationModal(false)},
        child: '¿Esta usted seguro de enviar esta informacón?'
    }
    
    return(
        <>
            
            <Modal {...{...modalOptions, ...(!!props.customModal ? props.customModal: {})}} />

            {(showCancelConfirmationModal || showConfirmationModal) &&
                <Modal {... (showConfirmationModal ? modalConfirmationOptions : modalCancelConfirmationOptions)} />
            }

        </>
    )
}

export default InputObject