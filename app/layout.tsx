import type { Metadata } from "next";
import "./globals.css";
import "./company.css";
import {Header, Footer} from "./site-chrome";
export const metadata: Metadata = {title:{default:"lubrAIn | Agentic AI 기술·컨설팅·솔루션",template:"%s | lubrAIn"},description:"lubrAIn은 기업의 지식과 경험을 업무 성과로 연결하는 Agentic AI 핵심 기술을 개발합니다. 업무에 맞는 컨설팅과 CS 대응 솔루션을 제공합니다.",icons:{icon:"/favicon.svg"},openGraph:{title:"lubrAIn | 지식과 경험을 업무 성과로",description:"업무에 맞는 AI 선택, 정보 활용, 안전한 실행, 경험의 재사용. Agentic AI 컨설팅과 CS 대응 솔루션을 만나보세요.",type:"website",locale:"ko_KR"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body><Header/>{children}<Footer/></body></html>}

