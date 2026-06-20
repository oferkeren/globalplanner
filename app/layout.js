import "./styles.css";

export const metadata = {
  title: "Global Travel Planner",
  description: "Google login based smart travel planner"
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
