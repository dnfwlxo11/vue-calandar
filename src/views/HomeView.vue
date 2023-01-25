<template>
  <div id="home" class="container">
    <!-- <div class="custom">
      <Calendar />
    </div> -->
    <div class="custom">
      <DaeinCalendar />
    </div>
  </div>
</template>

<script>
import DaeinCalendar from "daein-calendar";
import Calendar from "./Calendar";

export default {
  name: "HomeView",
  components: {
    Calendar,
    DaeinCalendar,
  },
};
</script>

<style>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  width: 100%;
  height: 100%;
}

.custom {
  width: 95%;
  height: 95%;
}
</style>
