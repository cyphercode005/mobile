<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" :headerTitle="allInformation.title" />
        <nb-content padder>
            <nb-view>           
                <nb-text class="info" >{{allInformation.description}}</nb-text>   
            </nb-view>
        </nb-content>
        <footer :navigation="navigation" />
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            headerTitle:'Information',
            allInformation:'',
            isLoading: false
        }
    },
    beforeMount() {
        var status=true;
        this.isLoading = true
        console.log(this.navigation.state.params.slug)        
        this.api.create({

            method: 'POST',
            url: this.api.routes.getInformation,
            headers: { 'Content-Type': 'application/json'
            },
            data:{slug:this.navigation.state.params.slug}

        })
        .then(response => { 
            console.log(response.data.information)
            this.allInformation=response.data.information;
            this.isLoading = false
        })
        .catch(error => {
            this.isLoading = false
            console.log(error.response.data);
        })
        return status;
    },
    methods: {

    },
}
</script>

<style>
 .info{
  
     font-size: 10;
     color: #000000;
     line-height: 18;

 }



</style>