import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-dark flex font-sans">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">{children}</div>
      </main>
    </div>
  );
}
