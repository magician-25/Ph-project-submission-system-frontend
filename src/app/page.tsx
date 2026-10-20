import AuthGuard from "@/components/authentication/auth-guard";

export default function Home() {
  return <AuthGuard redirectAuthenticatedUser />;
}
