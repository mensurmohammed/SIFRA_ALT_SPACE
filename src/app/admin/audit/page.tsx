export default function AuditLogsPage() {
  const logs = [
    {
      timestamp: new Date(),
      user: "admin@sifra.et",
      action: "LOGIN",
      details: "Successful authentication",
      type: "neutral",
    },
    {
      timestamp: new Date(Date.now() - 3600000),
      user: "manager@sifra.et",
      action: "ORDER_CREATED",
      details: "Processed order in POS",
      type: "success",
    },
  ];

  const typeBadge = (type: string) => {
    switch (type) {
      case "success":
        return { background: "#E2F0D9", color: "#385723" };
      case "danger":
        return { background: "#FCE4D6", color: "#C65911" };
      default:
        return { background: "#F7F4EE", color: "#352214" };
    }
  };

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      <div>
        <h1 className="font-serif font-bold text-primary-dark mb-1 text-2xl sm:text-3xl">
          Audit Logs
        </h1>
        <p className="text-text-muted text-xs sm:text-sm">Security and activity tracking log.</p>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {logs.map((log, i) => (
          <div
            key={i}
            className="bg-white rounded-[12px] p-4 border border-border-color space-y-2 shadow-xs"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-semibold text-primary-dark text-xs break-all">
                {log.user}
              </span>
              <span
                className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                style={typeBadge(log.type)}
              >
                {log.action}
              </span>
            </div>
            <p className="text-xs text-text-muted">{log.details}</p>
            <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-400">
              {log.timestamp.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table Card */}
      <div
        className="hidden md:block bg-white rounded-[12px] border border-border-color overflow-hidden"
        style={{ boxShadow: "0 2px 8px rgba(53,34,20,0.05)" }}
      >
        <table className="min-w-full">
          <thead>
            <tr style={{ background: "#F7F4EE", borderBottom: "1px solid #E0DCD3" }}>
              {["Timestamp", "User", "Action Type", "Details"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-xs font-semibold text-text-muted uppercase tracking-widest"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr
                key={i}
                style={{ borderBottom: i < logs.length - 1 ? "1px solid #E0DCD3" : "none" }}
              >
                <td className="px-6 py-4 text-sm text-text-muted whitespace-nowrap">
                  {log.timestamp.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-primary-dark whitespace-nowrap">
                  {log.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={typeBadge(log.type)}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-text-muted">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}