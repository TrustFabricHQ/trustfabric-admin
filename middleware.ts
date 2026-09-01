export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/leads/:path*", "/api/leads/:path*"],
};
