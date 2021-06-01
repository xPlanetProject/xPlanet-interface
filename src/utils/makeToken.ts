import { ChainId, Token, WETH, ETHER } from '@xplanet/sdk'
import { Web3Provider } from '@ethersproject/providers'
import ERC20_ABI from '@/constants/abis/erc20.json'
import { getContract } from '@/utils'

console.log(WETH, ETHER)

export const makeToken = async(tokenAddress: string, library: Web3Provider): Promise<Token> => {
  const tokenContract = getContract(tokenAddress, ERC20_ABI, library)
  const tokenDecimals = await tokenContract.decimals()
  let tokenSymbol = await tokenContract.symbol()

  if (tokenSymbol === WETH[ChainId.MAINNET].symbol) {
    tokenSymbol = ETHER.symbol
  }

  return new Token(
    ChainId.MAINNET,
    tokenAddress,
    tokenDecimals,
    tokenSymbol
  )
}