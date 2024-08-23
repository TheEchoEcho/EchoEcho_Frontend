'use client';

import NFTCard from '../../components/NFTCard';
import SectionTitle from '../../components/SectionTitle';
import Modal from '../../components/Modal';
import React from 'react';

export default function Page() {

  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
      <Modal isOpen={isModalOpen} title='Mint NFT' onClose={() => { setIsModalOpen(false) }}>
        <div>
          <h1 className="text-2xl font-semibold">Modal Title</h1>
          <p className="text-gray-500">Some content here</p>
        </div>
      </Modal>
    </div>
  );
}