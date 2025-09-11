import Esewa from '@/components/esewa/Esewa';
import PaymentForm from '@/components/esewa/SecEsewa';
import React from 'react';

export default function page() {
  return (
    <div>
      <div>use detail username:9806800001 password:1122 token:123456</div>
      <Esewa total_amount={100} />
    </div>
  );
}
