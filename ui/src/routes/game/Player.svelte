<script lang="ts">
	import ellipsis from '$lib/ellipsis';
	export let username = 'N/A';
	export let rating = 'N/A';
</script>

<div id="player" class="absolute inset-1 layout dark-theme">
	<span class="rating-badge">
		{rating}
	</span>
	<span class="player-name">
		<span class="long">{username}</span>
		<span class="short" title={username}>{ellipsis(username, 6)}</span>
	</span>
</div>

<style lang="scss">
	#player {
		container-type: inline-size;
		.long {
			display: block;
		}
		.short {
			display: none;
		}
	}

	@container (max-width: 190px) {
		#player {
			.long {
				display: none;
			}
			.short {
				display: block;
			}
		}
	}

	.layout {
		@apply flex gap-2 items-center rounded-lg px-3 py-2 shadow-md;
		background: linear-gradient(145deg, #1a1a2e, #0f0f1a);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.rating-badge {
		@apply text-xs font-bold text-white px-2 py-1 rounded-full;
		background: linear-gradient(135deg, #8f5eff, #5f3dc4);
		box-shadow: 0 0 8px #8f5eff88;
	}

	.player-name {
		@apply text-gray-100 text-base font-semibold flex-1 min-w-0 truncate;
		text-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
	}

	.dark-theme {
		box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
		transition: background 0.3s ease;
	}
</style>
