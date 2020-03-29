<template>
	<!-- 充值-支付弹窗 -->
	<el-dialog
		title="支付"
		:close-on-click-moda="true"
		:visible.sync="dialogRechargeVisible"
		width="60%"
		:before-close="rechargeClose"
	>
		<div
			class="pay-main"
			v-loading="isLoadingPay"
			element-loading-background="white"
			element-loading-custom-class="pay-main-loading"
		>
			<div class="pay-tabs">
				<div class="pay-head">
					<ul>
						<li
							class="pointer"
							ref="tab"
							v-for="(item, index) in tabPay"
							:key="index"
							@click="payTypeSelected(item, index)"
						>
							<img
								:src="isActive == index ? item.icon_active : item.icon"
								alt=""
							/>
							<p :class="{ isActive: isActive == index }">{{ item.title }}</p>
						</li>
						<div :style="activeBarStyle"></div>
					</ul>
				</div>
			</div>
			<div class="pay-content">
				<div class="pay-content-wrap">
					<div class="pay-code">
						<!-- <img :src="paymentCode.pay_url" alt="" /> -->
						<iframe
							id="code_iframe"
							frameborder="0"
							height="166px;"
							width="166px;"
							scrolling="no"
							class="text-align"
							:src="paymentCode.pay_url"
						></iframe>
					</div>
					<div class="pay-info">
						<h1>套餐类型: {{ paymentCode.package_title }}</h1>
						<p class="pay_order">订单号: {{ paymentCode.order_no }}</p>
						<p class="pay_preferential">
							优惠价:<span>¥{{ paymentCode.amount }}</span
							><span>原价:¥235.71</span>
						</p>
						<div class="pay_prompt_code">
							<img :src="sys_logo" alt="" />
							<p>请使用支付宝扫一扫 扫描二维码完成支付</p>
						</div>
						<p class="pay_prompt">二维码将在30分钟后失效，请尽快支付</p>
					</div>
				</div>
			</div>
			<div class="pay-zhe_code">
				<el-checkbox v-model="checked">折扣码</el-checkbox>
				<el-tooltip
					popper-class="draw_share_atooltip"
					effect="light"
					:visible-arrow="true"
					content="仅限活动获取"
					placement="bottom"
				>
					<img class="unselect pointer" :src="zhe_code_problem" alt="" />
				</el-tooltip>
			</div>
			<el-autocomplete
				class="gh_zhekouInput"
				v-show="checked"
				v-model="zheCodeCopy"
				@input="inputDiscount"
				:fetch-suggestions="querySearch"
				placeholder="如无不需填写"
				@select="checkDiscountSelect"
			></el-autocomplete>
			<el-button v-show="discount_use_show" @click="useZhecode">使用</el-button>
		</div>
	</el-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import RechargeService from '@services/recharge';
const rechargeService = new RechargeService();
import LocalStorageUtil from '@components/recharge/js/LocalStorageUtil';
const localStorageUtil = new LocalStorageUtil();
export default {
	data() {
		return {
			activeBarStyle: null,
			isActive: 0,
			checked: false, // 是否显示折扣码输入框
			zhe_code_input: '',
			// 收款码
			paymentCode: {},
			pay_code: '',
			sys_logo: require('@/assets/img/activity/sys_logo.png'),
			zhe_code_problem: require('@/assets/img/activity/zhe_code_problem.png'),
			tabPay: [
				{
					title: '支付宝',
					icon: require('@/assets/img/activity/ali_pay.png'),
					icon_active: require('@/assets/img/activity/ali_pay_active.png'),
					pay_type: 2,
					qr_type: 'ali_qr',
				},
				{
					title: '微信支付',
					icon: require('@/assets/img/activity/wx_pay.png'),
					icon_active: require('@/assets/img/activity/wx_pay_active.png'),
					pay_type: 1,
					qr_type: 0,
				},
				{
					title: 'QQ支付',
					icon: require('@/assets/img/activity/qq_pay.png'),
					icon_active: require('@/assets/img/activity/qq_pay_active.png'),
					pay_type: 3,
					qr_type: 0,
				},
			],
			pay_type: '',
			qr_type: '',
			code_type: '',
			packageCheck: {},
			package_id: Number,
			isLoadingPay: false,
			discount_use_show: false, // 是否显示 使用按钮
			pay_status: -1, // 0: 未支付  1: 已支付
			zhecode: '', //折扣码
			zheCodeCopy: '',
		};
	},
	props: {
		// 折扣码
		zheCode: {
			type: String,
			default: '',
		},
		// 页面要显示的折扣码列表
		discountlist: {
			type: Array,
			default: () => [],
		},
	},
	watch: {
		isActive: {
			handler() {
				this.$nextTick(() => {
					this.computeTransform();
				});
			},
			immediate: false,
		},
	},
	computed: {
		...mapState('recharge', ['rechargeDialog', 'isLoading']),
		...mapGetters('recharge', ['getAccountToken']),
		// 充值弹窗
		dialogRechargeVisible: {
			get: function() {
				return this.rechargeDialog;
			},
			set: function() {
				this.RechargeDialog(false);
			},
		},
	},
	methods: {
		...mapActions('recharge', ['RechargeDialog', 'IsLoading']),
		rechargeClose(done) {
			done();
			this.checked = false;
			this.zheCodeCopy = '';
			this.discount_use_show = false;
			this.$emit('payDialogClose', done);
		},
		/**
		 * 支付code tabs重置
		 */
		payStatus(index) {
			this.isActive = index; // 重置支付方式change tabs
			console.log('isActive:', this.isActive);
		},
		/**
		 * 切换支付方式
		 * function  : onCleanInvoiceState // 停止计时器
		 */
		payTypeSelected(item, index) {
			this.isActive = index;
			console.log('isActive:', this.isActive);
			this.pay_type = item.pay_type;
			this.qr_type = item.qr_type;
			this.code_type = item.title;
			// 支付方式切换成功之前 先停止支付状态查询计时器
			// 修复 计时器堆积造成的 请求次数多倍叠加
			this.$emit('onCleanInvoiceState');
			this.discount_use_show = false;
			this.checked = false;
			this.zheCodeCopy = '';
			this.getBuyCode(
				this.pay_type,
				this.qr_type,
				this.code_type,
				this.packageCheck,
				this.package_id,
			);
			this.IsLoading(false);
		},
		computeTransform() {
			let activeTab = this.$refs.tab[this.isActive];
			this.activeBarStyle = {
				width: activeTab.offsetWidth - 20 + 'px',
				transform: `translateX(${activeTab.offsetLeft}px)`,
			};
		},
		/**
		 * 获取 收款码
		 */
		async getBuyCode(pay_type, qr_type, code_type, packageCheck, package_id) {
			console.log('所选套餐info:', packageCheck);
			console.log('所选套餐id:', package_id);
			console.log('收款码type:', qr_type);
			// this.IsLoading(true);
			this.isLoadingPay = true;
			this.packageCheck = packageCheck;
			this.package_id = package_id;
			let token =
				this.getAccountToken || localStorageUtil.getUserToken().account_token;
			let params = {
				account_token: token,
				package_id: this.package_id,
				price_id: this.packageCheck.price_id,
				invoice_from: 1,
				pay_type: pay_type,
				src_channel: localStorageUtil.FROM_GUANWANG,
				os_type: '0',
				refer_code: '',
				qr_type: qr_type,
				pay_plat: 1,
				lang: 'zh_CN',
			};
			let paymentCodeData = await rechargeService.packageBuy(params);
			// this.IsLoading(false);
			this.isLoadingPay = false;
			if (paymentCodeData.code == rechargeService.HTTP_SUCCESS_NET_CODE) {
				// this.$message.success(paymentCodeData.msg);
				this.paymentCode = paymentCodeData.data;
				this.$emit('payBackData', paymentCodeData);
			} else if (paymentCodeData.code == rechargeService.HTTP_TOKEN_EXPIRE) {
				this.$message.warning(paymentCodeData.msg);
				this.$emit('tokenExpired');
			}
			console.log(`打开${code_type || '支付宝'}付款码返回：`, paymentCodeData);
		},
		/**
		 * 获取 收款码
		 */
		async getBuyCodeDiscount(
			pay_type,
			qr_type,
			code_type,
			packageCheck,
			package_id,
		) {
			this.isLoadingPay = true;
			this.packageCheck = packageCheck;
			this.package_id = package_id;
			let token =
				this.getAccountToken || localStorageUtil.getUserToken().account_token;
			let params = {
				account_token: token,
				package_id: this.package_id,
				price_id: this.packageCheck.price_id,
				invoice_from: 1,
				pay_type: pay_type,
				src_channel: localStorageUtil.FROM_GUANWANG,
				os_type: '0',
				refer_code: '',
				qr_type: qr_type,
				pay_plat: 1,
				lang: 'zh_CN',
			};
			if (this.zheCode != '' && this.zheCode != null) {
				params.discount_code = this.zheCode;
			}
			let paymentCodeData = await rechargeService.packageBuy(params);
			// this.IsLoading(false);
			this.isLoadingPay = false;
			if (paymentCodeData.code == rechargeService.HTTP_SUCCESS_NET_CODE) {
				this.$message.success(paymentCodeData.msg);
				this.$emit('payBackData', paymentCodeData);
			} else if (paymentCodeData.code == rechargeService.HTTP_TOKEN_EXPIRE) {
				this.$message.warning(paymentCodeData.msg);
				this.$emit('tokenExpired');
			} else {
				this.$message.warning(paymentCodeData.msg);
			}
		},
		/**
		 * 是否使用折扣码
		 */
		useDiscount() {
			this.$emit('onCleanInvoiceState');
			if (this.checked) {
				if (!this.zhecode) return;
				this.checkDiscount(this.zhecode);
			} else {
				this.checkDiscount();
			}
		},
		/**
		 * 处理要显示的折扣码列表
		 */
		querySearch(queryString, cb) {
			let restaurant = this.discountlist.filter(item => {
				if (item.value == queryString || item.label == queryString) {
					return true;
				}
			});
			if (restaurant.length == 0) {
				this.zhecode = queryString;
			}
			// 调用 callback 返回建议列表的数据
			cb(this.discountlist);
		},
		/**
		 * 输入折扣码
		 */
		inputDiscount() {
			this.discount_use_show = true;
		},
		/**
		 * 使用折扣码
		 */
		useZhecode() {
			this.$emit('onCleanInvoiceState');
			this.checkDiscount(this.zhecode);
		},
		/**
		 * 选择折扣码
		 */
		checkDiscountSelect(item) {
			this.$emit('this.onCleanInvoiceState');
			this.discount_use_show = false;
			this.zhecodecopy = item.value;
			// this.zhecode = item.label;
			this.checkDiscount(this.zhecodecopy);
		},
		/**
		 * 选择折扣码  discountList有值的情况
		 */
		async checkDiscount(item) {
			if (item) {
				this.zheCode = item;
				let zhe_code_info = this.discountlist.filter(items => {
					return items.label == item;
				});
				if (zhe_code_info.length > 0) {
					this.zheCodeCopy = zhe_code_info[0].value;
				} else {
					this.zheCodeCopy = item;
				}
			} else {
				this.zheCode = '';
				this.zheCodeCopy = '';
			}
			if (this.payType != 12) {
				await this.getBuyCodeDiscount(
					this.pay_type,
					this.qr_type,
					this.code_type,
					this.packageCheck,
					this.package_id,
				);
				// this.onPay(this.appParam.platform + 1);
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.text-align {
	text-align: center;
}
.pay-main {
	width: 490px;
	margin: auto;
	::v-deep .pay-main-loading {
		z-index: 9999;
		.el-loading-spinner {
			top: 50%;
		}
	}
	.pay-tabs {
		width: 100%;
		padding-top: 12px;
		.pay-head {
			display: flex;
			justify-content: center;
			ul {
				display: flex;
				position: relative;
				li {
					position: relative;
					text-align: center;
					min-width: 30px;
					height: 26px;
					margin-left: 40px;
					display: flex;
					align-items: center;
					&:first-child {
						margin-left: 0px !important;
					}
					p {
						display: inline;
						font-size: 14px;
						font-family: Source Han Sans CN;
						font-weight: 500;
						line-height: 19px;
						opacity: 1;
						color: #80838a;
						padding-left: 6px;
						&:hover {
							color: #333333;
							transition: all 0.2s linear;
						}
					}
					.isActive {
						color: rgba(66, 67, 70, 1);
						-webkit-text-stroke: 1 rgba(0, 0, 0, 0);
					}
				}
				div {
					position: absolute;
					bottom: -9px;
					left: 15px;
					width: 40px;
					height: 3px;
					background: linear-gradient(
						180deg,
						rgba(255, 210, 46, 1) 0%,
						rgba(248, 192, 79, 1) 100%
					);
					border-radius: 2px;
					transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
				}
			}
		}
	}
	.pay-content {
		width: 100%;
		padding-top: 60px;
		.pay-content-wrap {
			display: flex;
			justify-content: space-between;
			.pay-code {
				width: 179px;
				height: 179px;
				background: rgba(233, 233, 233, 1);
				opacity: 1;
				position: relative;
				text-align: center;
				padding: 15px 0 0 30px;
				display: flex;
				margin-left: 15px;
				#code_iframe {
					margin: auto;
					position: relative;
					right: 23px;
					bottom: 9px;
				}
				img {
					width: 186px;
					height: 186px;
					position: absolute;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					margin: auto;
				}
			}
			.pay-info {
				width: 290px;
				height: 199px;
				font-family: Source Han Sans CN;
				padding: 5px 0 0 40px;
				margin-top: -15px;
				h1 {
					font-size: 16px;
					font-weight: 500;
					line-height: 27px;
					color: rgba(66, 67, 70, 1);
				}
				.pay_order {
					width: 250px;
					height: 12px;
					font-size: 12px;
					font-weight: 500;
					line-height: 12px;
					color: rgba(128, 130, 136, 1);
					margin-top: 5px;
				}
				.pay_preferential {
					font-size: 14px;
					font-weight: 500;
					line-height: 24px;
					color: rgba(66, 67, 70, 1);
					padding-top: 10px;
					span {
						font-size: 30px;
						font-weight: 500;
						line-height: 51px;
						color: rgba(66, 67, 70, 1);
						padding-left: 7px;
						opacity: 1;
						&:last-child {
							font-size: 14px;
							font-weight: 500;
							line-height: 24px;
							color: rgba(128, 130, 136, 1);
							opacity: 0.5;
							text-decoration: line-through;
						}
					}
				}
				.pay_prompt_code {
					display: flex;
					align-items: center;
					padding-top: 15px;
					p {
						width: 126px;
						height: 34px;
						margin-left: 10px;
						font-size: 14px;
						font-weight: 400;
						line-height: 17px;
						color: rgba(128, 131, 138, 1);
					}
				}
				.pay_prompt {
					font-size: 14px;
					font-weight: 400;
					line-height: 24px;
					color: rgba(128, 131, 138, 1);
					padding-top: 10px;
				}
			}
		}
	}
	.pay-zhe_code {
		display: flex;
		align-items: center;
		padding: 23px 20px 0 15px;
		.draw_share_atooltip {
			z-index: 9999;
			border: 1px solid #bbbbbb !important;
		}
		::v-deep .el-checkbox__input.is-checked .el-checkbox__inner {
			width: 14px;
			height: 14px;
			border: 1px solid rgba(158, 159, 162, 1);
			border-radius: 2px;
		}
		::v-deep .el-checkbox__inner {
			border: 1px solid rgba(158, 159, 162, 1);
		}
		::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
			font-size: 16px;
			font-family: Source Han Sans CN;
			font-weight: 400;
			line-height: 27px;
			color: rgba(128, 131, 138, 1);
		}
		::v-deep .el-checkbox__label {
			font-size: 16px;
			font-weight: 400;
			line-height: 27px;
			color: rgba(128, 131, 138, 1);
		}
		::v-deep .el-checkbox__inner::after {
			//   border: 1px solid #9e9fa2 !important;
			-webkit-box-sizing: content-box;
			box-sizing: content-box;
			content: '';
			border: 1px solid #9e9fa2;
			border-left: 0;
			border-top: 0;
			height: 7px;
			left: 4px;
			position: absolute;
			top: 1px;
			width: 3px;
		}
		img {
			width: 16px;
			height: 16px;
			margin-left: 7px;
		}
	}
	::v-deep .el-autocomplete {
		margin-left: 15px;
	}
}
</style>
