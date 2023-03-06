<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Notifications" />
        <nb-content>
            <nb-list v-if="notifications.length">
                <nb-list-item avatar noBorder class="notification-list-item" v-for="notification in notifications" :key="notification.id" button :on-press="()=>navigateNotification(notification)">
                    <nb-left class="notification-left">
                        <image :source="require('../../../assets/images/menu/chicken-biriyani.png')" class="notification-item-image" />
                    </nb-left>
                    <nb-body class="notification-body">
                        <nb-text class="kitchen-name">{{ notification.title }}</nb-text>
                        <nb-text class="notification-description">{{ notification.message }}</nb-text>
                        <nb-text class="notification-time">{{ notification.created_at | moment("MMMM Do YYYY") }}</nb-text>
                    </nb-body>
                    <!-- <nb-right class="notification-right">
                        
                    </nb-right> -->
                </nb-list-item>
            </nb-list>
            <nb-view v-else padder class="no-result">
                <nb-text class="no-result-text">No new notifications</nb-text>
            </nb-view>
        </nb-content>
        <footer-Kitchen :navigation="navigation" />
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            notifications: [],
            isLoading: false
        }
    },
    beforeMount() {
        this.getNotifications()
    },
    methods: {
        getNotifications(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication); 
            console.log('AuthStr');
            console.log(AuthStr);
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.getNotifications,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
            })
            .then(response => { 
                console.log('data')
                console.log(response.data)
                this.notifications = response.data.notification;
                this.$store.commit('setNotification', this.notifications.length)
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data) 
            }); 
        },
        navigateNotification(notification){
            if(notification.route=='KitchenOrderDetail'){
                this.navigation.navigate(notification.route, {orderId: notification.parameter})
            } else if(notification.route=='KitchenInformation'){
                this.navigation.navigate(notification.route, {slug: notification.parameter})
            }
        }
    },
}
</script>

<style>
    .notification-list-item{
        border-bottom-width: 1;
        border-bottom-color: #e8e8e8;
        margin-right: 15;
    }
    .notification-left{
        justify-content: flex-start;
        align-items: center;
    }
    .notification-item-image{
        width: 45;
        height: 45;
        resize-mode: contain;
        align-self: center;
        margin-right: 0;
    }
    .notification-body{
        margin-left: 10;
    }  
    .kitchen-name{
        font-size: 14;
        color: #000000;
        font-family: Montserrat_SemiBold;
        margin-bottom: 3;
    }
    .notification-description{
        font-family: Montserrat_Medium;
        font-size: 10;
        color: #b4b4b4;
        margin-bottom: 3;
    }
    .notification-right{
        padding-right: 0;
    }
    .notification-time{
        color: #b7b1b1;
        font-size: 10;
        font-family: Montserrat_Medium;
    }

    /* No Result */

    .no-result{
        flex: 1;
        justify-content: center;
        align-items: center;
        margin-top: 30;
    }
    .no-result-text{
        font-size: 14;
        color: #000000;
    }
</style>