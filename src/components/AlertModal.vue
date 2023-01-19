<template>
  <div id="alert-modal">
    <div class="modal">
        <div class="modal-header">
            <div class="header-left"></div>
                안내창
            <div class="mdi mdi-close header-right" @click="$emit('action:close')"></div>
        </div>
        <div class="modal-body">
            {{ msg }}
        </div>
        <div class="modal-footer">
            <button class="btn" @click="$emit('accept:submit')">저 장</button>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertModal',
  props: {
    msg: {
      type: String,
      default: '정말 진행하시겠어요?',
    }
  }
};
</script>

<style lang="scss" scoped>
#alert-modal {
    position: absolute;
    top: calc(50% - 25%);
    left: calc(50% - 15%);

    min-width: 300px;
    min-height: 200px;
    height: 30%;
    width: 30%;

    @media (pointer:coarse) {
        top: calc(50% - 35%);
        left: calc(50% - 45%);

        height: 50%;
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
        padding: 10px 20px 10px 20px;
        background: white;
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
        display: flex;
        align-items: center;
        justify-content: center;
        height: calc(80% - 40px);
        background: white;
    }
}

.mdi {
    font-size: 14px;
    margin: 0 3px 0 3px;
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