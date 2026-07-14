import {Trade} from './types';

const DB_NAME='tradesea-db';
const STORE='trades';
const VERSION=1;

function openDb():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(DB_NAME,VERSION);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:'id'})};
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 });
}

export async function loadTrades():Promise<Trade[]>{
 if(typeof indexedDB==='undefined')return [];
 const db=await openDb();
 return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly');const req=tx.objectStore(STORE).getAll();req.onsuccess=()=>resolve((req.result as Trade[]).sort((a,b)=>b.date.localeCompare(a.date)));req.onerror=()=>reject(req.error)});
}
export async function saveTrade(trade:Trade){const db=await openDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(trade);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
export async function deleteTrade(id:string){const db=await openDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
export async function replaceTrades(trades:Trade[]){const db=await openDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');const store=tx.objectStore(STORE);store.clear();trades.forEach(t=>store.put(t));tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
