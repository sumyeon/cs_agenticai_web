import styles from "./integrations.module.css";

const groups = [
  {title:"문의·소통", description:"문의 인입·담당자 승인·고객 안내", tools:[
    ["slack","Slack","문의와 담당자 대화"],
    ["zendesk","Zendesk","웹훅·API 기반 티켓 연동"],
    ["api","기타 CS 도구","문의·처리 결과를 웹훅·API로 연결"],
  ]},
  {title:"로그·모니터링", description:"에러 로그·요청 ID·실행 기록 조회", tools:[
    ["datadog","Datadog","로그·트레이스·장애 정보"],
    ["sentry","Sentry","에러 추적·장애 맥락 조회"],
    ["logs-api","사내 로그 API","자체 로그·수집 시스템 연결"],
  ]},
  {title:"코드·이슈·문서", description:"원인 분석·PR 준비·지식 참조", tools:[
    ["github","GitHub","코드·이슈·PR"],
    ["jira","Jira","이슈·작업 관리"],
    ["confluence","Confluence","제품 문서·팀 지식"],
    ["notion","Notion","문서·데이터베이스"],
    ["linear","Linear","이슈·프로젝트"],
  ]},
];

export default function Integrations() {
  return <section className="company-section" aria-labelledby="integrations-title"><div className="wrap">
    <div className="section-heading"><div><p className="overline">INTEGRATIONS / 연동 지원</p><h2 id="integrations-title">문의부터 로그와 코드까지,<br/>지금 쓰는 도구를 연결합니다.</h2></div><p>고객 문의를 받아 관련 로그와 문서를 찾고, 수정안과 답변을 준비하는 데 필요한 도구를 한 흐름으로 연결합니다.</p></div>
    {groups.map(group=><div className={styles.group} key={group.title}><h3>{group.title}</h3><p>{group.description}</p><ul className={styles.grid}>{group.tools.map(([id,name,description])=><li key={id}><div className={styles.card}>
      {(id==="api" || id==="logs-api") ? <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m11 8-8 8 8 8m10-16 8 8-8 8M18 5l-4 22"/></svg> : <img src={`/integrations/${id}.svg`} alt="" width="32" height="32" loading="lazy"/>}
      <strong>{name}</strong><span>{description}</span>
    </div></li>)}</ul></div>)}
    <div className={styles.protocols}><div><h3>MCP · 업무 도구 연결</h3><p>MCP 서버를 제공하는 도구의 정보 조회와 작업 실행을 연결합니다. CS 도구와 사내 로그 시스템은 제공하는 웹훅·API에 맞춰 연결 범위를 정합니다.</p></div><div><h3>A2A · 에이전트 간 협업</h3><p>A2A를 지원하는 에이전트와 작업을 주고받아 처리 흐름을 확장합니다.</p></div></div>
    <p className="small-note">연결 대상의 예시입니다. 실제 연동 범위는 도구의 제공 기능, 인증·접근 권한과 팀의 보안 정책에 맞춰 확인합니다.</p>
    <a className="link-arrow" href="/contact?type=cs-solution">우리 팀 도구로 자동화 진단받기 ↗</a>
  </div></section>;
}
