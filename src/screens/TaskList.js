import React, {Component} from 'react'
import {View, 
        Text, 
        ImageBackground, 
        StyleSheet, 
        FlatList, 
        TouchableOpacity, 
        Platform,
        Alert} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Icon3 from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/Feather'
import moment from 'moment'
import 'moment/locale/pt-br'
import AsyncStorage from "@react-native-community/async-storage"
import axios from  'axios'
import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'

import { server, showError} from '../common'
import Task from '../components/Task'
import AddTask from './Add.Task'
import commonStyles from '../commonStyles'

const initialSatte = { 
    showDoneTasks:true,                    
    showAddTask:false,                    
    visibleTasks : [],
    tasks : []
        }

export default class TaskList extends Component{
    state = {
        ...initialSatte
    }

    toggleFilter = () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks)

    }

    toggleTask = async (taskId) => {
        try{
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
           
        }catch(e){
            showError(e)
        }

       
    }

    addtask = async (newTask) => {
        if(!newTask.desc || !newTask.desc.trim()){
            Alert.alert( 'Dados Invalidos' , 'Descrição não informada!')
            return
        }

        try{
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })

            this.setState({showAddTask: false}, this.loadTasks)

        }catch(e){
            showError(e)
        }


    }
    loadTasks = async () => {
        try{
            const maxDate = moment().add({days: this.props.dasyAhead}).format('YYYY-MM-DD 23:59:59')

            const res = await axios.get(`${server}/tasks?date=${maxDate}`)

            this.setState({tasks : res.data}, this.filterTasks)

        }catch(e){
            showError(e)
        }
    }
    componentDidMount = async()=> {

       const stateString = await AsyncStorage.getItem('tasksState')
       const ssavedState =  JSON.parse(stateString) || initialSatte
       this.setState({
           showDoneTasks: ssavedState.showDoneTasks
       }, this.filterTasks)
       this.loadTasks( )
    }

    filterTasks = () => {
        let visibleTasks = null

        if(this.state.showDoneTasks) {
            visibleTasks = [...this.state.tasks]
        }else {
            const pending = task => task.doneAt ===null
            visibleTasks = this.state.tasks.filter(pending)
        }

        this.setState({visibleTasks})
        AsyncStorage.setItem('tasksState', JSON.stringify({
            showDoneTasks: this.state.showDoneTasks
        }))
    }
    deleteTask = async taskId => {
        try{
            await axios.delete(`${server}/tasks/${taskId}`)
           this.loadTasks()

        }catch(e){
            showError(e)
        }
        
    }

    getImage = () => {
        switch(this.props.dasyAhead){
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }
    getColor = () => {
        switch(this.props.dasyAhead){
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }
    render() {
        //Contruindo o data
        const today = moment().locale('pt-br').format('ddd, D [de] MMM')
        return(
            <View style ={styles.container}>
                <AddTask isVisible = {this.state.showAddTask}
                          onCancel= {() =>this.setState({showAddTask: false})}
                          onSave = {this.addtask}/>
                <ImageBackground 
                source = {this.getImage()}
                style = {styles.backgroud}>
                    <View style = {styles.iconBar}>
                    <TouchableOpacity onPress ={()=> this.props.navigation.openDrawer()}>
                            <Icon2 name= 'menu'
                                size = {20} 
                                color = {commonStyles.colors.secundary}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress ={this.toggleFilter}>
                            <Icon2 name= {this.state.showDoneTasks ? 'eye': 'eye-off'} 
                                size = {20} color = {commonStyles.colors.secundary}/>
                        </TouchableOpacity>
                     </View>
                    <View style ={styles.titleBar}>
                        <Text style ={styles.title}>{this.props.title}</Text>
                        <Text style = {styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style = {styles.taskList}>
                    <FlatList
                    data = {this.state.visibleTasks}
                    keyExtractor = {item => `${item.id}`}
                    renderItem = {({item}) => <Task {...item} onToggleTask = {this.toggleTask} onDelete = {this.deleteTask}/>}/>
                </View>
                <TouchableOpacity style = {[styles.addButton, { backgroundColor: this.getColor()}]}
                    onPress = {() => this.setState({showAddTask:true})}
                    activeOpacity ={0.7}>
                    <Icon3 name ='ios-add' size= {30} 
                        color = {commonStyles.colors.secundary}/>
                </TouchableOpacity>
            </View>
        )
    }

}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    backgroud: {
        flex: 3
    },
    taskList : {
        flex: 7
    },
    titleBar : {
        flex: 1,
        justifyContent: 'flex-end'
    },
    title : {
        fontFamily: commonStyles.fontFamily,
        fontSize: 50,
        color : commonStyles.colors.secundary,
        marginLeft: 20,
        marginBottom: 20
    },
    subtitle : {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color : commonStyles.colors.secundary,
        marginLeft: 20,
        marginBottom: 20
    },
    iconBar : {
        flexDirection: 'row',
        marginHorizontal: 20,
        justifyContent: 'space-between',
        marginTop: Platform.OS === 'ios' ? 40: 10
    },
    addButton : {
        position : 'absolute',
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    }
})