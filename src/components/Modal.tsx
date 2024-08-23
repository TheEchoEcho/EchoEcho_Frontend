'use client';

import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, title, onClose, children }: { isOpen: boolean, title: string, onClose: () => void, children: React.ReactNode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative w-1/2 max-w-3xl mx-auto my-6 z-50">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="flex items-start justify-between py-3 px-4 border-b border-solid border-gray-300 rounded-t">
            <h3 className="text-2xl font-semibold">{title}</h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>
          <div className="relative p-4 flex-auto">
            {children}
          </div>
          <div className="flex items-center justify-end py-3 px-4 border-t border-solid border-gray-300 rounded-b">
            <button
              className="text-gray-500 background-transparent font-bold uppercase px-4 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-gray-700 text-white active:bg-gray-500 font-bold uppercase text-sm px-4 py-2 rounded-lg shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={onClose}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;