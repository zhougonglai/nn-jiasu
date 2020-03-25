<template>
	<div class="speech-sound-wrap">
		<SpeechSoundLeft
			class="speech-sound-left"
			@chooseCateGory="chooseCateGory"
		/>
		<SpeechSoundRight class="speech-sound-right" ref="SpeechSoundRight" />
	</div>
</template>

<script>
export default {
	name: 'SpeechSound',
	data() {
		return {};
	},
	components: {
		SpeechSoundLeft: () =>
			import('@components/speechSound/speechSoundLeft.vue'),
		SpeechSoundRight: () =>
			import('@components/speechSound/speechSoundRight.vue'),
	},
	methods: {
		chooseCateGory(id) {
			this.$refs.SpeechSoundRight.chooseCategory(id);
		},
	},
};
</script>

<style lang="scss" scoped>
.speech-sound-wrap {
	width: 1150px;
	height: 626px;
	border: 1px solid rgba(44, 44, 49, 1);
	border-top: 0;
	box-sizing: border-box;
	display: flex;
	.speech-sound-left {
		box-sizing: border-box;
		width: 200px;
		height: 625px;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.09);
		opacity: 1;
	}
	.speech-sound-right {
		width: 950px;
	}
}
</style>
