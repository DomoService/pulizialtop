import {expect,mock,test} from 'bun:test'
let result={data:[],error:null}
const rpc=mock(async()=>result)
const from=mock(()=>{throw new Error('No direct delete or token table reads')})
mock.module('@/lib/access',()=>({requireAdmin:async()=>({}),requireAgencyAccess:async()=>({}),isAdmin:()=>true}))
mock.module('@/lib/supabase/server',()=>({getSupabaseServerClient:async()=>({rpc,from})}))
const {deleteAgency}=await import('../app/actions')
test('delete is a single restricted transactional RPC, no partial table deletes',async()=>{
 expect((await deleteAgency(42)).success).toBe(true)
 expect(rpc).toHaveBeenCalledWith('delete_agency_as_admin',{p_agency:42})
 expect(from).not.toHaveBeenCalled()
 result={data:null,error:{code:'23503',message:'private audit data'}}
 const r=await deleteAgency(42)
 expect(r.success).toBe(false)
 expect(r.error).not.toContain('private audit data')
})
