export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl flex flex-col gap-12 mx-10 md:ml-48 min-h-[85vh] items-start">{children}</div>
  );
}
