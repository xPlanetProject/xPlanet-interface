import { ChainId, Token, WETH, ETHER } from '@xplanet/sdk'
import { Web3Provider } from '@ethersproject/providers'
import { Contract } from '@ethersproject/contracts'
import { abi as ERC20_ABI } from '@/constants/contracts/ERC20.json'
import { getContract } from '@/utils'

type MakeTokenResult = {
  tokenContract: Contract
  token: Token
} | Token

export const makeToken = async(tokenAddress: string, library: Web3Provider, needContract?: boolean): Promise<MakeTokenResult> => {
  const tokenContract = getContract(tokenAddress, ERC20_ABI, library)
  const tokenDecimals = await tokenContract.decimals()
  let tokenSymbol = await tokenContract.symbol()

  if (tokenSymbol === WETH[ChainId.MAINNET].symbol) {
    tokenSymbol = ETHER.symbol
  }

  if (needContract) {
    return {
      token: new Token(
        ChainId.MAINNET,
        tokenAddress,
        tokenDecimals,
        tokenSymbol
      ),
      tokenContract
    } 
  }

  return new Token(
    ChainId.MAINNET,
    tokenAddress,
    tokenDecimals,
    tokenSymbol
  )
}