import {expect,mock,test} from 'bun:test'
let admin=true,fail=false
const calls=[]
mock.module('@/lib/access',()=>({requireAdmin:async()=>{if(!admin)throw new Error('denied')}}))
mock.module('@/lib/supabase/server',()=>({getSupabaseServerClient:async()=>({from:(table)=>{
 calls.push(table)
 if(table==='agencies')return {select:(fields)=>{expect(fields).toBe('agency_id,nome,website');return {order:()=>({range:async()=>({data:[{agency_id:7,nome:'Fixture',website:null}],error:fail?{}:null})})}}}
 if(table==='agency_provenance')return {select:()=>({in:async()=>({data:[{agency_id:7,source:'registered'}],error:null})})}
 throw new Error('Unexpected table')
}})}))
const {getProvenanceReview}=await import('../app/legal-actions')
test('register returns only scoped fields and separates failure from empty list',async()=>{
 expect((await getProvenanceReview()).rows[0]).toEqual({agency_id:7,nome:'Fixture',website:null,status:'registered'})
 fail=true;expect((await getProvenanceReview()).available).toBe(false)
 calls.length=0;admin=false;await expect(getProvenanceReview()).rejects.toThrow('denied');expect(calls).toEqual([])
})
