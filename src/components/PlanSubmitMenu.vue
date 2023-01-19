<template>
  <div tabindex="0" id="plan-submit-modal" ref="plan-submit-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="header-left">
          <button class="btn btn-danger" @click.stop="deleteData(modalDateInfor);">삭제</button>
        </div>
        {{modalType ? '일정 수정' : '일정 등록' }}
        <div class="mdi mdi-close header-right" @click="$emit('action:close')"></div>
      </div>
      <div class="modal-body">
        <div class="body-title">
          <div style="width: 24px;"></div>
          <input class="title-input" type="text" placeholder="제목" v-model="submitData.title">
        </div>
        <div class="body-date">
          <div class="mdi mdi-calendar-month-outline"></div>
          <input style="margin-right: 10px;" type="date" v-model="submitData.fulldate">
          <div style="margin: auto 0 auto 0;">
            <button :class="isFullDay ? 'btn' : 'btn-outline'"
              @click="setFullDay">{{isFullDay ? '종일' : '시간대'}}</button>
          </div>
        </div>
        <div v-if="!isFullDay" class="body-time">
          <div class="mdi mdi-clock-time-four-outline"></div>
          <input style="margin-right: 10px;" type="time" v-model="submitData.time">
        </div>
        <div class="body-content">
          <div class="mdi mdi-text-long"></div>
          <textarea cols="50" rows="8" placeholder="내용을 적어주세요." v-model="submitData.content"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn" @click="submit">저장</button>
      </div>
    </div>
  </div>    
</template>

<script>
export default {
    name: 'PlanSubmitModal',
    props: {
      modalDateInfor: {
        type: Object,
        default: () => {return {}},
      },
    },
    data() {
      return {
        modalRef: null,
        modalType: false,
        isProcessing: false,
        isFullDay: true,
        submitData: {
          'title': null,
          'time': null,
          'content': null,
        }
      }
    },
    created() {
      this.setTargetDate();
    },
    mounted() {
      this.modalRef = this.$refs['plan-submit-modal'];
      this.modalRef.focus();
      this.modalRef.addEventListener('keyup', this.keyEventListener);
    },
    methods: {
      setTargetDate() {
        const { year, month, day } = this.modalDateInfor;

        this.modalType = this.modalDateInfor.type;
        
        this.modalDateInfor.time === 'all' 
          ? this.isFullDay = true 
          : this.isFullDay = false;

        // true는 수정 false는 생성
        if (this.modalType) {
          this.submitData = {
            ...this.modalDateInfor,
            'updated_ts': this.$Utils.dateUtils.getNow(),
          };
        } else {
          this.submitData = {
            ...this.submitData,
            'time': this.modalDateInfor.time,
            'fulldate': `${year}-${month}-${day.toString().padStart(2, '0')}`,
            'created_ts': this.$Utils.dateUtils.getNow(),
            'updated_ts': this.$Utils.dateUtils.getNow(),
            'uid': this.$Utils.convenience.getUUID(),
          }
        }
      },
      submit() {
        if (!this.submitData.title) return;
        if (!this.submitData.content) return;

        this.modalType 
          ? this.$emit('update:submit', this.submitData)
          : this.$emit('create:submit', this.submitData); 
      },
      setFullDay() {
        this.isFullDay = !this.isFullDay;
        this.isFullDay
          ? this.$set(this.submitData, 'time', 'all')
          : this.$set(this.submitData, 'time', this.modalDateInfor.time === 'all' ? '08:00' : this.modalDateInfor.time);
      },
      deleteData(uid) {
        this.$emit('delete:data', uid)
      },
      keyEventListener(evt) {
        evt.stopPropagation();

        // 중복 방지
        if(this.isProcessing) return false;
        this.isProcessing = true;

        switch (evt.key) {
          case 'Escape':
            this.$emit('action:close');
            break;
          case 'Delete':
            this.deleteData(this.modalDateInfor);
            break;
          default:
            break;
        }

        this.isProcessing = false
      }
    },
    destroyed() {
      this.modalRef.removeEventListener('keyup', this.keyEventListener, false);
    }
}
</script>

<style lang="scss" scoped>
#plan-submit-modal {
  position: absolute;
  top: calc(50% - 25%);
  left: calc(50% - 15%);

  min-width: 300px;
  min-height: 400px;
  height: 50%;
  width: 30%;

  @media (pointer:coarse) {
    top: calc(50% - 35%);
    left: calc(50% - 45%);

    height: 70%;
    width: 90%;
  }

  &:focus {
    outline: none;
  }
}

.modal {
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;

  & .modal-header, .modal-footer {
    padding: 0 20px 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & .modal-header {
    font-weight: 600;

    & .header-right, .header-left {
      width: 30px;
    }

    & .header-left {
      margin-right: auto;
    }

    & .header-right {
      margin-left: auto;

      &:hover {
        cursor: pointer;
      }
    }

    height: 10%;
    background: #F1F3F5;
  }

  & .modal-body {
    width: calc(100% - 40px);
    height: calc(80% - 60px);
    text-align: center;
    padding: 30px 20px 30px 20px;
    background: white;

    & .mdi {
      width: 24px;
      font-size: 24px;
      color: grey;
    }

    & .body-title {
      width: 100%;
      margin-bottom: 40px;

      & .title-input {
        padding: 7px;
        width: 80%;
        font-size: 18px;
        border: none;
        border-bottom: 1px solid lightgray;
      }
    }

    & .body-date, .body-time, .body-content {
      display: flex;
      margin-bottom: 20px;

      & .mdi {
        margin-right: 10px;
      }

      & input[type=radio] {
        box-sizing: border-box;
        appearance: none;
        background: white;
        outline: 2px solid #333;
        border: 4px solid white;
        width: 5px;
        height: 5px;

        &:checked {
          background: #333;
        }
      }
    }

    & .body-date {
      & input {
        border: none;
        border-bottom: 1px solid grey;
      }
    }

    & .body-time {
      position: relative;
      height: 30px;
    }

    & .body-content {
      & textarea {
        padding: 5px;
        background: #F1F3F5;
        border: none;
        border-radius: 0.25rem;
        resize: none;
      }
    }
  }

  & .modal-footer {
    height: 10%;
    background: white;
    justify-content: flex-end;
  }
}

.btn {
  height: 70%;
  background: #413BF7;
  color: white;
  min-width: 50px;
  min-height: 20px;
  border-radius: 0.25rem;
  border: none;

  &-danger {
    background: #FF4646;
  }

  &:hover {
    cursor: pointer;
  }
}

.btn-outline {
  height: 70%;
  background: white;
  color: #413BF7;
  min-width: 50px;
  border-radius: 0.25rem;
  border: 1px solid #413BF7;
  font-weight: 600;

  &-danger {
    border: #FF4646;
  }

  &:hover {
    cursor: pointer;
  }
}
</style>