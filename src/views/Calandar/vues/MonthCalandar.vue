<template>
  <div id="month-calandar">
    <div class="month-nav">
      <div v-for="(day, idx) of ['일', '월', '화', '수', '목', '금', '토']" :key="idx" class="day-of-week">
        {{day}}
      </div>
    </div>
    <div class="days">
      <div v-for="(data, idx) of arrays" :key="idx" class="day-card">
        asd
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'MonthCalandar',
  data() {
    return {
      arrays: []
    }
  },
  mounted() {
    this.arrays = new Array(35);
  }
}
</script>

<style lang="scss">
#month-calandar {
  height: 100%;
}

.month-nav {
  height: 30px;
  display: flex;
  justify-content: space-between;

  & .day-of-week {
    width: calc((100% - 7px) / 7);
    border-right: 1px solid lightgrey;
  }
}

.days {
  height: calc(100% - 30px);

  display: flex;
  flex-wrap: wrap;

  & .day-card {
    height: calc(((100% - 4px) / 5));
    width: calc(((100% - 7px) / 7));
    border-right: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;

    &:hover {
      cursor: pointer;
      background: lightgrey;
    }
  }
}


</style>