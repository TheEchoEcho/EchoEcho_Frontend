'use client';

import NFTCard from '../../components/NFTCard';
import SectionTitle from '../../components/SectionTitle';
import Modal from '../../components/Modal';
import { SetStateAction, useEffect, useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi'
import { abi as abiServiceNFT_A } from '../../../abi/ServiceNFT_A.json'
import { toast } from 'react-toastify';
import { client } from '../providers'

export default function Page() {

  const { address } = useAccount()

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalBtnDisabled, setIsModalBtnDisabled] = useState(true);
  const [uri, setUri] = useState('')
  const [mintedList, setMintedList] = useState<any[]>([])
  const [uriList, setUriList] = useState<any[]>([])

  const { data: hash, writeContractAsync } = useWriteContract()

  useEffect(() => {
    if(!address) return
    client.getContractEvents({
      address: '0x153745F7FDc3BC2cF3E64FBFcCcE04A2f1B89554',
      abi: abiServiceNFT_A,
      eventName: 'Minted',
      args: {
        recipient: address
      },
      fromBlock: BigInt(6580040),
      toBlock: 'latest'
    }).then((res) => {
      setMintedList(res)
    })
  }, [address])

  useEffect(() => {
    const fetchData = async () => {
      const list: SetStateAction<any[]> = []
      for (const item of mintedList) {
        const uri = await getTokenURI(item.args.tokenId)
        const res = await fetch(`https://ipfs.io/ipfs/${uri}`)
        const metaData = await res.json()
        list.push({
          tokenId: Number(item.args.tokenId),
          status: 'minted',
          ...metaData
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
    setIsModalBtnDisabled(true)
    await writeContractAsync({
      address: "0x153745F7FDc3BC2cF3E64FBFcCcE04A2f1B89554",
      abi: abiServiceNFT_A,
      functionName: "mint_A",
      args: [address, uri]
    }).then(res => {
      setUri('')
      setIsModalOpen(false)
      toast('Mint successfully! the tokenId is ' + res)
    })
  }

  async function getTokenURI(tokenId: string) {
    const res = await client.readContract({
      address: "0x153745F7FDc3BC2cF3E64FBFcCcE04A2f1B89554",
      abi: abiServiceNFT_A,
      functionName: "tokenURI",
      args: [tokenId]
    })
    return res
  }

  const onInputChange = (e: { target: { value: SetStateAction<string>; }; }) => { 
    setUri(e.target.value) 
    setIsModalBtnDisabled(!e.target.value)
  }

  return (
    <div>
      <div className='flex justify-between'>
        <SectionTitle title="Services I Created" />
        <button
          className="px-3 h-10 bg-gradient-to-b from-gray-800 to-gray-500 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
          onClick={() => { setIsModalOpen(true) }}
        >
          Create
        </button>
      </div>
      <div className="flex flex-wrap -m-2">
        {
          uriList.map((item, index) => (
            <NFTCard key={index} {...item} />
          ))
        }
      </div>
      <div className='mt-10'>
        <SectionTitle title="Services I Bought" />
      </div>
      <Modal btnDisabled={isModalBtnDisabled} isOpen={isModalOpen} title='Create New Service' onClose={() => { setIsModalOpen(false) }} onSubmit={() => mintNFT()}>
        <div>
          <input type="text" placeholder="CID"
            value={uri} onChange={onInputChange}
            className="w-full h-10 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" />
        </div>
      </Modal>
    </div>
  );
}