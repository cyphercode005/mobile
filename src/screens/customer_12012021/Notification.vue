<template>
    <nb-container>
        <header :navigation="navigation" headerTitle="Notifications" />
        <nb-content>
            <!-- <nb-list>
                <nb-list-item avatar noBorder class="notification-list-item" button :on-press="()=>{}">
                    <nb-left class="notification-left">
                        <image :source="require('../../../assets/images/menu/chicken-biriyani.png')" class="notification-item-image" />
                    </nb-left>
                    <nb-body class="notification-body">
                        <nb-text class="kitchen-name">Kitchen Name</nb-text>
                        <nb-text class="notification-description">Your order has been shipped into your address</nb-text>
                    </nb-body>
                    <nb-right class="notification-right">
                        <nb-text class="notification-time">2 minutes ago</nb-text>
                    </nb-right>
                </nb-list-item>
        
            </nb-list> -->
              <nb-view  padder class="no-result">
            <nb-text class="no-result-text">No notifications found</nb-text>
        </nb-view>

        </nb-content>
        <footer :navigation="navigation" />
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    }
}
</script>

<style>
    .notification-list-item{
        border-bottom-width: 1;
        border-bottom-color: #e8e8e8;
        margin-right: 15;
    }
    .notification-left{
        justify-content: center;
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
    /* no result */
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