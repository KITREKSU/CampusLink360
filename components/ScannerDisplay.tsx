"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RotateCcw, ScanLine, WifiOff } from "lucide-react";
import { child, onValue, ref, set } from "firebase/database";
import { doc, getDoc, runTransaction } from "firebase/firestore";
import { AppHeader } from "@/components/AppHeader";
import { PageContainer } from "@/components/PageContainer";
import { firestoreDb, isFirebaseConfigured, realtimeDb } from "@/lib/firebase";

export type ScannerType = "Hostel" | "Canteen" | "Bus";

type StudentDetails = {
  name: string;
  department: string;
  year: string;
  feePending: boolean;
  wallet: number;
};

type PaymentResult = {
  status: "success" | "insufficient";
  message: string;
  amount: number;
  balance: number;
};

type ScannerDisplayProps = {
  scanner: ScannerType;
  description: string;
};

function normalizeFeePending(value: unknown) {
  return value === 1 || value === "1" || value === true;
}

export function ScannerDisplay({ scanner, description }: ScannerDisplayProps) {
  const isCanteenScanner = scanner === "Canteen";
  const [busy, setBusy] = useState<number>(0);
  const [uid, setUid] = useState<string>("0");
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [processedUid, setProcessedUid] = useState("");
  const [status, setStatus] = useState("Waiting for scan");
  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [error, setError] = useState("");
  const scannerPath = useMemo(() => `Scanner/${scanner}`, [scanner]);
  const paymentAmount = Number(amount);
  const hasValidAmount = Number.isFinite(paymentAmount) && paymentAmount > 0;

  useEffect(() => {
    setStudent(null);
    setUid("0");
    setBusy(0);
    setPaymentResult(null);
    setProcessedUid("");
    setError("");
    setStatus(isCanteenScanner ? "Enter amount, then scan card" : "Waiting for scan");

    if (!realtimeDb || !isFirebaseConfigured) {
      setError("Firebase is not configured yet. Add your project values to .env.local and restart localhost.");
      return;
    }

    const scannerRef = ref(realtimeDb, scannerPath);
    const unsubscribe = onValue(
      scannerRef,
      (snapshot) => {
        const value = snapshot.val() as { Busy?: number | string | boolean; UID?: string | number } | null;
        const currentBusy = Number(value?.Busy ?? 0);
        const currentUid = String(value?.UID ?? "0");

        setBusy(currentBusy);
        setUid(currentUid);
        setError("");

        if (currentBusy === 0) {
          setStudent(null);
          setPaymentResult(null);
          setProcessedUid("");
          setStatus(isCanteenScanner ? "Enter amount, then scan card" : "Please scan your card");
          return;
        }

        if (currentBusy === 1 && currentUid && currentUid !== "0") {
          if (isCanteenScanner && !hasValidAmount) {
            setStatus("Enter amount before scanning card");
            return;
          }

          setStatus("Card detected. Reading student details...");
          return;
        }

        setStatus("Scanner is busy, waiting for UID...");
      },
      (readError) => {
        setError(readError.message);
        setStatus("Unable to read scanner status");
      },
    );

    return () => unsubscribe();
  }, [hasValidAmount, isCanteenScanner, scannerPath]);

  useEffect(() => {
    async function loadStudent() {
      if (busy !== 1 || !uid || uid === "0" || !firestoreDb || processedUid === uid) {
        return;
      }

      if (isCanteenScanner && !hasValidAmount) {
        setStudent(null);
        setPaymentResult(null);
        setStatus("Enter amount before scanning card");
        return;
      }

      setIsLoadingStudent(true);
      setError("");

      try {
        const studentRef = doc(firestoreDb, "Student", uid);

        if (isCanteenScanner) {
          const transactionResult = await runTransaction(firestoreDb, async (transaction) => {
            const studentSnapshot = await transaction.get(studentRef);

            if (!studentSnapshot.exists()) {
              throw new Error(`No student record found for UID ${uid}`);
            }

            const data = studentSnapshot.data();
            const currentWallet = Number(data.Wallet ?? 0);

            if (!Number.isFinite(currentWallet)) {
              throw new Error("Wallet balance is not a valid number");
            }

            const details: StudentDetails = {
              name: String(data.Name ?? "Not available"),
              department: String(data.Department ?? "Not available"),
              year: String(data.Year ?? "Not available"),
              feePending: normalizeFeePending(data.FeePending),
              wallet: currentWallet,
            };

            if (currentWallet < paymentAmount) {
              return {
                student: details,
                payment: {
                  status: "insufficient" as const,
                  message: "Insufficient wallet balance",
                  amount: paymentAmount,
                  balance: currentWallet,
                },
              };
            }

            const newWalletBalance = currentWallet - paymentAmount;
            transaction.update(studentRef, { Wallet: newWalletBalance });

            return {
              student: { ...details, wallet: newWalletBalance },
              payment: {
                status: "success" as const,
                message: "Payment successful",
                amount: paymentAmount,
                balance: newWalletBalance,
              },
            };
          });

          setStudent(transactionResult.student);
          setPaymentResult(transactionResult.payment);
          setProcessedUid(uid);
          setStatus(transactionResult.payment.message);
          return;
        }

        const studentSnapshot = await getDoc(studentRef);

        if (!studentSnapshot.exists()) {
          setStudent(null);
          setStatus(`No student record found for UID ${uid}`);
          return;
        }

        const data = studentSnapshot.data();
        setStudent({
          name: String(data.Name ?? "Not available"),
          department: String(data.Department ?? "Not available"),
          year: String(data.Year ?? "Not available"),
          feePending: normalizeFeePending(data.FeePending),
          wallet: Number(data.Wallet ?? 0),
        });
        setProcessedUid(uid);
        setStatus("Student details loaded");
      } catch (studentError) {
        setStudent(null);
        setPaymentResult(null);
        setError(studentError instanceof Error ? studentError.message : "Unable to read student details");
        setStatus("Unable to load student details");
      } finally {
        setIsLoadingStudent(false);
      }
    }

    loadStudent();
  }, [busy, hasValidAmount, isCanteenScanner, paymentAmount, processedUid, uid]);

  async function clearScanner() {
    if (!realtimeDb) {
      setError("Firebase is not configured yet.");
      return;
    }

    setError("");
    setStatus("Clearing scanner...");

    try {
      const scannerRef = ref(realtimeDb);
      await Promise.all([set(child(scannerRef, `${scannerPath}/Busy`), 0), set(child(scannerRef, `${scannerPath}/UID`), 0)]);
      setStudent(null);
      setPaymentResult(null);
      setProcessedUid("");
      setUid("0");
      setBusy(0);
      setStatus(isCanteenScanner ? "Enter amount, then scan card" : "Please scan your card");
    } catch (clearError) {
      setError(clearError instanceof Error ? clearError.message : "Unable to clear scanner");
      setStatus("Clear failed");
    }
  }

  return (
    <PageContainer>
      <AppHeader title={`${scanner} Scanner`} subtitle="Firebase RTDB + Firestore" showBack />

      <section className="mt-6 rounded-[30px] bg-gradient-to-br from-sky-950 via-sky-800 to-teal-600 p-5 text-white shadow-2xl shadow-sky-950/20">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15">
          <ScanLine size={27} />
        </div>
        <h1 className="mt-5 text-3xl font-black leading-tight">{scanner} Scanner</h1>
        <p className="mt-3 text-sm leading-6 text-cyan-50">{description}</p>
      </section>

      {isCanteenScanner ? (
        <section className="glass-panel mt-5 rounded-[28px] p-5">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-teal-700">Payment Amount</span>
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(event) => {
                setAmount(event.target.value);
                setPaymentResult(null);
                setStudent(null);
                setProcessedUid("");
                setStatus("Enter amount, then scan card");
              }}
              disabled={busy === 1}
              placeholder="Enter amount"
              className="mt-2 h-12 w-full rounded-2xl border border-cyan-100 bg-white px-4 text-lg font-black text-slate-950 outline-none focus:border-teal-400 disabled:bg-slate-100 disabled:text-slate-500"
            />
          </label>
          <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">
            Enter the canteen bill amount first. After the card scan, the amount will be deducted from
            Student/{uid && uid !== "0" ? uid : "UID"}/Wallet.
          </p>
        </section>
      ) : null}

      <section className="glass-panel mt-5 rounded-[28px] p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{scanner} only</p>
            <h2 className="mt-1 text-xl font-black text-slate-950">Live Display</h2>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-black ${
              busy === 1 ? "bg-emerald-50 text-emerald-700" : "bg-cyan-50 text-teal-700"
            }`}
          >
            Busy: {busy}
          </span>
        </div>

        <div className="mt-5 rounded-[24px] bg-gradient-to-br from-slate-950 to-sky-900 p-5 text-white">
          <div className="flex items-center gap-3">
            {error ? (
              <WifiOff className="text-amber-300" size={23} />
            ) : isLoadingStudent ? (
              <Loader2 className="animate-spin text-cyan-200" size={23} />
            ) : student ? (
              <CheckCircle2 className="text-emerald-300" size={23} />
            ) : (
              <ScanLine className="text-cyan-200" size={23} />
            )}
            <p className="text-sm font-bold text-cyan-50">{status}</p>
          </div>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">
            {student ? (
              <div className="space-y-3">
                <DisplayRow label="UID" value={uid} />
                <DisplayRow label="Name" value={student.name} />
                <DisplayRow label="Department" value={student.department} />
                <DisplayRow label="Year" value={student.year} />
                {isCanteenScanner ? <DisplayRow label="Wallet" value={`₹${student.wallet}`} /> : null}
              </div>
            ) : (
              <div className="py-5 text-center">
                <p className="text-2xl font-black">{isCanteenScanner && !hasValidAmount ? "Enter amount first" : "Please scan your card"}</p>
                <p className="mt-2 text-sm font-semibold text-cyan-100">Waiting at {scannerPath}</p>
              </div>
            )}
          </div>
        </div>

        {paymentResult ? (
          <div
            className={`mt-4 flex items-start gap-3 rounded-2xl p-4 ${
              paymentResult.status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
            }`}
          >
            {paymentResult.status === "success" ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
            <div>
              <p className="text-sm font-black">{paymentResult.message}</p>
              <p className="mt-1 text-xs font-semibold opacity-80">
                Amount: ₹{paymentResult.amount} · Wallet balance: ₹{paymentResult.balance}
              </p>
            </div>
          </div>
        ) : student && !isCanteenScanner ? (
          <div
            className={`mt-4 flex items-start gap-3 rounded-2xl p-4 ${
              student.feePending ? "bg-amber-50 text-amber-800" : "bg-emerald-50 text-emerald-800"
            }`}
          >
            {student.feePending ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
            <div>
              <p className="text-sm font-black">
                {student.feePending ? `${scanner} fee is pending` : `No ${scanner.toLowerCase()} fee pending`}
              </p>
              <p className="mt-1 text-xs font-semibold opacity-80">Firestore field checked: Student/{uid}/FeePending</p>
            </div>
          </div>
        ) : null}

        {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-xs font-bold leading-5 text-red-700">{error}</p> : null}

        <button
          type="button"
          onClick={clearScanner}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-sky-950 text-sm font-black text-white shadow-lg shadow-sky-950/20"
        >
          <RotateCcw size={17} />
          Clear & Wait for Next Scan
        </button>
      </section>
    </PageContainer>
  );
}

function DisplayRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2 last:border-b-0 last:pb-0">
      <span className="text-xs font-bold uppercase tracking-wide text-cyan-100">{label}</span>
      <span className="min-w-0 truncate text-right text-sm font-black text-white">{value}</span>
    </div>
  );
}
