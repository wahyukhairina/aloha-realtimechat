import React, {Component} from 'react'
import MapView from 'react-native-maps';
import { Text } from 'react-native'
import GetLocation from 'react-native-get-location'
import { db, auth } from '../congfig/Config'
export default class Maps extends Component {
    state ={
        user : []
    }
    
    async componentDidMount(){
       this.getLocation()
       
        // GetLocation.getCurrentPosition({
        //     enableHighAccuracy: true,
        //     timeout: 15000,
        // })
        // .then(location => {
        //     console.log(location);
        // })
        // .catch(error => {
        //     const { code, message } = error;
        //     console.warn(code, message);
        // })
    }

    getLocation (){
        db.ref('/user').on('value', (snapshot) => {
            const current_user = auth.currentUser.uid
            const data = snapshot.val()
            const user = Object.values(data)
            this.setState({
                user : user})
        })

    }
    render(){
        const marker = this.state.user.map((item) =>  <MapView.Marker
        coordinate={{
            latitude: item.latitude,
            longitude: item.longitude,
        }}
        title={item.name}
        description="Hello" />
        ) 
        return (
            <>
            <MapView
                style={{ flex: 1, width: window.width }} //window pake Dimensions
                region={{
                    latitude: -6.1750,
                    longitude: 106.8283,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421 
                }} >
                {marker}
             </MapView>
             </>
        )
    }
}
