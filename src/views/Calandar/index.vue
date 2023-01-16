<template>
  <div id="calandar">
    <div class="calandar-nav">
      <div class="date-sector">
        <button class="mdi mdi-chevron-left" @click="moveCalandar"></button>
        {{initDate.year}}년 {{initDate.month}}월
        <button class="mdi mdi-chevron-right"></button>
      </div>
      <div class="menu-sector">
        <select name="calandar-menu" id="calandar-menu" v-model="currMode">
          <option value="month" selected>월</option>
          <option value="week">주</option>
          <option value="day">일</option>
        </select>
      </div>
    </div>
    <div class="calandar-body">
      <MonthCalendar v-if="currMode==='month'" :dateInfor="initDate" />
      <WeekCalendar v-else-if="currMode==='week'" />
      <DayCalendar v-else-if="currMode==='day'" />
    </div>
  </div>
</template>

<script>
import MonthCalendar from './vues/MonthCalendar.vue'
import WeekCalendar from './vues/WeekCalendar.vue'
import DayCalendar from './vues/DayCalendar.vue'

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Calandar',
  components: {
    MonthCalendar,
    WeekCalendar,
    DayCalendar,
  },
  data() {
    return {
      initDate: null,
      currDate: null,
      currMode: 'month',
    }
  },
  methods: {
    getNow() {
      const tmpDate = JSON.parse(localStorage.getItem('currDate'));

      if (tmpDate === null) {
        let nowDateInfor = this.$Utils.dateUtils.extractDateInfor();
        const lastDayInfor = this.$Utils.dateUtils.getLastDay(nowDateInfor.year, nowDateInfor.month);

        nowDateInfor = { ...nowDateInfor, ...lastDayInfor }

        localStorage.setItem('currDate', JSON.stringify(nowDateInfor));
        this.initDate = nowDateInfor;
      } else {
        this.initDate = tmpDate;
      }
    },
    drawCalandar() {

    },
    moveCalandar() {
      
    }
  },
  created() {
    this.getNow();
  },
  mounted() {
    
  },
}
</script>

<style lang="scss">
#calandar {
    width: 100%;
    height: 90%;
    border: 1px solid black;
}

.calandar-nav {
  height: 50px;
  border-bottom: 1px solid lightgrey;
  padding: 0 5% 0 5%;
  display: flex;
  align-items: center;
  justify-content: center;

  & .date-sector {
    margin-right: auto;
    font-size: 20px;
    font-weight: 600;

    & button {
      background-color: inherit;
      border: none;
      font-size: 22px;

      &:hover {
        background-color: lightgrey;
      }
    }
  }

  & .menu-sector {
    height: 100%;
    margin-left: auto;
    display: inherit;
    align-items: center;

    & select {
      height: 70%;
      width: 60px;
      text-align: center;
      font-size: 16px;
    }
  }
}

.calandar-body {
  height: calc(100% - 50px);
}
</style>