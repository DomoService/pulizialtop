import {expect,test} from 'bun:test'
import {planRetention,retentionProposals} from '../lib/legal/retention'
import {canEnableOptionalAnalytics,legalSettingsSchema} from '../lib/legal/schema'
const now=Date.parse('2026-11-06T12:00:00Z')
const row={reference:'opaque-1',kind:'contacts',anchor:'2025-01-01T12:00:00Z',closed:true,legalHold:false,reviewed:true}
const policy={approved:true,version:'approved-fixture',reviewedAt:'2026-11-05',rules:{contacts:{days:180,approved:true}}}
test('retention remains off without explicit approval and valid version/date',()=>{
 for(const p of [{...policy,approved:false},{...policy,version:''},{...policy,reviewedAt:null},{...policy,reviewedAt:'invalid'},{...policy,reviewedAt:'2030-01-01'}]) expect(planRetention([row],p,now).enabled).toBe(false)
 expect(retentionProposals.length).toBe(9)
})
test('planner emits only opaque manual-review metadata, never executes deletion',()=>{
 expect(planRetention([row],policy,now)).toEqual({enabled:true,candidates:[{reference:'opaque-1',kind:'contacts',action:'manual-review'}],blocked:0})
 for(const r of [{...row,closed:false},{...row,legalHold:true},{...row,legalHold:null},{...row,reviewed:false},{...row,anchor:null},{...row,anchor:'2030-01-01'}]) expect(planRetention([r],policy,now).candidates).toEqual([])
 expect(planRetention([row],{...policy,rules:{contacts:{days:-1,approved:true}}},now).candidates).toEqual([])
})
test('optional new analytics is gated on documented supplier/transfer/log criteria',()=>{
 expect(canEnableOptionalAnalytics(legalSettingsSchema.parse({analyticsEnabled:true}))).toBe(false)
 expect(canEnableOptionalAnalytics(legalSettingsSchema.parse({reviewed:true,suppliers:'Reviewed fixture',transfers:'Reviewed fixture',retentionLogs:'Reviewed fixture'}))).toBe(true)
})

test('owner preferences retain calendar-month semantics and leap dates',async()=>{
 const {retentionDeadline}=await import('../lib/legal/retention')
 expect(retentionProposals.find(x=>x.kind==='accounts').days).toBe(90)
 expect(retentionProposals.find(x=>x.kind==='accounts').anchor).toBe('closed_at')
 expect(retentionProposals.find(x=>x.kind==='logs').days).toBe(90)
 expect(retentionProposals.find(x=>x.kind==='contacts').months).toBe(12)
 expect(new Date(retentionDeadline(Date.parse('2024-02-29T12:00:00Z'),{months:12,approved:true})).toISOString()).toBe('2025-02-28T12:00:00.000Z')
 expect(Number.isNaN(retentionDeadline(now,{days:30,months:1,approved:true}))).toBe(true)
})
test('source statuses never fabricate documentary provenance',async()=>{
 const {assessProvenance}=await import('../lib/legal/provenance')
 expect(assessProvenance('registered').origin).toBe('direct-claimed')
 expect(assessProvenance('claimed').evidence).toContain('non prova')
 expect(assessProvenance(null).origin).toBe('unknown')
 expect(assessProvenance('platform').needsReview).toBe(true)
})
