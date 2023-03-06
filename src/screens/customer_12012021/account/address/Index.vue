<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Saved Address" :style="{backgroundColor:'#FFFFFF', elevation:2}"/>
        <nb-content v-if="allAddress.length > 0" padder>
            <nb-view  v-for="address in allAddress" :key="address.id" class="address-list-item" padder>
                <nb-text class="address-name">{{address.name}} <nb-text class="address-type">( {{address.address_type == 0 ? 'Home' : address.address_type == 1 ? 'Work' : 'Other'}})</nb-text></nb-text>
                <nb-text class="address-detail">{{address.address_line1}}, {{address.address_line2}}, {{address.landmark}}, {{address.street_name}}, {{address.locality}}, {{address.city}}, {{address.state}}, {{address.country}}, {{address.postcode}}</nb-text>
                <nb-text class="address-phone">Phone: {{address.phone}}</nb-text>
                <nb-view class="address-buttons">
         
                    <touchable-opacity :on-press="()=> deleteAddressConfirmation(address.id) " class="button-delete">
                        <nb-text class="address-button-delete">Delete</nb-text>
                    </touchable-opacity>
                    <touchable-opacity :on-press="()=> editAddressConfirmation(address.id)" class="button-edit">
                        <nb-text class="address-button-edit">Edit</nb-text>
                    </touchable-opacity>
                </nb-view>
            </nb-view>
          
        </nb-content>
        <nb-content padder  v-else >
            <nb-view class="no-result">
                <nb-text class="no-result-text">No Saved Address Found</nb-text>
            </nb-view>
        </nb-content>
        <nb-button block class="full-width-button" :on-press="()=> { navigation.navigate('AddAddress') }"><nb-text class="full-width-button-text">Add New Address</nb-text></nb-button>
    </nb-container>
</template>

<script>
import { Alert } from "react-native";
import { Toast } from 'native-base'
export default {
    props: {
        navigation: { Object }
    },
    
    data() {
        return {
            allAddress:'',
            authToken:this.$store.state.user.authentication,
            isLogged:this.$store.state.user.loggedIn,
            isLoading: false
        }
    },
    
    methods: {
        deleteAddress(addressId){
            var status = true;
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.deleteAddress,
                data :{address_id:addressId},
                headers: { 'Content-Type': 'application/json',
                        'Authorization':AuthStr },   
                    })
            .then(response => { 
                this.allAddress = response.data.address;
                console.log(this.allAddress)
                if(this.allAddress.length==0)
                {
                    console.log('addressnull')
                    this.$store.commit('user/unsetDeliveryAddress')
                }
                Toast.show({
                    text: "Address Deleted Successfully",
                    duration: 3000
                }); 
            })
            .catch(error => {
                console.log(error.response.data);
            }) 
            return status
        },
      
        editAddressConfirmation(addressId){
            Alert.alert(
                "Confirm",
                "Do you want to edit address?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"), style: "cancel"
                    },
                    { 
                        text: "OK", onPress: () => {this. navigation.navigate('EditAddress',{addressId:addressId})}
                    }
                ],
                { cancelable: false }
            );
        },
        deleteAddressConfirmation(addressId){
            Alert.alert(
                "Confirm",
                "Do you want to delete address?",
                [
                    {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"), style: "cancel"
                    },
                    { 
                        text: "OK", onPress: () => {this. deleteAddress(addressId)}
                    }
                ],
                { cancelable: false }
            );
        }
    },
    beforeMount() {
        const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
        var status = true;
        this.isLoading = true
        this.api.create({
            method: 'GET',
            url: this.api.routes.address,
            headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
        })
        .then(response => { 
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
}
</script>

<style>
    .address-list-item{
        border-radius: 4;
        border-color: #e6e6e6;
        border-width: 1;
        margin-bottom: 5;
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
    /* .full-width-button{
        background-color: #312045;
        height: 42;
        border-radius: 0;
    }
    .full-width-button-text{
        color: #FFFFFF;
        font-size: 14;
    } */

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