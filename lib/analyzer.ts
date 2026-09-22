export type Finding={label:string;detail:string;severity:"low"|"medium"|"high"};
export type Analysis={score:number;risk:"Low"|"Medium"|"High";status:string;summary:string;findings:Finding[];recommendations:string[]};
const suspicious=["verify","urgent","suspend","password","login","bank","wallet","prize","free","confirm","security alert","immediately"];
export function analyzeUrl(raw:string):Analysis{
  const findings:Finding[]=[]; let score=0; let url:URL;
  try{url=new URL(/^https?:\/\//i.test(raw)?raw:`https://${raw}`)}catch{return {score:92,risk:"High",status:"Invalid or deceptive URL",summary:"This address cannot be parsed safely.",findings:[{label:"Malformed address",detail:"The URL does not use a recognizable web address format.",severity:"high"}],recommendations:["Do not open this link","Confirm the address with the sender through another channel"]}}
  const host=url.hostname.toLowerCase(); const whole=url.href.toLowerCase();
  if(url.protocol!=="https:"){score+=24;findings.push({label:"No HTTPS",detail:"The connection is not encrypted.",severity:"high"})}
  if(/\d{1,3}(\.\d{1,3}){3}/.test(host)){score+=28;findings.push({label:"IP address host",detail:"Legitimate services rarely ask users to sign in through a raw IP address.",severity:"high"})}
  if(host.split(".").length>4){score+=16;findings.push({label:"Deep subdomain chain",detail:"The domain uses an unusually long chain of subdomains.",severity:"medium"})}
  if(host.includes("xn--")){score+=24;findings.push({label:"Encoded domain",detail:"Punycode can be used to imitate familiar brand names.",severity:"high"})}
  if(whole.length>100){score+=12;findings.push({label:"Long URL",detail:"The address is unusually long and may hide its destination.",severity:"medium"})}
  const hits=suspicious.filter(x=>whole.includes(x)); if(hits.length){score+=Math.min(30,hits.length*8);findings.push({label:"High-pressure wording",detail:`Matched: ${hits.slice(0,4).join(", ")}.`,severity:hits.length>2?"high":"medium"})}
  if((whole.match(/@/g)||[]).length){score+=18;findings.push({label:"Redirect pattern",detail:"The address contains an @ symbol that can obscure the real host.",severity:"high"})}
  if(!findings.length)findings.push({label:"No obvious structural flags",detail:"The URL passed the local pattern checks.",severity:"low"});
  return finish(score,findings,"URL");
}
export function analyzeEmail(text:string):Analysis{
  const value=text.toLowerCase(),findings:Finding[]=[];let score=0;
  const urgency=["urgent","immediately","within 24 hours","suspended","final warning"].filter(x=>value.includes(x));
  const credentials=["password","verify your account","login","otp","pin","social security"].filter(x=>value.includes(x));
  const money=["wire transfer","gift card","crypto","refund","prize","bank details"].filter(x=>value.includes(x));
  const links=(text.match(/https?:\/\/[^\s]+/gi)||[]);
  if(urgency.length){score+=Math.min(30,urgency.length*10);findings.push({label:"Urgency tactics",detail:`Creates pressure using: ${urgency.join(", ")}.`,severity:"high"})}
  if(credentials.length){score+=Math.min(35,credentials.length*12);findings.push({label:"Sensitive information request",detail:`Requests or references: ${credentials.join(", ")}.`,severity:"high"})}
  if(money.length){score+=Math.min(30,money.length*12);findings.push({label:"Financial lure",detail:`Financial language detected: ${money.join(", ")}.`,severity:"high"})}
  if(links.length){score+=12;findings.push({label:"Embedded link",detail:`Found ${links.length} link${links.length>1?"s":""}; verify the destination separately.`,severity:"medium"})}
  if(/dear (customer|user|sir|madam)/i.test(text)){score+=10;findings.push({label:"Generic greeting",detail:"The sender does not address the recipient personally.",severity:"medium"})}
  if(!findings.length)findings.push({label:"No common social-engineering signals",detail:"The message passed the local language checks.",severity:"low"});
  return finish(score,findings,"message");
}
function finish(value:number,findings:Finding[],kind:string):Analysis{const score=Math.min(99,Math.max(4,value));const risk=score>=65?"High":score>=30?"Medium":"Low";return{score,risk,status:risk==="High"?"Likely phishing":risk==="Medium"?"Needs caution":"No obvious threat",summary:risk==="High"?`This ${kind} shows multiple phishing signals.`:risk==="Medium"?`This ${kind} has warning signs worth checking.`:`This ${kind} appears low-risk in the local scan.`,findings,recommendations:risk==="Low"?["Still verify unexpected requests before sharing information","Keep your browser and security tools updated"]:["Do not click links or download attachments","Verify the sender through a trusted channel","Report and delete the content if the sender cannot be confirmed"]}}
