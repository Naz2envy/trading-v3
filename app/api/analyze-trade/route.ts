import OpenAI from 'openai';
import {NextResponse} from 'next/server';
export async function POST(req:Request){
 try{
  const {image}=await req.json();
  if(!image) return NextResponse.json({error:'Image is required'},{status:400});
  if(!process.env.OPENAI_API_KEY) return NextResponse.json({demo:true,instrument:'NAS100',direction:'Long',setup:'Liquidity Sweep + FVG',session:'London',entry:18432.6,stopLoss:18402.1,takeProfit:18502.3,exit:18502.3,emotion:'Focused',confidence:84,notes:'Demo analysis because OPENAI_API_KEY is not configured.'});
  const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const response=await client.responses.create({model:process.env.OPENAI_VISION_MODEL||'gpt-4.1-mini',input:[{role:'user',content:[{type:'input_text',text:'Analyse this trading screenshot. Return only JSON with instrument, direction (Long or Short), setup, session, entry, stopLoss, takeProfit, exit, emotion, confidence 0-100, and concise notes. Use null for values that cannot be seen. Do not invent exact prices.'},{type:'input_image',image_url:image,detail:'high'}]}]});
  const text=response.output_text.replace(/```json|```/g,'').trim();
  return NextResponse.json(JSON.parse(text));
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Analysis failed'},{status:500})}
}
