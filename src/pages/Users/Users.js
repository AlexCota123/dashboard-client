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
    const {loading, error, data: dataUsers} = useQuery(UserApi.getUsers())
    const {loading: userLoading, error: userError, data: dataProjects} = useQuery(ProjectApi.getProjectsWOUsers())
    const [createObject, {loading: loadingMutation, error: errorMutation}] = useMutation(UserApi.addUser())
    const [deleteObject, {loading: loadingDelete, error: errorDelete, data: responseData}] = useMutation(UserApi.deleteUser())
    const [updateObject, {loading: loadingUpdate, error: errorUodate, data: updateData}] = useMutation(UserApi.updateUser())
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
        form.age = Number(form.age)
        console.log('form: ', form)
        createObject({variables: {input: form}, 
            update(cache, {data}) {
                if(!data){
                    return
                }
                try {
                    const {addUser: newObject} = data

                    form.label = form.name + ' ' + form.lastName || ''
                    const dataListAux = [...dataList, form]
                    setdataList(dataListAux)
                } catch (error) {
                    console.log('error: ', error)
                }

        }})
        setShowModal(false)
    }

    const onEdit = (form) => {
        
        form.projects.map( item => {
            delete item.label
            delete item.checked
        
        })

        updateObject({variables: {input: form}, 
            update(cache, {data}) {
                if(!data){
                    return
                }

                try {
                    const {updateUser} = data
                    const dataListAux = dataList.map( item => {
                        if(item.id === updateUser.id) {
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