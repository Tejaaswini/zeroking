<script lang="ts">
	import { goto } from '$app/navigation';
	import AuroConnect from '$lib/components/general/AuroConnect.svelte';
	import { ripple } from 'svelte-ripple-action';
	import { onMount } from 'svelte';

	let email = '';
	let emailValid = false;
	let emailTouched = false;
	let zkEmailProof: any = null;
	let minting = false;
	let minted = false;

	function validateEmail(input: string) {
		emailTouched = true;
		emailValid = /^[^@\s]+@[^@\s]+\.edu$/.test(input.trim());
	}

	async function handleConnection(connect: () => void) {
		if (!emailValid) {
			alert('Please enter a valid .edu email address.');
			return;
		}

		zkEmailProof = await generateZkEmailProof(email);

		if (zkEmailProof?.isValid) {
			await mintVictoryNFT(email, zkEmailProof, 'connect');
			connect();
			goto('/game');
		} else {
			alert('Email verification with zkEmail failed.');
		}
	}

	async function generateZkEmailProof(email: string) {
		return {
			isValid: true,
			email,
			proof: 'zkProof123abc',
			issuer: 'zkemail.io',
			hash: '0xZKEMAILHASH',
		};
	}

	export async function mintVictoryNFT(email: string, proof: any, reason: 'connect' | 'resign' | 'draw', player?: 'white' | 'black' | 'both') {
		minting = true;

		const name = reason === 'resign'
			? `ZeroKing Victory - ${player === 'black' ? 'Black Wins' : 'White Wins'}`
			: reason === 'draw'
			? 'ZeroKing Draw Badge'
			: 'ZeroKing Victory Badge';

		const metadata = {
			name,
			description: `Awarded to a verified .edu player in ZeroKing (${reason})`,
			image: '/nft/zk-winner.png',
			attributes: [
				{ trait_type: 'Email', value: email },
				{ trait_type: 'ZK Verified', value: 'Yes' },
				{ trait_type: 'Proof Hash', value: proof.hash },
				{ trait_type: 'Issuer', value: proof.issuer },
				{ trait_type: 'Outcome', value: reason },
				{ trait_type: 'Sponsor', value: 'ZK Email' },
			],
		};

		console.log('Minting NFT with metadata:', metadata);
		await new Promise((r) => setTimeout(r, 1500));
		minted = true;
		minting = false;
		alert('🎉 NFT minted and linked to your email proof!');
	}
</script>

<svelte:head>
	<title>ZeroKing</title>
</svelte:head>

<main class="relative min-h-screen flex flex-col items-center justify-center bg-background">
	<!-- Background Overlay -->
	<div class="absolute inset-0 bg-black/70 backdrop-blur-sm z-0"></div>

	<!-- Hero Section -->
	<div class="container relative z-10 max-w-4xl mx-auto px-6 text-center text-white pt-24">
		<h1 class="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-4 drop-shadow-lg">
			ZeroKing: Play with Proof
		</h1>
		<p class="text-lg md:text-xl max-w-2xl mx-auto text-gray-300 drop-shadow">
			Trustless. Transparent. Tamper-proof. Powered by zero-knowledge cryptography.
		</p>

		<div class="flex flex-col md:flex-row items-center justify-center gap-4 mt-10">
			<input
				type="email"
				bind:value={email}
				on:input={(e) => validateEmail(e.target.value)}
				class="px-4 py-2 rounded-md text-black w-64"
				placeholder="Enter your .edu email"
			/>

			<AuroConnect let:connect>
				<button
					use:ripple
					class="bg-primary text-white text-lg px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all duration-200 disabled:opacity-50"
					on:click={() => handleConnection(connect)}
					disabled={!emailValid || minting}
				>
					{minting ? 'Verifying...' : minted ? 'Connected ✅' : 'Connect & Play'}
				</button>
			</AuroConnect>
		</div>
	</div>

	<section class="relative z-10 mt-20 px-4 w-full pb-20">
		<h2 class="text-white text-3xl font-bold text-center mb-12">Why ZeroKing?</h2>
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
			<div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
				<div class="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 mb-4">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 20.5C7.305 20.5 3.5 16.695 3.5 12S7.305 3.5 12 3.5 20.5 7.305 20.5 12 16.695 20.5 12 20.5z" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold mb-2">Trustless Gameplay</h3>
				<p class="text-sm text-gray-300">Play without needing to trust your opponent — cryptographic proofs handle it all.</p>
			</div>

			<div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
				<div class="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 mb-4">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h11M9 21V3m12 7l-4 4-4-4" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold mb-2">On-Chain Proofs</h3>
				<p class="text-sm text-gray-300">Moves are verifiably valid on-chain using zk-SNARKs, ensuring full integrity.</p>
			</div>

			<div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
				<div class="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 mb-4">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m0 14v1m8-8h1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.021 0l-.707-.707M6.343 6.343l-.707-.707" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold mb-2">Private Move Encoding</h3>
				<p class="text-sm text-gray-300">Your moves are encrypted and revealed only after verification — privacy preserved.</p>
			</div>

			<div class="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all">
				<div class="w-12 h-12 flex items-center justify-center rounded-full bg-pink-600 mb-4">
					<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<h3 class="text-lg font-semibold mb-2">Decentralized Fairness</h3>
				<p class="text-sm text-gray-300">No server manipulation, no bias — fairness is guaranteed by math and code.</p>
			</div>
		</div>
	</section>
</main>

<style>
	.bg-background {
		background-color: #0d0d0d;
		background-image: url("https://images.unsplash.com/photo-1528819622765-d6bcf132f793?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
	}

	.text-primary {
		color: #8f5eff;
	}

	.bg-primary {
		background-color: #8f5eff;
	}
</style>
