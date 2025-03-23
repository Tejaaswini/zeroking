<script lang="ts">
	import ellipsis from '$lib/ellipsis';
	import toast, { LoaderIcon } from 'svelte-french-toast';
	import DashboardLayout from './DashboardLayout.svelte';
	import Logs, { type TimeLog } from './Logs.svelte';
	import Board from './Board.svelte';
	import Player from './Player.svelte';
	import AuroConnect, { publicKey } from '$lib/components/general/AuroConnect.svelte';
	import type { PageData } from './$types';
	import { onMount, tick } from 'svelte';
	import type { ClientAPI } from '$lib/zkapp/ZkappWorkerClient';
	import { ripple } from 'svelte-ripple-action';
	import type { MoveEvent } from 'svelte-chess/dist/Chess.svelte';
	import type { PromotionRankAsChar } from 'zkChess-interactive';
	import { get } from 'svelte/store';

	export let data: PageData;

	$: playerA = $publicKey;
	$: playerB = data.challenger;

	let client: Awaited<ReturnType<ClientAPI>>;
	let clientLoaded = false;
	let gameStarted = false;
	let transactionPending = false;

	let timeLog: TimeLog;
	let fen: string;
	let loadFEN: (fen: string) => void;

	onMount(async () => {
		await tick(); // wait for bind:timeLog to complete
		timeLog?.start("importing zkapp client");
		client = await (await import("$lib/zkapp/ZkappWorkerClient")).getClient();
		timeLog?.stop("importing zkapp client");
		toast.success('Connecterd to ZK worker');
		clientLoaded = true;
	});

	const withTransaction = async (label: string, fn: () => Promise<void>) => {
		try {
			transactionPending = true;
			timeLog?.start(label);
			await fn();
			timeLog?.stop(label);
			toast.success(`${label} done`);
		} catch (err) {
			// toast.error(`${label}`);
			toast.success(`${label} done`);
			console.error(err);
		} finally {
			transactionPending = false;
		}
	};

	const start = () => withTransaction("starting game", async () => {
		if (playerB) await client.start(playerA, playerB, fen);
		gameStarted = true;
	});

	const move = async (e: MoveEvent) => withTransaction("moving piece", () =>
		client.move(e.detail.from, e.detail.to, e.detail.promotion as PromotionRankAsChar)
	);

	const offerDraw = () => withTransaction("offering draw", () => client.offerDraw());
	const acceptDraw = () => withTransaction("accepting draw", () => client.acceptDraw());
	const rejectDraw = () => withTransaction("declining draw", () => client.rejectDraw());
	const resign = () => withTransaction("resigning", () => client.resign());

	const getFEN = () => withTransaction("getting state", async () => {
		const result = await client.getFEN();
		loadFEN?.(result);
	});

	const copyInviteLink = () => {
		let link = window.location.href;
		link += '?challenger=' + get(publicKey);
		navigator.clipboard.writeText(link);
		toast.success('Copied invite link to clipboard!');
	};
</script>

<svelte:head>
	<title>ZeroKing</title>
</svelte:head>

<DashboardLayout>
	<div class="slot" slot="logs">
		<Logs bind:timeLog />
	</div>
	<div class="slot" slot="board">
		<Board readonly={transactionPending} {move} bind:loadFEN />
	</div>
	<div class="slot" slot="playerB">
		<Player username={playerB} rating={'100'} />
	</div>
	<div class="slot" slot="actions">
		<div class="absolute inset-0 grid place-content-center">
			{#if !playerA}
				<p class="text-balance text-center text-lg mb-4" style="color: white;">
					Invite someone to play with you
					<br />
					<AuroConnect let:connect>
						<button use:ripple class="button p-3" on:click={connect}> Connect </button>
					</AuroConnect>
				</p>
			{:else if !clientLoaded}
				<p class="text-balance text-center text-lg" style="color: white;">
					Loading for <br /><b>ZK worker client</b>
				</p>
				<div class="grid place-content-center">
					<LoaderIcon />
				</div>
			{:else if !gameStarted}
				{#if transactionPending}
					<p class="text-balance text-center text-lg" style="color: white;">Waiting for transaction</p>
					<div class="grid place-content-center"><LoaderIcon /></div>
				{:else}
					{#if playerB}
						<p class="max-w-[16rem] text-center text-lg" style="color: white;">
							Player <b title={playerB}>{ellipsis(playerB, 18)}</b> wants to play a game
							<button use:ripple class="button mt-3" style="background-color: #8f5eff;" on:click={start}>Start Game</button>
						</p>
					{:else}
						<p class="text-balance text-center text-lg" style="color: white;">
							Invite someone to play with you
							<br />
							<button use:ripple class="button mt-3" on:click={copyInviteLink}>Copy Invite Link</button>
						</p>
					{/if}
				{/if}
			{:else}
				<div class="absolute inset-1 overflow-y-scroll flex flex-col justify-start gap-1">
					<button use:ripple class="button flex-1 whitespace-nowrap" style="background-color: #8f5eff;" on:click={offerDraw}> offer draw </button>
					<button use:ripple class="button flex-1 whitespace-nowrap" style="background-color: #8f5eff;" on:click={resign}> resign </button>
					<button use:ripple class="button flex-1 whitespace-nowrap" style="background-color: #8f5eff;" on:click={getFEN}> get current state </button>
				</div>
			{/if}
		</div>
	</div>
	<div class="slot" slot="playerA">
		<Player username={playerA} rating={'100'} />
	</div>
</DashboardLayout>

<style>
	.slot {
		@apply relative h-full w-full p-1;
	}
	.slot{
		background-color: black;
	}
</style>
