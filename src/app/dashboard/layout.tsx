import Link from 'next/link';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <nav>
        This is nav
        <br /> <br />
        <div>
          <Link href="/dashboard/settings">Settings</Link>
        </div>
        <br />
      </nav>
      {children}
    </section>
  );
}
