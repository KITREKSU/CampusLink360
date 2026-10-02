import {
  Bell,
  BookOpen,
  Bus,
  CreditCard,
  GraduationCap,
  ScanLine,
  Soup,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  isOpen?: boolean;
};

export const features: Feature[] = [
  {
    title: "Canteen Menu",
    description: "View live menu, pricing, and availability.",
    href: "/canteen",
    icon: Soup,
    isOpen: true,
  },
  {
    title: "Bus Tracking",
    description: "Track college bus location using driver mobile GPS.",
    href: "/bus",
    icon: Bus,
  },
  {
    title: "Study Materials",
    description: "Access notes, PDFs, links, and assignments.",
    href: "/materials",
    icon: BookOpen,
  },
  {
    title: "Score Card",
    description: "View academic score updates and performance.",
    href: "/score-card",
    icon: GraduationCap,
  },
  {
    title: "Fee Details",
    description: "Check official fee information and payment status.",
    href: "/fees",
    icon: CreditCard,
  },
  {
    title: "Notifications",
    description: "Get important college updates and alerts.",
    href: "/notifications",
    icon: Bell,
  },
  {
    title: "Payment Scanners",
    description: "Check hostel, canteen, and bus card scans.",
    href: "/scanners",
    icon: ScanLine,
    isOpen: true,
  },
];

export type CanteenItem = {
  category: "Breakfast" | "Lunch" | "Snacks" | "Drinks";
  name: string;
  price: string;
  status: "Available" | "Limited" | "Not Available";
};

export const canteenMenu: CanteenItem[] = [
  { category: "Breakfast", name: "Idli Set", price: "₹30", status: "Available" },
  { category: "Breakfast", name: "Masala Dosa", price: "₹45", status: "Available" },
  { category: "Breakfast", name: "Poori Masala", price: "₹40", status: "Limited" },
  { category: "Lunch", name: "Meals", price: "₹70", status: "Available" },
  { category: "Lunch", name: "Chicken Biryani", price: "₹120", status: "Available" },
  { category: "Lunch", name: "Veg Fried Rice", price: "₹80", status: "Not Available" },
  { category: "Snacks", name: "Samosa", price: "₹15", status: "Available" },
  { category: "Snacks", name: "Cutlet", price: "₹20", status: "Available" },
  { category: "Snacks", name: "Pazham Pori", price: "₹15", status: "Limited" },
  { category: "Drinks", name: "Tea", price: "₹10", status: "Available" },
  { category: "Drinks", name: "Coffee", price: "₹15", status: "Available" },
  { category: "Drinks", name: "Lime Juice", price: "₹25", status: "Available" },
];

export const categories = ["Breakfast", "Lunch", "Snacks", "Drinks"] as const;

export const roleNames = ["Student", "Teacher", "Parent", "Bus Driver", "Admin"] as const;
