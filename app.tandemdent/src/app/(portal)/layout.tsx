import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patient Portal | TandemDent",
  description: "Access your appointments and medical records",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
