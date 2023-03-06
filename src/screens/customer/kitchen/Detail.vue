<template>
    <nb-container v-if="getKitchenDetail">
        <Spinner
          :visible="isLoading"
        />
        <StatusBar backgroundColor="#fcbe00" barStyle="dark-content"/>
        <nb-view :style="{width:appConfig.width, height: 170, justifyContent:'center', marginTop: appConfig.platform==='ios'? statusBarHeight : 0}" >
            <Swiper :style="{}" :key="sliderImages.length"
                :showsButtons=false
                :autoplay=true
                :autoplayTimeout="4"
                activeDotColor="#ffbf00"
                dotColor="#fff0c4"
                :dotStyle="{width:10.5, height:3, borderRadius:30}"
                :activeDotStyle="{width:10.5, height:3, borderRadius:30}"
                :index="sliderIndex"
                :onIndexChanged="(index) => {
                    sliderIndex = index
                }">
                <nb-view v-for="slider in sliderImages" :key="slider">
                    <touchable-opacity :on-press="()=>sliderImageViewer(sliderIndex)" v-if="slider.type=='image'">
                        <image :source="slider.image" class="slider-image" />
                    </touchable-opacity>
                    <image-background :source="slider.image" class="slider-image video" v-else>
                        <touchable-opacity class="play-button" :on-press="()=>openVideoPlayer(slider.videoId)">
                            <image :source="require('../../../../assets/images/icons/play.png')" class="play-button-icon" />
                        </touchable-opacity>
                    </image-background>
                </nb-view>
            </Swiper>
            <touchable-opacity class="favourite-button" :on-press="()=>setFavourite(kitchenDetail.id)">
                <image v-if="favoriteStatus==0" :source="require('../../../../assets/images/icons/heart.png')" class="favourite-button-icon" />
                 <image v-else :source="require('../../../../assets/images/icons/heart-fill.png')" class="favourite-button-icon" />
            </touchable-opacity>
            <!-- <touchable-opacity class="play-button" :on-press="()=>{}">
                <image :source="require('../../../../assets/images/icons/play.png')" class="play-button-icon" />
            </touchable-opacity> -->
        </nb-view>
        <nb-view padder>
            <nb-view class="kitchen-head">
                <nb-text class="kitchen-name">{{kitchenDetail.name}}</nb-text>
                <!-- <image :source="require('../../../../assets/images/icons/share.png')" class="kitchen-share" /> -->
            </nb-view>
            <nb-text class="kitchen-description">{{kitchenDetail.kitchen_description}}</nb-text>
            <nb-view class="kitchen-detail"> 
                <nb-view class="" :style="{flex:1, flexDirection:'row'}">
                    <nb-view class="kitchen-location" >
                        <image :source="require('../../../../assets/images/icons/location-filled.png')" class="location-icon" />
                        <nb-text class="location-text">{{kitchenDetail.location}}</nb-text>
                    </nb-view>
                    <nb-view class="kitchen-distance">
                        <image :source="require('../../../../assets/images/icons/distance-filled.png')" class="distance-icon" />
                        <nb-text class="distance-text">{{ parseFloat(kitchenDistance).toFixed(1) }} Km</nb-text>
                    </nb-view>
                    <nb-view class="kitchen-distance">
                        <image :source="require('../../../../assets/images/icons/star-rating.png')" class="distance-icon" />
                        <nb-text class="distance-text">{{parseFloat(kitchenRating).toFixed(1)}} ({{kitchenDetail.review_count}})</nb-text>
                    </nb-view>
                </nb-view>
                <touchable-opacity class="kitchen-report" :on-press="() => {$refs.reportKitchen.open()}">
                    <image :source="require('../../../../assets/images/icons/ban.png')" class="distance-icon" />
                    <nb-text class="distance-text">Report</nb-text>
                </touchable-opacity>
                <!-- <nb-view class="kitchen-rating">
                    <image :source="require('../../../../assets/images/icons/star-rating.png')" class="rating-icon" />
                    <nb-text class="rating-text">{{kitchenDetail.rating}} ({{kitchenDetail.review_count}})</nb-text>
                </nb-view> -->
            </nb-view>
            
        </nb-view>
        <nb-tabs :tabBarUnderlineStyle="{height:3, marginTop:1}">
            <nb-tab heading="Menu" :on-press="()=> clickTab('menu')" :textStyle="{fontSize: 14, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 14, color: '#000000'}">
                <nb-content padder>
                    <nb-list v-if="getKitchenMenu&&kitchenMenus.length > 0">
                        <nb-list-item  v-for="kitchenMenu in kitchenMenus" :key="kitchenMenu.id" avatar noBorder class="menu-list-item" button :on-press="()=>getMenuDetail(kitchenMenu.id)" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-left :style="{ marginTop:0, paddingTop:0 }">
                                <image-background :imageStyle="{borderRadius: 60}"  :source=" kitchenMenu.image ? {uri:kitchenMenu.image} :require('../../../../assets/images/no-image.png')" class="product-thumb">
                                     <image  v-if="kitchenMenu.veg_status == '0'"  :source="require('../../../../assets/images/icons/veg.png')" class="food-type"/>
                                        <image  v-else :source="require('../../../../assets/images/icons/non-veg.png')" class="food-type"/>
                                </image-background>
                            </nb-left>
                            <nb-body :style="{ marginTop:0, paddingTop:0, marginLeft:8}">
                                <nb-text class="menu-item-name">{{kitchenMenu.name}}</nb-text>
                                <nb-text class="menu-item-kitchen">{{kitchenMenu.kitchen_name}}</nb-text>
                                <!-- <HTML :html="kitchenMenu.description" :tagsStyles="{ p: { fontSize: 10, color: '#7d7b76',marginBottom:5 }}" /> -->
                                <nb-text :numberOfLines=2 class="menu-item-description">{{ kitchenMenu.description }}</nb-text>
                                <nb-text class="menu-item-order-time">Order Time <nb-text class="menu-item-time">{{kitchenMenu.order_time}}</nb-text></nb-text>
                                <nb-view class="price-section">
                                    <nb-text class="menu-item-price">₹{{parseFloat(kitchenMenu.price).toFixed(2)}}</nb-text>
                                    <nb-text class="menu-item-quantity">{{kitchenMenu.quantity}} <nb-text class="menu-item-quantity-remaining">remaining</nb-text></nb-text>
                                </nb-view>
                            </nb-body>
                        </nb-list-item>
                    </nb-list>
                    <nb-view  padder class="no-result" v-else>
                        <nb-text class="no-result-text">No Items Found</nb-text>
                    </nb-view>
                </nb-content>
            </nb-tab>
            <nb-tab heading="Gallery" :on-press="()=> clickTab('gallery')" :textStyle="{fontSize: 14, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 14, color: '#000000'}">
                <nb-content padder>
                    <nb-text class="gallery-head" v-if="galleryVideos.length">Videos</nb-text>
                    <nb-view class="gallery-video" v-if="galleryVideos.length">
                        <touchable-opacity v-for="video in galleryVideos" :key="video.videoId" class="video-item" :on-press="() => openVideoPlayer(video.videoId)" >
                            <image-background :source="video.image" class="video-thumb" :style="{width:galleryImageWidth, height:galleryImageWidth}">
                                <image :source="require('../../../../assets/images/icons/play.png')" class="video-play-icon" />
                            </image-background>
                        </touchable-opacity>
                    </nb-view>
                    <nb-text class="gallery-head" v-if="galleryImages.length">Photos</nb-text>
                    <nb-view class="gallery-video" v-if="galleryImages.length">
                        <touchable-opacity class="video-item" v-for="(image, index) in galleryImages" :key="index" :on-press="() => galleryImageViewer(index)" >
                            <image-background :source="image" class="video-thumb" :style="{width:galleryImageWidth, height:galleryImageWidth}"/>
                        </touchable-opacity>
                    </nb-view>
                </nb-content>
            </nb-tab>
            <nb-tab heading="Review" :on-press="()=> clickTab('review')" :textStyle="{fontSize: 14, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 14, color: '#000000'}">
                <nb-content v-if="getKitchenReview&&kitchenReview.length > 0" padder>
                    <nb-view class="rating-head">
                        <nb-text class="rating-text">Overall rating</nb-text>
                        <star-rating :style="{}"
                            :disabled=true
                            :maxStars=5
                            :rating=kitchenOverallRating
                            :starSize=24
                            halfStarColor="#fcbe00"
                            fullStarColor="#fcbe00"
                            emptyStarColor="#dfdfdf"
                            :starStyle="{marginRight:2}"
                            :containerStyle="{justifyContent:'center'}"
                        />
                    </nb-view>
                    <nb-view  v-for="review in kitchenReview" :key="review.id">
                        <nb-view  class="review-list-item">
                            <nb-view class="review-head">
                                <nb-view class="review-user-icon">
                                    <nb-text class="review-user-letter">{{review.name.charAt(0)}}</nb-text>
                                </nb-view>
                                <nb-view class="review-name-rating">
                                    <nb-text class="review-user-name">{{review.name}}</nb-text>
                                    <star-rating :style="{}"
                                        :disabled=true
                                        :maxStars=5
                                        :rating=parseFloat(review.rating).toFixed(1)
                                        :starSize=12
                                        halfStarColor="#fcbe00"
                                        fullStarColor="#fcbe00"
                                        emptyStarColor="#dfdfdf"
                                        :starStyle="{marginRight:3}"
                                        :containerStyle="{justifyContent:'flex-start'}"
                                    />
                                </nb-view>
                                <nb-view>
                                    <nb-text class="review-date">{{review.date}}</nb-text>
                                </nb-view>
                            </nb-view>
                            <!-- <ViewMoreText
                                :numberOfLines=2
                                :renderViewMore="renderViewMore"
                                :renderViewLess="renderViewLess"> -->
                                <nb-text class="review-description">{{review.description}}</nb-text>
                            <!-- </ViewMoreText> -->
                        </nb-view> 
                      
                    </nb-view>


                </nb-content>
                         <nb-content padder v-else>
                            <nb-view  padder class="no-result">
                            <nb-text class="no-result-text">No Reviews Yet!</nb-text>
                        </nb-view>
              
                    </nb-content>
                </nb-tab>
            
            <nb-tab heading="About" :on-press="()=> clickTab('about')" :textStyle="{fontSize: 14, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 14, color: '#000000'}">
                <nb-content padder>
                    <!-- <HTML :html=information.description :imagesMaxWidth="(appConfig.width - 30)" :baseFontStyle="{fontFamily:'Montserrat_Regular', fontSize:10, color:'#808080'}"
                    :tagsStyles="{ p: {marginTop:2, marginBottom:2 } }"/> -->
                    <nb-text :style="{fontSize:12, color:'#000000', lineHeight:16}">{{kitchenDetail.kitchen_about}}</nb-texT>
                    <!-- <HTML :html="kitchenDetail.kitchen_about" :tagsStyles="{ p: {marginTop:1, marginBottom:1,fontSize: 12, color: '#707070' } }" /> -->
                </nb-content>
            </nb-tab>
        </nb-tabs>
        <RBSheet
            ref="reportKitchen"
            height="350"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopRightRadius:15, borderTopLeftRadius:15, paddingTop:5,
                }
            }"
        >
            <nb-view class="modal-header">
                <nb-text class="modal-header-title">Report Kitchen</nb-text>
            </nb-view>
            <nb-content padder>
                <nb-text class="cancel-label">Reason to report</nb-text>
                <nb-view class="picker-container" :style="{zIndex:3000}"  v-if="appConfig.platform=='ios'">
                    <DropDownPicker
                        :items="reportReasons"
                        :containerStyle="{height: 48}"
                        :style="{backgroundColor: '#fafafa'}"
                        :itemStyle="{
                            justifyContent: 'flex-start'
                        }"
                        :labelStyle="{fontSize:12, color:'#999999', fontFamily:'Montserrat_Regular'}"
                        :dropDownStyle="{backgroundColor: '#fafafa'}"
                        :onChangeItem="(reason)=>{
                            reportReason = reason.value.name
                            reportReasonId = reason.value.id
                        }"
                    />
                </nb-view>
                <DropDownPicker v-else
                    :items="reportReasons"
                    :containerStyle="{height: 40, marginBottom:15}"
                    :style="{backgroundColor: '#fafafa'}"
                    :itemStyle="{
                        justifyContent: 'flex-start', height:30
                    }"
                    :selectedLabelStyle="{fontSize:12, color:'#8c8c8c', fontFamily:'Montserrat_Regular', height:15}"
                    :labelStyle="{fontSize:12, color:'#999999', fontFamily:'Montserrat_Regular'}"
                    :dropDownStyle="{backgroundColor: '#fafafa'}"
                    :onChangeItem="(reason)=>{
                        reportReason = reason.value.name
                        reportReasonId = reason.value.id
                    }"
                />
                <nb-text v-if="errors.reportReason" :style="{color:'red',marginBottom:10, marginTop: -10, fontSize:12}">{{errors.reportReason}}</nb-text>
                <nb-text class="comment-label">Remark</nb-text>
                <nb-textarea :on-change-text="(text)=>{reportRemarks=text}" :defaultValue="reportRemarks" :rowSpan="3" placeholder="Remarks" class="comment-input"/>
                <nb-text v-if="errors.reportRemarks" :style="{color:'red',marginBottom:5, fontSize:12}">{{errors.reportRemarks}}</nb-text>
            </nb-content> 
            <nb-view class="modal-footer">
                <touchable-opacity class="modal-goback-button" :on-press="()=>{$refs.reportKitchen.close()}">
                    <nb-text class="modal-goback-button-text">Go Back</nb-text>
                </touchable-opacity>
                <touchable-opacity class="modal-cancel-button" :on-press="()=>{reportKitchen()}">
                    <nb-text class="modal-cancel-button-text">Report</nb-text>
                </touchable-opacity>
            </nb-view>
        </RBSheet>
        <RBSheet
            ref="menuDetail"
            height="480"
            :closeOnPressMask="true"
            :customStyles="{
                container: {
                    borderTopLeftRadius:5, borderTopRightRadius:5
                }
            }"
            :onClose="()=>{ }"
        >
            <Spinner
                :visible="isMenuLoading"
            />
            <image-background :source="menuDetail.image ? {uri:menuDetail.image} :require('../../../../assets/images/no-image.png')" class="modal-menu-image">
                <touchable-opacity class="modal-close" :on-press="()=>{ $refs.menuDetail.close() }">
                    <image :source="require('../../../../assets/images/icons/modal-close.png')" class="modal-close-icon" />
                </touchable-opacity>
            </image-background>
            <nb-content padder :style="{paddingTop:0}">
                <nb-text class="modal-menu-name">{{menuDetail.name}}</nb-text>
                <nb-text class="modal-menu-description">{{menuDetail.description}}</nb-text>
                <nb-view class="modal-instruction">
                    <nb-text class="instruction-head">Recipe Details</nb-text>
                    <nb-text class="modal-input">{{menuDetail.recipe}}</nb-text>
                    <!-- <nb-text :style="{color:'red',fontSize:12, marginTop:-20, marginBottom:10}" v-if="cartMessage">{{cartMessage}}</nb-text>   -->
                </nb-view>
                <input-spinner 
                    :width=125 
                    :height=42 
                    :buttonFontSize=26
                    :rounded=true
                    :editable=false
                    :disabled=false
                    :value=variantQty
                    :max="menuDetail.quantity"
                    :min=1
                    :style="{alignSelf:'center', marginTop:10}"
                    :buttonStyle="{width:41, height:41,alignSelf:'center', borderWidth:2, borderColor:'#fcbe00',fontSize:12, fontFamily:'Montserrat_SemiBold', alignItems:'center', justifyContent:'center', paddingTop:0}"
                    :step=1
                    :on-change="(quantity) => { changeQuantity(quantity) }"
                    :inputStyle="{color:'#000000', fontSize:26, fontFamily:'Montserrat_Regular'}"
                    buttonFontFamily="Montserrat_SemiBold"
                    fontFamily="Montserrat_Regular"
                    color="#FFFFFF"
                    buttonTextColor="#000000"
                    colorPress="#fcbe00"
                    buttonPressTextColor="#FFFFFF" />
                 
            </nb-content>
            <nb-view class="modal-footer">
                <nb-view class="modal-menu-price">
                    <nb-text  class="menu-quantity" >{{quantity}} Quantity</nb-text>
                    <nb-text  class="menu-price" >₹{{parseFloat(productTotal).toFixed(2)}}</nb-text>
                </nb-view>
                <touchable-opacity v-if="itemCart.cartQuantity>0"  class="modal-add-cart-button" :on-press="()=>{cartUpdate(quantity,menuDetail.id,itemCart.rowId) }">
                    <nb-text></nb-text>
                    <nb-text class="add-cart-button-text">Update Cart</nb-text>
                    <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="add-cart-button-icon" />
                </touchable-opacity>
                <touchable-opacity v-else  class="modal-add-cart-button" :on-press="()=>{ checkCart(menuDetail) }">
                    <nb-text></nb-text>
                    <nb-text class="add-cart-button-text">Add to Cart</nb-text>
                    <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="add-cart-button-icon" />
                </touchable-opacity>
            </nb-view>
        </RBSheet>
        <footer :navigation="navigation" />
        <ImageView
            :images="imageViewer"
            :imageIndex="imageIndex"
            :visible="isVisible"
            :onRequestClose="() => {isVisible=false}"
        />
        <Modal :isVisible="videoPlayer" 
            :style="{padding:0}"
            :transparent="true"
            :hasBackdrop="true"
            :onPress="() => pause()"
            :propagateSwipe="true"
            :onBackButtonPress="()=>{videoPlayer=false}"
            :coverScreen="false">
            <touchable-opacity class="modal-close" :on-press="()=>{ videoPlayer=false }" :style="{marginRight:-10,zIndex:9999, top:appConfig.platform==='ios'? 20:undefined}">
                <image :source="require('../../../../assets/images/icons/modal-close.png')" class="modal-close-icon" />
            </touchable-opacity>
            <nb-view :style="{zIndex:9999, justifyContent:'center', height:'99%', alignItems:'center'}">
                <YoutubePlayer
                    height="100%"
                    :play="true"
                    width="100%"
                    :videoId="videoId"
                    :webViewProps="{
                        containerStyle: { margin:-20, marginTop:appConfig.height/3, justifyContent:'center', flex:1, padding:0 }
                    }"
                    :initialPlayerParams="{
                        rel: false,
                        modestbranding: false,
                        showClosedCaptions: false    
                    }"
                />
                <!-- <YoutubePlayer
                    :videoId="videoId"
                    ref="youtubePlayer"
                    :style="{backgroundColor:'red', alignItems:'center', zIndex:9}"
                    :onStart="() => {console.log('onStart')}"
                    :onEnd="() => {console.log('End')}"
                    showFullScreenButton
                    autoPlay
                /> -->
            </nb-view>
        </Modal>
    </nb-container>
</template>

<script>
import ImageView from 'react-native-image-viewing'
import React, {Component} from 'react'
import { Platform, StyleSheet, View, Image, Modal, Text } from 'react-native'
import ViewMoreText from 'react-native-view-more-text'
import Swiper from 'react-native-swiper'
import { WebView } from 'react-native-webview'
// import YoutubePlayer from 'react-native-yt-player'
import YoutubePlayer from "react-native-youtube-iframe";
import { Toast } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
import { Alert } from "react-native";
import DropDownPicker from 'react-native-dropdown-picker'
import { getStatusBarHeight } from 'react-native-status-bar-height';

export default {
    props: {
        navigation : { Object }
    },
    components: {
        ViewMoreText,ImageView,Swiper,WebView,YoutubePlayer, DropDownPicker
    },
    data() {
        return {
            statusBarHeight: getStatusBarHeight(),
            sliderImages : [],
            sliderViewer: [],
            galleryImageWidth : (this.appConfig.width - 45)/3,
            kitchenId :this.navigation.state.params.kitchenId,
            kitchenDetail :'',
            kitchenMenus:'',
            kitchenReview :'',
            kitchenOverallRating:'',
            isVisible: false,
            sliderIndex:0,
            imageIndex: 0,
            videoPlayer: false,
            galleryVideos: [],
            galleryImages: [],
            imageViewer: [],
            videoId: '',
            menuDetail:'',
            quantity:1,
            note:'',
            additional:'',
            productPrice:0,
            productTotal:0,
            favoriteStatus:'',
            variantQty:'',
            cartMessage:'',
            itemCart:'',
            kitchenDistance: 0,
            kitchenRating: 0,
            isLoading: false,
            isMenuLoading: false,

            reportReasons:[],
            reportReason:'',
            reportReasonId: '',
            reportRemarks: '',
             errors: {
                reportReason: '',
                reportRemarks: '',
                // orderDisputeReason: '',
                // orderDispureRemarks: ''
            },
        }   
    },
    mounted() {
        // this.$refs.menuDetail.open()
    },
    beforeMount(){
        this.getKitchenDetail()
        this.getKitchenMenu()
        this.getKitchenReview()
        this.getCartDetails()
        this.getReportReasons()
    },
    methods: {
        getKitchenDetail(){
            var status = true;
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.kitchenDetail,
                data :{
                    kitchen_id: this.kitchenId,
                    latitude: this.$store.state.selectedLocation.coords.latitude,
                    longitude: this.$store.state.selectedLocation.coords.longitude
                },
                headers: { 'Content-Type': 'application/json' },    
            })
            .then(response => { 
                console.log(response.data)
                this.kitchenDetail = response.data.kitchen;
                this.favoriteStatus =  this.kitchenDetail.favoriteStatus;
                if(response.data.featuredImage){
                    this.sliderImages.push({image: {uri: response.data.featuredImage}, type:'image'})
                    this.sliderViewer.push({uri: response.data.featuredImage })
                } else {
                    this.sliderImages.push({image: require('../../../../assets/images/no-image.png'), type:'image'})
                    this.sliderViewer.push(require('../../../../assets/images/no-image.png'))
                }
                if(response.data.sliderImages.length){
                    response.data.sliderImages.map((image)=>{
                        this.sliderImages.push({image: {uri: image.image}, type:'image'})
                        this.sliderViewer.push({uri: image.image})
                        this.galleryImages.push({uri: image.image})
                    })
                }
                if(response.data.featuredVideos.length){
                    response.data.featuredVideos.map((video) => {
                        var url = this.parseUrl(video.url)
                        this.sliderImages.push({image: {uri: url.imageUrl}, type:'video',videoUrl:video.url, videoId:url.videoId})
                        this.galleryVideos.push({image: {uri: url.imageUrl}, type:'video',videoUrl:video.url, videoId:url.videoId})
                    })
                }
                if(response.data.galleryImages.length){
                    response.data.galleryImages.map((image)=>{
                        this.galleryImages.push({uri: image.image})
                    })
                }
                if(response.data.galleryVideos.length){
                    response.data.galleryVideos.map((video) => {
                        var url = this.parseUrl(video.url)
                        this.galleryVideos.push({image: {uri: url.imageUrl}, type:'video',videoUrl:video.url, videoId:url.videoId})
                    })
                }
                // console.log(this.galleryVideos)
                // console.log(this.getGeoDistance(this.kitchenDetail.latitude, this.kitchenDetail.longitude, this.$store.state.seletedLocation.coords.latitude, this.$store.state.seletedLocation.coords.longitude))
                // this.kitchenDistance = this.geoDistance(this.kitchenDetail.latitude, this.kitchenDetail.longitude, this.$store.state.selectedLocation.coords.latitude, this.$store.state.selectedLocation.coords.longitude)
                this.kitchenDistance = this.kitchenDetail.kitchenDistance!=null ? this.kitchenDetail.kitchenDistance : 0
                this.kitchenRating = this.kitchenDetail.rating
                this.isLoading = false
            })
            .catch(error => {
                console.log(error.response.data);
            }) 
            return status
        },

        getKitchenMenu(){
            var status = true;
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.kitchenMenu,
                data :{'kitchen_id':this.kitchenId},
                headers: { 'Content-Type': 'application/json' },    
            })
            .then(response => { 
                this.kitchenMenus = response.data.kitchen_menu;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
            return status
        },

        getKitchenReview(){
            var status = true;
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.kitchenReview,
                data :{'kitchen_id':this.kitchenId},
                headers: { 'Content-Type': 'application/json' },    
            })
            .then(response => { 
            //    console.log(response.data.kitchen_reviews);
                this.kitchenReview = response.data.kitchen_reviews;
                this.kitchenOverallRating = response.data.total_rating;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
                
            }) 
            return status
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
                    // console.log(response.data)
                    this.carts=response.data.cart
                    this.cartCount=response.data.cart_count;
                    this.$store.commit('cart/setCartCount',response.data.cart_count)
                    this.cartTotal=response.data.cart_total;
                    this.grandTotal = this.cartTotal;
                    this.$store.commit('cart/setKitchen',response.data.kitchen);
                    if(this.$store.state.checkout.coupon.couponCode){
                        this.couponDiscount=this.$store.state.checkout.coupon.discount
                        this.couponCode = this.$store.state.checkout.coupon.couponCode
                    
                    if(this.couponDiscount>0 && this.cartCount)
                        this.grandTotal = parseFloat(this.cartTotal) - parseFloat(this.couponDiscount).toFixed(2)
                    }
                    // this.getKitchenDelivery()
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                })
            }
            return status;
        },

        renderViewMore(onPress){
            return(
                <Text onPress={onPress}>View more</Text>
            )
        },
        renderViewLess(onPress){
            return(
                <Text onPress={onPress}>View less</Text>
            )
        },
        renderInactiveDot(){
            return(
                <View style={{backgroundColor:'rgba(0,0,0,.2)', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />
            )
        },
        parseUrl(url){
            let regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/,
            params = {},
            match;
            match = regex.exec(url)
            console.log(match)
            if(match && match.length){
                var imageUrl = 'https://img.youtube.com/vi/'+match[1]+'/maxresdefault.jpg'
                return ({ imageUrl: imageUrl, videoId: match[1] })
            } else {
                return ({ imageUrl: '', videoId: '' })
            }
        },
        openImageViewer(index){
            this.imageIndex = index
            this.isVisible = true
        },
        sliderImageViewer(index){
            this.imageIndex = index
            this.imageViewer = this.sliderViewer
            this.isVisible = true
        },
        galleryImageViewer(index){
            this.imageIndex = index
            this.imageViewer = this.galleryImages
            this.isVisible = true
        },
        openVideoPlayer(videoId){
            this.videoId = videoId
            this.videoPlayer = true
        },

        // Video Player

        onFullScreen(fullScreen) {
            console.log("fullscreen ", fullScreen);
        },
        play() {
            this.player.playVideo();
        },
        pause() {
            this.player.pauseVideo();
        },
        seekTo(s) {
            this.player.seekTo(s);
        },

        // Menu

        setFavourite(kitchenId){
            if(this.$store.state.user.authentication!=''){
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.favorite,
                    headers: { 'Content-Type': 'application/json',
                        'Authorization':AuthStr},
                    data:{kitchen_id:kitchenId}
                })
                .then(response => { 
                    this.favoriteStatus= response.data.status;
                    this.isLoading = false
                    Toast.show({
                        text: response.data.message,
                        duration: 3000
                    });
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data)
                    Toast.show({
                        text: 'Something Went Wrong',
                        duration: 3000
                    });
                })
            } else {
                Toast.show({
                    text: 'Please login to add kitchen to favourites',
                    duration: 3000
                });
            }
        },

        getMenuDetail(foodId){
            this.menuDetail=''
            this.$refs.menuDetail.open()
            this.isMenuLoading = true
            this.cartMessage=''
            var status = true
            this.note=''
            this.additional=''
            this.productPrice = 0
            this.productTotal = 0
            if(this.$store.state.user.loggedIn) {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.menuDetailWithCart,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': AuthStr
                    },
                    data:{food_id:foodId}
                })
                .then(response => { 
                    this.productPrice=parseFloat(response.data.kitchen_menu.price);
                    console.log(response.data.kitchen_menu.cartQuantity)
                    if(parseFloat(response.data.kitchen_menu.cartQuantity)>0)
                    { 
                        this.quantity=response.data.kitchen_menu.cartQuantity
                        this.productTotal=parseFloat(response.data.kitchen_menu.price)*parseFloat(response.data.kitchen_menu.cartQuantity);
                        this.variantQty=parseFloat(response.data.kitchen_menu.cartQuantity)
                        this.cartMessage="Item already added to the cart"
                   }
                    else
                    {
                        this.productTotal=parseFloat(response.data.kitchen_menu.price)
                        this.quantity=1
                        this.variantQty=1
                    }
                    this.itemCart=response.data.cartDetails
                    this.menuDetail=response.data.kitchen_menu;
                    this.isMenuLoading = false
                })
                .catch(error => {
                    this.isMenuLoading = false
                    console.log(error.response.data);
                })
            } else {
                  this.cart=this.$store.state.cart.cart
                this.itemCart=''
                if(this.cart.length>0)
                {
                var cartRow=this.cart.filter(x => x.id ===foodId)
                if(cartRow.length>0)
                this.itemCart={'cartQuantity':cartRow[0].qty,cartCount:this.$store.state.cart.cartCount,cartTotal:this.$store.state.cart.cartTotal}
                }
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.menuDetail,
                    headers: { 'Content-Type': 'application/json' },
                    data:{food_id:foodId}
                })
                .then(response => { 
                    this.menuDetail=response.data.kitchen_menu;
                    console.log('menuDetail')
                    console.log(this.menuDetail)
                    this.productPrice=parseFloat(response.data.kitchen_menu.price);
                    if(this.cart.length>0)
                    {
                        if(this.cart.filter(x => x.id ===foodId).length>0)
                            { 
                            this.quantity=parseInt(this.cart.filter(x => x.id ===foodId)[0].qty)
                            this.productTotal=parseFloat(response.data.kitchen_menu.price)*parseFloat(this.cart.filter(x => x.id ===foodId)[0].qty);
                            this.variantQty=parseFloat(this.cart.filter(x => x.id ===foodId)[0].qty)
                            this.cartMessage="Item already added to the cart"
                            }
                            else
                            {
                                this.productTotal=parseFloat(response.data.kitchen_menu.price)
                                this.quantity=1
                                this.variantQty=1
                            }
                        }
                        else{
                            this.productTotal=parseFloat(response.data.kitchen_menu.price)
                            this.quantity=1
                            this.variantQty=1
                        }
                    this.isMenuLoading = false
                    // this.$refs.menuDetail.open()
                   
                })
                .catch(error => {
                    this.isMenuLoading = false
                    console.log(error.response.data);
                }) 
            }
            return status
        },

        checkCart(food){
            // console.log(this.$store.state.cart.kitchen);
            if(this.$store.state.cart.kitchen!='') {
                if(this.$store.state.cart.kitchen.id==food.kitchen_id) {
                   this.addToCart(food);
                    this.$refs.menuDetail.close()
                } else {
                    Alert.alert(
                        "Confirm",
                        "Clear cart and continue with the order?",
                        [
                            {
                                text: "Cancel",
                                onPress: () => console.log("Cancel Pressed"), style: "cancel"
                            },
                            { 
                                text: "OK", onPress: () => {this.clearCart(food),this.$refs.menuDetail.close()}
                            }
                        ],
                        { cancelable: false }
                    );
                }
               
            }
            else{
                 this.addToCart(food);
                 this.$refs.menuDetail.close()
            }
        },

        clearCart(food) {
            if(this.$store.state.user.authentication!='') {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.clearCart,
                    headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr},
                })
                .then(response => { 
                    Toast.show({
                        text: "Cart Cleared",
                        duration: 3000
                    });
                    this.addToCart(food);
                    this.$store.commit('cart/setKitchen', food.kitchen);
                    this.kitchenId=food.kitchen_id
                    this.$refs.menuDetail.close()
                })
                .catch(error => {
                    console.log(error.response.data);
                    Toast.show({
                        text: "Something went Wrong ",
                        duration: 3000
                    });  
                })
            } else {
                this.$store.commit('cart/unsetCartCount');
                this.$store.commit('cart/unsetCart');
                this.$store.commit('cart/unsetCartTotal');
                this.addToCart(food);
                this.$store.commit('cart/setKitchen', food.kitchen);
                this.kitchenId=food.kitchen_id;
                this.$refs.menuDetail.close();
            }
        },

        addToCart(food){
            console.log(food);
            this.isMenuLoading = true
            if(this.$store.state.user.authentication!='') {
                if(this.quantity=='') {
                    this.quantity=1
                }
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.cartStore,
                    headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                    data:{ food_id:food.id,quantity:this.quantity }
                })
                .then(response => { 
                    this.cartCount=response.data.cartCount;
                    this.$store.commit('cart/setCartCount',response.data.cartCount)
                    this.cartTotal=response.data.cartTotal;
                    this.quantity=1;
                    this.$store.commit('cart/setKitchen',food.kitchen);
                    this.$store.commit('checkout/unsetCouponDiscount')
                    this.isMenuLoading = false
                    Toast.show({
                        text: "Item added to the cart",
                        duration: 3000
                    });
                })
                .catch(error => {
                    this.isMenuLoading = false
                    console.log(error.response.data);
                    Toast.show({
                        text: "Something went Wrong ",
                        duration: 3000
                    });
                })
            } else { 
                 var status = true;
                var cartTotal=0;
                var options={'currentQty':food.quantity,'kitchen_id':food.kitchen_id};
                var cartId=this.makeId();
                
                var data={
                    cartId:cartId,
                    id:food.id,
                    name:food.name,
                    qty:this.quantity,
                    price:food.price,
                    options:options
                }   
                cartTotal=parseFloat(cartTotal)+parseFloat(this.quantity*food.price)
                const storeCart =this.$store.state.cart.cart;
                var cartArray =  []
                for(const key in storeCart){
                    if(food.id==storeCart[key].id) {
                        // alert('test');
                        // Toast.show({
                        // text: "Already added to the cart",
                    
                        // duration: 3000
                        // }); 
                    } else {
                        const list= {
                            'cartId':storeCart[key].cartId,
                            'id':storeCart[key].id,
                            'name':storeCart[key].name,
                            'qty' :storeCart[key].qty,
                            'price':storeCart[key].price,
                            'options':storeCart[key].options
                        }
                        cartTotal=parseFloat(cartTotal)+parseFloat(storeCart[key].qty*storeCart[key].price)
                        cartArray.push(list)
                    }
                }  
                cartArray.push(data)
                var count=cartArray.length
                this.$store.commit('cart/setCartCount',count)
                this.$store.commit('cart/setCart',cartArray)
                // if(!this.$store.state.cart.kitchen) {
                    this.$store.commit('cart/setKitchen',food.kitchen);
                // }
                this.option=''
                this.cart=this.$store.state.cart.cart;
                this.cartCount=this.$store.state.cart.cartCount;
                this.$store.commit('cart/setCartTotal',cartTotal)
                this.$store.commit('checkout/unsetCouponDiscount')
                this.cartTotal=cartTotal;
                // console.log(this.cart);
                this.isMenuLoading = false
                Toast.show({
                    text: "Added to the cart",
                    duration: 3000
                }); 

            }
        },
        cartUpdate(qty,Id='',rowId='') {
            // console.log('changeQty')
            this.isMenuLoading = false
            if(this.$store.state.user.authentication) {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.cartUpdateQuantity,
                    headers: {'Content-Type': 'application/json','Authorization':AuthStr },
                    data:{rowId:rowId,quantity:qty,latitude: this.$store.state.selectedLocation.coords.latitude,longitude: this.$store.state.selectedLocation.coords.longitude}      
                })
                .then(response => { 
                    // console.log(response.data.cart)
                    Toast.show({
                        text: "Cart Updated",
                        duration: 3000
                    }); 
                   
                    this.cart=response.data.cart
                    this.cartCount=response.data.cartCount;
                    this.$store.commit('cart/setCartCount',response.data.cartCount)
                    this.cartTotal=response.data.cartTotal;
                    this.$store.commit('checkout/unsetCouponDiscount')
                    this.isMenuLoading = false
                    this.$refs.menuDetail.close();
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                })
             }
             else
             {
                var status = true;
                var cartTotal=0;
                var Total=0;
                const storeCart =this.$store.state.cart.cart;
                var cartArray =  []
                var oldArray='';
                oldArray=storeCart.filter(x => x.id === Id);
                console.log(oldArray[0].cartId);
                    var data={
                        cartId:oldArray[0].cartId,
                        id:oldArray[0].id,
                        name:oldArray[0].name,
                        qty:qty,
                        price:oldArray[0].price,
                        options:oldArray[0].options,
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
                                'options':storeCart[key].options,
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
                    this.isMenuLoading = false
                   this.$refs.menuDetail.close();
                }
        },
        changeQuantity(quantity)
        {
            this.quantity=quantity
            this.productTotal=(parseFloat(quantity)*parseFloat(this.productPrice)).toFixed(2);
        },
        makeId() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        },
        
        getReportReasons(){
            // console.log('getReportReasons')
            if(this.$store.state.user.loggedIn) {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                console.log('getReportReasons')
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.getReportReasons,
                    headers: {'Authorization': AuthStr,'Content-Type' :'application/json' },
                })
                .then(response => { 
                    // console.log(response.data)
                    response.data.reasons.map((reasonRow) => {
                        this.reportReasons.push({label:reasonRow.name, value:{ id:reasonRow.id, name: reasonRow.name }})
                    })
                })
                .catch(error => {
                    Toast.show({
                        text: response.data.error,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                }); 
            } 
        },
        reportKitchen(){
            if(!this.reportReasonId){
                this.errors.reportReason = 'Please select a report reason'
            } else {
                this.errors.reportReason = ''
            }
            if(!this.reportRemarks){
                this.errors.reportRemarks = 'Remarks field is required'
            } else {
                this.errors.reportRemarks = ''
            }

            if(!this.errors.reportRemarks && !this.errors.reportReason){
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.reportKitchen,
                    data:{
                        kitchen_id:this.kitchenId,
                        reason:this.reportReason,
                        reason_id:this.reportReasonId,
                        remarks:this.reportRemarks
                    },
                    headers: {'Authorization': AuthStr, 'Content-Type': 'application/json' },
                })
                .then(response => { 
                    // console.log(response.data);
                    this.reportReason = ''
                    this.reportReasonId = ''
                    this.reportRemarks = ''
                    this.$refs.reportKitchen.close()
                    Toast.show({
                        text: response.data.success,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    this.isLoading = false
                })
                .catch(error => {
                    Toast.show({
                        text: error.response.data.error,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    this.isLoading = false
                    console.log(error.response.data);
                }) 
            }
        },
    },

}
</script>

<style>
    .slider-image{
        width: 100%;
        height: 170;
        resize-mode: cover;
    }
    .video{
        justify-content: center;
    }
    .favourite-button{
        position: absolute;
        margin: 15;
        right: 0;
        align-self: flex-end;
        top: 0;
        background-color: #FFFFFF;
        border-radius: 30;
        align-items: center;
        justify-content: center;
        height: 23;
        width: 23;
    }
    .favourite-button-icon{
        width: 15;
        height: 15;
        /* margin-right: 16; */
        resize-mode: contain;
    }
    .favourite-button-active-icon{
        width: 15;
        height: 15;
        /* margin-right: 16; */
        resize-mode: contain;
        tint-color: #f0373e;
    }
    .play-button{
        position: absolute;
        align-self: center;
    }
    .play-button-icon{
        width: 45;
        height: 45;
        resize-mode: contain;
        z-index: 9999;
    }
    .kitchen-head{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .kitchen-name{
        color: #364151;
        font-size: 16;
        font-family: Montserrat_SemiBold;
        margin-bottom: 8;
    }
    .kitchen-share{
        height: 15.5;
        width: 15.5;
    }
    .kitchen-description{
        font-size: 12; 
        /* flex: 1; */
        color: #707070;
    }   
    .kitchen-detail{
        flex-direction: row;
        margin-top: 12;
    }
    .kitchen-location, .kitchen-distance, .kitchen-rating{
        flex-direction: row;
        align-items: center;
        margin-right: 12;
    }
    .kitchen-report{
        flex-direction: row;
        align-items: center;
        align-self: flex-end;
    }
    .location-icon, .distance-icon, .rating-icon{
        width: 12;
        height: 12;
        margin-right: 6;
        resize-mode:contain;
    }
    .location-text, .distance-text, .rating-text{
        font-family: Montserrat_Medium;
        font-size: 10;
        /* align-self: center; */
        color: #655c5c;
    }
    /* .distance-icon{
        width: 12;
        height: 12;
        margin-right: 8;
    }
    .distance-text{
        font-family: Montserrat_Medium;
        font-size: 10;
        color: #364151;
    }
    .rating-icon{
        width: 12;
        height: 12;
        margin-right: 8;
    }
    .rating-text{
        font-family: Montserrat_Medium;
        font-size: 10;
        color: #655c5c;
    } */

    /* Menu Items */
   .product-thumb{
        width: 98;
        height: 98;
        resize-mode: contain;
        border-radius: 60;
    }
    .food-type{
        width: 7;
        height: 7;
        resize-mode:contain;
    }
    .menu-list-item{
        margin-left: 0;
        background-color: #FFFFFF;
        elevation: 3;
        border-radius: 8;
        padding-right: 10;
        margin-bottom: 10;
        padding-vertical:5;
        padding-left: 5;
    }
    .menu-item-name{
        font-family: Montserrat_SemiBold;
        font-size: 14;
        color: #000000;
    }
    .menu-item-kitchen{
        font-size: 12;
        color: #f2b600;
        font-family: Montserrat_Medium;
    }
    .menu-item-description{
        font-size: 10;
        color: #7d7b76;
        margin-bottom: 5;
    }
    .menu-item-order-time{
        font-size: 10;
        font-family: Montserrat_SemiBold;
        color: #a1a6ae;
        margin-bottom: 3;
    }
    .menu-item-time{
        font-size: 10;
        font-family: Montserrat_SemiBold;
        color: #364151;
    }
    .price-section{
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: -3;
    }
    .menu-item-price{
        color: #364151;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }
    .menu-item-quantity{
        color: #f0373e;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }
    .menu-item-quantity-remaining{
        color: #364151;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }
    .menu-item-distance{
        flex-direction: row;
        align-items: center;
    }
    .menu-item-distance-icon{
        width: 9.2;
        height: 9.2;
        resize-mode: contain;
        margin-right: 5;
    }
    .menu-item-distance-text{
        color: #364151;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }

    /* Modal */

    .modal-menu-image{
        height: 150;
        resize-mode: cover;
    }
    .modal-close{
        margin: 15;
        align-self: flex-end;
        border-radius:30;
        background-color: #FFFFFF; 
        padding:3;
    }
    .modal-close-icon{
        width: 24;
        height: 24;
        tint-color: #000000;
    }
    .modal-menu-name{
        color: #5d5757;
        font-size: 16;
        font-family: Montserrat_Medium;
        margin-bottom: 4;
    }
    .modal-menu-description{
        font-size: 12;
        color: #989696;
    }
    .modal-instruction{
        margin-top: 20;
        margin-bottom: 15;
    }
    .instruction-head{
        font-size: 14;
        color: #5d5757;
        font-family: Montserrat_Medium;
        margin-bottom: 5;
    }
    .modal-input-field{
        margin-bottom: 8;
    }
    .modal-input{
        font-size: 12;
        color: #cbc7c7;
        margin-bottom: -8;
    }
    .modal-footer{
        height: 47;
        flex-direction: row;
        border-top-width: 2;
        border-top-color: #e4e1e1;
    }
    .modal-menu-price{
        padding-horizontal: 15;
        flex:0.8;
        justify-content: center;
    }
    .menu-quantity{
        font-size: 12;
        color: #959595;
    }
    .menu-price{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #554444;
    }
    .modal-add-cart-button{
        background-color: #fcbe00;
        border-top-left-radius: 20;
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .add-cart-button-text{
        font-size: 14;
        color: #FFFFFF;
        font-family: Montserrat_Medium;
    }
    .add-cart-button-icon{
        width: 8.5;
        height: 14.1;
    }

    /* Gallery */

    .gallery-video, .gallery-image{
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap; 
        margin-bottom: 10;
    }
    .video-item{
        flex-basis: 32%;
        align-items: center;
        margin-bottom: 5;
        margin-right: 2.5;
        align-self: flex-start;
    }
    .video-thumb{
        resize-mode: contain;
        align-items: center;
        justify-content: center;
    }
    .gallery-head{
        font-size: 12;
        color: #707070;
        margin-bottom: 10;
    }
    .video-play-icon{
        width: 29;
        height: 29;
        resize-mode: contain;
    }

    /* Review & Rating */

    .rating-head{
        align-items: center;
        margin-bottom: 10;
    }
    .rating-text{
        font-size: 11;
        color: #707070;
        margin-bottom: 5;
    }
    .review-list-item{
        margin-bottom: 20;
    }
    .review-head{
        flex-direction: row;
        align-items: flex-end;
        margin-bottom: 5;
    }
    .review-user-icon{
        height:33;
        width: 33;
        background-color: #ff3434;
        border-radius: 30;
        justify-content: center;
        align-items: center;
        margin-right: 10;
    }
    .review-user-letter{
        font-size: 14;
        font-family: Montserrat_SemiBold;
        color: #FFFFFF;
    }
    .review-name-rating{
        flex: 1;
    }
    .review-user-name{
        font-size: 12;
        color: #707070;
        font-family: Montserrat_Medium;
    }
    .review-date{
        font-size: 9;
        color: #9a9797;
    }
    .review-description{
        font-size: 11;
        color: #707070;
    }

    /* About */
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

    /* Cancel Modal */

    .modal-header{
        margin-bottom: 5;
        margin-top: 20;
        padding-horizontal: 13;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .modal-header-title{
        font-size: 16;
        margin-bottom: 2;
        color: #414141;
        font-family: Montserrat_Medium;
    }
    .picker-container{
        margin-bottom: 10;
    }
    .cancel-label{
        font-size: 12;
        color: #000000;
        margin-bottom: 5;
        font-family: Montserrat_Medium;
    }
    .comment-label{
        font-size: 12;
        margin-bottom: 8;
    }
    .comment-input {
        border-width: .8;
        border-color: #d1d1d1;
        border-radius: 4;
        padding: 4;
    }

    /* Footer Button */

    .modal-footer{
        height: 48;
        flex-direction: row;
        justify-content: space-evenly;
        border-top-width: 1;
        border-top-color: #e2e2e2;
    }
    .modal-goback-button{
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .modal-goback-button-text{
        font-size: 14;
        color: #fcbe00;
        font-family: Montserrat_Medium;
    }
    .modal-cancel-button{
        background-color: #fcbe00;
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .modal-cancel-button-text{
        font-size: 14;
        color: #FFFFFF;
        font-family: Montserrat_Medium;
    }
    .modal-goback-button-icon{
        width: 10;
        height: 18.2;
        tint-color: #FFFFFF;
        resize-mode: contain;
    }
    .modal-cancel-button-icon{
        width: 10;
        height: 18.2;
        tint-color: #FFFFFF;
        resize-mode: contain;
    }
</style>