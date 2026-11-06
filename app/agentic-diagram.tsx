"use client";

import {useState} from "react";
import styles from "./agentic-diagram.module.css";

function FlowConnector() {
  return <svg className={styles.connector} width="2" height="24" aria-hidden="true">
    <line className={styles.flow} x1="1" y1="0" x2="1" y2="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
  </svg>;
}

export default function AgenticDiagram() {
  const [paused, setPaused] = useState(false);

  return <figure className={styles.diagram} data-paused={paused} aria-labelledby="agentic-diagram-title" aria-describedby="agentic-diagram-policy">
    <div className={styles.header}>
      <span>lubrAIn / AGENTIC WORKFLOW</span>
      <div className={styles.controls}>
        <span className={styles.dot} aria-hidden="true" />
        <button className={styles.motionToggle} type="button" aria-label={paused ? "다이어그램 애니메이션 재생" : "다이어그램 애니메이션 일시정지"} aria-pressed={paused} title={paused ? "애니메이션 재생" : "애니메이션 일시정지"} onClick={() => setPaused(value => !value)}>
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            {paused ? <path d="M3 1.5 10 6 3 10.5Z" fill="currentColor" /> : <path d="M3.5 2v8M8.5 2v8" stroke="currentColor" strokeWidth="2" />}
          </svg>
        </button>
      </div>
    </div>

    <ul className={styles.inputs} aria-label="업무에 연결하는 정보와 도구">
      <li>문서</li><li>데이터</li><li>시스템</li>
    </ul>
    <FlowConnector />

    <div className={styles.core}>
      <p className={styles.subtitle}>업무를 이해하고 연결하는</p>
      <strong className={styles.title} id="agentic-diagram-title">Agentic AI</strong>
      <div className={styles.process}>
        <ol className={styles.steps} aria-label="자동으로 이어지는 업무 단계">
          { ["업무 목표", "계획", "실행", "검증"].map((step, index) => <li key={step} className={styles.step}>
            {step}{index < 3 && <span className={styles.arrow} aria-hidden="true">→</span>}
          </li>) }
        </ol>
        <div className={styles.feedback}>
          <svg className={styles.loopArrow} viewBox="0 0 100 28" preserveAspectRatio="none" aria-hidden="true">
            <path className={styles.flow} d="M99 1V16Q99 22 94 22H6Q1 22 1 16V4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
          </svg>
          <span className={styles.loopTip} aria-hidden="true" />
          <p className={styles.loopLabel}><span aria-hidden="true">↻ </span>자율 피드백 루프<span className={styles.screenReaderOnly}>: 업무 목표와 검증 결과를 바탕으로 계획과 실행을 조정합니다.</span></p>
        </div>
      </div>
    </div>

    <FlowConnector />
    <div className={styles.result}>
      <span>지식을 바탕으로 판단하고</span>
      <strong>정확한 결과를 확인하여 제공합니다.</strong>
    </div>
    <ul className={styles.policies} aria-label="실행을 지키는 기준">
      <li>안전 규칙</li><li>검토와 승인</li><li>중단과 복구</li>
    </ul>
    <figcaption className={styles.caption} id="agentic-diagram-policy">허용된 작업은 자동으로, 중요한 결정은 사람과 함께 합니다.</figcaption>
  </figure>;
}
