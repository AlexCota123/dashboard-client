import ApolloClient, {InMemoryCache, } from 'apollo-boost'
import ProjectApi from './projects'
import UserApi from './users'

const client = new ApolloClient({
    // uri: 'https://arcane-savannah-23063.herokuapp.com/graphql/',
    uri: 'http://localhost:5000/graphql/',
    cache: new InMemoryCache({
        addTypename: false
    })
})

export {client, ProjectApi, UserApi}