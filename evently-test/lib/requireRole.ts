import { getSession } from "next-auth/client";

export function requireRole(
  handler: (req: any, res: any) => Promise<void>,
  requiredRole: string,
) {
  return async (req: any, res: any) => {
    const session = await getSession({ req });
    if (!session || session.user.role !== requiredRole) {
      return res.status(403).json({ error: "Access denied" });
    }
    return handler(req, res);
  };
}
