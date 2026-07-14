const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SESSION_KEY = 'tradesea-supabase-session';

export type SupabaseSession = { access_token:string; refresh_token:string; expires_at?:number; user:{id:string;email?:string} };
export const isSupabaseConfigured=()=>Boolean(URL&&ANON);
export const getSession=():SupabaseSession|null=>{if(typeof window==='undefined')return null;try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}};
export const setSession=(session:SupabaseSession|null)=>{if(typeof window==='undefined')return;if(session)localStorage.setItem(SESSION_KEY,JSON.stringify(session));else localStorage.removeItem(SESSION_KEY)};

export async function supabaseFetch(path:string,init:RequestInit={},authenticated=true){
 const session=getSession();
 const headers=new Headers(init.headers);
 headers.set('apikey',ANON);
 if(authenticated&&session?.access_token)headers.set('Authorization',`Bearer ${session.access_token}`);
 if(!headers.has('Content-Type')&&!(init.body instanceof Blob)&&!(init.body instanceof Uint8Array))headers.set('Content-Type','application/json');
 const response=await fetch(`${URL}${path}`,{...init,headers});
 if(!response.ok){const text=await response.text();throw new Error(text||`Supabase request failed (${response.status})`)}
 if(response.status===204)return null;
 const text=await response.text();return text?JSON.parse(text):null;
}

export async function refreshSession(){const current=getSession();if(!current?.refresh_token)return null;try{const data=await supabaseFetch('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:current.refresh_token})},false);setSession(data);return data}catch{setSession(null);return null}}
