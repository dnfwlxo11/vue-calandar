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
      <month-calendar v-if="currMode==='month'" :date="initDate" :data="initData[initDate.year]" @update:data="updateData" />
      <week-calendar v-else-if="currMode==='week'" />
      <day-calendar v-else-if="currMode==='day'" />
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
      initData: null,
      currMode: 'month',
    }
  },
  methods: {
    init() {
      // date 초기설정
      const tmpDate = JSON.parse(localStorage.getItem('currDate'));
      tmpDate === null ? this.setDate() : this.initDate = tmpDate;

      // calendar data 초기설정
      let tmpData = JSON.parse(localStorage.getItem('calendarData'));

      if (tmpData === null) {
        localStorage.setItem('calendarData', JSON.stringify({}));
        tmpData = JSON.parse(localStorage.getItem('calendarData'));
      }

      const targetYear = this.initDate.year;
        
      // eslint-disable-next-line no-prototype-builtins
      if (!tmpData.hasOwnProperty(targetYear)) {
        tmpData[targetYear] = {};
        localStorage.setItem('calendarData', JSON.stringify(tmpData));
        tmpData = JSON.parse(localStorage.getItem('calendarData'));
      }

      this.initData = tmpData;
    },
    setDate(date = null) {
      const targetDate = date === null ? new Date() : new Date(date);

      let nowDateInfor = this.$Utils.dateUtils.extractDateInfor(targetDate);
      const lastDayInfor = this.$Utils.dateUtils.getLastDay(nowDateInfor.year, nowDateInfor.month);

      nowDateInfor = { ...nowDateInfor, ...lastDayInfor }

      localStorage.setItem('currDate', JSON.stringify(nowDateInfor));
      this.initDate = nowDateInfor;
    },
    setData() {
      let tmpData = JSON.parse(localStorage.getItem('calendarData'));
      const targetYear = this.initDate.year;
        
      // eslint-disable-next-line no-prototype-builtins
      if (!tmpData.hasOwnProperty(targetYear)) {
        tmpData[targetYear] = {};
        localStorage.setItem('calendarData', JSON.stringify(tmpData));
        tmpData = JSON.parse(localStorage.getItem('calendarData'));
      }

      this.initData = tmpData;
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

        console.log(year, month)
        this.setDate(`${year}-${month}`);
        // this.setData();
      } 
    },
    updateData(value) {
      const updateYear = value.year;
      console.log(this.initData, value)
      this.$set(this.initData, updateYear, { ...this.initData[updateYear], ...value.submitData })
      this.initData
      localStorage.setItem('calendarData', JSON.stringify(this.initData));
      this.initData = JSON.parse(localStorage.getItem('calendarData'));
    },
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
    border: 1px solid lightgrey;
    // box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;
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