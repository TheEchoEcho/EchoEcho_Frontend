'use client';

import NFTCard from '../../components/NFTCard';
import SectionTitle from '../../components/SectionTitle';
import { useWriteContract, useAccount } from 'wagmi'
import { abi as abiServiceNFT_A } from '../../../abi/ServiceNFT_A.json'
import { toast } from 'react-toastify';
import { client } from '../providers'

export default function Page() {

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
    },
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
      <SectionTitle title="Available Services" />
      {/* <div className="flex flex-wrap -m-2">
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
      </div> */}
    </div>
  );
}