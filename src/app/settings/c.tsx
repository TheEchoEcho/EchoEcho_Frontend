'use client';

import { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle';
import { client } from '../providers'
import { abi as abiEchoEcho } from '../../../abi/EchoEcho.json'
import { useWriteContract, useAccount } from 'wagmi'
import { toast } from 'react-toastify';

type TService = {
  consumer: string;
  time: BigInt;
  status: number;
}

const statusMap = ['', 'Pending', 'Agreed', 'Completed']

/**
 * 过滤数组，保留a和b字段相同时c字段最大的元素
 * @param {Array} arr - 输入数组，每个元素是包含a、b、c字段的对象
 * @returns {Array} - 过滤后的数组
 */
function filterArrayByFields(arr: any[]) {
  // 使用 Map 来存储唯一的 [a, b] 组合
  const uniqueMap = new Map();

  // 遍历数组
  arr.forEach(item => {
    const key = `${item.consumer}-${item.serviceInfoHash}`; // 创建唯一键
    
    if (!uniqueMap.has(key) || item.status > uniqueMap.get(key).status) {
      uniqueMap.set(key, item);
    }
  });

  // 将 Map 的值转换回数组
  return Array.from(uniqueMap.values());
}


const ServiceTable = () => {

  const { data: hash, writeContractAsync } = useWriteContract()
  const [list, setList] = useState<any[]>([])
  const { address } = useAccount()
  
  const updateTable = async () => {
    const res = await client.getContractEvents({
      address: '0x37a20FB4FB275CCf658f508C29bba8f8Af93fD31',
      abi: abiEchoEcho,
      eventName: 'PreBuyOrderStatus',
      args: {
        provider: address
      },
      fromBlock: BigInt(6580040),
      toBlock: 'latest'
    })
    console.log(res);
    const filteredList = filterArrayByFields(res.map((i: any) => i.args));
    setList(filteredList)
  }

  const onAgree = async (index: number) => {
    const serviceInfo = await client.readContract({
      address: '0x37a20FB4FB275CCf658f508C29bba8f8Af93fD31',
      abi: abiEchoEcho,
      functionName: 'getServiceInfo',
      args: [list[index].serviceInfoHash]
    })
    console.log(serviceInfo);
    await writeContractAsync({
      address: "0x37a20FB4FB275CCf658f508C29bba8f8Af93fD31",
      abi: abiEchoEcho,
      functionName: "providerCanService",
      args: [
        list[index].consumer,
        serviceInfo
      ]
    })
    toast('Agree successfully!')
    updateTable();
  }

  useEffect(() => {
    if (!address) return
    updateTable();
  }, [address])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              consumer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Operations
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {list.map((service: TService, index: number) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{service.consumer}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{new Date(Number(service.time) * 1000).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-orange-700">
                  {statusMap[service.status] || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {
                  service.status === 1 ? (
                    <button 
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={() => onAgree(index)}
                    >
                      Agree
                    </button>
                  ): null
                }
                {/* <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                  Deny
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function Page() {
  return (
    <div>
      <div>
        <SectionTitle title="Orders Audit" />
      </div>
      <ServiceTable />
    </div>
  );
}

export default Page;