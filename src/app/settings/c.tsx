'use client';

import { useEffect, useState } from 'react';
import SectionTitle from '../../components/SectionTitle';
import { client } from '../providers'
import { abi as abiEchoEcho } from '../../../abi/EchoEcho.json'
import { useWriteContract, useAccount } from 'wagmi'
import { toast } from 'react-toastify';

type TOrder = {
  consumer: string;
  time: BigInt;
  status: number;
  serviceInfoHash: string;
}

const statusMap = ['', 'Pending', 'Agreed', 'Completed']

const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

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

const OrdersTable = () => {

  const { data: hash, writeContractAsync } = useWriteContract()
  const [list, setList] = useState<any[]>([])
  const { address } = useAccount()

  const updateTable = async () => {
    const res = await client.getContractEvents({
      address: '0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab',
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
      address: '0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab',
      abi: abiEchoEcho,
      functionName: 'getServiceInfo',
      args: [list[index].serviceInfoHash]
    })
    console.log(serviceInfo);
    await writeContractAsync({
      address: "0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab",
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
              Service
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
          {list.map((order: TOrder, index: number) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900" title={order.consumer}>{formatAddress(order.consumer)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{order.serviceInfoHash.slice(-8)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{new Date(Number(order.time) * 1000).toLocaleString()}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-orange-700">
                  {statusMap[order.status] || 'Unknown'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {
                  order.status === 1 ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2"
                      onClick={() => onAgree(index)}
                    >
                      Agree
                    </button>
                  ) : '-'
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ServicesTable = () => {

  const { data: hash, writeContractAsync } = useWriteContract()
  const [list, setList] = useState<any[]>([])
  const { address } = useAccount()
  const onWithdraw = async (index: number) => {
    console.log(list[index].serviceInfoHash)
    const serviceInfo = await client.readContract({
      address: '0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab',
      abi: abiEchoEcho,
      functionName: 'getServiceInfo',
      args: [list[index].serviceInfoHash]
    })
    await writeContractAsync({
      address: "0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab",
      abi: abiEchoEcho,
      functionName: "serviceWithdraw",
      args: [serviceInfo]
    })
    toast('Withdraw successfully!')
    updateTable();
  }

  async function getBalances(_list: any[]) {
    const balances: any = _list.map((item: any) => ({
      address: '0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab',
      abi: abiEchoEcho,
      functionName: 'serviceIncome',
      args: [item.args.serviceInfoHash]
    }))
    const res = await client.multicall({
      contracts: balances
    })
    setList(res.map((item: any, index: number) => ({
      balance: Number(item.result) / (10 ** 18),
      hash: _list[index].args.serviceInfoHash.slice(-8),
      serviceInfoHash: _list[index].args.serviceInfoHash
    })))
  }

  const updateTable = () => {
    client.getContractEvents({
      address: '0x0E5411a8139bFd38fbe19ce9ED8224Ff12b575Ab',
      abi: abiEchoEcho,
      eventName: 'List',
      args: {
        provider: address
      },
      fromBlock: BigInt(6580040),
      toBlock: 'latest'
    }).then((res: any) => {
      console.log(res);
      getBalances(res)
    })
  }

  useEffect(() => {
    if (!address) return
    updateTable()
  }, [address])

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Balance
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Operations
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {list.map((service: any, index: number) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{service.hash}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{service.balance} ETH</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                {
                  service.balance > 0 ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2"
                      onClick={() => onWithdraw(index)}
                    >
                      Withdraw
                    </button>
                  ) : null
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Page() {
  const { address } = useAccount()
  return (
    <div>
      <div className='mt-2 flex justify-between'>
        <SectionTitle title="Account" />
        <div>
          <div className="mb-4 flex items-center justify-end">
            <label className="text-sm font-medium text-gray-600 mr-4">Address:</label>
            <div className="bg-gray-100 p-2 rounded-md text-gray-800 font-mono">
              {address}
            </div>
          </div>
        </div>
      </div>
      <ServicesTable />

      <div className='mt-10'>
        <SectionTitle title="Orders" />
        <OrdersTable />
      </div>

    </div>
  );
}

export default Page;