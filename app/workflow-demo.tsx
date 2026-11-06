"use client";

import { useEffect, useState } from "react";

const steps = [
  { label: "문의 접수", actor: "자동 처리", status: "새 기술 문의", title: "고객의 문의가 들어오면 바로 작업을 시작합니다", detail: "lubrAIn이 고객의 문의와 요청 ID를 한 작업에 묶고, 조사에 필요한 제품 버전과 실패 기록을 찾기 시작합니다.", outcome: "담당자가 티켓을 열어 조사 순서를 정할 때까지 기다리지 않습니다." },
  { label: "정보 조사", actor: "자동 처리", status: "근거 수집 중", title: "요청 로그와 고객 설정을 자동으로 연결합니다", detail: "요청 ID로 전달 기록을 찾고 고객별 재시도 설정, 제품 버전, 관련 문서를 대조합니다.", outcome: "자료가 여러 곳에 있어도 한 작업 화면에서 근거를 따라갈 수 있습니다." },
  { label: "원인 확인", actor: "자동 처리", status: "오류 재현", title: "실패 조건을 찾고 같은 오류를 재현합니다", detail: "'2초 뒤 재시도'라는 응답이 2밀리초로 처리되는 경로를 확인하고 격리된 환경에서 같은 오류를 재현합니다.", outcome: "추측이 아니라 로그와 재현 결과를 바탕으로 원인을 설명합니다." },
  { label: "수정안·PR", actor: "자동 처리", status: "검토용 PR 준비", title: "수정안과 테스트를 만들고 PR까지 준비합니다", detail: "격리된 작업 공간에서 시간 단위 처리 코드를 고치고 재발 확인 테스트를 실행합니다. 변경 내용과 테스트 결과를 검토용 PR로 묶습니다.", outcome: "담당자는 조사 과정을 반복하지 않고 근거가 담긴 PR을 검토합니다." },
  { label: "PR 승인", actor: "담당자 1회", status: "담당자 승인 대기", title: "담당자는 준비된 PR을 한 번 검토합니다", detail: "변경 파일, 재현 결과, 테스트와 영향 범위를 보고 승인 여부를 결정합니다. 이 승인 전에는 실제 서비스에 수정안을 반영하지 않습니다.", outcome: "이 시나리오에서는 PR 승인 한 번으로 이후 자동 처리가 이어집니다." },
  { label: "수정 반영", actor: "승인 후 자동", status: "승인된 절차 실행", title: "승인된 수정안을 정해진 절차로 반영합니다", detail: "PR 승인 신호를 받으면 고객이 허용한 병합·배포 절차를 이어갑니다. 실패하면 중단하고 담당자에게 원인과 진행 상태를 알립니다.", outcome: "승인 뒤에도 담당자가 여러 도구를 옮겨 다니며 다음 작업을 지시하지 않습니다." },
  { label: "해결 검증", actor: "승인 후 자동", status: "문제 해결 확인", title: "같은 고객 조건으로 해결 여부를 다시 확인합니다", detail: "처음 실패한 요청 조건으로 웹훅을 다시 보내고, 재시도 간격과 전달 결과를 비교합니다. 예상과 다르면 문의를 완료로 표시하지 않습니다.", outcome: "코드 변경과 실제 문제 해결을 별개의 확인 단계로 다룹니다." },
  { label: "고객 안내", actor: "승인 후 자동", status: "문의 처리 완료", title: "확인한 결과를 고객에게 알리고 문의를 마칩니다", detail: "승인된 안내 정책에 따라 원인, 조치, 확인 결과를 고객에게 전달하고 해결 기록을 남깁니다. 고객의 추가 응답이 오면 같은 작업에 이어 붙입니다.", outcome: "접수부터 고객 안내까지 한 건의 기록으로 남고, 확인된 해결 절차는 다음 문의에 활용합니다." },
] as const;

function CaseArtifact({ active }: { active: number }) {
  return <div className="case-artifact" aria-label="가상 문의의 단계별 제품 화면">
    <div className="case-artifact-bar"><span>CASE-2026-0142 <b>·</b> 웹훅 전달 실패</span><span>시연용 가상 데이터</span></div>
    {active === 0 && <div className="case-artifact-content">
      <div className="case-artifact-meta"><span>고객 A</span><span>기술 문의</span><span>API v2.4.1</span><span>접수 09:18</span></div>
      <div className="case-message"><span className="case-avatar">고객</span><div><strong>결제 완료 웹훅이 오늘 아침부터 누락됩니다.</strong><p>"저희 수신 주소는 정상입니다. 재전송을 눌러도 같은 건만 실패해요. 요청 ID <code>demo_req_7C21</code>을 확인해 주실 수 있나요? 다른 이벤트의 알림은 도착하고 있습니다."</p><small>고객이 제공한 내용 · 예시</small></div></div>
      <div className="case-next"><span>lubrAIn이 확인할 항목</span><p>요청 ID의 전달 기록, 고객별 재시도 설정, 해당 버전의 웹훅 처리 경로</p></div>
    </div>}
    {active === 1 && <div className="case-artifact-content">
      <div className="case-artifact-meta"><span>요청 ID demo_req_7C21</span><span>설정과 로그 연결됨</span></div>
      <div className="case-log"><div className="case-log-head"><span>시간</span><span>전달 기록</span><span>결과</span></div><div><span>09:14:22.000</span><span>POST /payment.created</span><b>HTTP 429</b></div><div><span>09:14:22.002</span><span>Retry-After: 2 응답 수신</span><b>재시도 예약</b></div><div><span>09:14:22.004</span><span>같은 요청 재전송</span><b>HTTP 429</b></div></div>
      <div className="case-source"><span>연결한 근거</span><p>고객별 재시도 설정: 사용 · 제품 코드: v2.4.1 · 문서: 웹훅 재시도 정책 v2</p></div>
    </div>}
    {active === 2 && <div className="case-artifact-content">
      <div className="case-artifact-meta"><span>원인 분석</span><span>격리된 환경에서 재현</span></div>
      <div className="case-compare"><div><small>수신 서버의 의도</small><strong>2초 뒤 재시도</strong><code>Retry-After: 2</code></div><span aria-hidden="true">→</span><div className="case-error"><small>현재 처리 결과</small><strong>2ms 뒤 재시도</strong><code>custom retry 경로의 단위 변환 누락</code></div></div>
      <div className="case-next"><span>확인한 사실</span><p>같은 설정으로 재현하면 제한이 풀리기 전에 재전송됩니다. 원인 후보를 코드 경로와 테스트 결과로 좁혔습니다.</p></div>
    </div>}
    {(active === 3 || active === 4) && <div className="case-artifact-content">
      <div className="case-artifact-meta"><span>검토용 PR · 예시</span><span>{active === 3 ? "lubrAIn이 자동 생성" : "담당자 승인 대기"}</span></div>
      <div className="case-pr"><div className="case-pr-head"><strong>fix: Retry-After 시간 단위 처리</strong><span>{active === 3 ? "테스트 완료" : "승인 요청"}</span></div><p>src/webhooks/retry-policy.ts</p><code><span className="case-diff-old">- return Number(retryAfter);</span><span className="case-diff-new">+ return parseRetryAfterToMs(retryAfter, now);</span></code><div className="case-test">재발 확인 테스트 · 2초 응답은 2000ms 뒤 재시도 · 날짜 형식도 확인</div></div>
      {active === 4 && <div className="case-next"><span>담당자가 한 번 결정</span><p>PR과 테스트 결과를 검토합니다. 아래 버튼은 시나리오 재생용이며 실제 승인을 기록하지 않습니다.</p></div>}
    </div>}
    {active === 5 && <div className="case-artifact-content">
      <div className="case-artifact-meta"><span>PR 승인됨 · 예시</span><span>승인된 배포 절차 진행</span></div>
      <div className="case-runbook"><div><span className="case-check">✓</span><strong>검토된 변경안 반영</strong><small>승인된 PR을 기존 배포 절차에 연결</small></div><div><span className="case-check">✓</span><strong>배포 상태 확인</strong><small>실패 시 중단하고 담당자에게 알림</small></div><div><span className="case-check">●</span><strong>고객별 재전송 준비</strong><small>원래 실패한 요청 조건을 다시 사용</small></div></div>
    </div>}
    {active === 6 && <div className="case-artifact-content">
      <div className="case-artifact-meta"><span>문제 해결 검증</span><span>같은 고객 조건 재확인</span></div>
      <div className="case-compare"><div className="case-error"><small>수정 전</small><strong>2ms 뒤 재시도</strong><code>429 → 즉시 재시도 → 429</code></div><span aria-hidden="true">→</span><div><small>수정 후 · 시연 결과</small><strong>2초 뒤 재시도</strong><code>429 → 대기 → 전달 확인</code></div></div>
      <div className="case-next"><span>완료 판단 조건</span><p>원래 실패한 요청의 재전송 결과와 재발 확인 테스트가 모두 확인돼야 다음 단계로 갑니다. 실패하면 문의는 열린 상태로 남습니다.</p></div>
    </div>}
    {active === 7 && <div className="case-artifact-content">
      <div className="case-artifact-meta"><span>고객 안내 · 예시</span><span>문의 처리 완료</span></div>
      <div className="case-message"><span className="case-avatar">lubrAIn</span><div><strong>웹훅 알림 누락 건 처리 결과</strong><p>"요청 <code>demo_req_7C21</code>의 실패 원인은 재시도 시간 해석 오류였습니다. 수정 반영 후 같은 조건에서 알림 전달을 확인했습니다. 재발 여부를 확인할 테스트도 추가했습니다. 추가로 확인이 필요하면 이 문의에 답장해 주세요."</p><small>승인된 발송 정책을 적용한 자동 고객 안내 예시</small></div></div>
      <div className="case-next"><span>남는 기록</span><p>문의 원문 → 조사 근거 → PR 승인 → 배포·검증 결과 → 고객 안내가 한 건에 연결됩니다.</p></div>
    </div>}
  </div>;
}

export default function WorkflowDemo() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = document.getElementById("workflow-demo");
    if (!section) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !reducedMotion.matches) {
        setVisible(true);
        setPlaying(true);
        observer.disconnect();
      }
    }, { threshold: 0.25 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return;
    if (active === 4 || active === steps.length - 1) {
      setPlaying(false);
      return;
    }
    const timer = window.setInterval(() => setActive(current => current + 1), 4700);
    return () => window.clearInterval(timer);
  }, [playing, visible, active]);

  const step = steps[active];
  return <section className="workflow-demo section" id="workflow-demo" aria-labelledby="workflow-demo-title">
    <div className="wrap">
      <div className="workflow-heading"><div><p className="section-kicker">시연: 한 건의 문의, 한 번의 승인</p><h2 id="workflow-demo-title">접수부터 고객 안내까지,<br/>에이전트가 일을 이어갑니다.</h2></div><p>문의가 들어오면 조사, 원인 확인, 수정안과 검토용 PR까지 자동으로 진행합니다. 담당자가 PR을 승인하면 정해진 절차에 따라 수정 반영, 해결 확인, 고객 안내로 이어집니다.</p></div>
      <div className="workflow-promise" aria-label="자동 처리와 승인 지점"><span>자동 조사·원인 확인·PR 준비</span><b aria-hidden="true">→</b><span className="workflow-promise-human">담당자 PR 승인 1회</span><b aria-hidden="true">→</b><span>자동 반영·검증·고객 안내</span></div>
      <div className="workflow-shell">
        <div className="workflow-toolbar"><div><span className="workflow-pulse" aria-hidden="true"/> {active === 4 ? "담당자 PR 승인 대기" : active === 7 ? "고객 안내까지 완료" : "에이전트 자동 처리 중"} <span className="workflow-sim-tag">설명용 가상 화면</span></div><div className="workflow-controls"><span>{String(active + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span><button type="button" onClick={() => { setVisible(true); if (active === 7) { setActive(0); setPlaying(true); } else if (active === 4) { setActive(5); setPlaying(true); } else setPlaying(value => !value); }} aria-label={active === 7 ? "시나리오 다시 보기" : active === 4 ? "시연에서 PR 승인 후 계속" : playing ? "자동 재생 일시정지" : "자동 재생 시작"}>{active === 7 ? "다시 보기 ↺" : active === 4 ? "승인 후 계속 ▶" : playing ? "일시정지 Ⅱ" : "자동 재생 ▶"}</button></div></div>
        <div className="workflow-progress" aria-hidden="true"><span style={{ width: `${((active + 1) / steps.length) * 100}%` }}/></div>
        <div className="workflow-layout"><ol className="workflow-steps" aria-label="문의 처리 기록">{steps.map((item, index) => <li key={item.label}><button type="button" className={`${index === active ? "is-active" : ""} ${index === 4 ? "is-gate" : ""}`} aria-current={index === active ? "step" : undefined} onClick={() => { setActive(index); setPlaying(false); setVisible(true); }}><span className="workflow-step-num">{String(index + 1).padStart(2, "0")}</span><span>{item.label}<small>{item.actor}</small></span><span className="workflow-step-mark" aria-hidden="true">{index < active ? "✓" : index === active ? "●" : "○"}</span></button></li>)}</ol>
          <div className="workflow-detail" key={active}><div className="workflow-detail-top"><span>고객 A · 웹훅 알림 실패</span><span className={active === 4 ? "workflow-status human" : "workflow-status"}>{step.status}</span></div><p className="workflow-detail-kicker">{step.actor} / {step.label}</p><h3>{step.title}</h3><p className="workflow-detail-body">{step.detail}</p><CaseArtifact active={active}/><div className="workflow-insight"><span>이 단계의 의미</span><p>{step.outcome}</p></div>{active === 4 && <button className="workflow-continue" type="button" onClick={() => { setActive(5); setPlaying(true); }}>시연에서 PR 승인 후 자동 처리 보기 ↗</button>}</div></div>
        <div className="workflow-footer"><span>자동 조사 → 자동 수정안·PR → 담당자 승인 → 자동 반영 → 해결 검증 → 고객 안내</span><span>자동 실행과 추가 승인 범위는 고객 정책에 따르며, 예외 상황은 담당자에게 인계합니다.</span></div>
      </div>
      <div className="workflow-after"><p>실제 고객 사례나 실제 제품 캡처는 아닙니다. lubrAIn의 업무 흐름을 이해하기 위한 예시입니다.</p><a href="/solutions/cs/use-cases">다른 활용 사례 보기 ↗</a></div>
    </div>
  </section>;
}
