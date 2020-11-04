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
                }
            }
        `
        return query
    }
}

export default UserApi