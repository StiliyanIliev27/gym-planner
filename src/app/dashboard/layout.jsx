import { AuthenticatedLayout } from "@/components/layouts/authenticated-layout";

export default function DashboardLayout({ children }) {
  return (
    <AuthenticatedLayout
      breadcrumb={[{ title: "Dashboard", href: "/dashboard" }]}
    >
      {children}
    </AuthenticatedLayout>
  );
}
