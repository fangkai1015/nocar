<template>
    <header class="insure-header">
          <div class="insure-return"  @click="returnBack()"></div>
          <h3 class="insure-subtitle">{{titleName}}</h3>
          <slot name="collect"></slot>
          <slot name="home"></slot>
          <slot name="renew"></slot>
    </header>
</template>

<script>
export default {
  name: 'headerbox',
  props:['titleName'],
    data () {
        return {

        }
    },
    methods: {
        returnBack:function(){
            this.$router.go(-1);
        }
    },
    mounted () {

    }
}
</script>

