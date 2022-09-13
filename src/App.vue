<template>
  <router-view></router-view>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    name: "app",
    data() {
      return {};
    },
    computed: {
      ...mapState(["items", "searchResult"])
    },
    created() {
      this.$store.dispatch("loadPopularMovies");
    }
  }
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
}
header {
  position: fixed;
  z-index: 1;
}

main {
  flex: 1;
  min-height: 100vh;
}

</style>
