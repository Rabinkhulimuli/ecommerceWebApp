import React from "react";
import CryptoJS from "crypto-js";
import { v4 as uuidv4 } from "uuid";

const generatePaymentData = ({total_amount}: {total_amount: number}) => {
  const transaction_uuid = uuidv4();
  const Message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
  const hash = CryptoJS.HmacSHA256(Message, "8gBm/:&EnhH.1/q");
  const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

  return {
    transaction_uuid,
    total_amount,
    hashInBase64,
  };
};

const PaymentForm = ({ total_amount }:{total_amount: number}) => {
  const { transaction_uuid, hashInBase64 } = generatePaymentData({ total_amount });

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
    >
      <input type="hidden" name="amount" value={total_amount} required />
      <input type="hidden" name="tax_amount" value="0" required />
      <input type="hidden" name="total_amount" value={total_amount} required />
      <input type="hidden" name="transaction_uuid" value={transaction_uuid} required />
      <input type="hidden" name="product_code" value="EPAYTEST" required />
      <input type="hidden" name="product_service_charge" value="0" required />
      <input type="hidden" name="product_delivery_charge" value="0" required />
      <input
        type="hidden"
        name="success_url"
        value="https://your-success-url.com/"
        required
      />
      <input
        type="hidden"
        name="failure_url"
        value="https://your-failure-url.com/"
        required
      />
      <input
        type="hidden"
        name="signed_field_names"
        value="total_amount,transaction_uuid,product_code"
        required
      />
      <input type="hidden" name="signature" value={hashInBase64} required />

      <button type="submit">Pay Rs. {total_amount}</button>
    </form>
  );
};

export default PaymentForm;