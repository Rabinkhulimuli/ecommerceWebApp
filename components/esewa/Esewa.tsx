import React from 'react';
import CryptoJS from 'crypto-js';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import EsewaPayButton from './PayButton';

type PaymentData = {
  transaction_uuid: string;
  total_amount: number;
  hashInBase64: string;
};

const generatePaymentData = (total_amount: number): PaymentData => {
  const transaction_uuid = uuidv4();
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
  const hash = CryptoJS.HmacSHA256(message, '8gBm/:&EnhH.1/q');
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return {
    transaction_uuid,
    total_amount,
    hashInBase64,
  };
};

interface PaymentFormProps {
  total_amount: number;
  productCode:string
}

const Esewa: React.FC<PaymentFormProps> = ({ total_amount = 100,productCode }) => {
  const { transaction_uuid, hashInBase64 } = generatePaymentData(total_amount);

  return (
    <form action='https://rc-epay.esewa.com.np/api/epay/main/v2/form' method='POST'>
      <input type='hidden' name='amount' value={total_amount} required />
      <input type='hidden' name='tax_amount' value='0' required />
      <input type='hidden' name='total_amount' value={total_amount} required />
      <input type='hidden' name='transaction_uuid' value={transaction_uuid} required />
      <input type='hidden' name='product_code' value='EPAYTEST' required />
      <input type='hidden' name='product_service_charge' value='0' required />
      <input type='hidden' name='product_delivery_charge' value='0' required />
      <input
        type='hidden'
        name='success_url'
        value='http://localhost:3000/orders/success'
        required
      />
      <input
        type='hidden'
        name='failure_url'
        value='http://localhost:3000/orders/failure'
        required
      />
      <input
        type='hidden'
        name='signed_field_names'
        value='total_amount,transaction_uuid,product_code'
        required
      />
      <input type='hidden' name='signature' value={hashInBase64} required />

      {/* <button
        className="group relative overflow-hidden bg-gradient-to-r from-white to-green-500 text-black px-6 py-3 rounded-xl shadow-lg hover:text-white hover:shadow-xl transition-all duration-300 hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        type="submit"
      >
        <div className="flex flex-col items-end justify-center gap-1">
          <div className="flex flex-col w-full min-w-64 gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 group-hover:bg-white/50 transition-all duration-200">
            <span className="text-xs w-full text-start font-bold tracking-wide">Pay via Esewa</span>
            <div className="w-16 h-auto transform group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/esewa/esewa.png"
                alt="Esewa Logo"
                width={80}
                height={40}
                className="object-contain rounded-sm"
              />
            </div>
          </div>
          <div className="mt-1">
            <span className="text-xl font-extrabold tracking-tight">
              Pay Rs. {total_amount}
            </span>
            <div className="h-0.5 w-full bg-green-700/30 mt-1 group-hover:bg-white/50 transition-all duration-300"></div>
          </div>
        </div>
        <div className="absolute inset-0 -left-full group-hover:left-full bg-green-700/20 skew-x-45 transition-all duration-500"></div>
      </button> */}
      <EsewaPayButton totalAmount={total_amount} />
    </form>
  );
};

export default Esewa;
