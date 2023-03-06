<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation"  headerTitle="Bucket" />
        <nb-content padder>
            <nb-view class="delivery-address-section"  >
                <image :source="require('../../../../assets/images/icons/location-filled.png')" class="delivery-location-icon" />
                    <nb-view class="delivery-detail" v-if="getAddress" >
                    <nb-text class="delivery-name" :on-press="()=>{}">Delivery Address</nb-text>
                    <nb-text v-if="address==''" class="delivery-address">{{ $store.state.selectedLocation.address }}</nb-text>
                     <nb-text v-else class="delivery-address">{{ address }}</nb-text>
                </nb-view>
            </nb-view>
            <nb-view class="cart-head-section">
                <nb-text class="cart-head">Cave Bucket</nb-text>
                <touchable-opacity class="add-button" :on-press="()=>{navigation.navigate('Home')}">
                    <nb-text class="add-button-text">+Add  More</nb-text>
                </touchable-opacity>
            </nb-view>
            <nb-list class="cart-list" v-if="getCartDetails&&cartCount>0">

        <nb-list-item  class="cart-item" v-for="cart in carts" :key="cart.id" >
                    <nb-body>
                        <nb-text class="cart-item-name">{{cart.name}}</nb-text>
                        <!-- <nb-text class="cart-item-description">{{cart.description}}</nb-text> -->
                        <touchable-opacity class="cart-item-edit" :on-press="()=>{}">
                            <nb-text class="cart-item-edit-text">Edit Note</nb-text>
                            <image :source="require('../../../../assets/images/icons/chevron_down.png')" class="cart-item-edit-icon" />
                        </touchable-opacity>
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
                            :on-change="(num) => { changeQty(num,cart.id,cart.rowId)
                            }"
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
                  <nb-list class="cart-list" v-else >

        <nb-list-item   class="cart-item"  >
                    <nb-body>
                    <nb-text :style="{alignSelf:'center'}">Your cart is empty</nb-text>
                    </nb-body>
             
                </nb-list-item>
       
    
            </nb-list>


            <!-- <nb-view class="cart-head-section" v-if="cartCount>0">
                <nb-text class="cart-head">Delivery Agent</nb-text>
            </nb-view>
            <nb-view class="delivery-agent-section" v-if="cartCount>0">
                <touchable-opacity class="delivery-agent-selected">
                    <nb-text class="delivery-agent-selected-text">Pickup</nb-text>
                    <image :source="require('../../../../assets/images/icons/agent-selected.png')" class="agent-selected" />
                </touchable-opacity>
                <touchable-opacity class="delivery-agent">
                    <nb-text class="delivery-agent-text">Delivery</nb-text>
                    <nb-view class="agent-select"></nb-view>
                </touchable-opacity>
                <touchable-opacity class="delivery-agent">
                    <nb-text class="delivery-agent-text">D Partner</nb-text>
                    <nb-view class="agent-select"></nb-view>
                </touchable-opacity>
            </nb-view> -->


            <nb-view class="cart-summary" v-if="cartCount>0">
                <nb-text class="cart-head">Bill Details</nb-text>
                <nb-list>
                    <nb-list-item noBorder class="cart-summary-item">
                        <nb-left>
                            <nb-text class="cart-summary-item-head">Item Total</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="cart-summary-item-price">₹{{cartTotal}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                    <nb-list-item noBorder class="cart-summary-item" v-if="couponDiscount.length>0">
                        <nb-left>
                            <nb-text class="cart-summary-item-head">Coupon Discount</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="cart-summary-item-price">₹{{couponDiscount}}</nb-text>
                        </nb-right>
                    </nb-list-item>

                    <nb-view class="seperator"></nb-view>
                    <nb-list-item noBorder class="cart-summary-item">
                        <nb-left>
                            <nb-text class="cart-summary-item-total">Grand Total</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="cart-summary-item-total">₹{{parseFloat((cartTotal-couponDiscount).toFixed(2))}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                </nb-list>
            </nb-view>
            <!-- <nb-view class="coupon-section" v-if="cartCount>0">
                <nb-view class="coupon-head" v-if="coupon==''"  >
                    <nb-text class="coupon-head-text">Do you have any Coupon ? </nb-text>
                    <touchable-opacity class="coupon-head-button" :on-press="()=>{navigation.navigate('Coupon')}">
                        <nb-text class="coupon-head-button-text">Lets use it </nb-text>
                    </touchable-opacity>
                </nb-view>
                <nb-view class="split-coupon">
                    <nb-view class="coupon-code" v-if="coupon">
                       
                         <nb-text class="" >Coupon:{{coupon.couponCode}}</nb-text>
                    </nb-view>

                     <nb-view v-else class="coupon-code">
                        <nb-input v-model="couponCode" class="coupon-code-input" />
                    </nb-view>

                   
                    <nb-button  v-if="coupon"  :on-press="()=>{removeCoupon()}" class="coupon-button"><nb-text class="coupon-button-text">Remove</nb-text></nb-button>
                     <nb-button  v-else :on-press="()=>{applyCoupon()}" class="coupon-button"><nb-text class="coupon-button-text">Apply</nb-text></nb-button>
                </nb-view>
            </nb-view> -->
        </nb-content>
        <nb-view class="footer">
            <nb-view class="cart-price">
                <nb-text class="quantity">{{cartCount}} Item</nb-text>
                <nb-text class="price">₹ {{cartTotal}}</nb-text>
            </nb-view>
            <touchable-opacity v-if="cartCount>0" class="proceed-button" :on-press="()=>{goToCheckout()}">
                <nb-text></nb-text>
                <nb-text class="proceed-button-text">Proceed to Checkout

                </nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="proceed-button-icon" />
            </touchable-opacity>
        </nb-view>
    </nb-container>
</template>

<script>
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
            couponDiscount:'',
            coupon:this.$store.state.checkout.coupon,
            address:'',
            isLoading: false

        }
    },

    beforeMount() {
        var status=true;
        this.isLoading = true
        if(this.authToken!='') {
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({

                    method: 'POST',
                    url: this.api.routes.cartList,
                    headers: { 'Content-Type': 'application/json',
                        'Authorization':AuthStr },
                

                })
            .then(response => { 
                console.log('cart',response.data);
                this.carts=response.data.cart
            
                this.cartCount=response.data.cart_count;
                this.cartTotal=response.data.cart_total;
                
                if(this.$store.state.checkout.coupon)  {
                    this.couponDiscount=this.$store.state.checkout.coupon.couponDiscount
                }   
                this.isLoading = false  

            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            })
        }

        return status;
    },
    computed:{
      
        getAddress()
        {

            var status=true;

            if(this.authToken!='')
            {
                 const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({

                        method: 'POST',
                        url: this.api.routes.getDefaultAddress,
                        headers: { 'Content-Type': 'application/json',
                            'Authorization':AuthStr },
                    
                    })
                .then(response => { 
                     console.log('cart response',response.data);
                      this.address=response.data.address.name+','+response.data.address.address_line_1,+','+response.data.address.landmark

                   // address=response.data.
        
                                
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    
                    })
            }




            return status;
        },

        getCartDetails()
        {
          var status=true;

            if(this.authToken!='')
            {
                 const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({

                        method: 'POST',
                        url: this.api.routes.cartList,
                        headers: { 'Content-Type': 'application/json',
                            'Authorization':AuthStr },
                    

                    })
                .then(response => { 

                 console.log('cart',response.data);
                    this.carts=response.data.cart
                
                    this.cartCount=response.data.cart_count;
                    this.cartTotal=response.data.cart_total;
                    
                    if(this.$store.state.checkout.coupon)
                    {
                        
                         this.couponDiscount=this.$store.state.checkout.coupon.couponDiscount
                    }
        
                                
                    })
                    .catch(error => {
                        console.log(error.response.data);
                    
                    })
            }

            return status;
        }


    },


    methods:{
        goToCheckout()
        {
           
            
            if(this.authToken!='')
            {
                if(this.address){
             
                 this.navigation.navigate('Checkout')
               }
               else{
                   this.navigation.navigate('AddAddress',{routeName:'Checkout'})
               }
            }
            else{

            this.navigation.navigate('Verify')

            }

        },


     changeQty(qty,Id='',rowId='')
        {
            if(this.authToken=='')
            {
             
                    if(Id!='')
                    {
                    
                        var status = true;
                        var cartTotal=0;
                        var Total=0;
                        const storeCart =this.$store.state.cart.cart;
                        var cartArray =  []
                        var oldArray='';
                        var options={  'note':this.note,
                        'additional':this.additional
                        }
                          if(storeCart.length>0)
                          {
                              
                          }
                            oldArray=storeCart.filter(x => x.id ===Id);
                            
                            var data={
                                cartId:oldArray[0].cartId,
                                id:oldArray[0].id,
                                name:oldArray[0].name,
                                qty:qty,
                                price:oldArray[0].price,
                                options:options,
                                }  
                            
                        
                                
                        cartTotal=parseFloat(cartTotal)+parseFloat(qty*oldArray[0].price)
                                                
                        for(const key in storeCart){
                            if(storeCart[key].id!=oldArray[0].id)
                            {
                            const list={
                                    'cartId':storeCart[key].cartId,
                                    'id':storeCart[key].id,
                                    'name':storeCart[key].name,
                                    'qty' :storeCart[key].qty,
                                    'price':storeCart[key].price,
                                    'options':storeCart[key].options,
                                    
                                    }
                                    Total=parseFloat(storeCart[key].qty*storeCart[key].price)
                                    cartArray.push(list)
                                    
                            }  
                                }
                                cartTotal=parseFloat(cartTotal)+parseFloat(Total)
                                console.log(cartTotal);   
                        
                                    cartArray.push(data)
                                    var count=cartArray.length
                                
                                    this.option=''
                                    this.cart=cartArray;
                                    this.cartCount=count;
                                    this.cartTotal=cartTotal;
                                    
                                    this.$store.commit('cart/setCartCount',this.cartCount);
                                    this.$store.commit('cart/setCart',this.cart);
                                    this.$store.commit('cart/setCartTotal',this.cartTotal);
                                    Toast.show({

                                        text: "Cart Updated",
                                   
                                        duration: 3000
                                        }); 

                                
                    }
                    else{
                    
                        this.qty=qty;
                        //console.log(this.qty);
                    }
            }
            else
            {
                console.log(rowId);
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);

                 this.api.create({
               
                    method: 'POST',
                    url: this.api.routes.cartUpdateQuantity,
                    headers: { 'Content-Type': 'application/json',
                        'Authorization':AuthStr },
                    data:{rowId:rowId,quantity:qty}
                

                })
                .then(response => { 
                      
                    this.carts=response.data.cart

                    this.cartCount=response.data.cartCount;
                    this.cartTotal=response.data.cartTotal;
                    Toast.show({

                        text: "Cart Updated",
                    
                        duration: 3000
                        }); 

        
                    })
                .catch(error => {
                    console.log(error.response.data);
                
                })


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
        margin-bottom: 20;
    }
    .delivery-location-icon{
        height: 15;
        width: 11;
        resize-mode: contain;
        margin-right: 10;
    }
    .delivery-detail{
        margin-top: -3;
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
        font-size: 10;
        color: #989696;
        margin-bottom: 5;
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
        justify-content: center;
    }
    .coupon-button-text{
        color: #364151;
        font-size: 16;
        font-family: Montserrat_SemiBold;
    }

</style>