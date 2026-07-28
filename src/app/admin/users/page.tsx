import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CustomerManagementPage() {
  const users = await prisma.user.findMany({
    where: { Role: "Customer" },
    orderBy: { DateRegistered: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1" style={{ fontSize: "2rem" }}>
          Customer Accounts
        </h1>
        <p className="text-text-muted text-sm">All registered customer accounts.</p>
      </div>

      {/* Table Card */}
      <div
        className="bg-white rounded-[12px] border border-border-color overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <table className="min-w-full">
          <thead>
            <tr style={{ background: "#F7F4EE", borderBottom: "1px solid #E0DCD3" }}>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest">
                Date Registered
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-text-muted uppercase tracking-widest">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr
                key={u.UserID}
                style={{
                  borderBottom: i < users.length - 1 ? "1px solid #E0DCD3" : "none",
                }}
              >
                <td className="px-6 py-4 font-semibold text-primary-dark text-sm">
                  {u.FirstName} {u.LastName}
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{u.Email}</td>
                <td className="px-6 py-4 text-sm text-text-muted">
                  {u.DateRegistered.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4">
                  <span
                    className="badge text-xs"
                    style={
                      u.Status === "Active"
                        ? { background: "#E2F0D9", color: "#385723" }
                        : { background: "#FCE4D6", color: "#C65911" }
                    }
                  >
                    {u.Status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-xs font-semibold text-accent-gold hover:underline">
                      View Profile
                    </button>
                    <button className="text-xs font-semibold text-red-500 hover:underline">
                      Disable
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-text-muted">
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
