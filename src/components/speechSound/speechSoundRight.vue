<template>
	<div class="speech-sound-right-wrap">
		<div class="speech-sound-right-title">
			<span
				v-for="(item, index) in speechSoundRightTitleList"
				:key="index"
				:class="{ 'speech-sound-right-title-span': item.choosen }"
				@click="speechSoundRightItemChoosen(item)"
				>{{ item.name }}</span
			>
		</div>
		<div class="speech-sound-right-content">
			<div
				class="speech-sound-right-content-item"
				v-for="(item, index) in speechSoundChannelList"
				:key="index"
			>
				<img
					:src="item.avatar"
					alt
					class="speech-sound-right-content-item-img"
				/>
				<div class="speech-sound-right-content-item-detail">
					<span class="sl-2 speech-sound-right-content-item-title">{{
						item.name
					}}</span>
					<div class="speech-sound-right-content-item-num">
						<img :src="ic_id" alt style="width:14px;height:14px" />
						<span>{{ item.channelid }}</span>
						<img
							:src="ic_person"
							alt
							style="width:14px;height:14px;margin-left:25px"
						/>
						<span>{{ item.hots }}</span>
					</div>
					<div class="speech-sound-right-content-item-classify">
						<span
							v-for="(item2, index2) in item.tags.slice(0, 3)"
							:key="index2"
						>
							<img :src="item2.icon" alt />
							{{ item2.name }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import SpeechSoundService from '@/services/speechSound';

const speechSoundService = new SpeechSoundService();
export default {
	name: 'speechSoundRight',
	data() {
		return {
			ic_id: require('@/assets/img/speechSound/ic_id.png'),
			ic_person: require('@/assets/img/speechSound/ic_person.png'),
			speechSoundRightTitleList: [
				{ name: '综合排序', choosen: true, sort: 2 },
				{ name: '人气频道', choosen: false, sort: 1 },
				{ name: '最新频道', choosen: false, sort: 2 },
			],
			speechSoundChannelList: [],
			category: 0,
		};
	},
	methods: {
		// 切换左侧分类
		chooseCategory(id) {
			this.category = id;
			this.speechSoundRightTitleList.map(e => {
				e.choosen = false;
			});
			this.speechSoundRightTitleList[0].choosen = true;
			this.getALLChannel(2);
		},
		// 选择排序
		speechSoundRightItemChoosen(item) {
			this.speechSoundRightTitleList.map(e => {
				e.choosen = false;
			});
			item.choosen = true;
			this.getALLChannel(item.sort);
		},
		// 获取列表
		async getALLChannel(num) {
			let { code, data } = await speechSoundService.getChannelList(
				this.category,
				num,
			);
			if (code == 0) {
				this.speechSoundChannelList = data.list.map(e => {
					if (e.special_channel_no) {
						e.channelid = e.special_channel_no;
					} else {
						e.channelid = e.channel_no;
					}
					return e;
				});
			}
		},
	},
	mounted() {
		this.getALLChannel(2);
	},
};
</script>

<style lang="scss" scoped>
.speech-sound-right-wrap {
	width: 100%;
	background: url('../../assets/img/speechSound/homeBackground.png');
	background-repeat: no-repeat;
	background-size: 100% 100%;
	.speech-sound-right-title {
		display: flex;
		margin-top: 25px;
		margin-bottom: 11px;
		span {
			width: 75px;
			height: 26px;
			line-height: 26px;
			background: rgba(255, 255, 255, 1);
			border: 1px solid rgba(204, 204, 204, 1);
			opacity: 1;
			border-radius: 16px;
			text-align: center;
			margin-left: 10px;
			color: rgba(138, 144, 160, 1);
			font-size: 12px;
			cursor: pointer;
		}
		.speech-sound-right-title-span {
			color: rgba(51, 51, 51, 1);
			border: 1px solid rgba(51, 51, 51, 1);
		}
	}
	.speech-sound-right-content {
		display: flex;
		width: 100%;
		height: 561px;
		flex-wrap: wrap;
		overflow-y: auto;
		// padding-top: 11px;
		.speech-sound-right-content-item {
			width: 300px;
			height: 100px;
			display: flex;
			margin-left: 11px;
			margin-bottom: 11px;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
			opacity: 1;
			border-radius: 5px;
			.speech-sound-right-content-item-img {
				width: 100px;
				height: 100px;
				border-radius: 5px 0px 0px 5px;
			}
			.speech-sound-right-content-item-detail {
				width: 200px;
				display: flex;
				flex-direction: column;
				align-items: center;
				.speech-sound-right-content-item-title {
					width: 180px;
					height: 36px;
					font-size: 12px;
					font-family: MicrosoftYaHei;
					line-height: 18px;
					color: rgba(102, 102, 102, 1);
					opacity: 1;
					margin-top: 10px;
				}
				.speech-sound-right-content-item-num {
					width: 180px;
					margin-top: 10px;
					display: flex;
					span {
						width: 55px;
						height: 14px;
						font-size: 14px;
						font-family: ElectroluxSans-SemiBold;
						line-height: 14px;
						color: rgba(102, 102, 102, 1);
						opacity: 1;
						margin-left: 5px;
					}
				}
				.speech-sound-right-content-item-classify {
					width: 200px;
					margin-top: 10px;
					height: 12px;
					line-height: 12px;
					display: flex;
					span {
						margin-left: 11px;
						// width: 32px;
						height: 12px;
						font-size: 8px;
						font-family: PingFangSC-Medium;
						line-height: 12px;
						color: rgba(138, 144, 160, 1);
						opacity: 1;
						display: flex;
						img {
							width: 14px;
							height: 14px;
						}
					}
				}
			}
		}
	}
}
/* 自定义浏览器滚动条 */
::-webkit-scrollbar-track-piece {
	width: 4px;
	background-color: hsla(220, 4%, 58%, 0);
}
::-webkit-scrollbar {
	width: 5px;
	height: 0px;
}

::-webkit-scrollbar-thumb {
	height: 50px;
	background-color: hsla(220, 4%, 58%, 0.25);
	cursor: pointer;
	border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
	background-color: hsla(220, 4%, 58%, 0.3);
	cursor: pointer;
}
/*多行省略？*/
.sl-2 {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
</style>
