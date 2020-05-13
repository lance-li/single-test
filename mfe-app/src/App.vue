<template>
  <div id="app">
    <div id="nav">
      <span @click="handleGo"> Home</span>
      <span @click="handleGoAbout">About</span>
  <!--    <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>-->
    </div>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data(){
      return{

      }
    } ,
    methods:{
      handleGo(){
        this.$router.push('/')
      },
      handleGoAbout(){
        this.$router.push('/About')
      }
    }
  }
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
