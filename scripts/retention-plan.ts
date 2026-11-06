// Offline metadata-only dry-run. Never connects to DB or deletes anything.
// bun scripts/retention-plan.ts /protected/policy.json /protected/metadata.json
import { readFileSync } from "node:fs"
import { planRetention } from "../lib/legal/retention"
const [policyPath, metadataPath, ...extra]=process.argv.slice(2)
if(!policyPath||!metadataPath||extra.length) throw new Error("Usage: bun scripts/retention-plan.ts policy.json metadata.json (dry-run only)")
const policy=JSON.parse(readFileSync(policyPath,"utf8")), rows=JSON.parse(readFileSync(metadataPath,"utf8"))
if(!Array.isArray(rows)) throw new Error("Metadata must be an array")
// Keep local output private: even opaque references can be personal data.
console.log(JSON.stringify({mode:"DRY_RUN_NO_DELETION",...planRetention(rows,policy)},null,2))
