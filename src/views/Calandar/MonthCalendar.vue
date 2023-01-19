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
      <div v-for="(day, dayIdx) of days" 
        :key="dayIdx" class="day-card"
        :style="dynamicHeight"
        :class="{ 'hover': day.class }"
        @click.stop="showSubmitModal(day)">
        <div class="day-title" :class="{ 'sunday': dayIdx % 7 === 0, 'saturday': dayIdx % 7 === 6 }">
          {{ day.class ? day.day : null }}
        </div>
        <div v-if="Object.keys(monthData.data).length" class="day-plans">
          <div v-for="(dayData, dayKey) in monthData.data" :key="dayKey" style="height: 100%;">
              <div v-if="dayKey === day.day" class="day-plan-wrapper">
                <div :class="`day-plan day-plan${content.time === 'all' ? '-all' : '-time' }`" 
                  v-for="(content, contentIdx) of dayData.slice(0, 3)" 
                  :key="contentIdx"
                  @click.stop="showSubmitModal({ ...day, ...content }, true)">
                  <span v-if="content.time !== 'all'" class="mdi mdi-chevron-right"></span>
                  <span class="day-plan-title">{{ content.title }}</span> 
                  - <span class="day-plan-content">{{ content.content }}</span>
                </div>
              </div>
              <!-- {{dayData}} -->
              <div class="plan-more" v-if="dayData.length > 3 && dayKey === day.day">
                <button class="btn" @click.stop="showMoreData(day)">
                  {{dayData.length - 3}}개 더보기
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
    <plan-submit-menu 
      v-if="isSubmitModal" 
      :modalDateInfor="targetDate" 
      @action:close="isSubmitModal=false" 
      @create:submit="saveData"
      @update:submit="updateData"
      @delete:data="deleteData" />
    <plans-modal 
      v-if="isPlansShowModal"
      :modalPlansInfor="{ ...monthData.data, ...targetDay }"
      @action:close="isPlansShowModal=false"
      @update:submit="updateData"
      @delete:data="deleteData" />
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
    monthData: {
      type: Object,
      default: () => {return {}},
    },
  },
  data() {
    return {
      isPlansShowModal: false,
      isSubmitModal: false,
      days: [],
      targetday: null,
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
    showSubmitModal(date, type=false) {
      if (date.class) {
        this.targetDate = {
          ...date,
          'year': this.monthData.year,
          'month': this.monthData.month,
          type,
        }

        this.isSubmitModal = true;
      }
    },
    setCardHeight() {
      const totalDay = this.monthData.firstDate + this.monthData.lastDay;

      this.dynamicHeight = {
        // 줄당 1px 씩
        'height': `calc(((100% - ${Math.floor(totalDay / 7)}px) / ${Math.ceil(totalDay / 7)}))`
      };
    },
    setMonthCalendar() {
      this.days = [];

      for (let i=0;i<this.monthData.totalWeek * 7;i++) {
        const cardInforType = {
          'year': null,
          'month': null,
          'day': null,
          'class': true,
          'date': null,
        };

        if (i < this.monthData.firstDate || i >= this.monthData.lastDay + this.monthData.firstDate) {
          cardInforType['class'] = false;

          this.days.push(cardInforType);
        } else {
          cardInforType['year'] = this.monthData.year;
          cardInforType['month'] = this.monthData.month;
          cardInforType['day'] = ((i - this.monthData.firstDate) + 1).toString().padStart(2, '0');
          cardInforType['date'] = i % 7;

          this.days.push(cardInforType);
        }
      }
    },
    showMoreData(target) {
      this.targetDay = { day: target.day, date: target.date };
      this.isPlansShowModal = true;
    },
    saveData(value) {
      console.log(this.monthData.data)
      const [ year, month, day ] = value.fulldate.split('-');
      
      const dayData = {};
      Object.values(this.monthData.data).length
        ? dayData[day] = [ ...this.monthData.data[day], value]
        : dayData[day] = [value]

      let submitData = {};

      // eslint-disable-next-line no-prototype-builtins
      this.monthData.data.hasOwnProperty(day) ?
        submitData[month] = { ...this.monthData.data, ...dayData }
        : submitData[month] = dayData;
        
      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    },
    updateData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      const baseData = Object.values(this.monthData.data[day]).filter((dayData) => dayData.uid !== value.uid);
      console.log(value, baseData)

      const dayData = {}
      dayData[day] = [ ...baseData, value]

      let submitData = {};
      submitData[month] = dayData
      console.log(submitData)

      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    },
    deleteData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      const baseData = this.monthData.data[month][day].filter((item) => item.uid !== value.uid)

      const submitData = {};
      submitData[month] = baseData

      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    }
  },
  watch: {
    monthData() {
      this.init();
    },
  }
}
</script>

<style lang="scss" scoped>
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

    &::-webkit-scrollbar {
      display: none;
    }

    & .day-title {
      height: 20px;
      padding: 0 0 5px 0;
    }

    & .day-plans {
      // day div 25px
      height: calc(100% - 25px);

      & .plan-more {
        overflow-x: auto;
        overflow-y: hidden;
        height: 30px;
      }

      & .day-plan-wrapper {
        // more-btn 30px
        height: calc(100% - 30px);
        overflow-y: auto;

        &::-webkit-scrollbar {
          display: none;
        }

        & .day-plan {
          text-align: left;
          // 양쪽 3px 씩
          width: calc(100% - 6px);
          padding: 1px 3px 1px 3px;
          margin: 0 0 4px 0;
          
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow-x: hidden;
          overflow-y: auto;
          border-radius: 0.25rem;

          &-time {
            background: #D2FDBB;
          }

          &-all {
            background: #EEDDFF;
          }

          & .day-plan-title {
            font-size: 16px;
            font-weight: 600;
          }
        }
      }

      & .day-plan-content {
        font-size: 14px;
        font-weight: 400;
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