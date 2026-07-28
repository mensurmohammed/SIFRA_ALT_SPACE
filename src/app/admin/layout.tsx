import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const user: any = await verifyJwt(token);
  if (!user || user.role !== "Administrator") redirect("/login");

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F4EE" }}>
      <AdminSidebar />
      <main className="flex-1 p-8 text-primary-dark overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
