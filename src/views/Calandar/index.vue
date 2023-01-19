<template>
  <div id="calandar">
    <div class="calandar-nav">
      <div class="date-sector">
        <div v-if="calendarType==='month'">
          <button class="mdi mdi-chevron-left" @click="monthControll('prev')"></button>
          {{initDate.year}}년 {{initDate.month}}월
          <span v-if="calendarType === 'week'">
            <small>{{ initDate.nowWeek }}주차</small>
          </span>
          <button class="mdi mdi-chevron-right" @click="monthControll('next')"></button>
        </div>
        <div v-else-if="calendarType==='week'">
          <button class="mdi mdi-chevron-left" @click="weekControll('prev')"></button>
          {{initDate.year}}년 {{initDate.month}}월 <small>{{ initDate.nowWeek }}주차</small>
          <button class="mdi mdi-chevron-right" @click="weekControll('next')"></button>
        </div>
        <div v-else>
          <button class="mdi mdi-chevron-left" @click="weekControll('prev')"></button>
          {{initDate.year}}년 {{initDate.month}}월 {{ initDate.day }}일
          <button class="mdi mdi-chevron-right" @click="weekControll('next')"></button>
        </div>
      </div>
      <div class="menu-sector">
        <select name="calandar-menu" id="calandar-menu" v-model="calendarType">
          <option value="month" selected>월간</option>
          <option value="week">주간</option>
          <option value="day">일간</option>
        </select>
      </div>
    </div>
    <div class="calandar-body">
      <month-calendar v-if="calendarType==='month'" :monthData="{ ...initDate, data: initData[this.initDate.month] }" @update:data="updateData" />
      <week-calendar v-else-if="calendarType==='week'" :weekData="{ ...initDate, data: initData[this.initDate.month] }" @update:data="updateData" />
      <day-calendar v-else-if="calendarType==='day'" :dayData="{ ...initDate, data: initData[this.initDate.month] }" @update:data="updateData" />
    </div>
  </div>
</template>

<script>
import MonthCalendar from './MonthCalendar.vue'
import WeekCalendar from './WeekCalendar.vue'
import DayCalendar from './DayCalendar.vue'

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
      calendarType: 'day',
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // date 초기설정
      const tmpDate = this.$Utils.localDB.selectData('currDate');
      tmpDate === null ? this.setDate() : this.initDate = tmpDate;

      // calendar data 초기설정
      let tmpData = this.$Utils.localDB.selectData('calendarData');

      if (tmpData === null) 
        this.$Utils.localDB.insertData('calendarData', {});

      this.setData();
    },
    setDate(date = null) {
      // 월 관련 데이터 설정
      const targetDate = date === null ? new Date() : new Date(date);
      let nowDateInfor = this.$Utils.dateUtils.extractDateInfor(targetDate);

      // 주 관련 데이터 설정
      const weekEndDay = ((nowDateInfor.nowWeek * 7) - nowDateInfor.firstDate);
      const weekStartDay = weekEndDay - 6;
      nowDateInfor = { 
        ...nowDateInfor, 
        weekStartDay: weekStartDay,
        weekEndDay: weekEndDay, 
      }

      this.initDate = this.$Utils.localDB.insertData('currDate', nowDateInfor);
    },
    setData() {
      const targetYear = this.initDate.year;
      let tmpData = this.$Utils.localDB.selectData('calendarData');
      
      // eslint-disable-next-line no-prototype-builtins
      if (!tmpData.hasOwnProperty(targetYear)) {
        tmpData[targetYear] = {};
        ['01', '02', '03', '04', '05', '06', 
          '07', '08', '09', '10', '11', '12'].map(month => {
            tmpData[targetYear][month] = {};
        })
        tmpData = this.$Utils.localDB.updateData('calendarData', tmpData);
      }

      this.initData = tmpData[targetYear];
    },
    // calendarType이 month일때 컨트롤
    monthControll(flag) {
      let year = this.initDate.year;
      let month = parseInt(this.initDate.month);
      
      if (flag === 'prev') {
        if (month === 1) { 
          this.$set(this.initDate, 'year', year - 1);
          this.$set(this.initDate, 'month', 12);
        } 
        else this.$set(this.initDate, 'month', (month - 1).toString().padStart(2, '0'));

        this.setDate(`${this.initDate.year}-${this.initDate.month}-01`);
      } else {
        if (month === 12) { 
          this.$set(this.initDate, 'year', year + 1);
          this.$set(this.initDate, 'month', '01');
        }
        else this.$set(this.initDate, 'month', (month + 1).toString().padStart(2, '0'));

        this.setDate(`${this.initDate.year}-${this.initDate.month}-01`);
      }

      this.setData();
    },
    // calendarType이 week일때 컨트롤
    weekControll(flag) {
      let nowWeek = this.initDate.nowWeek;
      let totalWeek = this.initDate.totalWeek;
      let weekStartDay = this.initDate.weekStartDay;
      let weekEndDay = this.initDate.weekEndDay;

      if (flag === 'prev') {
        this.$set(this.initDate, 'weekStartDay', weekStartDay - 7);
        this.$set(this.initDate, 'weekEndDay', weekEndDay - 7);
        this.$set(this.initDate, 'nowWeek', nowWeek - 1);

        if (nowWeek === 1) {
          this.monthControll('prev');
          this.setDate(`${this.initDate.year}-${this.initDate.month}-${this.initDate.lastDay}`);
          this.setData();
        } else {
          this.setDate(`${this.initDate.year}-${this.initDate.month}-${this.initDate.weekEndDay.toString().padStart(2, '0')}`);
        }
      } else {
        this.$set(this.initDate, 'weekStartDay', weekStartDay + 7);
        this.$set(this.initDate, 'weekEndDay', weekEndDay + 7);
        this.$set(this.initDate, 'nowWeek', nowWeek + 1);

        if (nowWeek === totalWeek) {
          this.monthControll('next');
          this.setData();
        } else {
          if (this.initDate.weekEndDay >= this.initDate.lastDay)
            this.setDate(`${this.initDate.year}-${this.initDate.month}-${this.initDate.lastDay}`);
          else
            this.setDate(`${this.initDate.year}-${this.initDate.month}-${this.initDate.weekEndDay.toString().padStart(2, '0')}`);
        }
      }
    },
    updateData(value) {
      const updateYear = this.initDate.year;
      const fullData = this.$Utils.localDB.selectData('calendarData');

      fullData[updateYear] = { ...this.initData, ...value };
      this.initData = this.$Utils.localDB.insertData('calendarData', fullData)[updateYear];

      this.setData();
    },
  },
}
</script>

<style lang="scss">
#calandar {
    width: 100%;
    height: 90%;
    // border: 1px solid lightgrey;
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

    @media (pointer:coarse) {
      font-size: 16px;
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