import { Container, Box } from "@mui/material";
import { DashboardNav } from "@/components/dashboard/DashboardNav";
import { JJEmailVerificationBanner } from "@/components/dashboard/JJEmailVerificationBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <JJEmailVerificationBanner />
      {/* On desktop, 2-col grid; on mobile, stacked single col */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "240px 1fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <DashboardNav />
        <Box>{children}</Box>
      </Box>
    </Container>
  );
}
