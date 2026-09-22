import {SignJWT,jwtVerify} from "jose";import {cookies} from "next/headers";
const key=()=>{const secret=process.env.JWT_SECRET;if(!secret)throw new Error("JWT_SECRET is required");return new TextEncoder().encode(secret)};
export type Session={sub:string;name:string;email:string;role:"USER"|"ADMIN"};
export async function signSession(data:Session){return new SignJWT(data).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key())}
export async function getSession(){const token=(await cookies()).get("pg_session")?.value;if(!token)return null;try{return (await jwtVerify(token,key())).payload as unknown as Session}catch{return null}}
