<template>
  <div id="month-calandar">
    <div class="month-nav">
      <div v-for="(day, idx) of ['일', '월', '화', '수', '목', '금', '토']" 
        :key="idx" class="day-of-week"
        :class="{ 'sunday': idx % 7 === 0, 'saturday': idx % 7 === 6 }">
        {{day}}
      </div>
    </div>
    <div class="days">
      <div v-for="(data, idx) of days" 
        :key="idx" class="day-card"
        :style="dynamicHeight"
        :class="{ 'sunday': idx % 7 === 0, 'saturday': idx % 7 === 6, 'hover': data.class === 'now' }"
        @click="showSubmitModal(data);">
        {{ data.class === 'now' ? data.day : null }}
      </div>
    </div>
    <PlanSubmitMenu v-if="isModal" :modalDateInfor="targetDate" @on-close='isModal=false;' @on-submit='isModal=false;' />
  </div>
</template>

<script>
import PlanSubmitMenu from '@/components/PlanSubmitMenu.vue'

export default {
  name: 'MonthCalandar',
  components: {
    PlanSubmitMenu,
  },
  props: {
    dateInfor: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      isModal: false,
      days: [],
      targetDate: null,
      dynamicHeight: 0,
    }
  },
  mounted() {
    this.setCardHeight();
    this.setMonthCalendar();
  },
  methods: {
    showSubmitModal(date) {
      if (date.class === 'now') {
        this.targetDate = {
          ...date,
          'year': this.dateInfor.year,
          'month': this.dateInfor.month,
        }
        this.isModal = true;
      }
    },
    setCardHeight() {
      const totalDay = this.dateInfor.firstDate + this.dateInfor.lastDay;

      this.dynamicHeight = {
        'height': `calc(((100% - ${Math.floor(totalDay / 7) + 2}px) / ${Math.ceil(totalDay / 7)}))`
      };

    },
    setMonthCalendar() {
      const totalDay = this.dateInfor.firstDate + this.dateInfor.lastDay;
      this.days = [];

      for (let i=0;i<Math.ceil(totalDay / 7) * 7;i++) {
        const cardInforType = {
          'day': null,
          'class': 'now',
          'date': null,
          'plan': [],
        };

        if (i < this.dateInfor.firstDate || i >= this.dateInfor.lastDay + this.dateInfor.firstDate) {
          cardInforType['class'] = 'none';

          this.days.push(cardInforType);
        } else {
          cardInforType['day'] = (i - this.dateInfor.firstDate) + 1;
          cardInforType['date'] = i % 7;

          this.days.push(cardInforType);
        }
      }
    }
  },
  watch: {
    dateInfor() {
      this.setCardHeight();
      this.setMonthCalendar();
    }
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
  font-weight: 600;

  & .day-of-week {
    width: calc((100% - 7px) / 7);
    border-right: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
  }
}

.days {
  height: calc(100% - 30px);

  display: flex;
  flex-wrap: wrap;

  & .day-card {
    width: calc(((100% - 7px) / 7));
    border-right: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
  }

  & .hover:hover {
    cursor: pointer;
    background: lightgrey;
  }
}

.saturday {
  color: blue;
}

.sunday {
  color: red;
}
</style>