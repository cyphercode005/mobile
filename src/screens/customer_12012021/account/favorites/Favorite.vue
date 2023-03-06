<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Favorites" />
        <nb-content padder v-if="allKitchens.length > 0">
            <nb-view  v-for="kitchen in allKitchens" :key="kitchen.id" class="kitchen-list-item">
              <touchable-opacity  :on-press="()=> {navigation.navigate('KithenDetail',{kitchenId:kitchen.id})}">
                <image :source="kitchen.image ? {uri:kitchen.image} :require('../../../../../assets/images/home/kitchen.png')" class="kitchen-image" :style="{width:kitchenImageWidth, height:kitchenImageWidth*.4283}"/>
                <nb-view padder class="kitchen-detail">
                    <nb-view class="kitchen-head">
                    <nb-text class="kitchen-name" :on-press="()=> {navigation.navigate('KithenDetail',{kitchenId:kitchen.id})}">{{kitchen.name}}</nb-text>
                        <nb-view class="rating" >
                            <touchable-opacity   :on-press="()=>{removeFavorite(kitchen.id)}">
                                <image  :source="require('../../../../../assets/images/icons/heart-fill.png')" class="rating-icon" />
                            </touchable-opacity>
                        </nb-view>
                    </nb-view>
                    <nb-view class="kitchen-desc">
                        <nb-text class="kitchen-description" :numberOfLines="1">{{kitchen.kitchen_description}}</nb-text>
                    </nb-view>
                </nb-view>
              </touchable-opacity>
            </nb-view>
        </nb-content>
        <nb-content padder v-else>
            <nb-view class="no-result">
                <nb-text class="no-result-text">No Favourite Kitchen Found</nb-text>
            </nb-view>
        </nb-content>

       
 
    </nb-container>
</template>

<script>
import { Toast } from "native-base";
export default {
    props: {
        navigation: { Object }
    },
 data() {
        return {
            kitchenImageWidth: this.appConfig.width - 30,
            allKitchens:'',
            isLoading: false
            
        }
    },
    beforeMount() {
         if(this.$store.state.user.isLogged) {
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'POST',
                url: this.api.routes.getFavoriteKitchen,
                headers: { 'Content-Type': 'application/json',
                'Authorization':AuthStr},
            })
            .then(response => { 
                console.log(response.data)
                this.allKitchens=response.data.kitchens;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data)
            })
        }   
        return true;
    },
    methods: {
        removeFavorite(kitchenId) {
            if(this.$store.state.user.isLogged) {
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.removeFavorite,
                    headers: { 'Content-Type': 'application/json',
                     'Authorization':AuthStr},
                    data:{kitchen_id:kitchenId}
                })
                .then(response => { 
                    console.log(response.data)
                    this.allKitchens=response.data.kitchens;
                    Toast.show({
                        text:'kitchen Removed',
                        duration: 3000
                    });                
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    Toast.show({
                        text: 'Something Went Wrong',
                        duration: 3000
                    });
                })
            }   
        }
    },
}
</script>

<style>
/* Kitchen */

    .kitchen-image{
        resize-mode:cover;
        background-color: #FFFFFF;
        border-top-left-radius: 10;
        border-top-right-radius: 10;
    }
    .kitchen-list-item{
        elevation:3;
        background-color: #FFFFFF;
        margin-bottom: 10;
        border-top-left-radius: 10;
        border-top-right-radius: 10;
    }
    .kitchen-head{
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 4;
    }
    .kitchen-name{
        font-family: Montserrat_SemiBold;
        font-size: 14;
        color: #000000;
    }
    .rating{
        flex-direction: row;
       
        border-radius: 15;
        padding-horizontal:0;
        padding-vertical:2;
        align-items: flex-end;
    }
    .rating-icon{
        width: 15;
        height: 15;
        resize-mode: contain;
        margin-right: 5;
    }
    .rating-text{
       
        font-family: Montserrat_SemiBold;
        font-size: 12;
    }
    .kitchen-desc{
        flex-direction: row;
        justify-content: space-between;
    }
    .kitchen-description{
        font-size: 10;
        flex:1;
        color: #7d7b76;
    }
    .kitchen-distance{
        flex-direction: row;
        align-items: center;
    }
    .kitchen-distance-icon{
        width: 12;
        height: 12;
        resize-mode: contain;
        margin-right: 3.3;
    }
    .kitchen-distance-text{
        font-size: 12;
        font-family: Montserrat_SemiBold;
        color: #364151;
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

</style>