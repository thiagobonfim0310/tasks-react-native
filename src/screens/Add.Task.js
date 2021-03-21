import React, {Component} from'react'
import {Modal,
        Platform, 
        Text,
        View,
        TouchableOpacity,
        TextInput,
        StyleSheet,
        TouchableWithoutFeedback} from 'react-native'
import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'
import commonStyles from '../commonStyles'

const initialSatte = { desc: '', date : new Date (), showDatePicker: false}
export default class AddTask extends Component {

    state = {
        ...initialSatte
        
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date :this.state.date
        }
        this.props.onSave && this.props.onSave(newTask)
        this.setState({...initialSatte})
    }
    getDatePiker = () => {
        let datePicker = <DateTimePicker
        value = {this.state.date}
        onChange = {(_, date) => this.setState({date: date, showDatePicker: false})}
        mode ='date'/>
        const dateString = moment(this.state.date).format('ddd, D [de] MMM [de] YYYY')
        if(Platform.OS ==='android'){
            datePicker = (
                <View>
                    <TouchableOpacity onPress = {() => this.setState({showDatePicker: true})}>
                        <Text style ={styles.date}>
                            {dateString}
                        </Text>

                    </TouchableOpacity>

                    {this.state.showDatePicker && datePicker}
                </View>
            )
        }
        return datePicker
    }

    render(){
        return(
            <Modal transparent ={true} visible ={this.props.isVisible}
                onRequestClose = {this.props.onCancel}
                animationType ='slide'>
                <TouchableWithoutFeedback onPress = {this.props.onCancel}>
                    <View style ={styles.background}/>
                </TouchableWithoutFeedback>
                <View style ={styles.container}>
                    <Text style= {styles.header}>Nova Tarefa</Text>
                    <TextInput style = {styles.input}
                            placeholder = 'Informe a Descrição...'
                            onChangeText={desc => this.setState({desc:desc})}
                            value= {this.state.desc}/>
                    {this.getDatePiker()}

                    <View style= {styles.buttons}>

                        <TouchableOpacity onPress = {this.props.onCancel}>
                            <Text style= {styles.button}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress = {this.save}>
                            <Text style= {styles.button}>Salvar</Text>
                        </TouchableOpacity>

                    </View>
                </View>
                <TouchableWithoutFeedback onPress = {this.props.onCancel}>
                    <View style ={styles.background}/>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
}

const styles =StyleSheet.create({
    background : {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    container : {
     
        backgroundColor: "#FFF"
    },
    header : {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secundary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18
    },
    input: {
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 6


        
    },
    buttons : {
        flexDirection: 'row',
        justifyContent: 'flex-end'

    },
    button : {
        margin: 20,
        marginRight: 30,
        color : commonStyles.colors.today


    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginLeft: 15
    }
    
})