import Integrations from "./integrations";
import AgenticDiagram from "./agentic-diagram";
import {ContactCTA} from "./site-chrome";

export default function Home(){return <main id="main">
<section className="company-hero"><div className="wrap hero-composition">
<div className="hero-intro"><p className="overline">API·SaaS 기업의 기술 지원·개발팀을 위한 솔루션</p><h1>기술 문의 한 건에 쏟던 40분,<br/><em>승인 클릭 1분으로<br/>줄입니다.</em></h1><p className="lead">문의가 올 때마다 로그를 찾고, 개발팀에 확인하고, 답변을 정리하고 있나요? lubrAIn의 기술 문의 자동화 솔루션은 원인 조사부터 수정안·테스트·검토용 PR 준비까지 자동으로 진행합니다. 담당자가 승인하면 허용된 절차로 수정 반영, 해결 검증, 고객 안내까지 이어갑니다.</p><div className="actions"><a className="btn" href="/solutions#workflow-demo">처리 과정 데모 보기 ↗</a><a className="link-arrow" href="/contact?type=cs-solution">우리 팀 반복 문의 자동화 진단받기 ↗</a></div></div>
<div className="preview-console"><div className="console-top"><span>AGENT WORKFLOW</span><span>웹훅 오류 처리 예시</span></div><p className="console-case">고객 문의: "결제는 됐는데 웹훅 알림이 오지 않습니다."</p><h3>담당자는 PR 검토·승인.<br/>나머지 작업은 정해진 흐름대로.</h3><ol><li><span>자동</span>고객 설정·로그 확인과 원인 재현<small style={{marginTop:6}}>429 응답의 Retry-After: 2를 2초가 아닌 2ms로 처리한 오류 확인</small></li><li><span>자동</span>수정안·테스트·검토용 PR 준비<small style={{marginTop:6}}>재시도 대기 시간 수정 PR과 초 단위·날짜 형식 테스트 준비</small></li><li className="approval-line"><span>담당자</span>변경 내용과 근거 확인 후 승인<small style={{marginTop:6}}>PR의 코드 변경안·테스트 결과·예상 영향 확인 후 승인</small></li><li><span>승인 후 자동</span>수정 반영 → 해결 검증 → 고객 안내<small style={{marginTop:6}}>같은 요청의 재전송 성공을 확인하고 고객 회신 준비</small></li></ol><small>이해를 돕기 위한 처리 예시입니다. 자동 실행 범위와 담당자 승인 단계는 각 팀의 배포·보안 정책에 맞춰 설정합니다.</small></div>
</div></section>
<section className="company-section core-overview"><div className="wrap"><div className="section-heading"><div><p className="overline">반복되는 지원 업무</p><h2>한 건의 문의 때문에<br/>여러 사람이 같은 조사를 반복하나요?</h2></div><p>지원팀이 자료를 모으고 개발팀이 다시 조사하는 과정, 수정 후 해결 여부를 확인하고 답변하는 과정을 한 건의 작업으로 연결합니다.</p></div><div className="core-grid">{[
["01","로그 찾기와 전달","지원팀과 개발팀이 요청 ID와 로그를 메신저로 주고받습니다.","AI가 문의의 버전·설정과 관련 로그를 묶어 조사 근거를 준비합니다."],
["02","원인 조사와 수정 준비","개발자가 진행하던 작업을 멈추고 재현 환경부터 준비합니다.","AI가 허용된 작업 공간에서 오류를 재현하고 수정안·테스트·검토용 PR을 준비합니다."],
["03","수정 후 확인","변경 반영 뒤 담당자가 테스트 요청을 보내 해결 여부를 확인합니다.","승인된 변경을 반영하면 같은 오류 조건으로 자동 재검증합니다. 실패한 작업은 완료로 표시하지 않습니다."],
["04","답변과 기록 정리","기술 내용을 고객이 이해할 말로 다시 쓰고 해결 기록을 정리합니다.","수정 내용과 검증 결과를 고객 안내문과 다음 문의에 활용할 해결 절차로 정리합니다."],
].map(([n,t,before,after])=><article key={n}><span>{n}</span><h3>{t}</h3><p>기존: {before}</p><p style={{marginTop:14}}>도입 후: {after}</p></article>)}</div><a className="link-arrow" href="/solutions/cs/use-cases">문의 유형별 활용 사례 보기 ↗</a></div></section>
<Integrations/>
<section className="company-section product-preview"><div className="wrap preview-grid"><div><p className="overline">자동 처리의 기준</p><h2>실행은 AI가.<br/>중요한 결정은 담당자가.</h2><p>자동 처리를 맡기려면 어디까지 실행하고 언제 멈추는지 분명해야 합니다. 모델에 지시하는 것과 별도로, 코드로 정한 규칙이 도구 권한과 단계별 실행 조건을 검사합니다.</p><ul><li>실제 서비스 변경은 담당자 승인 뒤에 진행합니다.</li><li>권한을 벗어나거나 검증에 실패하면 멈추고 담당자에게 근거와 상태를 넘깁니다.</li><li>승인 요청 전에 테스트 결과를 확인합니다. 실패한 수정안은 승인 대기 상태로 넘기지 않고, 허용된 범위에서 보완하거나 담당자에게 실패 원인을 알립니다.</li><li>문의별 조사 근거, 변경안, 승인과 검증 결과를 남깁니다.</li></ul><a className="link-arrow" href="/technology">안전한 자동 처리를 뒷받침하는 기술 ↗</a></div><AgenticDiagram/></div></section>
<section className="company-section"><div className="wrap preview-grid"><div><p className="overline">반복 업무의 변화</p><h2>반복 문의 처리 시간<br/>90% 이상 단축</h2><p>로그 조회, 오류 재현, 수정안·테스트 준비와 답변 정리를 AI가 이어서 처리합니다. 담당자는 자료를 처음부터 다시 모으는 대신, 한곳에 정리된 근거와 PR을 검토하고 승인합니다.</p><p className="small-note">측정 사례 기준이며, 문의 유형·연동 도구·팀별 승인 정책에 따라 절감 폭은 달라집니다.</p></div><div><h3>제품 개발 경험을 모아,<br/>함께 만드는 AI 팀.</h3><p>lubrAIn은 Agentic AI 기술과 솔루션을 함께 만드는 팀입니다. 팀이 보유한 경험에는 삼성전자에서 15년 이상 Galaxy·Bixby·가전·로봇의 데이터를 분석하고 상용 AI/ML 시스템을 개발한 경험이 포함됩니다. 이를 바탕으로 업무 분석부터 구현과 검증까지 함께 풀어갑니다.</p><p>도입 시에는 팀의 과거 문의 티켓과 처리 기록을 바탕으로 기존 소요 시간, 자동 처리 결과와 해결 여부를 비교·검증합니다.</p><a className="link-arrow" href="/about#experience">팀과 개발 경험 보기 ↗</a></div></div></section>
<section className="company-section offerings-section"><div className="wrap"><div className="section-heading"><div><p className="overline">도입 지원</p><h2>반복되는 문의 한 종류부터<br/>적용 범위를 정합니다.</h2></div><p>지금 쓰는 지원 도구와 개발 절차를 기준으로 연결할 자료, 자동 실행 범위, 담당자의 승인 지점을 함께 정합니다.</p></div><div className="engagement-steps">{[
["문의 유형 선택","자주 반복되고 해결 조건이 분명한 기술 문의를 고릅니다."],
["자료와 권한 확인","문의·문서·로그·코드 중 필요한 자료와 접근 범위를 정합니다."],
["승인과 검증 설계","누가 무엇을 승인하고 어떤 결과를 확인해야 완료할지 정합니다."],
["파일럿 검증 및 적용","전체 시스템 변경에 앞서 선택한 한 가지 문의 유형을 과거 티켓으로 검증합니다. 필요한 자료와 도구만 연결해 결과를 비교한 뒤 본 도입 범위를 정합니다."],
].map(([t,d],i)=><article key={t}><span>0{i+1}</span><h3>{t}</h3><p>{d}</p></article>)}</div><p>파일럿은 한 가지 문의 유형과 합의한 자료·권한 범위에서 시작합니다. 연결 작업과 검증 기준을 정한 뒤 일정과 비용을 안내합니다.</p><p>기술 문의 대응 외 업무에 Agentic AI를 적용하거나 기존 에이전트를 개선하려면 별도 컨설팅으로 상담할 수 있습니다. <a className="link-arrow" href="/consulting">도입 지원·컨설팅 보기 ↗</a></p></div></section>
<ContactCTA title="가장 반복되는 기술 문의 하나를 알려주세요."/>
</main>}
