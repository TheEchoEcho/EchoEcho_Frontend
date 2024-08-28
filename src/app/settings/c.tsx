import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from 'react';
import SectionTitle from '../../components/SectionTitle';

type TService = {
  name: string;
  buyer: string;
  status: string;
}

const services = [
  { name: "Web Development", buyer: "Company A", status: "pending" },
  { name: "UI/UX Design", buyer: "Company B", status: "pending" },
  { name: "SEO Optimization", buyer: "Company C", status: "pending" },
];

const ServiceTable = ({ services }: any) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Service Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buyer
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
          {services.map((service: TService, index: number) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{service.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{service.buyer}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-200 text-yellow-700">
                  {service.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-2">
                  Agree
                </button>
                <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                  Deny
                </button>
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
      <ServiceTable services={services} />
    </div>
  );
}

export default Page;