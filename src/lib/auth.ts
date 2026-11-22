import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "shyvon-super-secret-key-luxury-2026";
const ADMIN_COOKIE_NAME = "shyvon_admin_token";
const CUSTOMER_COOKIE_NAME = "shyvon_customer_token";

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CUSTOMER";
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: TokenPayload, expiresIn: any = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getAdminSession(): TokenPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (decoded && decoded.role === "ADMIN") {
    return decoded;
  }
  return null;
}

export function getCustomerSession(): TokenPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get(CUSTOMER_COOKIE_NAME)?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (decoded && decoded.role === "CUSTOMER") {
    return decoded;
  }
  return null;
}

export function isAuthorizedAdminEmail(email: string): boolean {
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(email.toLowerCase());
}
