import { Signer } from '@ethersproject/abstract-signer';
import { CrosschainQuote, Quote } from '@rainbow-me/swaps';
import { Address } from 'viem';

import { ParsedAsset } from '@/__swaps__/types/assets';
import { GasFeeParamsBySpeed, LegacyGasFeeParamsBySpeed, LegacySelectedGasFee, SelectedGasFee } from '@/entities';

export enum SwapModalField {
  input = 'inputAmount',
  native = 'nativeAmount',
  output = 'outputAmount',
}

export enum Source {
  AggregatorRainbow = 'rainbow',
  Aggregator0x = '0x',
  Aggregator1inch = '1inch',
  Socket = 'socket',
}

export interface UnlockActionParameters {
  amount: string;
  assetToUnlock: ParsedAsset;
  contractAddress: Address;
  chainId: number;
}

export type SwapMetadata = {
  slippage: number;
  route: Source;
  inputAsset: ParsedAsset;
  outputAsset: ParsedAsset;
  independentField: SwapModalField;
  independentValue: string;
};

export type QuoteTypeMap = {
  swap: Quote;
  crosschainSwap: CrosschainQuote;
};

export interface RapSwapActionParameters<T extends 'swap' | 'crosschainSwap'> {
  amount?: string | null;
  sellAmount: string;
  buyAmount?: string;
  permit?: boolean;
  chainId: number;
  requiresApprove?: boolean;
  meta?: SwapMetadata;
  assetToSell: ParsedAsset;
  assetToBuy: ParsedAsset;
  selectedGasFee: SelectedGasFee | LegacySelectedGasFee;
  gasFeeParamsBySpeed: GasFeeParamsBySpeed | LegacyGasFeeParamsBySpeed;
  nonce?: number;
  flashbots?: boolean;
  quote: QuoteTypeMap[T];
}

export interface RapUnlockActionParameters {
  fromAddress: Address;
  assetToUnlock: ParsedAsset;
  contractAddress: Address;
  chainId: number;
}

export type RapActionParameters = RapSwapActionParameters<'swap'> | RapSwapActionParameters<'crosschainSwap'> | RapUnlockActionParameters;

export interface RapActionTransaction {
  hash: string | null;
}

export type RapActionParameterMap = {
  swap: RapSwapActionParameters<'swap'>;
  crosschainSwap: RapSwapActionParameters<'crosschainSwap'>;
  unlock: RapUnlockActionParameters;
};

export interface RapAction<T extends RapActionTypes> {
  parameters: RapActionParameterMap[T];
  transaction: RapActionTransaction;
  type: T;
}

export interface Rap {
  actions: RapAction<'swap' | 'crosschainSwap' | 'unlock'>[];
}

export enum rapActions {
  swap = 'swap',
  crosschainSwap = 'crosschainSwap',
  unlock = 'unlock',
}

export type RapActionTypes = keyof typeof rapActions;

export enum rapTypes {
  swap = 'swap',
  crosschainSwap = 'crosschainSwap',
}

export type RapTypes = keyof typeof rapTypes;

export interface RapActionResponse {
  baseNonce?: number | null;
  errorMessage: string | null;
  hash?: string | null;
}

export interface RapActionResult {
  nonce?: number | undefined;
  hash?: string | undefined;
}

export interface ActionProps<T extends RapActionTypes> {
  baseNonce?: number;
  index: number;
  parameters: RapActionParameterMap[T];
  wallet: Signer;
  currentRap: Rap;
  selectedGasFee: SelectedGasFee | LegacySelectedGasFee;
  gasFeeParamsBySpeed: GasFeeParamsBySpeed | LegacyGasFeeParamsBySpeed;
}

export interface WalletExecuteRapProps {
  rapActionParameters: RapSwapActionParameters<'swap' | 'crosschainSwap'>;
  type: RapTypes;
}
