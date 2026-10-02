import { ScannerDisplay } from "@/components/ScannerDisplay";

export default function CanteenScannerPage() {
  return (
    <ScannerDisplay
      scanner="Canteen"
      description="Canteen scanning only. Enter amount at Scanner/Canteen/Amount and wait for cards at Scanner/Canteen/UID."
    />
  );
}
