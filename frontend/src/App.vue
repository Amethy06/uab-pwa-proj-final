<template>
  <NavBar />
  <router-view/>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import "./App.css"

export default {
  components: {
    NavBar,
  },
}
</script>
