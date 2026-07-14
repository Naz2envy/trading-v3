import {Trade} from './types';
export const seedTrades:Trade[]=[
{id:'1',date:'2026-07-11',instrument:'NAS100',direction:'Long',setup:'Liquidity Sweep + FVG',session:'London',entry:18432.6,stopLoss:18402.1,takeProfit:18502.3,exit:18502.3,risk:150,pnl:343.5,rMultiple:2.29,outcome:'Win',emotion:'Confident',followedPlan:true,notes:'Waited for confirmation after sell-side liquidity sweep.'},
{id:'2',date:'2026-07-10',instrument:'XAUUSD',direction:'Long',setup:'Order Block Rejection',session:'New York',entry:3312.4,stopLoss:3305.8,takeProfit:3325.6,exit:3321.3,risk:120,pnl:161.8,rMultiple:1.35,outcome:'Win',emotion:'Focused',followedPlan:true,notes:'Good patience, partial close before target.'},
{id:'3',date:'2026-07-09',instrument:'EURUSD',direction:'Short',setup:'Break & Retest',session:'London',entry:1.1712,stopLoss:1.1732,takeProfit:1.1672,exit:1.1732,risk:100,pnl:-100,rMultiple:-1,outcome:'Loss',emotion:'Frustrated',followedPlan:false,notes:'Entered too quickly after previous loss.'},
{id:'4',date:'2026-07-08',instrument:'NAS100',direction:'Short',setup:'Liquidity Sweep + FVG',session:'New York',entry:18380,stopLoss:18420,takeProfit:18280,exit:18406,risk:150,pnl:-97.5,rMultiple:-0.65,outcome:'Loss',emotion:'Hesitant',followedPlan:true,notes:'Valid setup but weak follow-through.'},
{id:'5',date:'2026-07-07',instrument:'GBPUSD',direction:'Long',setup:'Trend Continuation',session:'London',entry:1.359,stopLoss:1.356,takeProfit:1.3641,exit:1.3641,risk:125,pnl:212.5,rMultiple:1.7,outcome:'Win',emotion:'Calm',followedPlan:true,notes:'Clean continuation after BOS.'}
];
