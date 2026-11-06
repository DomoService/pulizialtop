"use client"
import { ReviewForm } from "@/components/review-form"
export function ReviewFormPublic({ token, agencyName }: { token: string; agencyName: string }) {
  return <ReviewForm agencyId={1} agencyName={agencyName} token={token} />
}
