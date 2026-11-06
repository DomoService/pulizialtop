import type { SupabaseClient } from "@supabase/supabase-js"
export async function updateRecoveredPassword(client: SupabaseClient, password: string, confirmation: string) {
  if (password.length<12 || password!==confirmation) return {success:false,error:"Usa almeno 12 caratteri e conferma la stessa password."}
  const {data:{user},error:sessionError}=await client.auth.getUser()
  if(sessionError||!user) return {success:false,error:"Sessione scaduta. Richiedi un nuovo link di recupero."}
  const {error}=await client.auth.updateUser({password})
  if(error) return {success:false,error:"Impossibile aggiornare la password. Verifica i requisiti o richiedi un nuovo link."}
  const {error:logoutError}=await client.auth.signOut({scope:"local"})
  return {success:true,warning:logoutError ? "Password aggiornata. La sessione non è stata chiusa: usa Esci prima di riaccedere." : ""}
}
