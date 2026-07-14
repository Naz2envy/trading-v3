import { Trade } from './types';
import { getSession,isSupabaseConfigured,refreshSession,setSession,supabaseFetch } from './supabase';

const BUCKET='trade-screenshots';
export type CloudUser={id:string;email?:string};
export async function getCloudUser():Promise<CloudUser|null>{if(!isSupabaseConfigured())return null;let session=getSession();if(session?.expires_at&&session.expires_at*1000<Date.now()+60000)session=await refreshSession();return session?.user?{id:session.user.id,email:session.user.email}:null}
export type AuthResult={signedIn:boolean;needsConfirmation:boolean;message:string};
export async function signUp(email:string,password:string):Promise<AuthResult>{
 if(!isSupabaseConfigured())throw new Error('Supabase environment variables are missing.');
 const cleanEmail=email.trim().toLowerCase();
 const data=await supabaseFetch('/auth/v1/signup',{method:'POST',body:JSON.stringify({email:cleanEmail,password})},false);
 if(data?.access_token){setSession(data);window.dispatchEvent(new Event('tradesea-auth'));return{signedIn:true,needsConfirmation:false,message:'Account created. Cloud sync is now active.'}}
 const hasUser=Boolean(data?.user?.id);
 if(hasUser)return{signedIn:false,needsConfirmation:true,message:'Account created. Check your email and tap the confirmation link, then return and sign in.'};
 throw new Error('Supabase did not create the account. Check that Email sign-ups are enabled in your Supabase project.');
}
export async function signIn(email:string,password:string):Promise<AuthResult>{
 if(!isSupabaseConfigured())throw new Error('Supabase environment variables are missing.');
 const data=await supabaseFetch('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email:email.trim().toLowerCase(),password})},false);
 if(!data?.access_token||!data?.user)throw new Error('Supabase returned an incomplete login response.');
 setSession(data);window.dispatchEvent(new Event('tradesea-auth'));
 return{signedIn:true,needsConfirmation:false,message:'Signed in. Your cloud journal is syncing.'};
}
export async function signOut(){try{await supabaseFetch('/auth/v1/logout',{method:'POST'})}catch{}setSession(null);window.dispatchEvent(new Event('tradesea-auth'))}

async function uploadScreenshot(userId:string,trade:Trade):Promise<Trade>{if(!trade.screenshot?.startsWith('data:image'))return trade;const match=trade.screenshot.match(/^data:(image\/[^;]+);base64,(.+)$/);if(!match)return trade;const mime=match[1],bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0)),ext=mime.includes('png')?'png':'jpg',path=`${userId}/${trade.id}.${ext}`;await supabaseFetch(`/storage/v1/object/${BUCKET}/${path}`,{method:'POST',headers:{'Content-Type':mime,'x-upsert':'true'},body:bytes});return{...trade,screenshot:undefined,screenshotPath:path}}
async function hydrateScreenshot(trade:Trade):Promise<Trade>{if(!trade.screenshotPath)return trade;try{const data=await supabaseFetch(`/storage/v1/object/sign/${BUCKET}/${trade.screenshotPath}`,{method:'POST',body:JSON.stringify({expiresIn:604800})});const base=process.env.NEXT_PUBLIC_SUPABASE_URL||'';return data?.signedURL?{...trade,screenshot:`${base}/storage/v1${data.signedURL}`} : trade}catch{return trade}}
export async function loadCloudTrades():Promise<Trade[]>{if(!getSession())return[];const rows=await supabaseFetch('/rest/v1/trades?select=trade&order=updated_at.desc',{headers:{Accept:'application/json'}});return Promise.all((rows||[]).map((r:any)=>hydrateScreenshot(r.trade as Trade)))}
export async function upsertCloudTrade(trade:Trade):Promise<Trade>{const user=await getCloudUser();if(!user)return trade;const cloudTrade=await uploadScreenshot(user.id,{...trade,updatedAt:new Date().toISOString()});await supabaseFetch('/rest/v1/trades?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:trade.id,user_id:user.id,trade:cloudTrade,updated_at:new Date().toISOString()})});return hydrateScreenshot(cloudTrade)}
export async function deleteCloudTrade(id:string,screenshotPath?:string){await supabaseFetch(`/rest/v1/trades?id=eq.${encodeURIComponent(id)}`,{method:'DELETE',headers:{Prefer:'return=minimal'}});if(screenshotPath)try{await supabaseFetch(`/storage/v1/object/${BUCKET}`,{method:'DELETE',body:JSON.stringify({prefixes:[screenshotPath]})})}catch{}}
export async function loadStrategy():Promise<string>{const local=localStorage.getItem('tradesea-strategy')||'';if(!getSession())return local;try{const rows=await supabaseFetch('/rest/v1/strategies?select=content&limit=1');return rows?.[0]?.content||local}catch{return local}}
export async function saveStrategy(content:string){localStorage.setItem('tradesea-strategy',content);const user=await getCloudUser();if(!user)return;await supabaseFetch('/rest/v1/strategies?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:user.id,content,updated_at:new Date().toISOString()})})}
export function subscribeToTradeChanges(onChange:()=>void){let last='';const check=async()=>{if(document.hidden)return;try{const trades=await loadCloudTrades();const fingerprint=trades.map(t=>`${t.id}:${t.updatedAt||''}`).join('|');if(last&&fingerprint!==last)onChange();last=fingerprint}catch{}};const timer=setInterval(check,6000);check();return()=>clearInterval(timer)}
export function onAuthChange(callback:(user:CloudUser|null)=>void){const handler=()=>getCloudUser().then(callback);window.addEventListener('tradesea-auth',handler);return()=>window.removeEventListener('tradesea-auth',handler)}
