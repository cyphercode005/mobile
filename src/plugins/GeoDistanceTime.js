import Config from '@/constants/Config'
import axios from 'axios';

var distanceInKm = ''
var timeDuration = ''

function getGoogleDirection (sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude) {
    var url = 'https://maps.googleapis.com/maps/api/directions/json?origin='+sourceLatitude+','+sourceLongitude+'&destination='+destinationLatitude+','+destinationLongitude+'&key='+Config.googleApiKey
    return axios.get(
        url
    )
    .then(response => {
        distanceInKm = parseFloat(response.data.routes[0].legs[0].distance.text) * 1.609344
        timeDuration = parseFloat(response.data.routes[0].legs[0].duration.text)
    })
    .catch(error => {
        console.log(error)
    })
}

function GeoDistanceTime(sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude){
    getGoogleDirection(
        sourceLatitude, sourceLongitude, destinationLatitude, destinationLongitude
    )
    .then((response) => {
        return response
    })
    .catch(error => {
        console.log("Request error: ", error)
    })
    return {distanceInKm: distanceInKm, timeDuration: timeDuration}
}

export default GeoDistanceTime