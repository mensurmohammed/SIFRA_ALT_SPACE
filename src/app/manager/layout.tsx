import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";
import { redirect } from "next/navigation";
import ManagerSidebar from "@/components/ManagerSidebar";

export const metadata = { title: "Manager Dashboard" };

export default async function ManagerLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) redirect("/login");

  const user: any = await verifyJwt(token);
  if (!user || (user.role !== "Manager" && user.role !== "Administrator"))
    redirect("/login");

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F4EE" }}>
      <ManagerSidebar />
      <main className="flex-1 p-8 text-primary-dark overflow-y-auto h-screen">
        {children}
      </main>
    </div>
  );
}
