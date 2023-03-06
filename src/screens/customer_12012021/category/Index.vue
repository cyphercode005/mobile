<template>
    <nb-container padder>
        <Spinner
          :visible="isLoading"
        />
        <StatusBar barStyle="light-content" backgroundColor="#fcbe00"/>
        <nb-view class="home-header" padder  >
            <image :source="require('../../../../assets/images/icons/location.png')" :on-press="()=>{navigation.navigate('LocationSearch')}" class="header-location-icon"/>
            <nb-text :on-press="()=>{navigation.navigate('LocationSearch')}" :numberOfLines=1 class="header-location-text">{{ $store.state.selectedLocation.address }}</nb-text>
            <touchable-opacity :on-press="()=>{navigation.navigate('Notification')}">
                <image :source="require('../../../../assets/images/icons/notification.png')" class="header-notification-icon" />
            </touchable-opacity>
        </nb-view>
        <nb-view class="search-container">
            <nb-item class="search-box">
                <image :source="require('../../../../assets/images/icons/search.png')" class="search-icon" />
                <nb-input class="search-input" v-model="search" :on-focus="()=>{navigation.navigate('Search',{search:true,searchType:'searching'})}" placeholder="Search for Item or kitchen" />
            </nb-item>
        </nb-view>
        <!-- <header :navigation="navigation" headerTitle="Categories" /> -->
        <nb-content padder>
            <nb-view  class="home-category">
                <touchable-opacity v-for="category in allCategories" :key="category.id" :on-press="()=>{navigation.navigate('CategoryDetail',{categoryId:category.id})}" class="category-item" :style="{width: (appConfig.width-50)/2}">
                    <nb-view padder class="category-inner">
                        <image :source=" category.icon ? {uri:category.icon} :require('../../../../assets/images/home/rice.png')" class="category-icon" />
                        <nb-text class="category-name">{{category.name}}</nb-text>
                        <!-- <nb-text class="category-name">{{category.description}}</nb-text> -->
                    </nb-view>
                </touchable-opacity>
            </nb-view>
        </nb-content>
        <footer :navigation="navigation"/>
    </nb-container>
</template>
<script>
export default {
     props: {
        navigation: { Object }
    },
    data() {
        return {
            allCategories:'',
            isLoading: false
        }
    },
    beforeMount() {
        this.getAllCategories()
    },
    methods: {
        getAllCategories(){
            this.isLoading = true
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.allCategories,
                headers: { 'Content-Type': 'application/json' },
                data:{
                    latitude: this.$store.state.selectedLocation.coords.latitude,
                    longitude: this.$store.state.selectedLocation.coords.longitude
                }
            })
            .then(response => { 
                console.log(response.data);
                this.allCategories=response.data;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
            return status
        },
    },
}
</script>
<style>

    .home-category{
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }
    /* .category-item{
        border-radius: 8;
        background-color: #FFFFFF;
        elevation: 3;
    } */
    .category-icon{
        width: 100;
        height: 100;
        resize-mode: cover;
        margin-bottom: 10;
    }
    .category-item{
        margin-bottom: 10;
        justify-content: center;
        align-items: center;
        border-radius: 8;
        background-color: #FFFFFF;
        elevation: 3;
    }
    .category-inner{
        justify-content: center;
        align-items: center;
    }
    .category-name{
        font-size: 14;
        color: #364151;
        font-family: Montserrat_SemiBold;
    }
</style>