<template>
  <div id="calandar">
    <div class="calandar-nav">
      <div class="date-sector">
        <button class="mdi mdi-chevron-left" @click="moveCalandar('prev')"></button>
        {{initDate.year}}년 {{initDate.month}}월
        <button class="mdi mdi-chevron-right" @click="moveCalandar('next')"></button>
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
    init() {
      const tmpDate = JSON.parse(localStorage.getItem('currDate'));
      if (tmpDate === null) {
        const now = new Date();

        let nowDateInfor = this.$Utils.dateUtils.extractDateInfor(now);
        const lastDayInfor = this.$Utils.dateUtils.getLastDay(nowDateInfor.year, nowDateInfor.month);

        nowDateInfor = { ...nowDateInfor, ...lastDayInfor }

        localStorage.setItem('currDate', JSON.stringify(nowDateInfor));
        this.initDate = nowDateInfor;
      } else {
        this.initDate = tmpDate;
      }
    },
    moveCalandar(direction) {
      if (this.currMode === 'month') {
        let year = this.initDate.year;
        let month = parseInt(this.initDate.month);

        if (direction === 'prev') {
          if (month === 1) {
            year -= 1;
            month = 12;
          } else {
            month -= 1;
          }
        } else {
          if (month === 12) {
            year += 1;
            month = 1;
          } else {
            month += 1;
          } 
        }

        const date = new Date(`${year}-${month}`)
        let moveDate = this.$Utils.dateUtils.extractDateInfor(date)
        const lastDayInfor = this.$Utils.dateUtils.getLastDay(year, month);

        moveDate = { ...moveDate, ...lastDayInfor }

        localStorage.setItem('currDate', JSON.stringify(moveDate));
        this.initDate = JSON.parse(localStorage.getItem('currDate'));
        this.$set(this.initDate, 'year', year)
      } 
    }
  },
  created() {
    this.init();
  },
  mounted() {
    
  },
}
</script>

<style lang="scss">
#calandar {
    width: 100%;
    height: 90%;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;
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