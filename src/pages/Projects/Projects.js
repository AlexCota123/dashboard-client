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
        className: 'col-12',
        type: 'text-area',
        label: 'Descripción del proyecto*',
        required: true
    },{
        name: 'users',
        className: 'col-12',
        type: 'select-multi',
        label: 'Usuarios',
        options: []
    }
]


export default () => {
    const {loading, error, data: dataProjects} = useQuery(ProjectApi.getProjects())
    const {loading: userLoading, error: userError, data: dataUsers} = useQuery(UserApi.getUsers())
    const [createObject, {loading: loadingMutation, error: errorMutation}] = useMutation(ProjectApi.addProject())
    const [deleteObject, {loading: loadingDelete, error: errorDelete, data: responseData}] = useMutation(ProjectApi.deleteProject())
    const [updateObject, {loading: loadingUpdate, error: errorUodate, data: updateData}] = useMutation(ProjectApi.updateProject())
    const [dataList, setdataList] = useState([])
    const [inputs, setInputs] = useState([...initialInputs])
    const [showModal, setShowModal] = useState(false)
    
    useEffect(() => {
        if(!!dataProjects){
            setdataList(dataProjects.projects)
        }
    }, [dataProjects])

    

    useEffect(() => {
        if(!!dataUsers){
            let inputsAux = [...inputs]
            inputsAux[inputsAux.length -1 ].options = dataUsers.users.map(user => (
                {...user, ...{label: user.name + ' ' + user.lastName || '' }})
            )
            setInputs(inputsAux)
        }
    }, [dataUsers])

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
        console.log('form: ', form)
        createObject({variables: {input: form}, 
            update(cache, {data}) {
                if(!data){
                    return
                }
                try {
                    const {addProject: newObject} = data
                    console.log('newObject: ', newObject)
                    const dataListAux = [...dataList, newObject]
                    setdataList(dataListAux)
                } catch (error) {
                    console.log('error: ', error)
                }

        }})
        setShowModal(false)
    }

    const onEdit = (form) => {
        console.log('form: ', form)
        updateObject({variables: {input: form}, 
            update(cache, {data}) {
                if(!data){
                    return
                }

                try {
                    const {updateProject} = data
                    const dataListAux = dataList.map( item => {
                        if(item.id === updateProject.id) {
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