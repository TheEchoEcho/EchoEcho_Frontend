import { useState } from 'react';
import Modal from './Modal';
import { toast } from 'react-toastify';
import { useWriteContract, useAccount } from 'wagmi'
import { abi as abiEchoEcho } from '../../abi/EchoEcho.json'

type TData = {
  status: string;
  tokenId: number;
  title: string;
  description: string;
  image: string;
  price?: number;
  attributes?: TAttribute[];
  serviceInfo?: any;
  serviceHash?: string;
}

type TAttribute = {
  [key: string]: string;
  value: string;
}

const NFTCard = (data: TData) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalBtnDisabled, setIsModalBtnDisabled] = useState(false);
  const [currentNFT, setCurrentNFT] = useState<TData | null>(null);
  const [price, setPrice] = useState('');
  const [trialPriceBP, setTrialPriceBP] = useState('');
  const [maxDuration, setMaxDuration] = useState('');
  const [trialDurationBP, setTrialDurationBP] = useState('');
  const [listEndTime, setListEndTime] = useState('');

  const { data: hash, writeContractAsync } = useWriteContract()

  const onPriceChange = (e: any) => {
    if (isNaN(e.target.value)) {
      toast('Please input a valid price');
      return;
    }
    setPrice(e.target.value);
  }

  const onTrialPriceBPChange = (e: any) => {
    if (isNaN(e.target.value) || parseInt(e.target.value) < 0 || parseInt(e.target.value) > 10000) {
      toast('Please input a valid trial price BP');
      return;
    }
    setTrialPriceBP(e.target.value);
  }

  const onMaxDurationChange = (e: any) => {
    if (isNaN(e.target.value)) {
      toast('Please input a valid max duration');
      return;
    }
    setMaxDuration(e.target.value);
  }

  const onTrialDurationBPChange = (e: any) => {
    if (isNaN(e.target.value) || parseInt(e.target.value) < 0 || parseInt(e.target.value) > 10000) {
      toast('Please input a valid trial duration BP');
      return;
    }
    setTrialDurationBP(e.target.value);
  }

  const onListEndTimeChange = (e: any) => {
    console.log(e.target.value);
    setListEndTime(e.target.value);
  }

  const onList = (data: TData) => {
    console.log('List', data);
    setCurrentNFT(data);
    setIsModalOpen(true);

  }

  const listNFT = async () => {
    if (!currentNFT) {
      toast('Please select an NFT');
      return;
    }
    if (!price || !trialPriceBP || !maxDuration || !trialDurationBP || !listEndTime) {
      toast('Please input all fields');
      return;
    }
    const _price = BigInt(parseFloat(price) * 10 ** 18);
    const _trialPriceBP = BigInt(trialPriceBP);
    const _maxDuration = BigInt(Number(maxDuration) * 3600);
    const _trialDurationBP = BigInt(trialDurationBP);
    const _listEndTime = BigInt(Math.floor(new Date(listEndTime).getTime() / 1000));

    await writeContractAsync({
      address: "0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab",
      abi: abiEchoEcho,
      functionName: "list",
      args: [BigInt(currentNFT?.tokenId), _price, _trialPriceBP, _trialDurationBP, _maxDuration, _listEndTime]
    }).then(res => {
      setIsModalOpen(false)
      toast('List successfully!')
    })
  }

  const onWant = async () => {
    const res = await writeContractAsync({
      address: "0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab",
      abi: abiEchoEcho,
      functionName: "consumerWantBuy",
      args: [data.serviceInfo]
    })
    toast('Submit successfully, please wait for agreement!')
  }

  const onBuy = async () => {
    const res = await writeContractAsync({
      address: "0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab",
      abi: abiEchoEcho,
      functionName: "buy",
      args: [data.serviceInfo],
      value: data.serviceInfo.price
    })
    toast('Buy successfully, please wait for agreement!')
  }

  const onCancel = async () => {
    const res = await writeContractAsync({
      address: "0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab",
      abi: abiEchoEcho,
      functionName: "cancelOrder",
      args: [data.serviceInfo]
    })
    toast('Cancel successfully!')
  }

  return (
    <div className="w-80 rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white m-2">
      <img className="w-full h-60 object-cover" src={data.image} alt={data.title} />
      <div className="px-3 py-2">
        <div className="font-bold text-xl mb-2">{data.title}</div>
        {
          data.status === 'listed' ? (
            <div className="mb-2 border border-gray-200 rounded inline-block px-2 bg-gray-700">{data.serviceHash?.slice(-8)}</div>
          ) : null
        }
        <p className="text-gray-400 text-sm line-clamp-3" title={data.description}>{data.description}</p>
        {
          data.attributes ? (
            <div className="mt-2">
              {
                data.attributes.map((attr, index) => (
                  <div key={index} className="flex justify-between mb-1">
                    <span className="text-sm text-gray-500">{attr.type || attr.trait_type}</span>
                    <span className="text-sm text-gray-400 text-right">{attr.value}</span>
                  </div>
                ))
              }
            </div>
          ) : null
        }
        {
          data.status === 'minted' ? (
            <div>
              <button
                className="w-full h-10 bg-gradient-to-r from-blue-500 to-blue-300 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                onClick={() => onList(data)}
              >
                List
              </button>
            </div>
          ) : null
        }
      </div>
      {
        data.status === 'listed' || data.status === 'bought' ? (
          <>
            <div className="px-3 pt-1 flex justify-between items-center border-t border-gray-700">
              <span className="text-sm text-gray-500">Current Price</span>
              <span className="text-xl font-bold flex items-center text-gray-300">
                {Number(data.serviceInfo.price) / (10 ** 18)} ETH
              </span>
            </div>
            <div className="px-3 pt-1 flex justify-between items-center">
              <span className="text-sm text-gray-500">Trial Price</span>
              <span className="text-base flex items-center text-gray-300">{Number(data.serviceInfo.trialPriceBP) / 100}%</span>
            </div>
            <div className="px-3 pt-1 flex justify-between items-center">
              <span className="text-sm text-gray-500">Max Duration</span>
              <span className="text-base flex items-center text-gray-300">{Number(data.serviceInfo.max_duration) / 3600} Hours</span>
            </div>
            <div className="px-3 pt-1 flex justify-between items-center">
              <span className="text-sm text-gray-500">Trial Duration</span>
              <span className="text-base flex items-center text-gray-300">{Number(data.serviceInfo.trialDurationBP) / 100}%</span>
            </div>
            <div className="px-3 pt-1 flex justify-between items-center pb-1 border-b border-gray-700">
              <span className="text-sm text-gray-500">List End Time</span>
              <span className="text-base flex items-center text-gray-300">{new Date(Number(data.serviceInfo.list_endtime) * 1000).toLocaleString()}</span>
            </div>
            {
              data.status === 'listed' ? (
                <div className='flex p-3 justify-between'>
                    <button
                      className="w-[32%] h-10 bg-gradient-to-r from-gray-700 to-gray-500 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                    >
                      <a href="http://113.45.157.148/" target='_blank' className='flex justify-center items-center h-full'>
                        Chat
                      </a>
                    </button>
                  <button
                    className="w-[32%] h-10 bg-gradient-to-r from-blue-500 to-blue-300 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                    onClick={onWant}
                  >
                    I Want
                  </button>
                  <button
                    className="w-[32%] h-10 bg-gradient-to-r from-orange-500 to-orange-300 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                    onClick={onBuy}
                  >
                    Buy Now
                  </button>
                </div>
              ) : null
            }
            {
              data.status === 'bought' ? (
                <div className='p-4'>
                  <button
                      className="w-full h-10 bg-gradient-to-r from-gray-500 to-gray-300 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg"
                      onClick={onCancel}
                    >
                      Cancel Service
                    </button>
                </div>
              ) : null
            }
          </>
        ) : null
      }

      <Modal btnDisabled={isModalBtnDisabled} isOpen={isModalOpen} title='Mint NFT' onClose={() => { setIsModalOpen(false) }} onSubmit={() => listNFT()}>
        <div className='text-gray-600'>
          <div>Price:</div>
          <input type="text" placeholder="Price (ETH)"
            value={price} onChange={onPriceChange}
            className="mb-2 text-gray-600 w-full h-10 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" />
          <div>Trial Price BP:</div>
          <input type="text" placeholder="Trial Price BP (0 - 10000)"
            value={trialPriceBP} onChange={onTrialPriceBPChange}
            className="mb-2 text-gray-600 w-full h-10 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" />
          <div>Max Duration:</div>
          <input type="text" placeholder="Max Duration (in hours)"
            value={maxDuration} onChange={onMaxDurationChange}
            className="mb-2 text-gray-600 w-full h-10 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" />
          <div>Trial Duration BP:</div>
          <input type="text" placeholder="Trial Duration BP (0 - 10000)"
            value={trialDurationBP} onChange={onTrialDurationBPChange}
            className="mb-2 text-gray-600 w-full h-10 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" />
          <div>List End Time:</div>
          <input type="datetime-local" placeholder="List End Time"
            value={listEndTime} onChange={onListEndTimeChange}
            className="mb-2 text-gray-600 w-full h-10 px-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500" />
        </div>
      </Modal>
    </div>
  );
};

export default NFTCard;