import {gql} from 'apollo-boost'

const UserApi = {
    getUsers: () => {
        const query = gql`
            query getUsers {
                users {
                    id
                    name
                    lastName
                    age
                    projects {
                        id
                        name
                    }
                }
            }
        `
        return query
    }, 
    getUsersWOProjects: () => {
        const query = gql`
            query getUsers {
                users {
                    id
                    name
                    lastName
                    age
                }
            }
        `
        return query
    }, 
    addUser: () => {
        const query = gql`
            mutation addUser($input: UserInput!){
                addUser(user: $input) {
                    id
                    name
                    lastName
                    age
                    projects {
                        id
                        name
                    }
                }
            }
        `
        return query
    },
    updateUser: () => {
        const query = gql`
            mutation updateUser($input: UserInput!){
                updateUser(user: $input) {
                    id 
                    name
                    lastName
                    age
                    projects {
                        id
                        name
                    }
                }
            }
        `
        return query
    },
    deleteUser: () => {
        const query = gql`
            mutation deleteUser($id: String!) {
                deleteUser(id: $id)
            }
        `
        return query
    }
}

export default UserApi