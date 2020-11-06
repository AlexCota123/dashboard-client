import React, {Fragment, useEffect, useState} from 'react'
import {CardList, InputObject} from '../../components'
import {ProjectApi, UserApi} from '../../api'
import {useQuery} from '@apollo/react-hooks'
import {useMutation} from '@apollo/client'
import Validations from '../../components/Validations'



const initialInputs = [{
        name: 'name',
        className: 'col-6',
        type: 'text',
        label: 'Nombre del usuario*',
        required: true,
        maxLength: 15
    },{
        name: 'lastName',
        className: 'col-6',
        type: 'text',
        label: 'Apellido del usuario*',
        required: true,
        maxLength: 15
    },{
        name: 'age',
        className: 'col-3 mt-3',
        type: 'text',
        label: 'Edad *',
        required: true,
        maxLength: 2,
        onKeyPress: Validations.number
    },{
        name: 'projects',
        className: 'col-12 mt-3',
        type: 'select-multi',
        label: 'Proyectos',
        options: []
    }
]


export default () => {
    const {loading, error, data: dataUsers} = useQuery(UserApi.getUsers(), {onError: () => {}})
    const {loading: userLoading, error: userError, data: dataProjects} = useQuery(ProjectApi.getProjectsWOUsers(), {onError: () => {}})
    const [createObject, {loading: loadingMutation, error: errorMutation}] = useMutation(UserApi.addUser(), {onError: () => {}})
    const [deleteObject, {loading: loadingDelete, error: errorDelete, data: responseData}] = useMutation(UserApi.deleteUser(), {onError: () => {}})
    const [updateObject, {loading: loadingUpdate, error: errorUpdate, data: updateData}] = useMutation(UserApi.updateUser(), {onError: () => {}})
    const [dataList, setdataList] = useState([])
    const [inputs, setInputs] = useState([...initialInputs])
    const [showModal, setShowModal] = useState(false)
    
    useEffect(() => {
        if(!!dataUsers){
            let userList = dataUsers.users.map( user => (
                {...user, label: user.name + ' ' + user.lastName || ''}
            ))
            setdataList(userList)
        }
    }, [dataUsers])

    useEffect(() => {
        if(error || userError || errorMutation || errorDelete || errorUpdate){
            console.log((error || userError || errorMutation || errorDelete || errorUpdate))
            if(error || userError) {
                alert("Sucedio un error al obtener los datos: " + (error || userError).msg )
            }
            if(errorMutation) {
                alert("Sucedion un error al Guardar: " + errorMutation.msg)
            }
            if(errorUpdate) {
                alert("Sucedion un error al Modificar: " + errorUpdate.msg)
            }
            if(errorDelete) {
                alert("Sucedion un error al Eliminar: " + errorDelete.msg)
            }

        }
    },[error,userError,errorMutation,errorDelete,errorUpdate])
    

    useEffect(() => {
        if(!!dataProjects){

            let inputsAux = [...inputs]
            inputsAux[inputsAux.length -1 ].options = dataProjects.projects.map(project => (
                {...project, ...{label: project.name}})
            )
            setInputs(inputsAux)
        }
    }, [dataProjects])

    const onDelete = (id) => {
        deleteObject({variables: {id: id}, 
            update(cache, {data}) {
                if(!data){
                    return
                }
                const dataListAux = dataList.filter(item => item.id !== id)
                setdataList(dataListAux)
            }
        })
    }

    const onSubmit = (form) => {
        let formInput = JSON.parse(JSON.stringify(form))
        formInput.projects.map( item => {
            delete item.label
            delete item.checked
        
        })
        formInput.age = Number(formInput.age)

        createObject({variables: {input: formInput}, 
            update(cache, {data}) {
                if(!data){
                    return
                }
                try {
                    const {addUser: newObject} = data
                    newObject.label = newObject.name + ' ' + newObject.lastName || ''
                    const dataListAux = [...dataList, newObject]
                    setdataList(dataListAux)
                } catch (error) {
                    console.log('error: ', error)
                }

        }})
        setShowModal(false)
    }

    const onEdit = (form) => {
        
        let formInput = JSON.parse(JSON.stringify(form))
        formInput.projects.map( item => {
            delete item.label
            delete item.checked
        
        })

        updateObject({variables: {input: formInput}, 
            update(cache, {data}) {
                if(!data){
                    return
                }

                try {
                    const {updateUser} = data
                    const dataListAux = dataList.map( item => {
                        if(item.id === updateUser.id) {
                            updateUser.label = updateUser.name + ' ' + updateUser.lastName || ''

                            return {...updateUser}
                        }
                        return {...item}
                    })
                    setdataList(dataListAux)
                } catch (error) {
                    console.log('error: ', error)
                }
            }
        })

    }

    return <div>
        <h1 style={{color: '#805994', margin: '30px 0'}} >
            Usuarios
        </h1>
        <div>
            <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)} >
                Añadir
            </button>
        </div>
        {showModal && <InputObject inputs={inputs} objectName={"usuario"} onSubmit={onSubmit} onCancel={() => {setShowModal(false)}} addData={ProjectApi.addProject} /> }
        <CardList nameList={"usuario"} data={dataList} onDelete={onDelete} onEdit={onEdit} inputs={inputs} />
    </div>
}