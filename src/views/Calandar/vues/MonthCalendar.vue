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
        :class="{ 'sunday': idx % 7 === 0, 'saturday': idx % 7 === 6 }">
        {{ data.class === 'now' ? data.day : null }}
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'MonthCalandar',
  props: {
    dateInfor: {
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      days: []
    }
  },
  mounted() {
    this.setMonthCalendar();
    
  },
  methods: {
    setMonthCalendar() {
      for (let i=0;i<this.dateInfor.lastDay + this.dateInfor.firstDate;i++) {
        console.log(i)

        const cardInforType = {
          'day': null,
          'class': 'now',
          'date': null,
          'plan': [],
        };

        if (i < this.dateInfor.firstDate) {
          cardInforType['class'] = 'before';

          this.days.push(cardInforType);
        } else {
          cardInforType['day'] = (i - this.dateInfor.firstDate) + 1;
          cardInforType['date'] = i % 7;

          this.days.push(cardInforType);
        }
      }

      console.log(this.days)
    }
  },
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
  }
}

.days {
  height: calc(100% - 30px);

  display: flex;
  flex-wrap: wrap;

  & .day-card {
    height: calc(((100% - 4px) / 5));
    width: calc(((100% - 7px) / 7));
    border-right: 1px solid lightgrey;
    border-bottom: 1px solid lightgrey;

    &:hover {
      cursor: pointer;
      background: lightgrey;
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