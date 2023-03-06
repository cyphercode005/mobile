<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="FAQs" :style="{backgroundColor:'#FFFFFF', elevation:2}"/>
        <nb-content padder  :automaticallyAdjustContentInsets="true">
            <nb-view v-if="faqs.length > 0">
                <nb-view class="faq-item faq-section" padder v-for="faq in faqs" :key="faq.id"  :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                    <touchable-opacity class="faq-header" :on-press="()=> toggleList('faqList'+faq.id)" >
                        <nb-text :class="toggledList=='faqList'+faq.id ? 'header-text-active' : 'header-text'">{{faq.title}}</nb-text>
                        <image v-if="toggledList=='faqList'+faq.id" class="header-right-icon" :source="require('../../../../../assets/images/icons/chevron_down.png')" />
                        <image v-else class="header-right-icon" :source="require('../../../../../assets/images/icons/chevron-right.png')" />
                    </touchable-opacity>
                    <nb-view class="faq-list" v-if="toggledList=='faqList'+faq.id">
                        <nb-text class="faq-item-text">{{faq.content}}</nb-text>
                    </nb-view>
                </nb-view>
            </nb-view>
            <nb-view class="no-result" v-if="!isLoading && !faqs.length" >
                <nb-text class="no-result-text">Empty</nb-text>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    },
 data() {
        return {
            faqs:[],
            toggledList: '',
            isLoading: false
        }
    },
    beforeMount() {
        this.toggledList = 'faqList'+1,
        this.getFaqs()
    },        
    methods: {
        toggleList(faqList){
            this.toggledList = faqList
        },
        getFaqs(){
            var status=true;
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.allFaq,
                headers: { 'Content-Type': 'application/json'
                },
            })
            .then(response => { 
                console.log(response.data)
                this.faqs=response.data.faq;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            })
            return status;
        }
    },
}
</script>

<style>
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

    /* Industry List */

    .faq-section{
        background-color: #FFFFFF;
        border-radius: 10;
        elevation: 3;
    }
    .faq-item{
        margin-vertical: 4;
    }
    .faq-header{
        flex-direction: row;
        align-items: center;
        flex: 1;
        /* height: 25; */
    }
    .header-faq-icon{
        width: 19.4;
        height: 19.4;
        resize-mode: contain;
        tint-color: #727c8e;
    }
    .header-text{
        font-family: Montserrat_Medium;
        color: #2f3f4e;
        font-size: 14;
        flex: 1;
        padding: 0;
    }
    .header-faq-icon-active{
        width: 19.4;
        height: 19.4;
        resize-mode: contain;
        tint-color: #06b2a1;
    }
    .header-text-active{
        font-family: Montserrat_Medium;
        color: #fcbe00;
        font-size: 14;
        flex: 1;
        padding: 0;
    }
    .header-right-icon{
        width: 15;
        height: 15;
        resize-mode: contain;
        tint-color: #515c6f;
    }

    .faq-list{
        margin-top: 5;
    }
    .faq-item-text{
        font-family: Montserrat_Regular;
        color: #1a1a1a;
        font-size: 12;
    }
    .faq-list-item{
        margin-right: 0;
        height: 20;
    }
    .separator{
        border-top-width: 1;
        border-top-color: #727c8e;
        margin-vertical: 5;
        margin-left:39;
    }
</style>