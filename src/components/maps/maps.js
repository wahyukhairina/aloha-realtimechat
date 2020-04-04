import React, {Component} from 'react'
import MapView from 'react-native-maps';
import { db, auth } from '../congfig/Config'
export default class Maps extends Component {
    state ={
        user : []
    }
    
    async componentDidMount(){
       this.getLocation()
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
        description={item.status} />
        ) 
        return (
            <>
            <MapView
                style={{ flex: 1, width: window.width }} //window pake Dimensions
                region={{
                    latitude: -6.1750,
                    longitude: 106.8283,
                    latitudeDelta: 20.0922,
                    longitudeDelta: 20.5421 
                }} >
                {marker}
             </MapView>
             </>
        )
    }
}
