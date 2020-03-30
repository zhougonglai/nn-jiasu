<template>
	<!-- 九宫格抽奖组件 -->
	<div class="recharge-lucky-draw">
		<ul>
			<li class="recharge-prize0" :class="{ active: index == 0 }">
				<div class="recharge-img">
					<img
						src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1948735660.jpg"
						alt=""
					/>
				</div>
				<p>xxx</p>
			</li>
			<li class="recharge-prize1" :class="{ active: index == 1 }">
				<div class="recharge-img">
					<img
						src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1948735660.jpg"
						alt=""
					/>
				</div>
				<p>xxx</p>
			</li>
			<li class="recharge-prize2" :class="{ active: index == 2 }">
				<div class="recharge-img">
					<img
						src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1948735660.jpg"
						alt=""
					/>
				</div>
				<p>xxx</p>
			</li>
			<li class="recharge-prize7" :class="{ active: index == 7 }">
				<div class="recharge-img">
					<img
						src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1948735660.jpg"
						alt=""
					/>
				</div>
				<p>xxx</p>
			</li>
			<li class="start_draw pointer" @click="onClickDraw" style="z-index:99">
				<h1>开始抽奖</h1>
				<p>剩余抽奖次数{{ number_of_draws }}次</p>
			</li>
			<li class="recharge-prize3" :class="{ active: index == 3 }">
				<div class="recharge-img">
					<img
						src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1948735660.jpg"
						alt=""
					/>
				</div>
				<p>xxx</p>
			</li>
			<li class="recharge-prize6" :class="{ active: index == 6 }">
				<div class="recharge-img">
					<img
						src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1948735660.jpg"
						alt=""
					/>
				</div>
				<p>xxx</p>
			</li>
			<li class="recharge-prize5" :class="{ active: index == 5 }">
				<div class="recharge-img">
					<img
						src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1948735660.jpg"
						alt=""
					/>
				</div>
				<p>xxx</p>
			</li>
			<li class="recharge-prize4" :class="{ active: index == 4 }">
				<div class="recharge-img">
					<img
						src="https://dss2.bdstatic.com/8_V1bjqh_Q23odCf/pacific/1948735660.jpg"
						alt=""
					/>
				</div>
				<p>xxx</p>
			</li>
		</ul>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import RechargeService from '@services/recharge';
const rechargeService = new RechargeService();
import LocalStorageUtil from '@components/recharge/js/LocalStorageUtil';
const localStorageUtil = new LocalStorageUtil();
export default {
	data() {
		return {
			list: [
				{
					id: 1,
					number: 1,
					prize_name: '乐豆',
				},
				{
					id: 2,
					number: 2,
					prize_name: '乐豆',
				},
				{
					id: 3,
					number: 3,
					prize_name: '乐豆',
				},
				{
					id: 4,
					number: 4,
					prize_name: '乐豆',
				},
				{
					id: 5,
					number: 5,
					prize_name: '乐豆',
				},
				{
					id: 6,
					number: 6,
					prize_name: '乐豆',
				},
				{
					id: 7,
					number: 7,
					prize_name: '乐豆',
				},
				{
					id: 8,
					number: 8,
					prize_name: '乐豆',
				},
			], //奖品列表
			index: 0, // 当前转动到哪个位置，第一次起点位置0,对应页面item1位置
			count: 8, // 总共有多少个位置
			times: 0, // 转动跑格子次数, 防连点
			cycle: 60, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
			speed: 200, // 初始转动速度
			lampShow: false, //开始抽奖，灯光闪烁
			timer: 0, // 转动定时器
			lamp: 0, // 灯光定时器
			prize: 0, // 中奖位置，接口返回
			number_of_draws: 0, //抽奖次数，接口返回
			prize_data: {
				//中奖信息
				present_id: Number, //奖品ID
				title: '', //奖品名称
				number: Number, //奖品数量
				img_url: '', //奖品图片
				type: Number, // 奖品类型
				points: Number, // 用户剩余积分
			},
			isDisable: true, // 防连点
			isWin: false, // 是否中奖
			awardInfo: null, //奖品数据
		};
	},
	computed: {
		...mapGetters('recharge', ['getAccountToken']),
	},
	async mounted() {
		await this.getActivityDetail();
	},
	methods: {
		/**
		 * 获取活动详情
		 */
		async getActivityDetail() {
			let token = this.getAccountToken || localStorageUtil.getUserToken();
			let params = {
				id: 279,
				type: 1,
				plat_type: 3,
				account_token: token,
				region_code: localStorageUtil.REGION_CODE_0,
				lang: 'zh_CN',
			};
			let BackData = await rechargeService.activityDetail(params);
			this.number_of_draws = BackData.data.points;
		},
		/**
		 * 点击开始抽奖
		 */
		async onClickDraw() {
			let token =
				this.getAccountToken || localStorageUtil.getUserToken().account_token;
			if (token == '') {
				//提示登录
				// console.log("请先登录");
				// this.gotoLogin();
				return;
			}
			if (this.number_of_draws <= 0) {
				//提示次数不足
				// console.log("次数不足");
				// this.dialog_recharge = true;
				return;
			}
			if (this.times != 0) {
				// console.log("正在抽奖中，请勿重复点击");
				return;
			}
			var _this = this;
			if (this.isDisable) {
				_this.isDisable = false;
				//开始调抽奖接口
				this.onDraw(1000, 1000);
				_this.startRoll(); //执行抽奖
				// _this.startMarquee(500); // 跑马灯
			}
		},
		/**
		 * 发送抽奖请求
		 * @param delay_win 成功延迟时间
		 * @param delay_lose 失败延迟显示
		 */
		async onDraw(delay_win, delay_lose) {
			let token =
				this.getAccountToken || localStorageUtil.getUserToken().account_token;
			let params = {
				activity_id: 279,
				account_token: token,
				region_code: localStorageUtil.REGION_CODE_0,
			};
			this.drwaBackData = await rechargeService.activityDraw(params);
			this.number_of_draws = this.drwaBackData.data.points;
			delay_win;
			delay_lose;
			// console.log(delay_win, delay_lose);
			// console.log('点击抽奖返回,:', this.drwaBackData);
			//执行部分
			this.speed = 200; //每次抽奖速度初始化为200
			this.prize = 2 - 1; //中奖位置赋值，跑马灯最终停留位置，这里实际位置需要-1
		},
		// 开始转动 => 开始抽奖
		startRoll() {
			// 执行请求
			this.isDisable = true;
			this.times += 1; // 转动次数 效果=>防连点
			this.oneRoll(); // 转动过程调用的每一次转动方法，这里是第一次调用初始化
			this.usePrize(1000, 1000);
		},

		// 每一次转动
		oneRoll() {
			let index = this.index; // 当前转动到哪个位置
			const count = 8; // 总共有多少个位置
			index += 1;
			if (index > count - 1) {
				index = 0;
			}
			this.index = index;
		},

		usePrize(delay_win, delay_lose) {
			// 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
			if (this.times > this.cycle + 10 && this.prize === this.index) {
				clearTimeout(this.timer); // 清除转动定时器
				clearTimeout(this.lamp); // 清除灯光定时器
				this.lampShow = false; // 白色灯隐藏
				this.times = 0; // 转动跑格子次数初始化为0，可以开始下次抽奖
				// if (this.prize_data.type == 0) {
				//   console.log("未中奖，谢谢参与"); //未中奖提示弹出，
				// } else {
				//   console.log("中奖啦"); //中奖弹出提示
				// }
				let that = this;
				if (this.drwaBackData.code == rechargeService.HTTP_SUCCESS_NET_CODE) {
					this.awardInfo = this.drwaBackData.data;
					// 中奖了
					setTimeout(function() {
						that.onDrawWin(that.drwaBackData);
					}, delay_win);
				} else if (
					this.drwaBackData.code == rechargeService.HTTP_TOKEN_EXPIRE
				) {
					// this.tokenExpired(this.drwaBackData.msg);
					this.$emit('tokenExpired', this.drwaBackData.msg);
					this.isDisable = false;
				} else {
					// 未中奖
					setTimeout(function() {
						that.onDrawLose(that.drwaBackData);
					}, delay_lose);
				}
			} else {
				if (this.times < this.cycle - 20) {
					this.speed -= 4; // 加快转动速度
				} else {
					this.speed += 10; // 抽奖即将结束，放慢转动速度
				}
				this.timer = setTimeout(this.startRoll, this.speed); //开始转动
			}
		},
		/**
		 * 中奖啦
		 */
		onDrawWin(backData) {
			// console.log('中奖啦:', backData);
			this.prize_data = backData;
			// //播放奖品动画
			// if (this.activityJson.choujiang_type == 1) {
			//   this.luck.speed = 100;
			//   this.roll();
			// }
			// if (this.activityJson.choujiang_type == 0) {
			//   this.isBengin = false;
			//   this.dialog_win = true; //弹出奖品图片动画
			//   this.prize_name = backData.data.title;
			//   this.prize_id = backData.data.present_id;
			// }
			// if (this.activityJson.choujiang_type == 2) {
			//   let num = Math.ceil(Math.random() * 3) + 5;
			//   let angel = 0;
			//   switch (backData.data.present_id) {
			//     case 90:
			//       angel = 5 + Math.random() * 50;
			//       break;
			//     case 89:
			//       angel = 5 + Math.random() * 50 + 60;
			//       break;
			//     case 88:
			//       angel = 5 + Math.random() * 50 + 120;
			//       break;
			//     case 87:
			//       angel = 5 + Math.random() * 50 + 180;
			//       break;
			//     case 86:
			//       angel = 5 + Math.random() * 50 + 240;
			//       break;
			//     case 85:
			//       angel = 5 + Math.random() * 50 + 300;
			//       break;
			//   }
			//   this.roll_deg =
			//     this.roll_deg + (360 - (this.roll_deg % 360)) + 360 * num + angel;
			//   $("#roll_table").css({
			//     transform: "rotate(" + this.roll_deg + "deg)",
			//     transition: "4s"
			//   });
			//   setTimeout(() => {
			//     this.dialog_win = true; //弹出奖品图片动画
			//     this.isBengin = false;
			//   }, 4000);
			//   this.prize_name = backData.data.title;
			//   this.prize_id = backData.data.present_id;
			// }
		},
		/**
		 * 未中奖
		 */
		onDrawLose(backData) {
			backData;
			// console.log('未中奖:', backData.msg);
		},
		/**
		 * 跑马灯
		 */
		startMarquee(deay_lamp) {
			let _this = this;
			_this.lamp = setInterval(() => {
				//灯光闪烁开启
				_this.lampShow = !_this.lampShow;
			}, deay_lamp);
		},
	},
};
</script>

<style lang="scss" scoped>
h1 {
	margin: 0 !important;
}
.recharge-lucky-draw {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 810px;
	height: 496px;
	border-radius: 8px;
	margin: auto;
	.start_draw {
		position: relative;
		width: 256px;
		height: 152px;
		border-radius: 8px;
		background: linear-gradient(
			151deg,
			rgba(255, 210, 46, 1) 0%,
			rgba(248, 192, 79, 1) 100%
		);
		box-shadow: 0px 3px 15px rgba(255, 192, 67, 0.5);
		opacity: 1;
		text-align: center;
		h1 {
			font-size: 39px;
			font-weight: 800;
			line-height: 54px;
			color: rgba(122, 73, 30, 1);
			opacity: 1;
			padding-top: 30px;
			text-align: center;
		}
		p {
			text-align: center;
			font-size: 18px;
			font-weight: 800;
			line-height: 25px;
			color: rgba(122, 73, 30, 1);
			opacity: 1;
		}
	}
	ul {
		width: 100%;
		height: 100%;
		position: relative;
		top: 0;
		left: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		z-index: 12;
		margin: auto;
		li {
			width: 256px;
			height: 152px;
			background: #472baf;
			border-radius: 8px;
			.recharge-img {
				width: 100%;
				height: 80%;
				img {
					width: 100%;
					height: auto;
				}
			}
			p {
				text-align: center;
				font-size: 13px;
				font-weight: 500;
				color: rgba(153, 153, 153, 1);
			}
		}
		.active {
			box-shadow: 0 0 0 3px #fff2b1;
			// border: 2px solid #fff2b1;
		}
	}
}
</style>
