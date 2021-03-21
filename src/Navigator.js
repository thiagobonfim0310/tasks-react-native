import React from 'react'
import {createAppContainer, 
        createSwitchNavigator,} from'react-navigation'
import  {createDrawerNavigator} from'react-navigation-drawer'

import AuthOrApp from './screens/AuthOrApp'
import Menu from './screens/Menu.js'
import Auth from './screens/Auth'
import TaskList from './screens/TaskList'

import commonStyles from './commonStyles'


const menuConfig = {
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize:20
        },
        activeLabelStyle: {
            color: '#080',
            fontWeight: 'bold',

        }
    }
}
const menuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <TaskList title = 'Hoje' 
                        {...props}
                        dasyAhead = {0}/>,
        navigationOptions: {
            title: 'Hoje'
        }
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <TaskList title = 'Amanhã' 
                        {...props}
                        dasyAhead = {1}/>,
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <TaskList title = 'Semana' 
                        {...props}
                        dasyAhead = {7}/>,
        navigationOptions: {
            title: 'Semana'
        }
    },
    Mouth: {
        name: 'Mouth',
        screen: props => <TaskList title = 'Mês' 
                        {...props}
                        dasyAhead = {30}/>,
        navigationOptions: {
            title: 'Mês'
        }
    },
}

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig)


const mainRoutes = {
    AuthOrApp: {
        name :'AuthOrApp',
        screen: AuthOrApp
    },
    Auth : {
        name : 'Auth',
        screen: Auth
    },
    Home : {
        name : 'Home',
        screen: menuNavigator
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName:'AuthOrApp'
})

export default createAppContainer(mainNavigator)