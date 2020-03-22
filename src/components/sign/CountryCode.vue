<template>
	<div class="dropdown-link" v-click-outside="outSiteClick">
		<div class="dropdown-container" @click="showCountryCode">
			<span>+{{ value }}</span>
			<div class="spacer" />
			<i class="el-icon-caret-bottom" />
		</div>
		<div class="dropdown-menus width-search bottom" v-if="countryCodePop">
			<div class="form-contrl">
				<label for="keyword">
					<i class="form-icon el-icon-search" />
				</label>
				<input
					id="keyword"
					type="text"
					autocomplete="country country-name"
					class="form-input"
					placeholder="搜索区号和国家关键字"
					v-model="keyword"
				/>
			</div>
			<div class="dropdown-content">
				<div
					class="dropdown-menu"
					v-for="(country, i) in filterTopCountry(keyword)"
					:key="i"
					@click="pickCountry(country)"
				>
					<img :src="country.ico" class="dropdown-menu-icon" />
					<div class="spacer text-start pl-2">
						{{ country.name }}
					</div>
					<div class="dropdown-menu-icon">
						{{ country.code }}
					</div>
				</div>

				<div class="list" v-for="group in countryGroups" :key="group">
					<template v-if="!keyword && group !== keyword.toUpperCase()">
						<div class="list-title" v-text="group" />
						<div class="divider" />
					</template>
					<div
						class="list-item"
						v-for="country in countryByGroup(group)(keyword)"
						:key="country.code"
						@click="pickCountry(country)"
					>
						<div class="dropdown-menu">
							<img :src="country.ico" class="dropdown-menu-icon" />
							<div class="spacer text-start pl-2">
								{{ country.name }}
							</div>
							<div class="dropdown-menu-icon">
								{{ country.code }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import { mapState, mapGetters } from 'vuex';

export default {
	name: 'CountryCode',
	data() {
		return {
			countryCodePop: false,
			keyword: '',
		};
	},
	props: ['value'],
	computed: {
		...mapState('sign', ['top_country', 'list_country']),
		...mapGetters('sign', [
			'countryGroups',
			'countryByGroup',
			'filterTopCountry',
		]),
	},
	methods: {
		outSiteClick() {
			if (this.countryCodePop) {
				this.countryCodePop = false;
			}
		},
		showCountryCode() {
			this.countryCodePop = !this.countryCodePop;
		},
		pickCountry(country) {
			this.$emit('input', country.code);
			this.countryCodePop = false;
		},
	},
};
</script>
<style lang="less" scoped></style>
