"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, LockKeyhole, Zap, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

// --- Usage --------------------------------------------------------------
// <EsewaPayButton
//   totalAmount={total ?? 0}
//   onPay={async () => {
//     // 1) If you already have an <Esewa /> component that submits a form, call it here
//     // or trigger a hidden form submission by id.
//     // Example (hidden form): document.getElementById("esewa-form")?.submit();
//   }}
// />
// ------------------------------------------------------------------------

function formatNpr(amount: number) {
  try {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `Rs. ${amount.toFixed(2)}`;
  }
}

export type EsewaPayButtonProps = {
  totalAmount: number;
  onPay?: () => Promise<void> | void; // provide your own handler that kicks off eSewa flow
  formId?: string; // alternatively, pass an id for a hidden <form /> to submit
  disabled?: boolean;
};

export default function EsewaPayButton({
  totalAmount,
  onPay,
  formId,
  disabled,
}: EsewaPayButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleClick = async () => {
    if (disabled || loading) return;
    setLoading(true);
    try {
      if (onPay) {
        await onPay();
      } else if (formId && typeof document !== "undefined") {
        const form = document.getElementById(formId) as HTMLFormElement | null;
        form?.submit();
      }
    } finally {
      setLoading(false);
    }
  };

  const isZero = !totalAmount || totalAmount <= 0;
  const isDisabled = disabled || isZero || loading;

  return (
    <div className="w-full">
      {/* Card-like container */}
      <div className="group relative overflow-hidden rounded-2xl border border-emerald-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
        {/* Soft radial highlight */}
        <div className="pointer-events-none absolute -top-24 right-0 h-52 w-52 rounded-full bg-emerald-100/60 blur-3xl group-hover:bg-emerald-100/80" />

        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pay securely with</p>
              <p className="-mt-0.5 text-base font-semibold tracking-tight text-emerald-700">eSewa</p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-emerald-200 px-2 py-1 text-xs font-medium text-emerald-700">
            <ShieldCheck className="mr-1 h-4 w-4" />
            PCI DSS Compliant
          </div>
        </div>

        {/* Amount row */}
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-gray-500">Total</p>
            <p className="text-2xl font-bold leading-tight text-gray-900">
              {formatNpr(totalAmount)}
            </p>
          </div>
          <div className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
            VAT incl. (if applicable)
          </div>
        </div>

        {/* Button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            type="submit"
            onClick={handleClick}
            disabled={isDisabled}
            className="relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {/* Animated sheen */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />

            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Processing…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Pay with eSewa
              </span>
            )}
          </Button>
        </motion.div>

        {/* Bottom row: lock + helper text */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <LockKeyhole className="h-4 w-4 text-emerald-600" />
            <span>256-bit TLS encryption</span>
          </div>
          <span className="rounded-full bg-gray-100 px-2 py-0.5">No extra fees</span>
        </div>
      </div>

      {/* Optional hidden form example (uncomment & wire up 'formId') */}
      {false && (
        <form id="esewa-form" method="POST" action="#" className="hidden">
          {/* Add required fields for eSewa here (amt, pid, scd, su, fu, etc.) */}
          <input type="hidden" name="amt" value={totalAmount} />
        </form>
      )}
    </div>
  );
}
