import type { Metadata } from "next";
import "./globals.css";
import "./company.css";
import {Header, Footer} from "./site-chrome";
export const metadata: Metadata = {title:{default:"lubrAIn | 기술 문의의 조사부터 고객 답변까지",template:"%s | lubrAIn"},description:"API·SaaS 기업의 CS팀과 개발팀을 위한 CS 대응 솔루션. 원인 조사·수정안·검토용 PR을 자동으로 준비하고, 담당자 승인 후 반영·해결 검증·고객 안내까지 이어갑니다.",icons:{icon:"/favicon.svg"},openGraph:{title:"lubrAIn | 반복되는 기술 문의, 조사부터 고객 답변까지",description:"CS팀과 개발팀의 반복 조사를 자동화합니다. 담당자는 변경안과 근거를 검토하고, 승인 후에는 정해진 절차로 해결 검증과 고객 안내를 이어갑니다.",type:"website",locale:"ko_KR"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body><Header/>{children}<Footer/></body></html>}

