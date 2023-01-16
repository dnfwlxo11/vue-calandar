<template>
    <div id='home' class="container">
        <strong>베이직 캘린더</strong>
        <Calandar />
    </div>
</template>

<script>
import Calandar from './Calandar'

export default {
    name: 'HomeView',
    components: {
        Calandar,
    }
}
</script>

<style>
.container {
    text-align: center;
    margin: 0 auto;
    width: 80%;
    height: 100%;
}
</style>