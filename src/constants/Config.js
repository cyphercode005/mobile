
import { Dimensions, Platform } from 'react-native'

export default {
    imageUrl: '',
    appName: 'Grozapp',
    payment: {
        clientId: '3023839593dcf067adc12efa583203',
        clientSecret: 'a487b594cf3cfcab6f6b502d621057aac5f40d81',
        currency: 'INR',
        testMode: false,
    },
    platform: Platform.OS,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    googleApiKey: 'AIzaSyDv4tbjxizDdu5cz9alkaGdWZydkkf55BQ'
}
