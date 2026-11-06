const base="http://127.0.0.1:8787";
const pages=["/","/technology","/consulting","/solutions","/solutions/cs/use-cases","/about","/contact","/solution","/use-cases"];
for(const path of pages){const r=await fetch(base+path);const html=await r.text();if(r.status!==200||!html.includes("lubrAIn"))throw new Error("Page failed: "+path);console.log("PAGE",path,r.status,new URL(r.url).pathname);}
const batch=Date.now();
let index=0;
async function submit(label,changes,expected){
 const body={name:"검증 담당",company:"lubrAIn 로컬 검증",email:"qa-"+batch+"-"+index+++"@example.invalid",interest:"consulting",message:"홈페이지 개편 후 문의 분류와 저장 경로를 확인하는 로컬 테스트입니다.",consent:"yes",startedAt:Date.now()-10000,requestId:crypto.randomUUID(),...changes};
 const r=await fetch(base+"/api/inquiries",{method:"POST",headers:{"Content-Type":"application/json","Origin":base},body:JSON.stringify(body)});
 const data=await r.json();if(r.status!==expected)throw new Error(label+": "+r.status+" "+JSON.stringify(data));console.log("FORM",label,r.status,data.reference||"");return body.requestId;
}
const ids=[];
ids.push(await submit("consulting",{stage:"도입 검토 중"},200));
ids.push(await submit("cs-solution",{interest:"cs-solution",context:"로컬 검증용 문의 도구"},200));
ids.push(await submit("partnership",{interest:"partnership"},200));
await submit("invalid category",{interest:"unknown"},400);
await submit("invalid email",{email:"broken"},400);
await submit("consent missing",{consent:"no"},400);
await submit("spam timing",{startedAt:Date.now()},400);
await submit("invalid optional field",{interest:"cs-solution",stage:"도입 검토 중"},400);
console.log("VERIFY_IDS",JSON.stringify(ids));

