type TData = {
  title: string;
  description: string;
  image: string;
  price?: number;
  attributes?: TAttribute[];
}

type TAttribute = {
  [key: string]: string;
  value: string;
} 

const NFTCard = (data: TData) => {
  return (
    <div className="w-80 rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white m-2">
      <img className="w-full h-60 object-cover" src={data.image} alt={data.title} />
      <div className="px-3 py-2">
        <div className="font-bold text-xl mb-2">{data.title}</div>
        <p className="text-gray-400 text-sm line-clamp-3" title={data.description}>{data.description}</p>
        {
          data.attributes ? (
            <div className="mt-2">
              {
                data.attributes.map((attr, index) => (
                  <div key={index} className="flex justify-between mb-2">
                    <span className="text-sm text-gray-500">{attr.type || attr.trait_type}</span>
                    <span className="text-sm text-gray-400 text-right">{attr.value}</span>
                  </div>
                ))
              }
            </div>
          ):null
        }
      <div>
        <button className="w-full h-10 bg-gradient-to-r from-gray-700 to-gray-500 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg">
          List
        </button>
      </div>
      </div>
      {
        data.price ? (
          <div className="px-3 py-2 flex justify-between items-center border-t border-gray-700">
            <span className="text-sm text-gray-400">Current Price</span>
            <span className="text-xl font-bold flex items-center">
              {data.price} ETH
            </span>
          </div>
        ):null
      }
    </div>
  );
};

export default NFTCard;