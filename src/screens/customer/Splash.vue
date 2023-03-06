<template>
    <nb-container>
        <!-- <StatusBar
            barStyle="light-content"
        /> -->
        <!-- <nb-content :style="{flex:1}"> -->
            <IndicatorViewPager :style="{flex:1, flexDirection:'column-reverse'}" ref="viewPager" :indicator="_renderDotIndicator()">
                <nb-view :style="{flex:1}">
                    <touchable-opacity :on-press="skipWalkthrough" class="skip-button">
                        <nb-text note class="skip-text">Skip</nb-text>
                    </touchable-opacity>
                    <image :source="require('../../../assets/images/walkthrough/1.png')" :style="{width:appConfig.width, alignSelf:'flex-end'}" class="walkthrough-image"/>
                    <nb-view class="walkthrough-container">
                        <nb-text class="walkthrough-title">Offers & Cashbacks</nb-text>
                        <nb-text class="walkthrough-description">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots .</nb-text>
                    </nb-view>
                    <touchable-opacity class="walkthrough-button" :on-press="() => slide(1)">
                        <image :source="require('../../../assets/images/icons/next.png')" class="walkthrough-button-icon" />
                    </touchable-opacity>
                </nb-view>
                <nb-view :style="{flex:1}">
                    <touchable-opacity :on-press="skipWalkthrough" class="skip-button">
                        <nb-text note class="skip-text">Skip</nb-text>
                    </touchable-opacity>
                    <image :source="require('../../../assets/images/walkthrough/2.png')" :style="{width:appConfig.width, alignSelf:'flex-end'}" class="walkthrough-image"/>
                    <nb-view class="walkthrough-container">
                        <nb-text class="walkthrough-title">Offers & Cashbacks</nb-text>
                        <nb-text class="walkthrough-description">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots .</nb-text>
                    </nb-view>
                    <touchable-opacity class="walkthrough-button" :on-press="() => slide(2)">
                        <image :source="require('../../../assets/images/icons/next.png')" class="walkthrough-button-icon" />
                    </touchable-opacity>
                </nb-view>
                <nb-view :style="{flex:1}">
                    <touchable-opacity :on-press="skipWalkthrough" class="skip-button">
                        <nb-text note class="skip-text">Skip</nb-text>
                    </touchable-opacity>
                    <image :source="require('../../../assets/images/walkthrough/3.png')" :style="{width:appConfig.width, alignSelf:'flex-end'}" class="walkthrough-image"/>
                    <nb-view class="walkthrough-container">
                        <nb-text class="walkthrough-title">Offers & Cashbacks</nb-text>
                        <nb-text class="walkthrough-description">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots .</nb-text>
                    </nb-view>
                    <touchable-opacity class="walkthrough-button"  :on-press="skipWalkthrough">
                        <image :source="require('../../../assets/images/icons/complete.png')" class="walkthrough-button-icon" />
                    </touchable-opacity>
                </nb-view>
            </IndicatorViewPager>
        <!-- </nb-content> -->
    </nb-container>
</template>

<script>
    import React from 'react';
    import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from '@shankarmorwal/rn-viewpager'

    export default {
        props: {
            navigation : { Object }
        },
        components:{
            PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator
        },
        data() {
            return {
               slideNumber:0
            }
        },

        methods: {
            _renderDotIndicator() {
                return <PagerDotIndicator pageCount="3" 
                dotStyle={{backgroundColor:'#f9e5a6', width:48,height:9,marginRight:5}}
                selectedDotStyle={{backgroundColor:'#fcbe00',width:48,height:9,marginRight:5}} 
                style={{justifyContent:'flex-start', bottom:50, left:25}}/>;
            },
            skipWalkthrough(){
                this.navigation.navigate('Verify')
            },
            slide(slideNumber){
                console.log('Test')
                this.$refs.viewPager.setPage(slideNumber);
            }
        },
    }
</script>

<style>
    .skip-button{
        margin-top: 55;
        align-self: flex-end;
        margin-right:30;
    }
    .skip-text{
        color:#fcbe00;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }
    .walkthrough-image{
        height:50%;
        margin-top:25;
        resize-mode: contain;
        margin-bottom: 30;
    }
    .walkthrough-container{
        padding-horizontal:25;
    }
    .walkthrough-title{
        font-size: 16;
        color: #364151;
        margin-bottom: 4;
        font-family: Montserrat_ExtraBold;
    }
    .walkthrough-description{
        color: #656565;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .walkthrough-button{
        margin-top: 35;
        align-self: flex-end;
        margin-right: 25;
    }
    .walkthrough-button-icon{
        height: 41;
        width: 41;
    }
</style>