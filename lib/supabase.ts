const URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SESSION_KEY = 'tradesea-supabase-session';

export type SupabaseSession = { access_token:string; refresh_token:string; expires_at?:number; user:{id:string;email?:string} };
export const isSupabaseConfigured=()=>Boolean(URL&&ANON);
export const getSession=():SupabaseSession|null=>{if(typeof window==='undefined')return null;try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}};
export const setSession=(session:SupabaseSession|null)=>{if(typeof window==='undefined')return;if(session)localStorage.setItem(SESSION_KEY,JSON.stringify(session));else localStorage.removeItem(SESSION_KEY)};

function friendlySupabaseError(status:number, raw:string){
 let message=raw;
 try{const parsed=JSON.parse(raw);message=parsed.msg||parsed.message||parsed.error_description||parsed.error||raw}catch{}
 const lower=String(message).toLowerCase();
 if(lower.includes('invalid login credentials'))return 'That email or password is not recognised. Create an account first or check your details.';
 if(lower.includes('email not confirmed'))return 'Confirm your email using the message from Supabase, then sign in.';
 if(lower.includes('user already registered'))return 'An account already exists for this email. Use Sign in instead.';
 if(lower.includes('signup is disabled'))return 'Account creation is disabled in Supabase. Enable Email sign-ups under Authentication → Providers → Email.';
 if(lower.includes('password should be at least'))return 'Your password must contain at least 6 characters.';
 if(lower.includes('unable to validate email'))return 'Enter a valid email address.';
 if(status===429)return 'Too many attempts. Wait a minute and try again.';
 return message || `Supabase request failed (${status})`;
}

export async function supabaseFetch(path:string,init:RequestInit={},authenticated=true){
 if(!isSupabaseConfigured())throw new Error('Supabase is not configured. Check the two NEXT_PUBLIC_SUPABASE environment variables in Vercel and redeploy.');
 const session=getSession();
 const headers=new Headers(init.headers);
 headers.set('apikey',ANON);
 if(authenticated&&session?.access_token)headers.set('Authorization',`Bearer ${session.access_token}`);
 if(!headers.has('Content-Type')&&!(init.body instanceof Blob)&&!(init.body instanceof Uint8Array))headers.set('Content-Type','application/json');
 let response:Response;
 try{response=await fetch(`${URL}${path}`,{...init,headers})}catch{throw new Error('TradeSea could not reach Supabase. Check your internet connection and Supabase project URL.')}
 if(!response.ok){const text=await response.text();throw new Error(friendlySupabaseError(response.status,text))}
 if(response.status===204)return null;
 const text=await response.text();return text?JSON.parse(text):null;
}

export async function refreshSession(){const current=getSession();if(!current?.refresh_token)return null;try{const data=await supabaseFetch('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:current.refresh_token})},false);setSession(data);return data}catch{setSession(null);return null}}
