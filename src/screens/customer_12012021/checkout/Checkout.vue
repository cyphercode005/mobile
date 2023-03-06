<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation"  headerTitle="Bucket" />
        <nb-content padder>
            <touchable-opacity class="delivery-address-section" v-if="deliveryType=='delivery' || deliveryType=='partner'">
                <image :source="require('../../../../assets/images/icons/location-filled.png')" class="delivery-location-icon" />
                <nb-view class="delivery-detail">
                    <nb-view class="delivery-head">
                        <nb-text class="delivery-name">Delivery Address</nb-text>
                        <touchable-opacity :on-press="()=>{ $store.state.user.authentication?navigation.navigate('CheckoutAddress'):navigation.navigate('Verify') }">
                            <nb-text class="change-address">Change</nb-text>
                        </touchable-opacity>
                    </nb-view>
                    <nb-text v-if="$store.state.user.deliveryAddress"  class="delivery-address">{{ address }}</nb-text>
                    <nb-text v-if="!$store.state.user.deliveryAddress" class="delivery-address">{{ $store.state.selectedLocation.address }}</nb-text>
                </nb-view>
            </touchable-opacity>
            <touchable-opacity class="delivery-address-section" v-if="deliveryType=='pickup'">
                <image :source="require('../../../../assets/images/icons/location-filled.png')" class="delivery-location-icon" />
                <nb-view class="delivery-detail">
                    <nb-text class="delivery-name">Pickup Address</nb-text>
                    <nb-text class="delivery-address">{{ $store.state.cart.kitchen?$store.state.cart.kitchen.name.en+','+$store.state.cart.kitchen.address_line_1+','+ $store.state.cart.kitchen.address_line_2+', '+$store.state.cart.kitchen.street_name+', '+$store.state.cart.kitchen.city+', '+$store.state.cart.kitchen.postcode:'No Address Found'}}</nb-text>
                </nb-view>
            </touchable-opacity>
            <!-- <nb-text>This kitchen does not deliver to your address</nb-text> -->
            <nb-view class="cart-head-section">
                <nb-text class="cart-head">Cave Bucket</nb-text>
                <touchable-opacity class="add-button" :on-press="()=>{navigation.navigate('Home')}">
                    <nb-text class="add-button-text">+Add More</nb-text>
                </touchable-opacity>
            </nb-view>
            <nb-list class="cart-list" v-if="cartCount>0">
                <nb-list-item  class="cart-item" v-for="cart in carts" :key="cart.id" >
                    <nb-body>
                        <nb-text class="cart-item-name">{{cart.name}}</nb-text>
                        <nb-text class="cart-item-description">Item Price: ₹{{parseFloat(cart.price).toFixed(2)}}</nb-text>
                    
                        <nb-text v-if="cart.message" class="cart-item-error">{{cart.message}}</nb-text>
                    </nb-body>
                    <nb-right :style="{marginRight:-15}">
                        <input-spinner ref="spinner" 
                            :width=75 
                            :height=25 
                            :buttonFontSize=16
                            :rounded=false
                            :editable=false
                            :disabled=false
                            :initialValue="cart.qty"
                            :value="cart.qty"
                            :style="{alignSelf:'center',marginTop:0}"
                            :buttonStyle="{width:25, height:25, marginalignSelf:'center', borderWidth:1, borderRadius:5, borderColor:'#fcbe00',fontSize:10, fontFamily:'Montserrat_SemiBold', alignItems:'center', justifyContent:'center', paddingTop:0}"
                            :step=1
                            :on-change="(num) => { changeQty(num,cart.id,cart.rowId) }"
                            :max=cart.options.currentQty
                            :inputStyle="{color:'#000000', fontSize:12, fontFamily:'Montserrat_SemiBold'}"
                            buttonFontFamily="Montserrat_SemiBold"
                            fontFamily="Montserrat_Regular"
                            color="transparent"
                            buttonTextColor="#000000"
                            colorPress="#fcbe00"
                            buttonPressTextColor="#FFFFFF" />
                            <nb-text class="cart-item-price" >₹{{(parseFloat(cart.price)*parseFloat(cart.qty)).toFixed(2)}}</nb-text>
                    </nb-right>
                </nb-list-item>
            </nb-list>
            <nb-view class="no-result" v-else >
                <nb-text class="no-result-text">Cart is empty</nb-text>
            </nb-view>
            <nb-view class="cart-head-section" v-if="cartCount>0">
                <nb-text class="cart-head">Delivery Agent</nb-text>
            </nb-view>
            <nb-view class="delivery-agent-section" v-if="cartCount>0">
                <touchable-opacity  :class="deliveryType=='pickup'? 'delivery-agent-selected': 'delivery-agent'" :on-press="()=>setDeliveryType('pickup')">
                    <nb-text :class="deliveryType=='pickup'? 'delivery-agent-selected-text': 'delivery-agent-text'">Pickup</nb-text>
                    <image :source="require('../../../../assets/images/icons/agent-selected.png')" class="agent-selected" v-if="deliveryType=='pickup'"/>
                    <nb-view v-else class="agent-select"></nb-view>
                </touchable-opacity>
                <touchable-opacity :disabled="kitchenDeliveryStatus==0" :class="deliveryType=='delivery'? 'delivery-agent-selected': 'delivery-agent'" :on-press="()=>setDeliveryType('delivery')">
                    <nb-text :class="deliveryType=='delivery' ? 'delivery-agent-selected-text': 'delivery-agent-text'">Delivery</nb-text>
                    <image :source="require('../../../../assets/images/icons/agent-selected.png')" class="agent-selected" v-if="deliveryType=='delivery'"/>
                    <nb-view v-else class="agent-select"></nb-view>
                </touchable-opacity>
                <touchable-opacity :class="deliveryType=='partner'? 'delivery-agent-selected': 'delivery-agent'" :on-press="()=>setDeliveryType('partner')">
                    <nb-text :class="deliveryType=='partner' ? 'delivery-agent-selected-text': 'delivery-agent-text'">D Partner</nb-text>
                    <image :source="require('../../../../assets/images/icons/agent-selected.png')" class="agent-selected" v-if="deliveryType=='partner'"/>
                    <nb-view v-else class="agent-select"></nb-view>
                </touchable-opacity>
            </nb-view>

            <nb-view class="cart-summary" v-if="cartCount>0">
                <nb-text class="cart-head">Bill Details</nb-text>
                <nb-list>
                    <nb-list-item noBorder class="cart-summary-item">
                        <nb-left>
                            <nb-text class="cart-summary-item-head">Item Total</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="cart-summary-item-price">₹{{parseFloat(cartTotal).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                    <nb-list-item noBorder class="cart-summary-item" v-if="couponDiscount">
                        <nb-left>
                            <nb-text class="cart-summary-item-head">Coupon Discount</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="cart-summary-item-price">₹{{parseFloat(couponDiscount).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                    <nb-list-item noBorder class="cart-summary-item" v-if="deliveryCharge!=0 && deliveryType=='partner'">
                        <nb-left>
                            <nb-text class="cart-summary-item-head">Delivery Charge</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="cart-summary-item-price">₹{{parseFloat(deliveryCharge).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                    <nb-view class="seperator"></nb-view>
                    <nb-list-item noBorder class="cart-summary-item">
                        <nb-left>
                            <nb-text class="cart-summary-item-total">Grand Total</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="cart-summary-item-total">₹{{parseFloat(grandTotal).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                </nb-list>
            </nb-view>
            <nb-view class="coupon-section" v-if="cartCount>0 && $store.state.user.authentication">
                <nb-view class="coupon-head" v-if="!coupon.discount">
                    <nb-text class="coupon-head-text">Do you have any Coupon ? </nb-text>
                    <touchable-opacity class="coupon-head-button" :on-press="()=>{navigation.navigate('Coupon')}">
                        <nb-text class="coupon-head-button-text">Lets use it </nb-text>
                    </touchable-opacity>
                </nb-view>
                <nb-view class="split-coupon">
                    <nb-view class="coupon-code">
                        <nb-input :value="$store.state.checkout.coupon.couponCode" disabled class="coupon-code-input" v-if="$store.state.checkout.coupon.discount"/>
                        <nb-input v-else v-model="couponCode" :disabled="coupon.discount" class="coupon-code-input" />
                    </nb-view>
                    <touchable-opacity  v-if="$store.state.checkout.coupon.discount" :on-press="removeCoupon" class="coupon-button"><nb-text class="coupon-button-text">Remove</nb-text></touchable-opacity>
                    <touchable-opacity  v-else :on-press="applyCoupon" class="coupon-button"><nb-text class="coupon-button-text">Apply</nb-text></touchable-opacity>
                </nb-view>
            </nb-view>
        </nb-content>
        <nb-view class="footer">
            <nb-view class="cart-price">
                <nb-text class="quantity">{{cartCount}} Item</nb-text>
                <nb-text class="price">₹{{parseFloat(grandTotal).toFixed(2)}}</nb-text>
            </nb-view>
            <touchable-opacity v-if="cartCount>0" class="proceed-button" :on-press="()=>{proceedPayment()}">
                <nb-text></nb-text>
                <nb-text class="proceed-button-text">Proceed to Pay</nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="proceed-button-icon" />
            </touchable-opacity>
        </nb-view>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
import { Toast } from 'native-base'
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            carts:this.$store.state.cart.cart,
            cartCount:this.$store.state.cart.cartCount,
            cartTotal:this.$store.state.cart.cartTotal,
            search: '',
            qty:1,
            note:'',
            additional:'',
            couponCode:'',
            couponDiscount:0,
            deliveryCharge:0,
            coupon:this.$store.state.checkout.coupon,
            address:'',
            deliveryType: this.$store.state.checkout.deliveryType ? this.$store.state.checkout.deliveryType : 'pickup',
            kitchenDeliveryStatus:0,
            grandTotal:this.$store.state.cart.cartTotal,
            isLoading: false
        }
    },

    beforeMount(){
        // this.$store.commit('checkout/unsetCouponDiscount')
        if(this.$store.state.user.loggedIn){
            this.getAddress()
            this.getCartDetails()
        }
    },
    methods:{
        getAddress() {  
            var status=true;
            if(this.$store.state.user.authentication){
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.getAddressById,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization':AuthStr 
                    },
                    data: {addressId : this.$store.state.user.deliveryAddress}
                })
                .then(response => { 
                    this.address = response.data.address.name+', '+response.data.address.address_line_1+', '+response.data.address.address_line_2
                })
                .catch(error => {
                    console.log(error.response.data);
                })
            }
            return status;
        },
        getCartDetails() {
            // console.log($store.state.cart);
            this.isLoading = true
            var status=true;
            if(this.$store.state.user.loggedIn){
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.cartList,
                    headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                    data:{
                        latitude: this.$store.state.selectedLocation.coords.latitude,
                        longitude: this.$store.state.selectedLocation.coords.longitude
                    }
                })
                .then(response => { 
                    console.log(response.data)
                    this.carts=response.data.cart
                    this.cartCount=response.data.cart_count;
                    this.cartTotal=response.data.cart_total;
                    this.grandTotal = this.cartTotal;
                    if(this.$store.state.checkout.coupon.couponCode){
                        this.couponDiscount=this.$store.state.checkout.coupon.discount
                        this.couponCode = this.$store.state.checkout.coupon.couponCode
                    
                    if(this.couponDiscount>0 && this.cartCount)
                        this.grandTotal = this.cartTotal - parseFloat(this.couponDiscount).toFixed(2)
                    }
                    this.getKitchenDelivery()
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                })
            }
            return status;
        },
        getKitchenDelivery(){
            var status=true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.getKitchenDeliveryType,
                headers: { 'Content-Type': 'application/json'},
                data: {kitchenId : this.$store.state.cart.kitchen.id}
            })
            .then(response => { 
                console.log(response.data)
                this.kitchenDeliveryStatus=response.data.status
                this.deliveryCharge=response.data.deliveryCharge
                if(this.$store.state.checkout.deliveryType=='partner'){
                    this.grandTotal=parseFloat(this.cartTotal)-parseFloat(this.couponDiscount)+parseFloat(this.deliveryCharge)
                }
            })
            .catch(error => {
                console.log(error.response.data);
            })
            return status;
        },
        proceedPayment(){
            if(this.$store.state.user.authentication){
                if(this.deliveryType=='partner'){
                    this.$store.commit('checkout/setDeliveryCharge',this.deliveryCharge);
                }
                /* if(this.deliveryType!='pickup'){
                    if(this.carts.filter(x => x.statusId === 2).length>0||this.carts.filter(x => x.statusId === 1).length>0){
                        alert('Some Items are not available now please update cart and continue !' )
                    }
                } */
                if(this.carts.filter(x => x.statusId === 2).length>0||this.carts.filter(x => x.statusId === 1).length>0){
                    alert('Some Items are not available now please update cart and continue !' )
                } else {
                    if(this.$store.state.user.deliveryAddress){
                        this.checkout()
                    } else {
                        this.navigation.navigate('CheckoutAddress',{routeName:'Checkout'})
                    }
                }
            } else {
                this.navigation.navigate('Verify',{routeName:'Checkout'});
            }
        },
        checkout(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'POST',
                url: this.api.routes.checkoutStore,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                data:{
                    deliveryCharge:this.deliveryCharge,
                    deliveryType:this.$store.state.checkout.deliveryType,
                    kitchen_id:this.$store.state.cart.kitchen.id,
                    coupon_code:this.$store.state.checkout.coupon ? this.$store.state.checkout.coupon.couponCode : '',
                    shipping_address:this.$store.state.user.deliveryAddress,
                    payment_method:'Online'
                }
            })
            .then(response => { 
                this.navigation.navigate('Payment', {orderId: response.data.orderId});
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error)
                console.log(error.response.data);
            })
        },
        setDeliveryType(deliveryType){
            this.deliveryType = deliveryType
            this.$store.commit('checkout/setDeliveryType',deliveryType);
            
            if(deliveryType=='partner'){
                this.grandTotal=parseFloat(this.cartTotal)-parseFloat(this.couponDiscount)+parseFloat(this.deliveryCharge)
            } else {
                this.grandTotal=parseFloat(this.cartTotal)-parseFloat(this.couponDiscount)
            }
        },
        changeQty(qty,Id='',rowId='') {
            this.isLoading = true
            if(this.$store.state.user.authentication) {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.cartUpdateQuantity,
                    headers: {'Content-Type': 'application/json','Authorization':AuthStr },
                    data:{rowId:rowId,quantity:qty,latitude: this.$store.state.selectedLocation.coords.latitude,longitude: this.$store.state.selectedLocation.coords.longitude}      
                })
                .then(response => { 
                    this.carts=response.data.cart
                    this.cartCount=response.data.cartCount;
                    this.cartTotal=response.data.cartTotal;
                    if(this.deliveryType=='partner')
                        this.grandTotal=parseFloat(this.cartTotal)+parseFloat(this.deliveryCharge)
                    else
                        this.grandTotal=this.cartTotal 
                    if(this.coupon){
                        this.$store.commit('checkout/unsetCoupon');
                        this.couponDiscount='';
                        this.coupon='';
                    }
                    Toast.show({
                        text: "Cart Updated",
                        duration: 3000
                    }); 
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                })
            } else {
                if(Id!=''){
                    var status = true;
                    var cartTotal=0;
                    var Total=0;
                    const storeCart =this.$store.state.cart.cart;
                    var cartArray =  []
                    var oldArray='';
                    var options=[];
                    if(qty==0){
                        for(const key in storeCart){
                            if(storeCart[key].id!=Id){  
                                const list={
                                    'cartId':storeCart[key].cartId,
                                    'id':storeCart[key].id,
                                    'name':storeCart[key].name,
                                    'qty' :storeCart[key].qty,
                                    'price':storeCart[key].price,
                                    'option':storeCart[key].options
                                }
                                cartTotal=parseFloat(cartTotal)+parseFloat(storeCart[key].qty*storeCart[key].price)
                                cartArray.push(list)
                            }         
                        }
                        var cartCount=cartArray.length
                        this.carts=cartArray;
                        this.cartCount=cartCount;
                        this.cartTotal=cartTotal;
                        this.$store.commit('cart/setCartCount',this.cartCount);
                        this.$store.commit('cart/setCart',this.carts);
                        this.$store.commit('cart/setCartTotal',this.cartTotal);
                        Toast.show({
                            text: "Cart Updated",
                            duration: 3000
                        }); 
                    } else {
                         oldArray=storeCart.filter(x => x.id === Id);
                        var data={
                            cartId:oldArray[0].cartId,
                            id:oldArray[0].id,
                            name:oldArray[0].name,
                            qty:qty,
                            price:oldArray[0].price,
                            }
                        cartTotal=parseFloat(cartTotal)+parseFloat(qty*oldArray[0].price)                   
                        for(const key in storeCart){
                            if(storeCart[key].id!=oldArray[0].id){
                                const list={
                                    'cartId':storeCart[key].cartId,
                                    'id':storeCart[key].id,
                                    'name':storeCart[key].name,
                                    'qty' :storeCart[key].qty,
                                    'price':storeCart[key].price,
                                }
                                Total=parseFloat(storeCart[key].qty*storeCart[key].price)
                                cartArray.push(list)
                            }  
                        }
                    
                        cartTotal=parseFloat(cartTotal)+parseFloat(Total)
                        cartArray.push(data)
                        var cartCount=cartArray.length
                        this.carts=cartArray;
                        this.cartCount=cartCount;
                        this.cartTotal=cartTotal;
                        this.$store.commit('cart/setCartCount',this.cartCount);
                        this.$store.commit('cart/setCart',this.carts);
                        this.$store.commit('cart/setCartTotal',this.cartTotal);
                        this.$store.commit('checkout/unsetCouponDiscount')
                        Toast.show({
                            text: "Cart Updated",
                            duration: 3000
                        }); 
                    }   
                    this.isLoading = false   
                } else {
                    this.qty=qty;
                    this.isLoading = false
                }
            }
        },
        applyCoupon(){
            if(this.$store.state.user.authentication) {
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.applyCoupon,
                    headers: {'Content-Type': 'application/json','Authorization':AuthStr},
                    data:{coupon_code:this.couponCode}
                })
                .then(response => { 
                    if(response.data.success) {
                        Toast.show({
                            text: response.data.success.message,
                            duration: 4000
                        }); 
                        var coupon = {
                            couponCode:response.data.success.coupon_code,
                            couponId:response.data.success.coupon_id,
                            discount:response.data.success.discount_total,
                        } 
                        this.$store.commit('checkout/setCoupon',coupon);
                        this.coupon=coupon;
                        this.couponDiscount=response.data.success.discount_total;
                        if(this.deliveryType=='partner')
                            this.grandTotal=parseFloat(this.cartTotal)-parseFloat( this.couponDiscount)+parseFloat( this.deliveryCharge)
                        else
                            this.grandTotal=parseFloat(this.cartTotal)-parseFloat( this.couponDiscount)
                        this.couponCode='';
                    } else {
                        Toast.show({
                            text: response.data.error.message,
                            duration: 3000
                        }); 
                    }
                    this.isLoading = false
                })
                .catch(error => {
                    console.log(error.response.data);
                    this.isLoading = false
                })
            } else { 
                alert('Please Login');
            }
        },
        removeCoupon(){
            if(this.coupon) {
                if(this.deliveryType=='partner')
                    this.grandTotal=parseFloat(this.cartTotal)+parseFloat(this.deliveryCharge)
                else
                    this.grandTotal=this.cartTotal 
                this.$store.commit('checkout/unsetCoupon');
                this.couponDiscount='';
                this.coupon='';
                Toast.show({
                    text: "Coupon Removed",
                    duration: 3000
                }); 
            }
        },
    },
}
</script>

<style>
    .delivery-address-section{
        padding: 11;
        background-color: #FFFFFF;
        elevation: 3;
        border-radius: 4;
        flex-direction: row;
        margin-bottom: 15;
    }
    .delivery-location-icon{
        height: 15;
        width: 11;
        resize-mode: contain;
        margin-right: 10;
    }
    .delivery-detail{
        margin-top: -3;
        /* padding-right: 20; */
        flex:1;
    }
    .delivery-name{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #535151;
    }
    .delivery-address{
        font-size: 12;
        color: #474545;
    }
    .cart-head-section{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .cart-head{
        font-size: 16;
        color: #333333;
        font-family: Montserrat_SemiBold;
    }
    .add-button{

    }
    .add-button-text{
        font-size: 10;
        font-family: Montserrat_SemiBold;
        color: #04b74c;
    }

    /* Cart Item */
    .cart-list{
        margin-bottom: 20;
    }
    .cart-item{
        margin-left: 0;
        padding-left: 0;
        padding-bottom: 10;
        border-bottom-color: #ebebeb;
    }
    .cart-item-name{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #000000;
        margin-left: 0;
    }
    .cart-item-description{
        font-size: 11;
        color: #989696;
        margin-bottom: 5;
        margin-top: 5;
        margin-left: 0
    }
    .cart-item-edit{
        flex-direction: row;
        align-items: center;
    }
    .cart-item-edit-text{
        font-size: 10;
        color: #fcbe00;
        margin-left: 0
    }
    .cart-item-error{
        font-size: 10;
        color: #fc1100;
        margin-left: 0
    }
    .cart-item-edit-icon{
        width: 8.1;
        height: 4.5;
        resize-mode: contain;
    }
    .cart-item-price{
        font-size: 16;
        color: #525252;
        font-family: Montserrat_Medium;
        margin-top: 5;
    }

    /* Delivery Agent */

    .delivery-agent-section{
        flex-direction: row;
        justify-content: space-evenly;
        margin-top: 12;
        margin-bottom: 20;
    }
    .delivery-agent{
        border-width: 1;
        border-color: #eeeeee;
        border-radius: 3;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        padding-vertical:4;
        padding-horizontal: 10;
        margin:2.5;
    }
    .delivery-agent-selected{
        border-width: 1;
        border-color: #eeeeee;
        background-color: #eeeeee;
        border-radius: 3;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        flex: 1;
        padding-vertical:4;
        padding-horizontal: 10;
        margin:2.5;
    }
    .delivery-agent-text{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #7b7b7b;
    }
    .delivery-agent-selected-text{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #000000;
    }
    .agent-select{
        height: 18;
        width: 18;
        background-color: #eeeeee;
        border-radius: 30;
        z-index: 999;
    }
    .agent-selected{
        height: 22;
        width: 22;
    }

    /* Summary */

    .cart-summary-item{
        margin-left:0; 
        padding-bottom: 5;
        padding-top:10;
        margin-bottom: -3;
    }
    .cart-summary-item-head, .cart-summary-item-price{
        font-size: 12;
        color: #000000;
        font-family: Montserrat_Medium;
    }
    .cart-summary-item-total{
        font-family: Montserrat_SemiBold;
        font-size: 16;
        color: #333333;
    }
    .seperator{
        border-bottom-width: 1;
        border-color: #9d9d9d;
        margin-top: 10;
    }
    .list-item-right-margin{
        margin-right: -15;
    }

    /* Button */

    .footer{
        height: 47;
        flex-direction: row;
        border-top-width: 2;
        border-top-color: #e4e1e1;
    }
    .cart-price{
        padding-horizontal: 15;
        flex:0.8;
        justify-content: center;
    }
    .quantity{
        font-size: 12;
        color: #959595;
    }
    .price{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #554444;
    }
    .proceed-button{
        background-color: #fcbe00;
        border-top-left-radius: 20;
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .proceed-button-text{
        font-size: 14;
        color: #FFFFFF;
        font-family: Montserrat_Medium;
    }
    .proceed-button-icon{
        width: 8.5;
        height: 14.1;
    }

    /* Coupon */

    .coupon-section{
        margin-vertical: 13;
    }
    .coupon-head{
        flex-direction: row;
        align-items: center;
    }
    .coupon-head-text{
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .coupon-head-button{
        justify-content: center;
    }
    .coupon-head-button-text{
        font-size: 14;
        font-family: Montserrat_SemiBold;
        color: #fcbe00;
    }
    .split-coupon{
        flex-direction: row;
        align-items: center;
        margin-top: 8;
    }
    .coupon-code{
        flex: 1;
        margin-right: 8;
    }
    .coupon-code-input{
        border-style: dashed;
        border-radius: 7;
        border-width: 1;
        border-color: #a19d9d;
        height: 38;
        padding-horizontal:10
    }
    .coupon-button{
        flex: 1;
        margin-left: 8;
        background-color: #FFFFFF;
        border-width: 1;
        border-color: #fcbe00;
        border-radius: 7;
        height: 38;
        align-items: center;
        justify-content: center;
    }
    .coupon-button-text{
        color: #364151;
        font-size: 16;
        font-family: Montserrat_SemiBold;
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
    .change-address{
        font-size: 10;
        font-family: Montserrat_Medium;
        color: #fcbe00;
    }
    .delivery-head{
        flex-direction: row;
        justify-content: space-between;
    }

</style>