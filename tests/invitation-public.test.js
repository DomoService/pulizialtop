import {expect,mock,test} from 'bun:test'
const rpc=mock(async()=>({data:null,error:null}))
const from=mock(()=>{throw Error('Private table read forbidden')})
mock.module('@/lib/supabase/server',()=>({getSupabaseServerClient:async()=>({rpc,from})}))
const {getInvitationByToken,submitReviewFromInvitation}=await import('../app/actions')
test('invalid token never queries the database',async()=>{expect(await getInvitationByToken('bad')).toBe(null);expect(rpc).not.toHaveBeenCalled()})
test('public lookup uses only the limited RPC',async()=>{await getInvitationByToken('00000000-0000-4000-8000-000000000003');expect(rpc).toHaveBeenCalledWith('get_public_invitation',{p_token:'00000000-0000-4000-8000-000000000003'});expect(from).not.toHaveBeenCalled()})
test('submission validates declarations and never accepts customer email from browser',async()=>{
 const f=new FormData();f.set('invitation_token','00000000-0000-4000-8000-000000000003');f.set('rating','4');f.set('comment','Test comment');f.set('public_name','Public alias');
 expect((await submitReviewFromInvitation(f)).success).toBe(false)
 f.set('terms','on');f.set('experience','on');f.set('customer_email','forged@example.test');
 expect((await submitReviewFromInvitation(f)).success).toBe(true)
 expect(rpc).toHaveBeenLastCalledWith('submit_invited_review',{p_token:'00000000-0000-4000-8000-000000000003',p_rating:4,p_comment:'Test comment',p_public_name:'Public alias'})
 expect(from).not.toHaveBeenCalled()
})
