export const inquiryLabels: Record<string, string> = {
  consulting: "Agentic AI 컨설팅",
  "cs-solution": "기술 문의 자동화 솔루션 진단·데모",
  partnership: "기술 협력·기타",
  integration: "API·개발 도구 연결 문제 (기존 분류)",
  support: "반복되는 기술 문의 처리 (기존 분류)",
  "ai-ops": "지원 업무 AI 관리 (기존 분류)",
  other: "그 밖의 도입 문의 (기존 분류)",
};
export const newInquiryTypes = ["cs-solution", "consulting", "partnership"] as const;
export const stages = ["도입 검토 중", "설계·구축 중", "운영·개선 중"];
