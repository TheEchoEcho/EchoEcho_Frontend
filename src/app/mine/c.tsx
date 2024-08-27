'use client';

import NFTCard from '../../components/NFTCard';
import SectionTitle from '../../components/SectionTitle';
import Modal from '../../components/Modal';
import { SetStateAction, useEffect, useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi'
import { abi } from '../../../abi/ServiceNFT_A.json'
import { toast } from 'react-toastify';
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const client = createPublicClient({
  chain: sepolia,
  transport: http('https://sepolia.infura.io/v3/32076fdc1eec4d01975b561943bd7e8d'),
})

export default function Page() {

  const { address } = useAccount()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uri, setUri] = useState('https://ipfs.io/ipfs/CID1')
  const [mintedList, setMintedList] = useState<any[]>([])
  const [uriList, setUriList] = useState<any[]>([])

  const { data: hash, writeContractAsync } = useWriteContract()

  useEffect(() => {
    client.getContractEvents({
      address: '0x153745F7FDc3BC2cF3E64FBFcCcE04A2f1B89554',
      abi: abi,
      eventName: 'Minted',
      args: {
        from: address
      },
      fromBlock: BigInt(6575195),
      toBlock: 'latest'
    }).then((res) => {
      setMintedList(res)
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const list: SetStateAction<any[]> = []
      for (const item of mintedList) {
        const uri = await getTokenURI(item.args.tokenId)
        list.push({
          tokenId: item.args.tokenId,
          uri: uri
        })
      }
      setUriList(list)
    }
    fetchData()
  }, [mintedList])

  async function mintNFT() {
    if (!uri) {
      toast('Please input the uri')
      return
    }
    await writeContractAsync({
      address: "0x153745F7FDc3BC2cF3E64FBFcCcE04A2f1B89554",
      abi: abi,
      functionName: "mint_A",
      args: [address, uri]
    }).then(res => {
      console.log(res)
      setIsModalOpen(false)
      toast('Mint successfully! the tokenId is ' + res)
    })
  }

  async function getTokenURI(tokenId: string) {
    const res = await client.readContract({
      address: "0x153745F7FDc3BC2cF3E64FBFcCcE04A2f1B89554",
      abi: abi,
      functionName: "tokenURI",
      args: [tokenId]
    })
    return res
  }

  const list = [
    {
      title: "Cosmic Harmony #42",
      description: "A mesmerizing digital artwork that captures the essence of universal balance.",
      creator: "CryptoArtist99",
      price: "0.5",
      imageUrl: "https://p5.img.cctvpic.com/photoworkspace/contentimg/2023/03/30/2023033011303020756.jpg"
    },
    {
      title: "Cosmic Harmony #42",
      description: "A mesmerizing digital artwork that captures the essence of universal balance.",
      creator: "CryptoArtist99",
      price: "0.5",
      imageUrl: "https://p5.img.cctvpic.com/photoworkspace/contentimg/2023/03/30/2023033011303020756.jpg"
    }
  ]

  return (
    <div>
      <div className='flex justify-between'>
        <SectionTitle title="My NFTs" />
        <button
          className="w-20 h-10 bg-gradient-to-b from-gray-800 to-gray-500 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
          onClick={() => { setIsModalOpen(true) }}
        >
          Mint
        </button>
      </div>
      <div className="flex flex-wrap -m-2">
        {
          list.map((item, index) => (
            <NFTCard
              key={index}
              title={item.title}
              description={item.description}
              creator={item.creator}
              price={item.price}
              imageUrl={item.imageUrl}
            />
          ))
        }
      </div>
      <div>
        {
          uriList.map((item, index) => {
            return <div key={index}>
              <p>{Number(item.tokenId)}</p>
              <p>{item.uri}</p>
            </div>
          })
        }
      </div>
      <Modal isOpen={isModalOpen} title='Mint NFT' onClose={() => { setIsModalOpen(false) }} onSubmit={() => mintNFT()}>
        <div>
          <input type="text" placeholder="uri"
            value={uri} onChange={(e) => { setUri(e.target.value) }}
            className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" />
        </div>
      </Modal>
    </div>
  );
}