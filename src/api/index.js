import ApolloClient, {InMemoryCache} from 'apollo-boost'
import ProjectApi from './projects'
import UserApi from './users'

const client = new ApolloClient({
    uri: 'https://arcane-savannah-23063.herokuapp.com/graphql/',
    cache: new InMemoryCache()
})

export {client, ProjectApi, UserApi}