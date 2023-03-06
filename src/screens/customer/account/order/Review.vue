<template>
    <nb-container >
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" :headerTitle="'Order #'+invoicePrefix+orderId" />
        <nb-content padder>
            <image :source="require('../../../../../assets/images/review.png')" class="review-image" />
            <nb-text class="delivery-status">Order is delivered successfully</nb-text>
            <nb-text class="rating-head">Give your Rating</nb-text>
            <!-- <Ionicons name="md-menu" :size="40" color="green" /> -->
            <star-rating :style="{}"
                :maxStars=5
                :rating=rating
                :starSize=33
                halfStarColor="#fcbe00"
                fullStarColor="#fcbe00"
                emptyStarColor="#dfdfdf"
                :selectedStar="(rating)=>onStarRatingPress(rating)"
                :starStyle="{marginRight:15}"
                :containerStyle="{justifyContent:'center', marginBottom:30}"
            />
            <nb-textarea :on-change-text="(text)=>{description=text}" :defaultValue="description" class="rating-textarea" placeholder="say something about the food"/>
            <nb-button rounded block :on-press="()=>submitReview()" class="review-button">
                <nb-text class="review-button-text">Submit</nb-text>
            </nb-button>
        </nb-content>
    </nb-container>
</template>

<script>
import { Toast } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
import { isLoading } from 'expo-font'
import { Ionicons } from '@expo/vector-icons';
export default {
    props: {
        navigation : { Object }
    },
    data() {
        return {
            rating: this.navigation.state.params.rating ? this.navigation.state.params.rating : 0,
            kitchenId: this.navigation.state.params.kitchenId,
            orderId:this.navigation.state.params.orderId,
            invoicePrefix:this.navigation.state.params.invoicePrefix,
            // orderTitle:this.navigation.state.params.orderTitle,
            description:'',
            isLoading: false

        }
    },
    components: {
        Ionicons
    },

    methods: {
        onStarRatingPress(rating){
            this.rating = rating
        },
        
        submitReview(){
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.addOrderRating,
                data :{kitchen_id:this.kitchenId,rating:this.rating,description:this.description,order_id:this.orderId},
                headers: { 'Content-Type': 'application/json',
                    'Authorization':AuthStr },
            })
            .then(response => { 
                Toast.show({
                    text: "Review added successfully",
                    duration : 3000
                });
                this.isLoading = false
                this.navigation.navigate(StackActions.replace({ routeName: 'OrderDetail', params:{orderId:this.orderId} }))
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
        }
    },
}
</script>

<style>
    .review-image{
        height: 125;
        width: 100%;
        resize-mode: contain;
        margin-top: 45;
        margin-bottom: 21;
        align-self: center;
    }
    .delivery-status{
        font-size: 13;
        color: #6d6d6d;
        margin-bottom: 27;
        align-self: center;
    }
    .rating-head{
        align-self: center;
        font-size: 14;
        color: #000000;
        font-family: Montserrat_Medium;
        margin-bottom: 27;
    }
    .rating-textarea{
        border-radius: 7;
        border-color: #ffe9a7;
        border-width: 1;
        background-color: #fbfbfb;
        padding-vertical: 8;
        margin-bottom: 35;
        font-size: 12;
    }
</style>