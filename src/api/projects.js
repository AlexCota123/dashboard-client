import {gql} from 'apollo-boost'
import {useQuery} from '@apollo/react-hooks'
import React from 'react'

const ProjectApi = {
    getProjects: () => {
        const query = gql`
            query getProjects {
                projects {
                    id
                    name
                    description
                    users {
                        id
                        name
                        lastName
                    }
                }
            }
        `
        return query
    },
    getProjectsWOUsers: () => {
        const query = gql`
            query getProjects {
                projects {
                    id
                    name
                    description
                }
            }
        `
        return query
    },
    getProject: (id) => {
        const query = gql`
            query getProject($id: ID) {
                project(id: $id) {
                    id
                    name
                    description
                }
            }
        `
        return  query
    },
    addProject: () => {
        const query = gql`
            mutation addProject($input: ProjectInput!) {
                addProject(project: $input ) {
                    id
                    name
                    description
                } 
            }
        `
        return query
    },
    updateProject: () => {
        const query = gql`
            mutation updateProject($input: ProjectInput!) {
                updateProject(project: $input) {
                    id
                    name
                    description
                    users {
                        id
                        name
                        lastName
                    }
                }
            }
        `
        return query
    },
    deleteProject: () => {
        const query = gql`
            mutation deleteProject($id: String!) {
                deleteProject(id: $id)
            }
        `
        return query
    }
}

export default ProjectApi