"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Check,
  Copy,
  CheckCheck,
  ShieldCheck,
  CreditCard,
  QrCode,
  Sparkles,
  Loader2,
  Building2,
  Clock,
  ArrowRight,
} from "lucide-react";

interface PaymentQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  venueName: string;
  courtName: string;
  date: string;
  timeSlot: string;
  totalPrice: number;
}

export function PaymentQRModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  venueName,
  courtName,
  date,
  timeSlot,
  totalPrice,
}: PaymentQRModalProps) {
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const bankNumber = "8840511196";
  const bankName = "BIDV - CN Sơn Tây";
  const accountHolder = "KOY VIRAKSAK";
  const memoContent = `BMB ${courtName.replace(/\s+/g, "")} ${date.slice(-5).replace("-", "")}`;

  const formatPriceVND = (price: number) => {
    return `${price.toLocaleString("en-US")}₫`;
  };

  const copyToClipboard = (text: string, type: "account" | "memo") => {
    navigator.clipboard.writeText(text);
    if (type === "account") {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    } else {
      setCopiedMemo(true);
      setTimeout(() => setCopiedMemo(false), 2000);
    }
  };

  const handlePaid = () => {
    setIsVerifying(true);
    // Simulate real-time payment gateway verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      setTimeout(() => {
        onPaymentSuccess();
      }, 900);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative z-10 w-full max-w-md max-h-[92vh] overflow-y-auto rounded-[32px] border border-[#e1e7df] bg-white p-4 sm:p-6 shadow-[0_24px_70px_rgba(23,32,28,0.28)] select-none my-auto transform-gpu will-change-transform"
          >
            {/* Top Navigation */}
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-[#edf1ea]">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f0fae1] text-[#4f781a]">
                  <QrCode className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#17201c]">
                    Scan QR to Pay Court Fee
                  </h3>
                  <p className="text-[11px] text-[#7d8881]">
                    VietQR 24/7 instant bank transfer
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3f5f1] text-[#17201c] hover:bg-[#e7ebe4] active:scale-90 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isSuccess ? (
              /* Success State */
              <div className="py-8 sm:py-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 20 }}
                  className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-[#a8e63d] shadow-[0_6px_24px_rgba(168,230,61,0.5)] transform-gpu"
                >
                  <Check className="h-8 w-8 sm:h-10 sm:w-10 text-[#17201c] stroke-[3]" />
                </motion.div>

                <h4 className="mt-3.5 text-xl sm:text-2xl font-black text-[#17201c]">
                  Payment Verified!
                </h4>
                <p className="mt-1 text-xs text-[#718076]">
                  Redirecting to your court bookings now...
                </p>
                <div className="mt-4 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-[#78a72b]" />
                </div>
              </div>
            ) : (
              <div className="mt-3 space-y-2.5 sm:space-y-3.5">
                {/* Court Fee Summary Card */}
                <div className="rounded-2xl bg-[#f7f9f6] border border-[#e3e9e1] p-3 sm:p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#86948b]">
                      Court & Time
                    </span>
                    <p className="text-xs font-black text-[#17201c]">
                      {venueName} · {courtName}
                    </p>
                    <p className="text-[11px] text-[#637267]">
                      {date} · {timeSlot}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-[#86948b]">
                      Total Fee
                    </span>
                    <p className="text-base sm:text-lg font-black text-[#2e570c]">
                      {formatPriceVND(totalPrice)}
                    </p>
                  </div>
                </div>

                {/* QR Code Frame */}
                <div className="relative mx-auto flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#a8e63d] bg-white p-2.5 sm:p-3 shadow-inner">
                  <div className="relative overflow-hidden rounded-xl border border-[#e1e7df] shadow-sm max-w-[165px] sm:max-w-[205px]">
                    <img
                      src="/court_image/QRpay.jpg"
                      alt="VietQR Payment - KOY VIRAKSAK"
                      className="w-full h-auto object-contain select-none pointer-events-none"
                    />
                  </div>

                  <div className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-[#456e17]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    <span>Official BIDV VietQR Payment</span>
                  </div>
                </div>

                {/* Bank Info with Fast Copy */}
                <div className="rounded-2xl border border-[#e2e8df] bg-[#fcfdfb] p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#7d8a81] font-medium">Bank</span>
                    <span className="font-bold text-[#17201c]">{bankName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#7d8a81] font-medium">Account Name</span>
                    <span className="font-black text-[#17201c]">{accountHolder}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#edf1ea] pt-2">
                    <span className="text-[#7d8a81] font-medium">Account Number</span>
                    <button
                      onClick={() => copyToClipboard(bankNumber, "account")}
                      className="flex items-center gap-1 font-mono font-black text-[#17201c] hover:text-[#5a861d] active:scale-95 transition"
                      title="Click to copy account number"
                    >
                      <span>{bankNumber}</span>
                      {copiedAccount ? (
                        <CheckCheck className="h-3.5 w-3.5 text-[#5a861d]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[#8c9890]" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#7d8a81] font-medium">Transfer Memo</span>
                    <button
                      onClick={() => copyToClipboard(memoContent, "memo")}
                      className="flex items-center gap-1 font-mono font-bold text-[#3d5345] hover:text-[#5a861d] active:scale-95 transition"
                      title="Click to copy transfer memo"
                    >
                      <span>{memoContent}</span>
                      {copiedMemo ? (
                        <CheckCheck className="h-3.5 w-3.5 text-[#5a861d]" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-[#8c9890]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Action Button */}
                <div className="pt-1">
                  <button
                    onClick={handlePaid}
                    disabled={isVerifying}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#a8e63d] py-3.5 text-xs sm:text-sm font-black text-[#17201c] shadow-[0_6px_22px_rgba(168,230,61,0.4)] hover:bg-[#b8ef59] active:scale-95 transition-all disabled:opacity-75"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#17201c]" />
                        <span>Verifying VietQR Transfer...</span>
                      </>
                    ) : (
                      <>
                        <span>I Have Paid · Confirm Booking</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
