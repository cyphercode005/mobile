<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Saved Addresses" :style="{backgroundColor:'#FFFFFF', elevation:2}"/>
        <nb-content v-if="allAddress.length>0" padder>
            <nb-view v-for="address in allAddress" :key="address.id">
                <touchable-opacity class="address-list-item" :on-press="()=>selectAddress(address.id)" :disabled="geoDistance($store.state.cart.kitchen.latitude,$store.state.cart.kitchen.longitude, address.latitude, address.longitude,'K') > 5">
                    <nb-view class="address-left">
                        <nb-text class="address-name">{{address.name}}</nb-text>
                        <nb-text class="address-detail">{{address.address_line1}}, {{address.address_line2}}, {{address.landmark}}</nb-text>
                        <nb-text class="address-phone">Phone: {{address.phone}}</nb-text>
                        <nb-text class="no-delivery" v-if="geoDistance($store.state.cart.kitchen.latitude,$store.state.cart.kitchen.longitude, address.latitude, address.longitude,'K') > 5">Can't deliver to this address</nb-text>
                    </nb-view>
                    <image :source="require('../../../../assets/images/icons/agent-selected.png')" class="address-selected" v-if="deliveryAddress==address.id"/>
                    <nb-view v-else class="address-select"></nb-view>
                </touchable-opacity>
            </nb-view>
        </nb-content>
        <nb-view v-else padder class="no-result">
            <nb-text class="no-result-text">No Addresses Found</nb-text>
        </nb-view>
        <nb-button block class="full-width-button" :on-press="()=> {navigate()}"><nb-text class="full-width-button-text">Add New Address</nb-text></nb-button>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
export default {
    props: {
        navigation: { Object }
    },
    
    data() {
        return {
            allAddress:'',
            deliveryAddress: this.$store.state.user.deliveryAddress ? this.$store.state.user.deliveryAddress : '',
            isLoading: false
        }
    },

    mounted(){
        this.willFocusSubscription = this.navigation.addListener(
            'willFocus',
            () => {
                this.getAddresses()
            }
        );
    },
    unmounted() {
        this.willFocusSubscription.remove();
    },

    beforeMount() {
        this.getAddresses()
    },
    
    methods: {
        getAddresses(){
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.isLoading = true
            var status = true;
            this.api.create({
                method: 'GET',
                url: this.api.routes.address,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
            })
            .then(response => { 
                console.log('co-ordinates');
                console.log(this.$store.state.cart.kitchen.latitude);
                console.log(this.$store.state.cart.kitchen.longitude);
                console.log(response.data);
                this.allAddress=response.data.address;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
            return status
        },
        selectAddress(addressId){
            this.deliveryAddress = addressId
            this.$store.commit('user/setDeliveryAddress', addressId)
            this.navigation.goBack()
        },
        navigate(){
            var routeName = 'CheckoutAddress'
            this.navigation.navigate('AddAddress',{routeName: routeName})
        }
    },
}
</script>

<style>
    .address-list-item{
        border-radius: 4;
        border-color: #e6e6e6;
        border-width: 1;
        margin-bottom: 5;
        padding: 10;
        flex-direction: row;
        align-items: center;
    }
    .address-name{
        color: #434343;
        font-size: 14;
        margin-bottom: 3;
    }
    .address-type{
        color: #8d8d8d;
        font-size: 12;
    }
    .address-detail{
        color: #838383;
        font-size: 12;
        margin-bottom: 6;
    }
    .address-phone{
        color: #838383;
        font-size: 12;
    }
    .address-buttons{
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 10;
    }
    .address-button-delete{
        font-size: 12;
        color: #312045;
    }
    .address-button-edit{
        font-size: 12;
        color: #f01a1a;
    }
    .button-delete{
        margin-right: 15;
    }
    .button-edit{
        margin-left: 15;
    }

    .address-selected{
        height: 22;
        width: 22;
    }
    .address-select{
        height: 18;
        width: 18;
        background-color: #eeeeee;
        border-radius: 30;
        z-index: 999;
    }
    .address-left{
        flex: 1;
    }
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
    .no-delivery{
        color: #f01a1a;
        font-size: 10;
    }

</style>