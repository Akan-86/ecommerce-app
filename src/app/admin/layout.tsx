import { ReactNode } from "react";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Panel",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
