import {Switch, Route} from 'react-router-dom'
import './SideBarStyle.scss'
export default () => {
    return <div className="d-flex justify-contents-center pl-0 ml-0 mr-3" style={{height: '100vh'}}>
        <ul class="nav flex-column nav-items " style={{backgroundColor: '#755187', marginTop: '10vh' , height: 'fit-content', borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>
            <li class="nav-item pt-2 ">
                <p class="nav-link text-white font-weight-bold mb-0">Menu</p>
            </li>
            <li class="nav-item">
                <a class="nav-link text-light" href="/projects">Projectos</a>
            </li>
            <li class="nav-item pb-1">
                <a class="nav-link text-light" href="/users">Usuarios</a>
            </li>
        </ul>
    </div>
}