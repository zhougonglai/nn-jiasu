<template>
	<!-- 中奖记录组件 -->
	<div class="winning_record">
		<vue-seamless-scroll
			:data="recordData"
			:class-option="optionHover"
			class="seamless-warp"
		>
			<ul v-for="(items, index) in 2" :key="index">
				<li ref="single" v-for="(item, index) in recordData" :key="index">
					<span class="phone_number ellipsis"
						>恭喜{{ item.mobile_num }} 抽中{{ item.title }}</span
					>
					<span class="date ellipsis" v-text="item.create_time"></span>
				</li>
			</ul>
		</vue-seamless-scroll>
		<vue-seamless-scroll
			:data="recordData"
			:class-option="optionHover"
			class="seamless-warp"
		>
			<ul>
				<li v-for="(item, index) in recordData" :key="index">
					<span class="phone_number ellipsis"
						>恭喜{{ item.mobile_num }} 抽中{{ item.title }}</span
					>
					<span class="date ellipsis" v-text="item.create_time"></span>
				</li>
			</ul>
		</vue-seamless-scroll>
	</div>
</template>

<script>
import RechargeService from '@services/recharge';
const rechargeService = new RechargeService();
export default {
	data() {
		return {
			recordData: [
				{
					mobile_num: '1323****871',
					title: 'iPhone 11',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 12',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 13',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 14',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 15',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 16',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 17',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 18',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 19',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 20',
					create_time: '2020.12.12 12:00 52',
				},
				{
					mobile_num: '1323****871',
					title: 'iPhone 21',
					create_time: '2020.12.12 12:00 52',
				},
			],
		};
	},
	computed: {
		optionHover() {
			return {
				hoverStop: false, //是否悬停
				singleHeight: 23, // 单行停顿高度 == 单行li的高度 这样就不会出现误差
				waitTime: 1000, //单行停顿时间
			};
		},
		recordDataUnReverse() {
			return this.recordData;
		},
	},
	watch: {
		singleHeight: {
			handler() {
				this.$nextTick(() => {
					this.getSingleHeight();
				});
			},
			immediate: true,
		},
	},
	async mounted() {
		await this.getActivityPresent();
	},
	methods: {
		/**
		 * 获取singleHeight 停留高度
		 */
		getSingleHeight() {
			// let single_height = this.$refs.single[0].offsetHeight;
		},
		/**
		 * 获取礼品中奖记录
		 */
		async getActivityPresent() {
			let params = {
				activity_id: 279,
				size: 50,
				present_type: 0,
				lang: 'zh_CN',
			};
			let recordData = await rechargeService.activityPresent(params);
			this.recordData = recordData.data.list;
			// console.log(this.recordData);
		},
	},
};
</script>

<style lang="scss" scoped>
.winning_record {
	width: 808px;
	height: 166px;
	background: rgba(71, 43, 175, 1);
	padding: 25px;
	opacity: 1;
	display: flex;
	.seamless-warp {
		width: 49%;
		height: 117px;
		overflow: hidden;
		padding-top: 2px;
		ul {
			li {
				color: #ffffff;
				height: 23px;
				// margin-top: 3px;
				span {
					display: inline-block;
					font-size: 12px;
					font-weight: bold;
					line-height: 17px;
					color: #ffffff;
					opacity: 0.7;
				}
				.phone_number {
					width: 213px;
				}
				.date {
					width: 130px;
				}
			}
		}
	}
}
</style>
