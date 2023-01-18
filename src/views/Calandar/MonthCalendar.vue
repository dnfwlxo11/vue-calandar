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
        <div v-if="monthData.data[`${day.month}-${day.day}`]" class="day-plans">
          <div :class="`day-plan${content.time === 'all' ? '-all' : '-time' }`" v-for="(content, idx) of monthData.data[`${day.month}-${day.day}`].slice(0, 3)" 
            :key="idx"
            @click.stop="showSubmitModal({ ...day, ...content }, true)">
            <span class="day-plan-title">{{ content.title }}</span> 
            - <span class="day-plan-content">{{ content.content }}</span>
          </div>
          <div v-if="monthData.data[`${day.month}-${day.day}`].length > 3">
            <button class="btn" @click.stop="showMoreData(day)">
              {{monthData.data[`${day.month}-${day.day}`].length - 3}}개 더보기
            </button>
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
      :modalPlansInfor="monthData.data[targetDay]"
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
      const totalDay = this.monthData.firstDate + this.monthData.lastDay;
      this.days = [];

      for (let i=0;i<Math.ceil(totalDay / 7) * 7;i++) {
        const cardInforType = {
          'year': null,
          'month': null,
          'day': null,
          'class': true,
          'date': null,
        };

        if (i < this.monthData.firstDate 
          || i >= this.monthData.lastDay + this.monthData.firstDate) {
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
      this.targetDay = `${target.month}-${target.day}`;
      this.isPlansShowModal = true;
    },
    saveData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      
      const submitData = {};

      // eslint-disable-next-line no-prototype-builtins
      this.monthData.data.hasOwnProperty(`${month}-${day}`) ?
        submitData[`${month}-${day}`] = [ ...this.monthData.data[`${month}-${day}`], value ]
        : submitData[`${month}-${day}`] = [value];
        
      this.$emit('update:data', { year, submitData });
      this.isSubmitModal = false;
    },
    updateData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      const baseData = this.monthData.data[`${month}-${day}`].filter((item) => item.uid !== value.uid);
      const submitData = {};

      submitData[`${month}-${day}`] = [ ...baseData, value ]

      this.$emit('update:data', { year, submitData });
      this.isSubmitModal = false;
    },
    deleteData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      const baseData = this.monthData.data[`${month}-${day}`].filter((item) => item.uid !== value.uid)

      const submitData = {};
      submitData[`${month}-${day}`] = baseData

      this.$emit('update:data', { year, submitData });
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

    &::-webkit-scrollbar {
      display: none;
    }

    & .day-title {
      padding: 5px 0 5px 0;
    }

    & .day-plans {
      & .day-plan {

        &-all {
          text-align: left;
          // 양쪽 3px 씩
          width: calc(100% - 6px);
          padding: 3px;
          margin: 0 0 4px 0;
          background: #EEDDFF;
          color: black;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow-x: hidden;
          overflow-y: auto;
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