import Esewa from '@/components/esewa/Esewa'
import PaymentForm from '@/components/esewa/SecEsewa'
import React from 'react'

export default function page() {
  return (
    <div>
       <Esewa total_amount={100} />
      {/* <PaymentForm total_amount={100}/> */}
    </div>
  )
}
