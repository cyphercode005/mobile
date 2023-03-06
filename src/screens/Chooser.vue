<template>
    <nb-container>
        <nb-view class="watermark">
            <image :source="require('../../assets/images/chooser/logo-watermark.png')" class="watermark-image" />
        </nb-view>
        <nb-view class="section-choose">
            <nb-text class="chooser-head">Login as a</nb-text>
            <nb-view class="chooser-split">
                <touchable-opacity class="chooser-customer" :on-press="()=>setUserType('customer')">
                    <image :source="require('../../assets/images/chooser/customer.png')" class="chooser-icon" />
                    <nb-text class="chooser-name">User</nb-text>
                </touchable-opacity>
                <touchable-opacity class="chooser-kitchen" :on-press="()=>setUserType('kitchen')">
                    <image :source="require('../../assets/images/chooser/kitchen.png')" class="chooser-icon" />
                    <nb-text class="chooser-name">Kitchen</nb-text>
                </touchable-opacity>
            </nb-view>
        </nb-view>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

export default {
    props: {
        navigation: { Object }
    },
    mounted() {
        this.registerForPushNotificationsAsync()
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
        Notifications.addNotificationReceivedListener(this._handleNotification)
        Notifications.addNotificationResponseReceivedListener(this._handleNotification)
    },
    beforeMount(){
        // console.log(this.$store.state)
        var routeName = ''
        if(this.$store.state.splash){
            routeName = 'Splash'
        } else if(this.$store.state.userType=='customer'){
            routeName = 'customer'
        } else if(this.$store.state.userType=='kitchen'){
            routeName = 'kitchen'
        }
        if(routeName){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: routeName })]
            })
            this.navigation.dispatch(resetAction);
        } 
    },
    methods: {
        setUserType(userType){
            this.$store.commit('setUserType', userType)
            // this.$store.commit('unsetUser')
            if(userType=='customer'){
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'customer' })]
                })
                this.navigation.dispatch(resetAction);
            } else if(userType=='kitchen') {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'kitchen' })]
                })
                this.navigation.dispatch(resetAction);
            }
        },
        async registerForPushNotificationsAsync(){
            try{
                if (!this.$store.state.token){
                    if (Constants.isDevice) {
                        let { status: existingStatus } = await Notifications.getPermissionsAsync();
                        let finalStatus = existingStatus;
                        // console.warn(finalStatus)
                        if (existingStatus !== 'granted') {
                            const { status } = await Notifications.requestPermissionsAsync();
                            finalStatus = status;
                            // alert('permission')
                        }
                        if (finalStatus !== 'granted') {
                            // alert('Failed to get push token for push notification!');
                            return;
                        }
                        token = (await Notifications.getExpoPushTokenAsync()).data;
                        // alert(token)
                        this.$store.commit('setToken', {
                            token : token
                        })
                        // alert(token)
                        // console.log(token);
                    } else {
                        // alert('Must use physical device for Push Notifications');
                    }
                }
            } catch(error){
                // alert(error)
            }
        },
        _handleNotification(notification){
            if(notification.actionIdentifier){
                if(this.navigation.state.routeName==notification.notification.request.content.data.route){
                    if(notification.notification.request.content.data.route=='OrderDetail'){
                        this.$store.commit('setOrderPushNotification')
                    }
                    this.navigation.dispatch(StackActions.replace({ routeName: notification.notification.request.content.data.route, params: notification.notification.request.content.data.params }))
                } else {
                    this.navigation.navigate(notification.notification.request.content.data.route, notification.notification.request.content.data.params)
                }
            } else {
                if(this.navigation.state.routeName==notification.request.content.data.route){
                    this.navigation.dispatch(StackActions.replace({ routeName: notification.request.content.data.route, params: notification.request.content.data.params }))
                } else {
                    this.navigation.navigate(notification.request.content.data.route, notification.request.content.data.params)
                }
            }
        },
    },
}
</script>

<style>
    .section-choose{
        bottom: 0;
        position: absolute;
        left: 0;
        right: 0;
        justify-content: center;
    }
    .chooser-head{
        font-size: 16;
        color: #25282b;
        font-family: Montserrat_Medium;
        align-self: center;
    }
    .watermark{
        flex: 1;
        justify-content: center;
        align-items: center;
        margin-bottom: 130;
    }
    .watermark-image{
        height: 260;
        resize-mode: contain;
        margin-left: -30;
    }
    .chooser-icon{
        width: 83;
        height: 83;
        resize-mode: contain;
    }
    .chooser-name{
        color: #171717;
        font-size: 14;
        font-family: Montserrat_SemiBold;
        margin-top: 5;
    }
    .chooser-customer{
        flex: 1;
        justify-content: center;
        align-items: center;
        border-right-color: #d2d2d2;
        border-right-width: 1;
    }
    .chooser-kitchen{
        flex: 1;
        justify-content: center;
        align-items: center;
        border-left-color: #d2d2d2;
        border-left-width: 1;
    }
    .chooser-split{
        flex: 1;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 30;
        padding-top: 20;
    }
</style>