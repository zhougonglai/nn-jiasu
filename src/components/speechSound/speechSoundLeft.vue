<template>
  <div class="speech-sound-left-wrap">
    <div class="speech-sound-catalogue" style="margin-top:13px;">
      <div class="speech-sound-title" >
        <img :src="wodepindao" />
        <span>我的频道</span>
      </div>
    </div>

    <div :class="['speech-sound-catalogue',{'speech-sound-catalogue-active':item.choosen}]" v-for="(item,index) in categoryList" :key="index" @click="chooseSpeechSoundCategory(item)">
      <div class="speech-sound-title">
        <img :src="item.icon" />
        <span>{{item.name}}</span>
         <div class="animation-wrap" v-show="item.choosen">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="speech-channel-list">
        <div v-for="(item2,index2) in item.tags" :key="index2" class="speech-channel-item">
          <span
            :class="{'channel-choosen':item.choosen && index2 === 0}"
          >{{item2.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SpeechSoundService from "@/services/speechSound";

const speechSoundService = new SpeechSoundService();
export default {
  name: "speechSoundLeft",
  data() {
    return {
      // 我的频道
      wodepindao: require("@/assets/img/speechSound/wodepindao.png"),
      // //热门频道
      // remenpindao: require("@/assets/img/speechSound/remenpindao.png"),
      // //游戏频道
      // youxipindao: require("@/assets/img/speechSound/youxipindao.png"),
      // //娱乐互动
      // yulehudong: require("@/assets/img/speechSound/yulehudong.png"),
      // 频道列表
      categoryList:[],
    };
  },
  methods: {
    // 选择分类
    chooseSpeechSoundCategory(item){
      this.deleteChoosen(item)
      this.$emit('chooseCateGory',item.id)
    },
    // 切换选中效果
    deleteChoosen(item){
      this.categoryList.map(e=>{
        e.choosen = false
      })
      item.choosen = true
    }
  },
  async mounted() {
    let { code, data } = await speechSoundService.getCategoryList();
    console.log(code, data);
    if (code == 0) {
      this.categoryList = data.map(e=>{
        e.choosen = false
        return e
      });
      this.categoryList[0].choosen = true
    }
  }
};
</script>

<style lang="scss" scoped>
.speech-sound-left-wrap {
  display: flex;
  flex-direction: column;
  .speech-sound-catalogue {
    padding:12px 0;
    .speech-sound-title {
      margin-left: 10px;
      cursor: pointer;
      display: flex;
      img {
        width: 19px;
        height: 19px;
        margin-right: 5px;
      }
      span {
        width: 56px;
        height: 19px;
        line-height: 19px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: rgba(51, 51, 51, 1);
        opacity: 1;
      }
    }
    .speech-channel-list {
      display: flex;
      align-content: center;
      flex-wrap: wrap;
      margin-left: 18px;
      .speech-channel-item {
        width: 80px;
        margin-top: 8px;
        text-align: center;
        margin-right: 5px;
        span {
          display: inline-block;
          font-size: 14px;
          font-family: MicrosoftYaHei;
          line-height: 24px;
          color: rgba(128, 131, 138, 1);
          opacity: 1;
          width: 80px;
          height: 24px;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
        }
        .channel-choosen {
          background-color: rgba(248, 192, 79, 1);
          color: rgba(122, 73, 30, 1);
        }
      }
    }
  }
  .animation-wrap {
    padding-left: 10px;
    width: 22px;
    height: 15px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    span {
      width: 1px;
      margin-left:1px;
      background-color: rgba(66,67,70,1);
      border-radius: 2px;
      animation: select 0ms -800ms linear infinite alternate;
    }
  }
  @keyframes select {
    0% {
      height: 2px;
    }

    100% {
      height: 8px;
    }
  }
  .animation-wrap span:nth-child(1) {
    /* height: 4px; */
    animation-duration: 474ms;
  }
  .animation-wrap span:nth-child(2) {
    /* height: 6px; */
    animation-duration: 433ms;
  }
  .animation-wrap span:nth-child(3) {
    /* height: 8px; */
    animation-duration: 407ms;
  }
}
</style>