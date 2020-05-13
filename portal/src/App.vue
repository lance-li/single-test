<template>
  <div id="container">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div id="subAppLayout" class="app-view-box" v-html="content"></div>
    <div v-if="loading" class="subapp-loading"></div>
    <!--<router-view/>-->
  </div>
</template>

<script>
  import apiDataFilter from "./utils/apiDataFilter";

  export default {
    name: 'framework',
    props: {
      loading: Boolean,
      content: String,
    },
    data() {
      return {}
    },
    beforeMount() {

    },
    mounted() {
 /*     apiDataFilter.request({
        apiPath:'common.regions',
      }).then((res)=>{
         console.log(res)
      })*/
    },
    methods: {
      goto(title, href) {
        window.history.pushState({}, title, href);
      },
    }
  }

</script>

<style lang="less">
#container {
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
