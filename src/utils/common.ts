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

export function getRandomPrivateKey(privateKeys: string[]): string | null {
  // 检查 privateKeys 数组是否为空
  if (privateKeys.length === 0) {
    return null;
  }

  // 生成一个随机索引，该索引对应于 privateKeys 数组中的一个私钥
  const randomIndex = Math.floor(Math.random() * privateKeys.length);

  // 返回选定的私钥
  return privateKeys[randomIndex];
}

export function sliceTokensRandomly(tokens: Array<number>, needed: number) {
  const maxTokens = tokens.length;
  if (needed >= maxTokens) {
    if (maxTokens === 1) {
      const token = tokens[0];
      return [token];
    } else if (maxTokens > 1) {
      const randomCount = Math.floor(Math.random() * (maxTokens - 1)) + 1;
      const randomIndex = Math.floor(
        Math.random() * (maxTokens - randomCount + 1),
      );
      const slicedTokens = tokens.splice(randomIndex, randomCount);
      return slicedTokens;
    } else {
      return [];
    }
  } else if (needed > 0) {
    const randomIndex = Math.floor(Math.random() * (maxTokens - needed + 1));
    const slicedTokens = tokens.splice(randomIndex, needed);
    return slicedTokens;
  } else {
    return [];
  }
}

export function getRandomSeconds() {
  const minSeconds = 1;
  const maxSeconds = 10;
  return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
}

export function removeElementFromArray<T>(array: T[], elementToRemove: T): T[] {
  return array.filter((element) => element !== elementToRemove);
}

export async function getTransaction(rpc, txHash) {
  const provider = new ethers.JsonRpcProvider(rpc);
  const receipt = await provider.getTransactionReceipt(txHash);
  return receipt;
}
