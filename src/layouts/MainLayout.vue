<template>
  <div class="layout">
    <Sidebar />

    <div class="main">
      <Navbar />

      <main class="content">
        <router-view />
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Sidebar from '../components/Sidebar.vue'
import Footer from '../components/Footer.vue'
</script>

<style scoped>
.layout{
    display:flex;
    min-height:100vh;
}

.main{
    flex:1;
    display:flex;
    flex-direction:column;
    min-width: 0;
}

.content{
    flex:1;
    padding:32px 40px;
    background: var(--bg);
}
</style>