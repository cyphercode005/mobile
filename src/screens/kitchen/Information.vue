<template>
    <nb-container v-model="getInformation">
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" :headerTitle="title" />
        <nb-content padder>
            <image class="logo" :source="require('../../../assets/images/kitchen/logo.png')"/>
            <nb-text class="description">{{ description }}</nb-text>
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
            information: '',
            title: '',
            description: '',
            isLoading: false   
        }
    },
    computed: {
        getInformation(){
            console.log('test')
            this.isLoading=true
            var status=true;
            console.log(this.navigation.state.params.infoId) 
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.getInformation,
                headers: { 'Content-Type': 'application/json' },
                data:{ info_id:this.navigation.state.params.infoId }
            })
            .then(response => { 
                console.log(response.data.information)
                this.isLoading=false
                this.information = response.data.information
                this.title = this.information.title.en
                this.description = this.information.description.en
                // this.allInformation=response.data.information;
            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);
            })
            return status;
        }
    },
}
</script>

<style>
    .logo{
        height: 110;
        width: 100%;
        resize-mode: contain;
        margin-top: 10;
        margin-bottom: 50;
    }
    .description{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #364151;
        line-height: 16;
    }
</style>