"use client";
import {useEffect,useRef,useState} from "react";
import {inquiryLabels,newInquiryTypes,stages} from "./inquiry-options";
import type {BrowserDelivery} from "./inquiry-delivery";
type State={kind:"idle"|"loading"|"success"|"error";message:string};
type Attempt={id:string;token:string;saved:boolean;delivery?:BrowserDelivery};
export default function ContactForm(){
 const [state,setState]=useState<State>({kind:"idle",message:""});
 const [interest,setInterest]=useState("");
 const [startedAt,setStartedAt]=useState(()=>Date.now());
 const attempt=useRef<Attempt|null>(null);
 useEffect(()=>{const t=new URLSearchParams(window.location.search).get("type");if(t&&newInquiryTypes.some(x=>x===t))setInterest(t);},[]);
 async function submit(event:React.FormEvent<HTMLFormElement>){
 event.preventDefault();const form=event.currentTarget;if(!attempt.current?.saved&&!form.reportValidity())return;
 const data=Object.fromEntries(new FormData(form).entries());
 const current=attempt.current??{id:crypto.randomUUID(),token:crypto.randomUUID(),saved:false};attempt.current=current;
 setState({kind:"loading",message:current.saved?"담당자에게 알림을 전달하고 있습니다.":"문의를 접수하고 있습니다."});
 try{
  if(!current.saved){
   const response=await fetch("/api/inquiries",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...data,startedAt,requestId:current.id,deliveryToken:current.token})});
   const result=await response.json() as {message?:string;reference?:string;delivery?:BrowserDelivery};
   if(!response.ok){attempt.current=null;throw new Error(result.message||"접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");}
   current.saved=Boolean(result.reference);current.delivery=result.delivery;
  }
  if(current.delivery){
   let status="browser_failed";
   try{
    const response=await fetch(current.delivery.endpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(current.delivery.fields),signal:AbortSignal.timeout(15000)});
    const result=await response.json() as {success?:boolean|string;message?:string};
    if(response.ok&&(result.success===true||result.success==="true"))status="browser_accepted";
    else if(typeof result.message==="string"&&/activation|activate form/i.test(result.message))status="activation_pending";
   }catch{ /* The saved inquiry remains available even if the mail service is unavailable. */ }
   await fetch("/api/inquiries",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({reference:current.id,deliveryToken:current.token,status})}).catch(()=>undefined);
   if(status!=="browser_accepted")throw new Error(`문의는 저장됐지만 담당자 알림을 전달하지 못했습니다. 잠시 후 '알림 다시 보내기'를 눌러 주세요. 접수 번호: ${current.id}`);
  }
  attempt.current=null;form.reset();setStartedAt(Date.now());setState({kind:"success",message:"문의가 접수되었습니다. 남겨주신 이메일로 연락드리겠습니다."});
 }catch(error){setState({kind:"error",message:error instanceof Error?error.message:"접수에 실패했습니다. 잠시 후 다시 시도해 주세요."});}}
 return <form className="contact-form" onSubmit={submit}>
 <p className="form-title">어떤 도움이 필요하신가요?</p>
 <fieldset disabled={state.kind==="loading"||Boolean(attempt.current?.saved)} style={{border:0,margin:0,padding:0,minWidth:0}}>
 <div className="field"><label htmlFor="contact-interest">문의 분야 *</label><select id="contact-interest" name="interest" value={interest} onChange={e=>setInterest(e.target.value)} required><option value="" disabled>선택해 주세요</option>{newInquiryTypes.map(t=><option value={t} key={t}>{inquiryLabels[t]}</option>)}</select></div>
 <div className="form-grid"><div className="field"><label htmlFor="contact-name">이름 *</label><input id="contact-name" name="name" autoComplete="name" required minLength={2} maxLength={80} placeholder="성함"/></div><div className="field"><label htmlFor="contact-company">회사명 *</label><input id="contact-company" name="company" autoComplete="organization" required minLength={2} maxLength={120} placeholder="회사명"/></div></div>
 <div className="field"><label htmlFor="contact-email">업무용 이메일 *</label><input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} placeholder="name@company.com"/></div>
 {interest==="consulting"&&<div className="field"><label htmlFor="contact-stage">현재 단계 (선택)</label><select id="contact-stage" name="stage" defaultValue=""><option value="">선택하지 않음</option>{stages.map(s=><option key={s}>{s}</option>)}</select></div>}
 {interest==="cs-solution"&&<div className="field"><label htmlFor="contact-context">사용 중인 지원·개발 도구 (선택)</label><input id="contact-context" name="context" maxLength={500} placeholder="문의 관리, 코드 저장소 등 현재 쓰는 도구"/></div>}
 <div className="field"><label htmlFor="contact-message">{interest==="cs-solution"?"어떤 문의 처리를 개선하고 싶으신가요?":"어떤 업무나 문제를 함께 살펴볼까요?"} *</label><textarea id="contact-message" name="message" required minLength={20} maxLength={3000} placeholder={interest==="cs-solution"?"반복되는 문의, 지금 처리하는 방법, 필요한 승인 절차를 알려주세요.":"자동화하고 싶은 업무, 활용할 자료, 현재의 어려움과 기대하는 변화를 적어 주세요."}/><p className="field-help">20자 이상 입력해 주세요. 개인정보, 비밀번호, 비밀키, 원본 고객 기록은 넣지 마세요.</p></div>
 <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">웹사이트</label><input id="contact-website" name="website" tabIndex={-1} autoComplete="off"/></div>
 <label className="consent"><input type="checkbox" name="consent" value="yes" required/><span>(필수) 문의 응대를 위한 개인정보 수집·이용에 동의합니다.</span></label>
 <details className="privacy-details"><summary>개인정보 수집·이용 안내</summary><p>수집 항목: 이름, 회사명, 이메일, 문의 분야와 내용, 선택 입력한 도입 단계 또는 사용 도구. 이용 목적: 컨설팅·솔루션·협력 문의 확인과 답변. 문의 처리와 후속 협의에 필요한 기간 동안 보관하며, 삭제 요청은 이 양식으로 접수할 수 있습니다. 동의하지 않으면 문의를 접수할 수 없습니다.</p><p>문의 알림을 담당자에게 전달하기 위해 입력한 내용은 이메일 전송 서비스 FormSubmit을 거쳐 담당자 메일함으로 전달됩니다. FormSubmit은 전송 내역을 30일간 보관한다고 안내합니다. <a href="https://formsubmit.co/privacy.pdf" target="_blank" rel="noopener noreferrer">FormSubmit 개인정보 안내 (새 창)</a></p></details>
 </fieldset>
 <button className="submit-button" type="submit" disabled={state.kind==="loading"}>{state.kind==="loading"?"접수 중...":attempt.current?.saved?"알림 다시 보내기":"문의 보내기"}<span aria-hidden="true">↗</span></button>
 <p className={"form-status "+state.kind} role="status" aria-live="polite">{state.message}</p></form>
}

