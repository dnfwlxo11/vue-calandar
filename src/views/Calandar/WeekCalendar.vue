<template>
  <div id="week-calandar">
    <div class="week-nav">
      <div class="day-of-week" v-for="(day, idx) of weekNavDay" :key="idx">
        <div v-if="day <= weekData.lastDay">
          <div :class="{ 'sunday': idx % 7 === 0, 'saturday': idx % 7 === 6 }">
            {{ $Utils.dateUtils.getKoreanDate(idx) }}
          </div>
          <div>
            {{day}}
          </div>
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
          <div class="week-contents" v-for="(day, dayIdx) of weekNavDay" :key="dayIdx">
            <div class="week-times">
              <div v-if="Object.prototype.hasOwnProperty.call(weekData.data, parseInt(day).toString().padStart(2, '0'))">
                <div class="week-all" @click.stop="showSubmitModal({ day, time: 'all' })">
                  <div v-for="(dayData, dayDataIdx) of weekData.data[day.toString().padStart(2, '0')]" 
                    :key="dayDataIdx">
                    <div v-if="dayData.time === 'all'" 
                      class="week-plan week-plan-all"
                      @click.stop="showSubmitModal({ ...dayData, day }, true)">
                      <span class="mdi mdi-check-circle-outline"></span>
                      <span class="week-plan-title">{{ dayData.title }}</span> 
                      - <span class="week-plan-content">{{ dayData.content }}</span>
                    </div>
                  </div>
                </div>
                <div class="week-time" 
                  v-for="(time, timeIdx) of timeKeys" 
                  :key="timeIdx"
                  @click.stop="showSubmitModal({ day, time })">
                  <div v-for="(dayData, dayDataIdx) of weekData.data[day.toString().padStart(2, '0')]" 
                    :key="dayDataIdx">
                    <div v-if="dayData.time.split(':')[0] === time.split(':')[0]" 
                      class="week-plan week-plan-time"
                      @click.stop="showSubmitModal({ ...dayData, day }, true)">
                      <span class="mdi mdi-timer-outline"></span>
                      <span style="margin-right: 3px;">[{{ dayData.time }}]</span>
                      <span class="week-plan-title">{{ dayData.title }}</span> 
                      - <span class="week-plan-content">{{ dayData.content }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="week-plans">
                <div class="week-all" @click.stop="showSubmitModal({ day, time: 'all' })"></div>
                <div class="week-time" 
                  v-for="(time, timeIdx) of timeKeys" 
                  :key="timeIdx"
                  @click.stop="showSubmitModal({ day, time })"></div>
              </div>
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
      @delete:data="deleteData" 
    />
  </div>
</template>

<script>
import PlanSubmitMenu from '@/components/PlanSubmitMenu.vue';

export default {
  name: 'WeekCalandar',
  components: {
    PlanSubmitMenu,
  },
  props: {
    weekData: {
      type: Object,
      default: () => {return {};}
    }
  },
  data() {
    return {
      times: [
        '오전 0시', '오전 1시', '오전 2시', '오전 3시', '오전 4시', '오전 5시', '오전 6시',
        '오전 7시', '오전 8시', '오전 9시', '오전 10시', '오전 11시', '오후 12시',
        '오후 1시', '오후 2시', '오후 3시', '오후 4시', '오후 5시', '오후 6시',
        '오후 7시', '오후 8시', '오후 9시', '오후 10시', '오후 11시',
      ],
      timeKeys: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', 
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
        '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', 
      ],
      isSubmitModal: false,
      targetDate: null,
      weekNavDay: [],
      weekStartDay: null,
      weekEndDay: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      this.weekNavDay = [];
      this.weekStartDay = this.weekData.weekStartDay;
      this.weekEndDay = this.weekData.weekEndDay;

      for (let i=this.weekStartDay;i<=this.weekEndDay;i++) {
        if (i < 1) this.weekNavDay.push(null);
        else this.weekNavDay.push(i);
      }
    },
    showSubmitModal(date, type=false) {
      this.targetDate = {
        ...date,
        'year': this.weekData.year,
        'month': this.weekData.month,
        type,
      };

      this.isSubmitModal = true;
    },
    saveData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      
      const dayData = {};

      Object.prototype.hasOwnProperty.call(this.weekData.data, day)
        ? dayData[day] = [ ...this.weekData.data[day], value]
        : dayData[day] = [value];

      let submitData = {};

      submitData[month] = { ...this.weekData.data, ...dayData };
      
      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    },
    updateData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      const baseData = this.weekData.data[day].filter((dayData) => dayData.uid !== value.uid);

      const dayData = {};
      dayData[day] = [ ...baseData, value];

      let submitData = {};
      submitData[month] = { ...this.weekData.data, ...dayData };

      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    },
    deleteData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      const baseData = this.weekData.data[day].filter((dayData) => dayData.uid !== value.uid);

      const dayData = {};
      dayData[day] = baseData;

      const submitData = {};
      submitData[month] = { ...this.weekData.data, ...dayData };

      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    }
  },
  watch: {
    weekData() {
      this.init();
    }
  }
};
</script>

<style lang="scss" scoped>
#week-calandar {
  height: 100%;
}

.week-nav {
  height: 60px;
  display: flex;
  font-weight: 600;
  border-bottom: 1px solid lightgrey;
  padding-left: 70px;

  & .day-of-week {
    width: calc(100% / 7);
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
        height: 140px;
        width: 70px;
        background: white;
        border-bottom: 1px solid lightgrey;
      }

      & .vertical-times {
        & .vertical-time {
          padding-top: 11px;
          height: 130px;
          width: 100%;
        }
      }
    }

    & .week-body-content {
      width: calc(100% - 70px);
      display: flex;

      & .week-contents {
        width: calc(100% / 7);

        & .week-times {
          border-right: 1px solid lightgrey;

          & .week-plan {
            text-align: left;
            // 양쪽 3px 씩
            width: calc(100% - 6px);
            padding: 1px 3px 1px 3px;
            margin: 4px 0 4px 0;
            
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

            & .week-plan-title {
              font-size: 16px;
              font-weight: 600;
            }

            & .week-plan-content {
              font-size: 14px;
              font-weight: 400;
            }
          }

          & .week-all {
            top: 0;
            position: sticky;
            width: 100%;
            height: 100px;
            padding-bottom: 40px;
            background: white;
            border-bottom: 1px solid lightgrey;
            overflow-y: auto;

            &::-webkit-scrollbar {
              display: none;
            }
          }

          & .week-time {
            width: 100%;
            height: 100px;
            padding-bottom: 40px;
            border-bottom: 1px solid lightgrey;
            overflow: auto;

            &::-webkit-scrollbar {
              display: none;
            }
          }

          & .week-all:hover, .week-time:hover {
            cursor: pointer;
            background: #F1F3F5;
          }
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

.mdi {
  font-size: 14px;
}
</style>