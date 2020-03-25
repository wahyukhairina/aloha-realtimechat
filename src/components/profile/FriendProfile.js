import React, { Component} from 'react'
import { Text } from 'react-native'
import { db } from '../congfig/Config'

export default class FriendProfile extends Component {
    state = {
        users : []
    }
    componentDidMount (){
        this.getDetails()
    }
    getDetails () {
        const id = this.props.navigation.state.params
        db.ref('/user/' + id ).on('value', (snapshot) => {
            const user = snapshot.val()
            this.setState({
                users: user
            })
        }
            )
        }
         

    render() {
        const id = this.props.navigation.state.params
        console.log('id', id)
        return (
            <>
            <Text>{this.state.users.name}</Text>
            </>

        )
    }

} 