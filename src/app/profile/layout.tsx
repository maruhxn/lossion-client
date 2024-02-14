export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="container py-6 space-y-6 lg:py-12 xl:space-y-10">
      <div className="container py-6 space-y-6 lg:py-12 xl:space-y-10">
        {children}
      </div>
    </div>
  );
}
