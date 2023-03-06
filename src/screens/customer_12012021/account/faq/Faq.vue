<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="FAQs" :style="{backgroundColor:'#FFFFFF', elevation:2}"/>
        <nb-content padder>
            <nb-view v-if="allFaq.length" >
                 <nb-accordion
                    :dataArray="allFaq"
                    icon="add"
                    expandedIcon="remove"
                    :iconStyle="{ color: '#f2b600' }"
                    :expandedIconStyle="{ color: '#f2b600' }"
                    :headerStyle="{fontFamily:'Montserrat_SemiBold', fontSize:12, backgroundColor:'#dddddd'}"
                    :contentStyle="{fontFamily:'Montserrat_Regular', fontSize:12, backgroundColor:'#efefef'}"
                />
            </nb-view>
            <nb-view class="no-result" v-else >
                <nb-text class="no-result-text">Empty</nb-text>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
import React from "react";
import { View, Text, Icon } from "native-base";
export default {
    props: {
        navigation: { Object }
    },
 data() {
        return {
              
            allFaq:[],
            isLoading: false
        }
    },
     methods: {
        
    _renderContent(content) {
      return (
        <Text style={{ color: "#000000",fontSize: 10,lineHeight: 18}}>
          {content}
        </Text>
      );
    },

    _renderHeader(title, expanded){
        return (
        <View
          style={{ flexDirection: "row", padding: 10, justifyContent: "space-between", alignItems: "center", backgroundColor: "#A9DAD6"}}
        >
          <Text style={{ fontWeight: "600" }}>
            {" "}{title}
          </Text>
          
        </View>
      );
    }
 
    },
    beforeMount() {
        var status=true;
        this.isLoading = true
        this.api.create({
            method: 'POST',
            url: this.api.routes.allFaq,
            headers: { 'Content-Type': 'application/json'
            },
        })
        .then(response => { 
            // console.log(response.data)
            this.allFaq=response.data.faq;
            this.isLoading = false
        })
        .catch(error => {
            this.isLoading = false
            console.log(error.response.data);
        })
        return status;
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
</style>