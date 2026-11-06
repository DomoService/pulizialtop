import { NextRequest } from "next/server"
import { recoveryCallback } from "@/lib/auth-recovery"
export function GET(request: NextRequest) { return recoveryCallback(request, "admin") }
