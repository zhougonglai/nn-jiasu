<template>
  <div class="speech-sound-left-wrap">
    <div class="speech-sound-catalogue">
      <div class="speech-sound-title">
        <img :src="wodepindao" />
        <span>我的频道</span>
      </div>
    </div>
    <div class="speech-sound-catalogue">
      <div class="speech-sound-title">
        <img :src="remenpindao" />
        <span>热门频道</span>
      </div>
    </div>
    <div class="speech-sound-catalogue">
      <div class="speech-sound-title">
        <img :src="youxipindao" />
        <span>游戏频道</span>
      </div>
      <div class="speech-channel-list">
        <div v-for="(item,index) in gameChannelList" :key="index" class="speech-channel-item">
          <span
            :class="{'channel-choosen':item.choosen}"
            @click="speechGameChannelChoose(item)"
          >{{item.name}}</span>
        </div>
      </div>
    </div>
    <div class="speech-sound-catalogue">
      <div class="speech-sound-title">
        <img :src="yulehudong" />
        <span>娱乐互动</span>
      </div>
      <div class="speech-channel-list">
        <div v-for="(item,index) in amusementList" :key="index" class="speech-channel-item">
          <span
            :class="{'channel-choosen':item.choosen}"
            @click="speechAmusementChannelChoose(item)"
          >{{item.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "speechSoundLeft",
  data() {
    return {
      // 我的频道
      wodepindao: require("@/assets/img/speechSound/wodepindao.png"),
      //热门频道
      remenpindao: require("@/assets/img/speechSound/remenpindao.png"),
      //游戏频道
      youxipindao: require("@/assets/img/speechSound/youxipindao.png"),
      //娱乐互动
      yulehudong: require("@/assets/img/speechSound/yulehudong.png"),
      // 游戏频道列表
      gameChannelList: [
        { name: "绝地求生", choosen: true },
        { name: "英雄联盟", choosen: false },
        { name: "云顶之弈", choosen: false },
        { name: "王者荣耀", choosen: false },
        { name: "王者荣耀", choosen: false },
        { name: "穿越火线", choosen: false },
        { name: "主机游戏", choosen: false },
        { name: "其他游戏", choosen: false }
      ],
      // 娱乐互动列表
      amusementList: [
        { name: "声优聊天", choosen: false },
        { name: "FM电台", choosen: false },
        { name: "互动交友", choosen: false },
        { name: "音乐世界", choosen: false }
      ]
    };
  },
  methods: {
    // 点击游戏频道
    speechGameChannelChoose(item) {
      this.gameChannelList.map(e => {
        e.choosen = false;
      });
      this.amusementList.map(e => {
        e.choosen = false;
      });
      item.choosen = true;
    },
    // 点击娱乐互动
    speechAmusementChannelChoose(item) {
      this.gameChannelList.map(e => {
        e.choosen = false;
      });
      this.amusementList.map(e => {
        e.choosen = false;
      });
      item.choosen = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.speech-sound-left-wrap {
  display: flex;
  flex-direction: column;
  .speech-sound-catalogue {
    .speech-sound-title {
      margin-left: 10px;
      margin-top: 25px;
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
        margin-top: 10px;
        text-align: center;
        margin-right:5px;
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
}
</style>