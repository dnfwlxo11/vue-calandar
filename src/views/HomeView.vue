<template>
    <div id='home' class="container">
        <Calandar />
    </div>
</template>

<script>
import Calandar from './Calandar'

export default {
    name: 'HomeView',
    components: {
        Calandar,
    },
}
</script>

<style>
.container {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    margin: 0 auto;
    width: 80%;
    height: 100%;
}
</style>