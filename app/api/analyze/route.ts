import {NextRequest,NextResponse} from "next/server";import {z} from "zod";import {analyzeEmail,analyzeUrl} from "@/lib/analyzer";
const input=z.object({type:z.enum(["url","email"]),content:z.string().min(3).max(20000)});
export async function POST(req:NextRequest){try{const body=input.parse(await req.json());const analysis=body.type==="url"?analyzeUrl(body.content):analyzeEmail(body.content);return NextResponse.json({...analysis,scannedAt:new Date().toISOString(),engine:"PhishGuard heuristic engine"})}catch{return NextResponse.json({error:"Enter valid content to analyze."},{status:400})}}
