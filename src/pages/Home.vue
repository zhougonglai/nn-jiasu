<template>
	<div class="home">
		home
	</div>
</template>

<script>
import SpeechSoundService from '@services/speechSound';

const speechSoundService = new SpeechSoundService();

export default {
	name: 'Home',
	async created() {
		await speechSoundService.getConfig();
	},
};
</script>
