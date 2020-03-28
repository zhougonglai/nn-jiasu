<template lang="pug">
#sign
	.box
		i.el-icon-close.top.right.abs(@click="close")
		div.logo.mb-2
			img#logo(src="../assets/img/logo.png" srcset="../assets/img/logo@2x.png 2x" alt="logo")
		router-view
</template>
<script>
import { mapActions } from "vuex";

export default {
  name: "SignLayout",
  methods: {
    close() {
      if (this.$root.production) {
        window.NimCefWebInstance.call("CallNativeFun", {
          message: {
            operation: "close"
          }
        });
      }
    },
    ...mapActions("sign", ["getCountryCodes"])
  },
  created() {
    this.getCountryCodes();
  }
};
</script>
<style lang="scss" scoped>
#sign {
  width: 862px;
  height: 486px;
  display: flex;
  justify-content: flex-end;
  background: url("../assets/img/sign_bg.png") no-repeat left;
  background-size: contain;

  ::v-deep .el-checkbox {
    align-self: self-start;
    &__label {
      color: lightgray;
    }
  }

  .box {
    box-sizing: border-box;
    position: relative;
    width: 280px;
    padding: 20px;
    height: 100%;
    backdrop-filter: blur(30px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  svg {
    fill: darkgray;
  }

  .abs {
    position: absolute;
    color: gray;
    cursor: pointer;
    overflow: hidden;
    font-size: 22px;
    &:hover {
      color: whitesmoke;
    }
    &.top {
      top: 12px;
    }
    &.right {
      right: 12px;
    }
  }
  .logo {
    svg,
    img {
      user-select: none;
      width: 71px;
      height: 80px;
    }
    svg {
      background-color: var(--primary);
      fill: white;
      border-radius: 6px;
      box-shadow: 0px 2px 20px 10px rgba(var(--primary-rgb), 0.1),
        0px 1px 10px 5px rgba(var(--primary-rgb), 0.1),
        0 0 4px 2px rgba(var(--primary-rgb), 0.2);
    }
    label {
      color: white;
      font-size: large;
    }
  }
}

@media (min-resolution: 2dppx) {
  #sign {
    background: url("../assets/img/sign_bg@2x.png") no-repeat left;
    background-size: contain;
  }
}
</style>
