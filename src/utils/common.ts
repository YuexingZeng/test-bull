import { ethers, JsonRpcProvider, TransactionReceipt, ZeroHash } from 'ethers';
import * as fs from 'fs';
import { WHITE_LIST_CSV, WHITE_LIST_PROOF } from './constants';

export function getTokensFromTx(tx: TransactionReceipt) {
  const topics = tx.logs[0].topics;
  const toTokenIdHex = tx.logs[0].data;
  const toTokenId = parseInt(toTokenIdHex.slice(2), 16);
  const fromTokenIdHex = topics[1];
  const fromTokenId = parseInt(fromTokenIdHex.slice(2), 16);
  const tokens = [];
  for (let tokenId = fromTokenId; tokenId <= toTokenId; tokenId++) {
    tokens.push(tokenId);
  }
  return tokens;
}

export async function checkAddressInWhiteList(address) {
  try {
    const data = await fs.promises.readFile(WHITE_LIST_CSV, 'utf8');
    const lines = data.split('\n');
    const matchingLine = lines.find((line) => line.includes(address));
    if (matchingLine) {
      return { found: true, amount: parseInt(matchingLine.split(',').pop()) };
    } else {
      return { found: false, amount: 0 };
    }
  } catch (err) {
    console.error('Error in checkAddressInWhiteList:', err);
    return { found: false, amount: 0 };
  }
}

export async function getMerkleProof(address) {
  try {
    const data = await fs.promises.readFile(WHITE_LIST_PROOF, 'utf8');
    const jsonData = JSON.parse(data);
    const result = jsonData.find((item) => item.addr === address);
    if (result) {
      return result.proof;
    } else {
      return [ZeroHash];
    }
  } catch (error) {
    throw error;
  }
}

export async function getTxReceipt(
  provider: JsonRpcProvider,
  txHash: string,
): Promise<TransactionReceipt> {
  return await provider.waitForTransaction(txHash);
}

export async function getTransaction(rpc, txHash) {
  const provider = new ethers.JsonRpcProvider(rpc);
  const receipt = await provider.getTransactionReceipt(txHash);
  return receipt;
}
