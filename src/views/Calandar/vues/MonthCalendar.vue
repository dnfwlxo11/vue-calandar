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
      <div v-for="(day, idx) of days" 
        :key="idx" class="day-card"
        :style="dynamicHeight"
        :class="{ 'sunday': idx % 7 === 0, 'saturday': idx % 7 === 6, 'hover': day.class }"
        @click.stop="showSubmitModal(day)">
        <div class="day-title">
          {{ day.class ? day.day : null }}
        </div>
        <div v-if="data[`${day.month}-${day.day}`]" class="day-plans">
          <div class="day-plan" v-for="(content, idx) of data[`${day.month}-${day.day}`].slice(0, 3)" :key="idx">
            <span class="day-plan-title">{{ content.title }}</span> 
            - <span class="day-plan-content">{{ content.title }}</span>
          </div>
          <div v-if="data[`${day.month}-${day.day}`].length > 3">
            <button class="btn" @click.stop="showMoreData(`${day.month}-${day.day}`)">{{data[`${day.month}-${day.day}`].length - 3}}개 더보기</button>
          </div>
        </div>
      </div>
    </div>
    <plan-submit-menu v-if="isSubmitModal" 
      :modalDateInfor="targetDate" 
      @action:close="isSubmitModal=false" 
      @action:submit="saveData" />
    <plans-modal />
  </div>
</template>

<script>
import PlanSubmitMenu from '@/components/PlanSubmitMenu.vue'
import PlansModal from '@/components/PlansModal.vue';

export default {
  name: 'MonthCalandar',
  components: {
    PlanSubmitMenu,
    PlansModal,
  },
  props: {
    date: {
      type: Object,
      default: () => {},
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isPlansShowModal: false,
      isSubmitModal: false,
      days: [],
      targetDate: null,
      dynamicHeight: 0,
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.setCardHeight();
      this.setMonthCalendar();
    },
    showSubmitModal(date) {
      if (date.class) {
        this.targetDate = {
          ...date,
          'year': this.date.year,
          'month': this.date.month,
        }
        this.isSubmitModal = true;
      }
    },
    setCardHeight() {
      const totalDay = this.date.firstDate + this.date.lastDay;

      this.dynamicHeight = {
        // 줄당 1px 씩
        'height': `calc(((100% - ${Math.floor(totalDay / 7)}px) / ${Math.ceil(totalDay / 7)}))`
      };
    },
    setMonthCalendar() {
      const totalDay = this.date.firstDate + this.date.lastDay;
      this.days = [];

      for (let i=0;i<Math.ceil(totalDay / 7) * 7;i++) {
        const cardInforType = {
          'year': null,
          'month': null,
          'day': null,
          'class': true,
          'date': null,
          'plan': [],
        };

        if (i < this.date.firstDate || i >= this.date.lastDay + this.date.firstDate) {
          cardInforType['class'] = false;

          this.days.push(cardInforType);
        } else {
          cardInforType['year'] = this.date.year;
          cardInforType['month'] = this.date.month;
          cardInforType['day'] = ((i - this.date.firstDate) + 1).toString().padStart(2, '0');
          cardInforType['date'] = i % 7;

          this.days.push(cardInforType);
        }
      }
    },
    showMoreData(target) {
      console.log(target)
    },
    saveData(value) {
      const [ year, month, day ] = value.date.split('-');
      
      const submitData = {};

      // eslint-disable-next-line no-prototype-builtins
      this.data.hasOwnProperty(`${month}-${day}`) ? 
        submitData[`${month}-${day}`] = [ ...this.data[`${month}-${day}`], value ]
        : submitData[`${month}-${day}`] = [value];

      this.$emit('update:data', { year, submitData });
      this.isSubmitModal = false;
    },
  },
  watch: {
    date() {
      this.init()
    },
    data() {
      this.init();
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
    // 오른쪽 1px씩 * 7ea
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
    // 오른쪽 1px씩 * 7ea
    width: calc(((100% - 7px) / 7));
    border-right: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow-y: auto;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      display: none;
    }

    & .day-title {
      padding: 5px 0 5px 0;
    }

    & .day-plans {

      & .day-plan {
        text-align: left;
        // 양쪽 3px 씩
        width: calc(100% - 6px);
        padding: 3px;
        margin: 0 0 4px 0;
        background: #EEDDFF;
        color: black;
        font-weight: 600;
        border-radius: 0.25rem;

        & .day-plan-title {
          font-size: 16px;
          font-weight: 600;
        }

        & .day-plan-content {
          font-size: 14px;
          font-weight: 400;
        }
      }
    }
  }

  & .hover:hover {
    cursor: pointer;
    background: #F1F3F5;
  }
}

.saturday {
  color: blue;
}

.sunday {
  color: red;
}

.btn {
  height: 70%;
  background: #413BF7;
  color: white;
  min-width: 50px;
  min-height: 20px;
  border-radius: 0.25rem;
  border: none;

  &:hover {
    cursor: pointer;
  }
}
</style>