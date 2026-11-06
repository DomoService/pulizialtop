import {expect,mock,test} from 'bun:test'
import {updateRecoveredPassword} from '../lib/password-update'
const valid='A valid test password 123'
function client(user={id:'test'},updateError=null,logoutError=null){return {auth:{getUser:mock(async()=>({data:{user},error:null})),updateUser:mock(async()=>({error:updateError})),signOut:mock(async()=>({error:logoutError}))}}}
test('password confirmation and session guard precede writes',async()=>{
 const db=client()
 expect((await updateRecoveredPassword(db,'short','short')).success).toBe(false)
 expect((await updateRecoveredPassword(db,valid,'different')).success).toBe(false)
 expect(db.auth.updateUser).not.toHaveBeenCalled()
 const expired=client(null)
 expect((await updateRecoveredPassword(expired,valid,valid)).success).toBe(false)
 expect(expired.auth.updateUser).not.toHaveBeenCalled()
})
test('successful update signs out locally; error is generic and no false success',async()=>{
 const db=client()
 expect((await updateRecoveredPassword(db,valid,valid)).success).toBe(true)
 expect(db.auth.updateUser).toHaveBeenCalledWith({password:valid})
 expect(db.auth.signOut).toHaveBeenCalledWith({scope:'local'})
 const fail=client({id:'test'},{message:'private details'})
 const result=await updateRecoveredPassword(fail,valid,valid)
 expect(result.success).toBe(false);expect(result.error).not.toContain('private details')
 expect(fail.auth.signOut).not.toHaveBeenCalled()
 const logoutFail=client({id:'test'},null,{message:'network'})
 expect((await updateRecoveredPassword(logoutFail,valid,valid)).warning).toContain('sessione non è stata chiusa')
})
