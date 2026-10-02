import { ScannerDisplay } from "@/components/ScannerDisplay";

export default function CanteenScannerPage() {
  return (
    <ScannerDisplay
      scanner="Canteen"
      databasePath="Canteen"
      description="Canteen scanning only. Enter amount at Canteen/Amount and wait for cards at Canteen/UID."
    />
  );
}
