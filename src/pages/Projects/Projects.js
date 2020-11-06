import React, {Fragment, useEffect, useState} from 'react'
import {CardList, InputObject} from '../../components'
import {ProjectApi, UserApi} from '../../api'
import {useQuery} from '@apollo/react-hooks'
import {useMutation} from '@apollo/client'

const usersInt = {
    id: '',
    name: '',
    lastName: '',
    age: ''
}

const proyectoInt = {
    name: '',
    description: '',
    users: [usersInt] 
}

const proyectos = [{
        id: 1,
        name: 'ToDo'
    },{
        id: 2,
        name: 'dashboard'
    }
]

const initialInputs = [{
        name: 'name',
        className: 'col-8',
        type: 'text',
        label: 'Nombre del proyecto*',
        required: true,
    },{
        name: 'description',
        className: 'col-12 mt-1',
        type: 'text-area',
        label: 'Descripción del proyecto*',
        required: true
    },{
        name: 'users',
        className: 'col-12 mt-1',
        type: 'select-multi',
        label: 'Usuarios',
        options: []
    }
]


export default () => {
    const {loading, error, data: dataProjects} = useQuery(ProjectApi.getProjects(),{onError: () => {}})
    const {loading: userLoading, error: userError, data: dataUsers} = useQuery(UserApi.getUsersWOProjects(), {onError: () => {}})
    const [createObject, {loading: loadingMutation, error: errorMutation}] = useMutation(ProjectApi.addProject(), {onError: () => {}})
    const [deleteObject, {loading: loadingDelete, error: errorDelete, data: responseData}] = useMutation(ProjectApi.deleteProject(), {onError: () => {}})
    const [updateObject, {loading: loadingUpdate, error: errorUpdate, data: updateData}] = useMutation(ProjectApi.updateProject(), {onError: () => {}})
    const [dataList, setdataList] = useState([])
    const [inputs, setInputs] = useState([...initialInputs])
    const [showModal, setShowModal] = useState(false)
    
    useEffect(() => {
        if(!!dataProjects){
            let projectList = dataProjects.projects.map(project => (
                {...project, label: project.name}
            ))
            setdataList(projectList)
        }
    }, [dataProjects])

    

    useEffect(() => {
        if(!!dataUsers){
            let inputsAux = [...inputs]
            inputsAux[inputsAux.length -1 ].options = dataUsers.users.map(user => (
                {...user, label: user.name + ' ' + user.lastName || '' })
            )
            setInputs(inputsAux)
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
                alert("Sucedion un error al Eliminar: " + errorDelete)
            }

        }
    }, [error,userError,errorMutation,errorDelete,errorUpdate])

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
        let formSubmit = JSON.parse(JSON.stringify(form))
        formSubmit.users.map( item => {
            delete item.label
            delete item.checked
        })
        createObject({variables: {input: formSubmit}, 
            update(cache, {data}) {
                if(!data){
                    return
                }
                try {
                    const {addProject: newObject} = data
                    newObject.label = newObject.name
                    const dataListAux = [...dataList, newObject]
                    setdataList(dataListAux)
                } catch (error) {
                    console.log('error: ', error)
                }

        }})
        setShowModal(false)
    }

    const onEdit = (form) => {
        let formSubmit = JSON.parse(JSON.stringify(form))
        formSubmit.users.map( item => {
            delete item.label
            delete item.checked
        })

        updateObject({variables: {input: formSubmit}, 
            update(cache, {data}) {
                if(!data){
                    return
                }

                try {
                    const {updateProject} = data
                    const dataListAux = dataList.map( item => {
                        if(item.id === updateProject.id) {
                            updateProject.label = updateProject.name
                            return {...updateProject}
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
            Proyectos
        </h1>
        <div>
            <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)} >
                Añadir
            </button>
        </div>
        {showModal && <InputObject inputs={inputs} objectName={"proyecto"} onSubmit={onSubmit} onCancel={() => {setShowModal(false)}} addData={ProjectApi.addProject} /> }
        <CardList nameList={"proyecto"} data={dataList} onDelete={onDelete} onEdit={onEdit} inputs={inputs} />
    </div>
}