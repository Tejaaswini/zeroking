import * as Comlink from 'comlink';
import ZkappWorker from './ZkappWorker?worker';
import type { ZkappWorkerAPI } from './ZkappWorker';
import type { PromotionRankAsChar } from 'zkChess-interactive';
// import {GameState, Move, type PromotionRankAsChar} from "zkChess-interactive";
// import { Bool, Mina, PublicKey } from 'o1js';

export const getClient=async()=>{
	const zkappWorker=new ZkappWorker();
	const zkappReady = () => new Promise<void>(resolve => 
		zkappWorker.onmessage = (e) => e.data==='ready' && resolve());
	await zkappReady();
	const proxy: Comlink.Remote<ZkappWorkerAPI> = Comlink.wrap(zkappWorker);
	return {
		start: async (whiteKey: string, blackKey: string, fen: string) => {
			await proxy.start(whiteKey, blackKey);
		},
		move: async (from: string, to: string, promotion: PromotionRankAsChar) => {
			return await proxy.move(from, to, promotion);
		},
		offerDraw: async () => {
			return await proxy.offerDraw();
		},
		acceptDraw: async () => {
			return await proxy.acceptDraw();
		},
		rejectDraw: async () => {
			return await proxy.rejectDraw();
		},
		resign: async () => {
			return await proxy.resign();
		},
		getFEN: async () => {
			return await proxy.getFEN();
		}
	}
};
export type ClientAPI= typeof getClient;

