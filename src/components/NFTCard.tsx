const NFTCard = ({ title, description, creator, price, imageUrl }: { title: string, description: string, creator: string, price: string, imageUrl: string }) => {
  return (
    <div className="w-64 rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white m-2">
      <img className="w-full h-40 object-cover" src={imageUrl} alt={title} />
      <div className="px-3 py-2">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-400 text-base">{description}</p>
      </div>
      <div className="px-3 pt-2 pb-2 text-gray-400 text-sm text-right">
        Created by {creator}
      </div>
      <div className="px-3 py-2 flex justify-between items-center border-t border-gray-700">
        <span className="text-sm text-gray-400">Current Price</span>
        <span className="text-xl font-bold flex items-center">
          {price} ETH
        </span>
      </div>
    </div>
  );
};

export default NFTCard;