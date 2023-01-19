<template>
  <div id="week-calandar">
    <div class="week-nav">
      <div class="day-of-week"
        v-for="(day, idx) of ['일', '월', '화', '수', '목', '금', '토']" :key="idx">
        <div  :class="{ 'sunday': idx % 7 === 0, 'saturday': idx % 7 === 6 }">
          {{day}}
        </div>
        <div>
          {{weekNavDay[idx]}}
        </div>
      </div>
    </div>
    <div class="week-body">
      <div class="week-body-inner">
        <div class="week-body-vertical">
          <div class="vertical-all">
            종일
          </div>
          <div class="vertical-times">
            <div class="vertical-time" v-for="(time, idx) of times" :key="idx">
              {{ time }}
            </div>
          </div>
        </div>
        <div class="week-body-content">
          <div class="week-all">
            123
          </div>
          <div class="week-times">
            <div class="week-time" v-for="(time, idx) of timeKeys" :key="idx">
              {{idx}}. {{time}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlanSubmitMenu from '@/components/PlanSubmitMenu.vue'
import PlansModal from '@/components/PlansModal.vue';

export default {
  name: 'WeekCalandar',
  components: {
    PlanSubmitMenu,
    PlansModal,
  },
  props: {
    weekData: {
      type: Object,
      default: () => {return {}}
    }
  },
  data() {
    return {
      times: [
        '오전 1시', '오전 2시', '오전 3시', '오전 4시', '오전 5시', '오전 6시',
        '오전 7시', '오전 8시', '오전 9시', '오전 10시', '오전 11시', '오후 12시',
        '오후 1시', '오후 2시', '오후 3시', '오후 4시', '오후 5시', '오후 6시',
        '오후 7시', '오후 8시', '오후 9시', '오후 10시', '오후 11시',
      ],
      timeKeys: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', 
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', 
      ],
      weekNavDay: [],
      weekStartDay: null,
      weekEndDay: null,
      monthLastDay: null,
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.weekNavDay = [];
      this.weekStartDay = this.weekData.weekStartDay;
      this.weekEndDay = this.weekData.weekEndDay;
      this.monthLastDay = this.weekData.lastDay;

      for (let i=this.weekStartDay;i<=((this.weekEndDay > this.monthLastDay) ? this.monthLastDay : this.weekEndDay);i++) {
        if (i < 1) this.weekNavDay.push(null)
        else this.weekNavDay.push(i);
      }
    },
  },
  watch: {
    weekData(value) {
      this.init();
    }
  }
}
</script>

<style lang="scss" scoped>
#week-calandar {
  height: 100%;
}

.week-nav {
  height: 60px;
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  border-bottom: 1px solid lightgrey;
  padding-left: 70px;

  & .day-of-week {
    width: 100%;
  }
}

.week-body {
  // nav 60px, border 1px * 3ea
  height: calc(100% - 60px - 3px);
  width: 100%;
  border-bottom: 1px solid lightgrey;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  & .week-body-inner {
    display: flex;
    width: 100%;

    & .week-body-vertical {
      width: 70px;
      border-right: 1px solid lightgrey;
      text-align: center;
      font-size: 14px;
      color: #282828;
      font-weight: 600;
      

      & .vertical-all {
        top: 0;
        position: sticky;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100px;
        width: 70px;
        background: white;
        border-bottom: 1px solid lightgrey;
      }

      & .vertical-times {
        & .vertical-time {
          padding-top: 10px;
          height: 140px;
          width: 100%;
        }
      }
      
    }

    & .week-body-content {
      width: calc(100% - 70px);

      & .week-all {
        top: 0;
        position: sticky;
        width: calc(100%);
        height: 100px;
        background: white;
        border-bottom: 1px solid lightgrey;
      }

      & .week-times {
        & .week-time {
          width: 100%;
          height: 140px;
        }
      }
    }
  }  
}

.saturday {
  color: blue;
}

.sunday {
  color: red;
}
</style>