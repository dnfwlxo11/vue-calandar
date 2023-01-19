<template>
  <div id="day-calandar">
    <div class="day-nav">
      <div>{{ dayData.day }}</div> &nbsp;
      <div :class="{ 'sunday': dayData.nowDate % 7 === 0, 'saturday': dayData.nowDate % 7 === 6 }">
        <small>{{ $Utils.dateUtils.getKoreanDate(dayData.nowDate) }}</small>
      </div>
    </div>
    <div class="day-body">
      <div class="day-body-inner">
        <div class="day-body-vertical">
          <div class="vertical-all">
            종일
          </div>
          <div class="vertical-times">
            <div class="vertical-time" v-for="(time, idx) of times" :key="idx">
              {{ time }}
            </div>
          </div>
        </div>
        <div class="day-body-content">
          <div class="day-contents">
            <div class="day-times">
              <div v-if="dayData.data.hasOwnProperty(parseInt(dayData.day).toString().padStart(2, '0'))">
                <div class="day-all" @click.stop="showSubmitModal({ day: dayData.day, time: 'all' })">
                  <div v-for="(datas, dataIdx) of dayData.data[dayData.day.toString().padStart(2, '0')]" 
                    :key="dataIdx">
                    <div v-if="datas.time === 'all'" 
                      class="day-plan day-plan-all"
                      @click.stop="showSubmitModal({ ...datas, day: dayData.day }, true)">
                      <span class="mdi mdi-check-circle-outline"></span>
                      <span class="day-plan-title">{{ datas.title }}</span> 
                      - <span class="day-plan-content">{{ datas.content }}</span>
                    </div>
                  </div>
                </div>
                <div class="day-time" 
                  v-for="(time, timeIdx) of timeKeys" 
                  :key="timeIdx"
                  @click.stop="showSubmitModal({ day: dayData.day, time })">
                  <div v-for="(datas, dataIdx) of dayData.data[dayData.day.toString().padStart(2, '0')]" 
                    :key="dataIdx">
                    <div v-if="datas.time.split(':')[0] === time.split(':')[0]" 
                      class="day-plan day-plan-time"
                      @click.stop="showSubmitModal({ ...datas, day: dayData.day }, true)">
                      <span class="mdi mdi-timer-outline"></span>
                      <span class="day-plan-title">{{ datas.title }}</span> 
                      - <span class="day-plan-content">{{ datas.content }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="day-plans">
                <div class="day-all" @click.stop="showSubmitModal({ day: dayData.day, time: 'all' })"></div>
                <div class="day-time" 
                  v-for="(time, timeIdx) of timeKeys" 
                  :key="timeIdx"
                  @click.stop="showSubmitModal({ day: dayData.day, time })"></div>
              </div>
              <div class="day-plans">
                <div class="day-all"></div>
                <div class="day-time" v-for="(time, timeIdx) of timeKeys" :key="timeIdx"></div>
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
import PlanSubmitMenu from '@/components/PlanSubmitMenu.vue'

export default {
  name: 'DayCalandar',
  components: {
    PlanSubmitMenu,
  },
  props: {
    dayData: {
      type: Object,
      default: () => {return {}},
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
    }
  },
  methods: {
    showSubmitModal(date, type=false) {
      this.targetDate = {
        ...date,
        'year': this.dayData.year,
        'month': this.dayData.month,
        type,
      }

      this.isSubmitModal = true;
    },
    saveData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      
      const tmpDayData = {};

      // eslint-disable-next-line no-prototype-builtins
      this.dayData.data.hasOwnProperty(day)
        ? tmpDayData[day] = [ ...this.dayData.data[day], value]
        : tmpDayData[day] = [value]

      let submitData = {};

      // eslint-disable-next-line no-prototype-builtins
      submitData[month] = { ...this.dayData.data, ...tmpDayData }
      
      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    },
    updateData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      const baseData = this.dayData.data[day].filter((dayData) => dayData.uid !== value.uid);

      const tmpDayData = {}
      tmpDayData[day] = [ ...baseData, value]

      let submitData = {};
      submitData[month] = { ...this.dayData.data, ...tmpDayData };

      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    },
    deleteData(value) {
      const [ year, month, day ] = value.fulldate.split('-');
      const baseData = this.dayData.data[day].filter((dayData) => dayData.uid !== value.uid)

      const tmpDayData = {};
      tmpDayData[day] = baseData;

      const submitData = {};
      submitData[month] = { ...this.dayData.data, ...tmpDayData };

      this.$emit('update:data', submitData);
      this.isSubmitModal = false;
    }
  }
}
</script>

<style lang="scss" scoped>
#day-calandar {
  height: 100%;
}

.day-nav {
  height: 60px;
  display: flex;
  font-weight: 600;
  border-bottom: 1px solid lightgrey;
  padding-left: 70px;
  align-items: center;
  justify-content: flex-start;
  font-size: 20px;
}

.day-body {
  // nav 60px, border 1px * 3ea
  height: calc(100% - 60px - 3px);
  width: 100%;
  border-bottom: 1px solid lightgrey;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }

  & .day-body-inner {
    display: flex;
    width: 100%;

    & .day-body-vertical {
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

    & .day-body-content {
      width: calc(100% - 70px);
      display: flex;

      & .day-contents {
        width: 100%;

        & .day-times {
          border-right: 1px solid lightgrey;

          & .day-plan {
            // 양쪽 3px 씩
            width: calc(100% - 6px);
            padding: 3px;
            margin: 4px 0 4px 0;
            text-align: left;
            
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
              font-size: 20px;
              font-weight: 600;
            }

            & .day-plan-content {
              font-size: 18px;
              font-weight: 400;
            }
          }

          & .day-all {
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

          & .day-time {
            width: 100%;
            height: 100px;
            padding-bottom: 40px;
            border-bottom: 1px solid lightgrey;
            overflow: auto;

            &::-webkit-scrollbar {
              display: none;
            }
          }

          & .day-all:hover, .day-time:hover {
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
</style>