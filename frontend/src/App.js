import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import InputPage from './InputPage';
import ResultPage from './ResultPage';
import Mypage from './MyPage';
import LoginPage from './LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// CSS 스타일을 여기에 통합합니다.
const GlobalStyles = () => (
  <style>{`
    /* src/index.css */
    @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

    body {
      margin: 0;
      font-family: 'Roboto', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a {
      text-decoration: none;
      color: inherit;
    }

    .container {
      width: 100%;
      max-width: 1280px;
      margin-left: auto;
      margin-right: auto;
      padding-left: 1.5rem; /* 24px */
      padding-right: 1.5rem; /* 24px */
      box-sizing: border-box;
    }

    /* src/App.module.css */
    .appContainer {
      min-height: 100vh;
      background-image: linear-gradient(to bottom right, #EFF6FF, white);
    }

    /* src/components/Header.module.css */
    .header {
      background-color: white;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .header-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }

    .header-logo {
      font-family: 'Pacifico', cursive;
      font-size: 1.5rem;
      color: #2563EB;
    }

    .header-nav {
      display: flex; /* 데스크톱에서 항상 표시 */
      gap: 2rem;
    }
    
    @media (max-width: 768px) {
      .header-nav {
        display: none; /* 모바일에서 숨김 */
      }
      
      .header-buttonGroup {
        display: none; /* 모바일에서 숨김 */
      }
      
      .header-menuButton {
        display: block; /* 모바일에서 표시 */
        background: none;
        border: none;
        cursor: pointer;
        color: #374151;
      }
    }
    
    @media (min-width: 769px) {
      .header-menuButton {
        display: none; /* 데스크톱에서 숨김 */
      }
    }

    .header-navLink {
      color: #374151;
      transition: color 0.2s ease-in-out;
      font-weight: 500;
    }

    .header-navLink:hover {
      color: #2563EB;
    }

    .header-buttonGroup {
      display: flex; /* 데스크톱에서 항상 표시 */
      align-items: center;
      gap: 1rem;
    }

    .header-loginButton {
      color: #374151;
      white-space: nowrap;
      cursor: pointer;
      font-weight: 500;
    }
    .header-loginButton:hover {
      color: #2563EB;
    }

    .header-signupButton {
      background-color: #2563EB;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      white-space: nowrap;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
      font-weight: 500;
    }
    .header-signupButton:hover {
      background-color: #1D4ED8;
    }

    .header-menuButton {
      cursor: pointer;
      border: none;
      background: none;
      padding: 0.5rem;
    }

    /* Medium screens and up */
    @media (min-width: 768px) {
      .header-nav, .header-buttonGroup {
        display: flex;
      }
      .header-menuButton {
        display: none;
      }
    }

    /* MainPage.module.css */
    .section {
      padding-top: 5rem;
      padding-bottom: 5rem;
    }

    .textCenter {
      text-align: center;
    }

    .title {
      font-size: 2.25rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.25rem;
      color: #4b5563;
    }

    .grid {
      display: grid;
      gap: 2rem;
    }

    @media (min-width: 768px) {
      .grid-3-cols {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    
    .heroSection {
      position: relative;
      min-height: 95vh;
      display: flex;
      align-items: center;
      color: white;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-attachment: fixed;
    }

    .heroContent {
      max-width: 50rem;
      text-align: center;
    }

    .heroStats {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
    }

    .statItem {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 1rem 1.5rem;
      border-radius: 1rem;
      text-align: center;
      min-width: 120px;
    }

    .statNumber {
      font-size: 1.125rem;
      font-weight: 700;
      color: #FBBF24;
      margin-bottom: 0.25rem;
    }

    .statLabel {
      font-size: 0.875rem;
      color: #E5E7EB;
      font-weight: 500;
    }

    .heroTitle {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      line-height: 1.1;
      text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
    }

    .heroTitleHighlight {
      color: #FBBF24;
      background: linear-gradient(45deg, #FBBF24, #F59E0B);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .heroTitleAccent {
      color: #E0E7FF;
    }

    .heroSubtitle {
      font-size: 1.375rem;
      margin-bottom: 2.5rem;
      color: #E5E7EB;
      line-height: 1.6;
      max-width: 45rem;
      margin-left: auto;
      margin-right: auto;
    }

    .heroTrustBadges {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 2.5rem;
      flex-wrap: wrap;
    }

    .trustBadge {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .buttonWrapper {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      align-items: center;
      justify-content: center;
    }

    .primaryButton, .secondaryButton {
      padding: 1rem 2rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 1.125rem;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      border: 2px solid transparent;
    }

    .primaryButton {
      background-color: white;
      color: #2563EB;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
      text-align: center;
    }

    .primaryButton:hover {
      background-color: #F9FAFB;
      transform: translateY(-2px);
    }

    .secondaryButton {
      border-color: white;
      color: white;
      background-color: transparent;
    }

    .secondaryButton:hover {
      background-color: white;
      color: #2563EB;
    }

    @media (min-width: 640px) {
      .buttonWrapper {
        flex-direction: row;
        justify-content: center;
        align-items: center;
      }
    }

    @media (min-width: 768px) {
      .heroTitle {
        font-size: 3.75rem;
      }
      .heroSubtitle {
        font-size: 1.5rem;
      }
    }

    .featuresSection {
      background-color: white;
    }

    .featuresHeader {
      margin-bottom: 4rem;
      max-width: 42rem;
      margin-left: auto;
      margin-right: auto;
    }

    .featureCard {
      padding: 2rem;
      border-radius: 1.5rem;
      text-align: center;
      position: relative;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      overflow: hidden;
    }

    .featureCard.enhanced {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
    }

    .featureCard.enhanced:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .featureHighlight {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(59, 130, 246, 0.9);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }

    .iconWrapper {
      width: 5rem;
      height: 5rem;
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      position: relative;
    }

    .iconWrapper.enhanced {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .iconWrapper.enhanced::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 2px;
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.3), transparent);
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: exclude;
    }

    .cardTitle {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .cardTitle.enhanced {
      font-weight: 700;
      background: linear-gradient(135deg, #1f2937, #4b5563);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .cardDescription {
      color: #4b5563;
      line-height: 1.6;
    }

    .cardDescription.enhanced {
      font-weight: 500;
    }

    .featureArrow {
      margin-top: 1.5rem;
      font-size: 1.5rem;
      color: #3B82F6;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .featureCard.enhanced:hover .featureArrow {
      opacity: 1;
    }

    .statsSection {
      background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
      position: relative;
    }

    .statsSection::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%233B82F6' fill-opacity='0.02'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zM30 10c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E");
    }

    .statsHeader {
      margin-bottom: 4rem;
      position: relative;
      z-index: 1;
    }

    .grid-4-cols {
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    }

    @media (min-width: 768px) {
      .grid-4-cols {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .statCard {
      background: white;
      padding: 2.5rem 2rem;
      border-radius: 1.5rem;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(148, 163, 184, 0.1);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .statCard::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #3B82F6, #10B981, #F59E0B, #EF4444);
    }

    .statCard:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }

    .statIcon {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .statNumber {
      font-size: 2.5rem;
      font-weight: 800;
      color: #1F2937;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #3B82F6, #10B981);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .statLabel {
      font-size: 1.25rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 0.75rem;
    }

    .statDescription {
      color: #6B7280;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .ctaSection {
      background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 50%, #10B981 100%);
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .ctaSection::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      animation: float 20s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    .ctaContent {
      position: relative;
      z-index: 1;
    }

    .ctaStats {
      display: flex;
      justify-content: center;
      gap: 3rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .ctaStatItem {
      text-align: center;
    }

    .ctaStatNumber {
      font-size: 2rem;
      font-weight: 800;
      color: #FBBF24;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .ctaStatLabel {
      font-size: 1rem;
      color: #E5E7EB;
      font-weight: 500;
    }

    .ctaTitle {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 2rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .ctaSubtitle {
      font-size: 1.375rem;
      margin-bottom: 3rem;
      color: #E5E7EB;
      max-width: 42rem;
      margin-left: auto;
      margin-right: auto;
      line-height: 1.6;
    }

    .ctaButtonGroup {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .ctaButton {
      padding: 1.25rem 2.5rem;
      border-radius: 1rem;
      font-weight: 700;
      font-size: 1.125rem;
      display: inline-block;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      min-width: 200px;
      text-align: center;
    }

    .ctaButton.primary {
      background: linear-gradient(135deg, #FBBF24, #F59E0B);
      color: #1F2937;
      box-shadow: 0 10px 25px rgba(251, 191, 36, 0.4);
    }

    .ctaButton.primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(251, 191, 36, 0.5);
      background: linear-gradient(135deg, #F59E0B, #D97706);
    }

    .ctaButton.secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-color: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .ctaButton.secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-3px);
    }

    .ctaFeatures {
      display: flex;
      justify-content: center;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .ctaFeature {
      font-size: 0.875rem;
      color: #D1D5DB;
      font-weight: 500;
    }

    /* src/components/Footer.module.css */
    .footer {
      background-color: #1f2937;
      color: white;
      padding: 3rem 0;
    }

    .footer-grid {
      display: grid;
      gap: 2rem;
    }

    .footer-logo {
      font-family: 'Pacifico', cursive;
      font-size: 1.5rem;
      color: #60A5FA;
      margin-bottom: 1rem;
    }

    .footer-description {
      color: #D1D5DB;
    }

    .footer-columnTitle {
      font-weight: 600;
      margin-bottom: 1rem;
      color: #9CA3AF;
      text-transform: uppercase;
      font-size: 0.875rem;
    }

    .footer-linkList {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-linkItem a {
      color: #D1D5DB;
      transition: color 0.2s ease-in-out;
    }

    .footer-linkItem a:hover {
      color: #60A5FA;
    }

    .footer-contactItem {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .footer-copyright {
      border-top: 1px solid #4B5563;
      margin-top: 2rem;
      padding-top: 2rem;
      text-align: center;
      color: #D1D5DB;
    }

    @media (min-width: 768px) {
      .footer-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  `}</style>
);

// 아이콘을 SVG 컴포넌트로 대체합니다.
const RiPhoneLine = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 16.42V19.9561C21 20.4862 20.5551 20.9561 20.0249 20.9561C18.6013 20.9447 17.1893 20.6886 15.8404 20.1956C10.2922 18.1863 5.81367 13.7078 3.80437 8.15961C3.31137 6.81071 3.0553 5.39868 3.0439 3.97511C3.0439 3.44492 3.51384 3 4.04394 3H7.5801C7.83678 3 8.07818 3.1111 8.24915 3.29878C8.42012 3.48645 8.5034 3.74337 8.47551 4.00441L8.01551 8.00441C7.97819 8.3443 7.7336 8.62181 7.40496 8.72667L5.63116 9.27333C6.69533 11.5304 8.46959 13.3047 10.7267 14.3688L11.2734 12.595C11.3782 12.2664 11.6557 12.0218 11.9956 11.9845L15.9956 11.5245C16.2566 11.4966 16.5136 11.5799 16.7012 11.7509C16.8889 11.9218 17 12.1632 17 12.42V16.42C17 16.5858 16.9315 16.7447 16.8096 16.8665C16.6878 16.9884 16.5288 17.0569 16.363 17.0569H16.36C16.2016 17.0569 16.0461 17.0249 15.9 16.963C13.133 15.9042 10.8123 14.1377 8.94301 11.9569C7.07375 9.77607 5.76734 7.24013 5.13801 4.5H5.13601C5.07412 4.35391 5.04212 4.19836 5.04212 4.04001V4.03801H5.04112C5.04112 3.88149 5.07252 3.72754 5.13242 3.58307C5.89227 1.52104 7.41141 0.0438843 9.40854 0.0438843C9.55168 0.0438843 9.69336 0.0631686 9.8301 0.100502L9.83209 0.100502C10.2448 0.218502 10.5847 0.499835 10.7516 0.884168L11.2116 1.88417C11.3215 2.13117 11.2469 2.42517 11.0336 2.6025L9.63143 3.80472C9.44393 3.96672 9.18826 4.01139 8.95826 3.91805C8.32226 3.68672 7.66893 3.52139 7.00226 3.42805V3.42706C6.91893 3.41406 6.8316 3.40606 6.74326 3.40339H6.74226C6.16093 3.38339 5.58626 3.46539 5.03126 3.64406C4.9616 3.66939 4.8876 3.69406 4.8116 3.71672C4.7896 3.72339 4.7676 3.73006 4.74626 3.73672L4.74526 3.73739C4.60893 3.78139 4.49493 3.88472 4.44426 4.02072C4.4316 4.05939 4.42226 4.09939 4.41626 4.14006C4.38526 4.36139 4.41026 4.58806 4.48826 4.80206C5.22826 6.94939 6.47893 8.90139 8.1696 10.5921C9.86026 12.2827 11.8123 13.5334 13.9596 14.2734C14.1736 14.3514 14.3996 14.3767 14.6216 14.3454C14.6623 14.3394 14.7023 14.3301 14.7409 14.3174C14.8776 14.2667 14.9809 14.1527 15.0249 14.0164L15.0256 14.0154C15.0323 13.9941 15.0389 13.9721 15.0456 13.9501C15.0683 13.8741 15.093 13.8001 15.1183 13.7304C15.297 13.1754 15.379 12.6007 15.359 12.0194H15.358C15.3553 11.9311 15.3473 11.8437 15.3343 11.7604C15.241 11.1937 15.0756 10.5394 14.8443 9.90439C14.751 9.67439 14.7956 9.41872 14.9576 9.23122L16.1599 7.82905C16.3372 7.61572 16.6312 7.54105 16.8782 7.65105L17.8782 8.11105C18.2626 8.27798 18.5439 8.61792 18.6619 9.03065L18.6619 9.03265C18.6993 9.16938 18.7185 9.31105 18.7185 9.45419C18.7185 11.4513 17.2414 13.0285 15.2414 13.0285H15.2394C15.1511 13.0285 15.0637 13.0205 14.9764 13.0075C14.4104 12.9145 13.8581 12.7495 13.3261 12.5185C13.0961 12.4155 12.8404 12.4595 12.6524 12.6225L12.0404 13.1425C11.9034 13.2585 11.8214 13.4285 11.8214 13.6085V14.5885C11.8214 14.7125 11.8794 14.8285 11.9764 14.9035L12.9864 15.7425C13.1364 15.8675 13.3324 15.9085 13.5124 15.8425C14.9644 15.3125 16.3114 14.5385 17.5264 13.5505C18.7414 12.5625 19.8054 11.3725 20.6974 10.0155C20.8174 9.82348 21 9.58848 21 9.34248V7.5801C21 6.00293 19.7522 4.75516 18.175 4.75516C17.929 4.75516 17.694 4.83516 17.502 4.95516L16.0998 5.95738C15.9224 6.07138 15.7004 6.10138 15.4974 6.03838C14.2024 5.61338 12.8314 5.42938 11.4544 5.50338C11.3104 5.51238 11.1704 5.52838 11.0334 5.55238C10.6184 5.62638 10.2184 5.75338 9.83241 5.93038C9.71841 5.98238 9.59141 6.00338 9.46441 5.99138C9.27341 5.97338 9.09841 5.87738 8.98441 5.72738L8.14541 4.71738C8.07041 4.62038 7.95441 4.56238 7.83041 4.56238H4.04394C4.04195 4.56238 4.04095 4.56238 4.03895 4.56238C4.03695 4.56238 4.03495 4.56238 4.03295 4.56338C4.60628 6.05971 5.43228 7.46404 6.48295 8.73738C8.25495 10.8907 10.5183 12.6074 13.0903 13.7517C14.0303 14.1817 15.0023 14.5051 16.0003 14.7171V16.42H16.363C17.0694 16.42 17.651 15.8384 17.651 15.132V12.42C17.651 12.3386 17.625 12.2591 17.5774 12.1931C17.5298 12.1271 17.4638 12.0789 17.388 12.056L13.388 12.516C13.3003 12.5422 13.2281 12.5973 13.1856 12.6718L12.639 14.4456C12.558 14.6976 12.306 14.8426 12.045 14.7866C9.91164 14.2826 8.01231 13.0803 6.46931 11.3113C4.92631 9.54231 3.79131 7.29497 3.19997 4.80231C3.15764 4.63297 3.15697 4.45331 3.19797 4.28164C3.28497 3.91497 3.59397 3.65131 3.96197 3.60931C5.39897 3.42897 6.85331 3.55431 8.25997 3.97931C8.42931 4.03164 8.61464 3.98197 8.73464 3.84364L10.1368 2.64143C10.1843 2.59976 10.2215 2.54943 10.2461 2.49376L9.78615 1.49376C9.74348 1.40009 9.65881 1.33276 9.56215 1.31109C9.09148 1.20443 8.60815 1.14609 8.12148 1.14109H8.12048C6.39448 1.14109 4.88848 2.43109 4.64148 4.14109C4.61581 4.32576 4.61581 4.51309 4.64148 4.69776C5.20148 7.05976 6.26248 9.21509 7.74548 11.0471C9.22848 12.8791 11.1011 14.3544 13.2165 15.3681C14.0105 15.7491 14.8325 16.0351 15.6775 16.2221C15.7364 16.2365 15.7958 16.2558 15.8555 16.2798C15.9025 16.2985 15.9475 16.3191 15.9905 16.3418H15.9915C16.0825 16.3818 16.1755 16.4118 16.2695 16.4298C16.2845 16.4328 16.2995 16.4358 16.3145 16.4378C16.3295 16.4398 16.3455 16.4418 16.3605 16.4428H16.363C16.364 16.4428 16.365 16.4428 16.366 16.4428C18.2313 16.4428 19.721 14.9531 19.721 13.0878C19.721 12.9265 19.689 12.7681 19.627 12.6181L19.568 12.4841C19.43 12.1601 19.143 11.9421 18.803 11.9081L14.803 11.4481C14.7147 11.4374 14.6287 11.4514 14.551 11.4881L14.0044 13.2619C13.9234 13.5139 13.6714 13.6589 13.4104 13.5929C11.3954 13.1169 9.58541 11.9969 8.08541 10.3019C6.58541 8.60691 5.46541 6.79691 5.00541 4.78191C4.93941 4.52091 5.08441 4.26891 5.33641 4.18791L7.11016 3.64124C7.18466 3.61574 7.24686 3.56524 7.28816 3.49774L7.74816 -0.502262C7.79083 -0.576762 7.85716 -0.636962 7.93783 -0.674295C7.68883 -0.725295 7.43083 -0.755295 7.16683 -0.755295H3.63068C1.86968 -0.755295 0.424805 0.690595 0.424805 2.45159C0.436205 3.87517 0.692272 5.28719 1.18527 6.63609C3.19457 12.1843 7.67311 16.6628 13.2213 18.6721C14.5702 19.1651 15.9822 19.4212 17.4058 19.4098C18.9188 19.3971 20.4135 19.0804 21.8302 18.4721C22.1002 18.3521 22.2812 18.0921 22.2812 17.8021V14.2659C22.2812 14.0076 22.1691 13.7662 21.9814 13.5952C21.7938 13.4242 21.5368 13.3409 21.2758 13.3688L17.2758 13.8288C16.9359 13.8661 16.6584 14.1107 16.5536 14.4393L16.0069 16.2131C15.9259 16.4651 15.6739 16.6101 15.4129 16.5441C12.9009 15.9141 10.6949 14.5881 8.94301 12.5901C7.19112 10.5921 5.86512 8.38609 5.23512 5.87409C5.16912 5.61309 5.31412 5.36109 5.56612 5.28009L7.33987 4.73343C7.61087 4.64743 7.79887 4.39843 7.82887 4.11643L8.28887 0.116428C8.31887 -0.165572 8.13087 -0.414572 7.85987 -0.500572L7.5801 -0.580295C7.32342 -0.660295 7.04202 -0.686295 6.77002 -0.655295C3.42302 -0.249295 0.651001 2.5227 0.651001 5.8697C0.639601 7.40527 0.920935 8.92894 1.469001 10.3681C3.593001 16.2901 8.38534 21.0824 14.3073 23.2064C15.7466 23.7545 17.2703 24.0358 18.8058 24.0244C20.5758 24.011 22.3241 23.6064 23.9408 22.8244C24.2568 22.6864 24.4628 22.3924 24.4628 22.0464V16.42C24.4628 16.1617 24.3507 15.9203 24.163 15.7493C23.9754 15.5783 23.7184 15.495 23.4574 15.5229L19.4574 15.9829C19.1175 16.0202 18.84 16.2648 18.7352 16.5934L18.1885 18.3672C18.1075 18.6192 17.8555 18.7642 17.5945 18.6982C15.4195 18.1142 13.4885 16.9282 11.9055 15.2532C10.3225 13.5782 9.1365 11.4472 8.5525 9.2722C8.4865 9.0112 8.6315 8.7592 8.8835 8.6782L10.6573 8.13153C10.9283 8.04553 11.1163 7.79653 11.1463 7.51453L11.6063 3.51453C11.6363 3.23253 11.4483 2.98353 11.1773 2.89753L10.8975 2.8178C10.6409 2.7378 10.3595 2.7118 10.0875 2.7428C7.1075 3.1118 4.5615 5.4888 4.5615 8.5288C4.5491 9.87346 4.79313 11.2065 5.2815 12.4688C7.1135 17.5318 11.4682 21.8865 16.5312 23.7185C17.7935 24.2069 19.1265 24.4509 20.4712 24.4385C21.8382 24.4259 23.1908 24.1189 24.4612 23.5285C24.7572 23.3935 24.9562 23.1025 24.9562 22.7725V16.42C24.9562 16.126 24.8382 15.852 24.6392 15.653C24.4402 15.454 24.1662 15.336 23.8722 15.354L19.8722 15.634C19.5323 15.6573 19.2548 15.8848 19.15 16.2048L18.593 17.9785C18.512 18.2305 18.26 18.3755 18.009 18.3095C14.029 17.2155 10.784 13.9705 9.69001 9.99053C9.62401 9.72953 9.76901 9.47753 10.021 9.39653L11.7948 8.84986C12.0658 8.76386 12.2538 8.51486 12.2838 8.23286L12.7438 4.23286C12.7738 3.95086 12.5858 3.70186 12.3148 3.61586L12.035 3.53614C11.7784 3.45614 11.497 3.43014 11.225 3.46114C7.878 3.86714 5.106 6.63914 5.106 9.98614C5.0946 11.4198 5.35067 12.8318 5.84367 14.1807C7.85297 19.7289 12.3315 24.2074 17.8797 26.2167C19.2286 26.7097 20.6406 26.9658 22.0642 26.9544C23.2842 26.9437 24.4945 26.7404 25.6502 26.3527C25.9522 26.2507 26.1692 25.9867 26.1692 25.6667V21H21V16.42Z"></path></svg>;
const RiMailLine = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2.9918 21.0002C2.44395 21.0002 2 20.5562 2 20.0084V3.9918C2 3.44395 2.44395 3 2.9918 3H21.0082C21.556 3 22 3.44395 22 3.9918V20.0082C22 20.556 21.556 21 21.0082 21H2.9918V21.0002ZM4 5V19H20V5H4ZM5.23267 6H18.7673L12.3571 11.3123C12.1618 11.4792 11.8382 11.4792 11.6429 11.3123L5.23267 6ZM4.3992 18.5284L9.93244 13.9951L4.40051 8.46319L4.3992 18.5284ZM19.6008 18.5284V8.46319L14.0676 13.9951L19.6008 18.5284ZM10.6191 14.6818L11.7858 15.6571C11.9052 15.7571 12.0948 15.7571 12.2142 15.6571L13.3809 14.6818L18.9142 19.2151H5.08585L10.6191 14.6818Z"></path></svg>;
const RiMenuLine = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>;
const RiHealthBookLine = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 2.00012H4C3.44772 2.00012 3 2.44784 3 3.00012V21.0001C3 21.5524 3.44772 22.0001 4 22.0001H20C20.5523 22.0001 21 21.5524 21 21.0001V3.00012C21 2.44784 20.5523 2.00012 20 2.00012ZM19 4.00012V13.0001H5V4.00012H19ZM5 20.0001V15.0001H19V20.0001H5ZM12 11.0001C12.5523 11.0001 13 10.5524 13 10.0001V8.00012H15C15.5523 8.00012 16 7.5524 16 7.00012C16 6.44784 15.5523 6.00012 15 6.00012H13V4.00012C13 3.44784 12.5523 3.00012 12 3.00012C11.4477 3.00012 11 3.44784 11 4.00012V6.00012H9C8.44772 6.00012 8 6.44784 8 7.00012C8 7.5524 8.44772 8.00012 9 8.00012H11V10.0001C11 10.5524 11.4477 11.0001 12 11.0001Z"></path></svg>;
const RiRestaurantLine = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21.9999 13.0001V21.0001H19.9999V13.0001H21.9999ZM12.9999 13.0001V21.0001H10.9999V13.0001H12.9999ZM21.9999 3.00012V11.0001H19.9999V3.00012H21.9999ZM12.9999 3.00012V11.0001H10.9999V3.00012H12.9999ZM5.41394 13.0001L4.00002 21.0001H2L3.41392 13.0001H5.41394ZM8.99991 3.00012C10.1045 3.00012 10.9999 3.89554 10.9999 5.00012V11.0001H6.99991V5.00012C6.99991 3.89554 7.89533 3.00012 8.99991 3.00012ZM18.9999 3.00012C19.5522 3.00012 19.9999 3.44784 19.9999 4.00012V11.0001H13.9999V4.00012C13.9999 3.44784 14.4476 3.00012 14.9999 3.00012H18.9999Z"></path></svg>;
const RiLineChartLine = () => <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3ZM5 5V19H18V5H5ZM7 15H9V17H7V15ZM10 12H12V17H10V12ZM13 9H15V17H13V9ZM16 6H18V17H16V6Z"></path></svg>;

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-wrapper">
        <Link className="header-logo" to="/">
          HealthSnap
        </Link>
        <nav className="header-nav">
          <Link className="header-navLink" to="/">홈</Link>
          <Link className="header-navLink" to="/input">검진 입력</Link>
          <Link className="header-navLink" to="/history">검진 기록</Link>
        </nav>
        <div className="header-buttonGroup">
          {isAuthenticated() ? (
            <>
              <span className="header-loginButton" style={{ cursor: 'default' }}>
                {user?.name}님
              </span>
              <button 
                className="header-signupButton" 
                onClick={handleLogout}
                style={{ border: 'none' }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link className="header-signupButton" to="/login">
              로그인
            </Link>
          )}
        </div>
        <button className="header-menuButton" onClick={toggleMobileMenu}>
          <RiMenuLine size={24} />
        </button>
      </div>
    </header>
  );
};

const HeroSection = () => {
  const heroBgImage = "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3";

  const scrollToFeatures = () => {
    document.querySelector('.featuresSection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="heroSection"
      style={{
        backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.85), rgba(59, 130, 246, 0.75)), url('${heroBgImage}')`
      }}
    >
      <div className="container heroContent">
        <div className="heroStats">
          <div className="statItem">
            <div className="statNumber">AI 분석</div>
            <div className="statLabel">정확도 95%</div>
          </div>
          <div className="statItem">
            <div className="statNumber">401종</div>
            <div className="statLabel">음식 데이터</div>
          </div>
          <div className="statItem">
            <div className="statNumber">실시간</div>
            <div className="statLabel">건강 점수</div>
          </div>
        </div>
        <h1 className="heroTitle">
          <span className="heroTitleHighlight">AI 기반</span> 건강검진 분석으로<br />
          <span className="heroTitleAccent">나만의 맞춤 건강관리</span>
        </h1>
        <p className="heroSubtitle">
          🏥 건강검진 결과를 업로드하면 <strong>AI가 즉시 분석</strong>하여<br />
          🍽️ <strong>개인별 맞춤 식단 6가지</strong>와 <strong>건강 점수</strong>를 제공합니다
        </p>
        <div className="buttonWrapper">
          <Link className="primaryButton" to="/input">
            <span>🚀 무료 분석 시작하기</span>
          </Link>
          <button className="secondaryButton" onClick={scrollToFeatures}>
            <span>📊 서비스 둘러보기</span>
          </button>
        </div>
        <div className="heroTrustBadges">
          <div className="trustBadge">✅ 개인정보 보호</div>
          <div className="trustBadge">🔬 의학 데이터 기반</div>
          <div className="trustBadge">⚡ 즉시 결과 제공</div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    { 
      icon: <RiHealthBookLine size={32} color="white" />, 
      title: "🎯 AI 기반 정밀 분석", 
      description: "Google Gemini AI가 건강검진 데이터를 분석하여 정확하고 객관적인 건강 상태를 평가합니다",
      bgColor: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", 
      iconBgColor: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
      highlight: "95% 정확도"
    },
    { 
      icon: <RiRestaurantLine size={32} color="white" />, 
      title: "🍽️ 맞춤 식단 추천", 
      description: "AI-Hub 401종 음식 데이터를 활용하여 개인의 건강 상태에 최적화된 식단 6가지를 추천합니다",
      bgColor: "linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)", 
      iconBgColor: "linear-gradient(135deg, #10B981, #059669)",
      highlight: "401종 음식 DB"
    },
    { 
      icon: <RiLineChartLine size={32} color="white" />, 
      title: "📊 실시간 건강 점수", 
      description: "위험도별 가중치를 적용한 종합 건강점수와 검진 기록을 체계적으로 관리할 수 있습니다",
      bgColor: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", 
      iconBgColor: "linear-gradient(135deg, #8B5CF6, #7C3AED)",
      highlight: "실시간 분석"
    },
  ];

  return (
    <section className="section featuresSection">
      <div className="container">
        <div className="textCenter featuresHeader">
          <h2 className="title">🚀 왜 HealthSnap를 선택해야 할까요?</h2>
          <p className="subtitle">최신 AI 기술과 의학 데이터를 기반으로 한 개인별 맞춤 건강 관리 솔루션</p>
        </div>
        <div className="grid grid-3-cols">
          {features.map((feature, index) => (
            <div key={index} className="featureCard enhanced" style={{ background: feature.bgColor }}>
              <div className="featureHighlight">{feature.highlight}</div>
              <div className="iconWrapper enhanced" style={{ background: feature.iconBgColor }}>
                {feature.icon}
              </div>
              <h3 className="cardTitle enhanced">{feature.title}</h3>
              <p className="cardDescription enhanced">{feature.description}</p>
              <div className="featureArrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    { 
      number: "95%", 
      label: "AI 분석 정확도", 
      description: "Google Gemini AI 기반 정밀 분석",
      icon: "🎯"
    },
    { 
      number: "401종", 
      label: "음식 데이터베이스", 
      description: "AI-Hub 공식 영양 정보 활용",
      icon: "🍽️"
    },
    { 
      number: "5분", 
      label: "빠른 분석 시간", 
      description: "간편 입력으로 즉시 결과 확인",
      icon: "⚡"
    },
    { 
      number: "무료", 
      label: "서비스 이용", 
      description: "회원가입 없이도 체험 가능",
      icon: "💎"
    }
  ];

  return (
    <section className="section statsSection">
      <div className="container">
        <div className="textCenter statsHeader">
          <h2 className="title">🚀 신뢰할 수 있는 건강 분석 서비스</h2>
          <p className="subtitle">의학적 근거와 최신 AI 기술을 바탕으로 한 정확한 건강 관리</p>
        </div>
        <div className="grid grid-4-cols">
          {stats.map((stat, index) => (
            <div key={index} className="statCard">
              <div className="statIcon">{stat.icon}</div>
              <div className="statNumber">{stat.number}</div>
              <h3 className="statLabel">{stat.label}</h3>
              <p className="statDescription">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="section ctaSection">
      <div className="container">
        <div className="ctaContent">
          <div className="ctaStats">
            <div className="ctaStatItem">
              <div className="ctaStatNumber">5분</div>
              <div className="ctaStatLabel">간편 입력</div>
            </div>
            <div className="ctaStatItem">
              <div className="ctaStatNumber">즉시</div>
              <div className="ctaStatLabel">결과 확인</div>
            </div>
            <div className="ctaStatItem">
              <div className="ctaStatNumber">무료</div>
              <div className="ctaStatLabel">서비스 이용</div>
            </div>
          </div>
          <h2 className="ctaTitle">
            ⚡ 지금 바로 건강 분석을 시작하세요
          </h2>
          <p className="ctaSubtitle">
            🎯 건강검진 결과만 있으면 <strong>5분 만에</strong> AI가 분석해드립니다<br />
            💡 <strong>완전 무료</strong>로 맞춤 식단과 건강 점수를 확인하세요
          </p>
          <div className="ctaButtonGroup">
            <Link className="ctaButton primary" to="/input">
              🚀 무료 분석 시작하기
            </Link>
            <Link className="ctaButton secondary" to="/login">
              📊 회원가입하고 기록 관리
            </Link>
          </div>
          <div className="ctaFeatures">
            <div className="ctaFeature">✅ 회원가입 없이 체험 가능</div>
            <div className="ctaFeature">🔒 개인정보 완전 보호</div>
            <div className="ctaFeature">⚡ 실시간 AI 분석</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MainPage = () => {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">HealthSnap</div>
            <p className="footer-description">건강검진 데이터 분석과 맞춤 식단 추천으로 건강한 삶을 지원합니다</p>
          </div>
          <div>
            <h4 className="footer-columnTitle">서비스</h4>
            <ul className="footer-linkList">
              <li className="footer-linkItem"><a href="#">건강검진 분석</a></li>
              <li className="footer-linkItem"><a href="#">검진 기록</a></li>
              <li className="footer-linkItem"><a href="#">식단 추천</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-columnTitle">고객지원</h4>
            <ul className="footer-linkList">
              <li className="footer-linkItem"><a href="#">자주 묻는 질문</a></li>
              <li className="footer-linkItem"><a href="#">고객센터</a></li>
              <li className="footer-linkItem"><a href="#">이용약관</a></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-columnTitle">연락처</h4>
            <ul className="footer-linkList">
              <li className="footer-contactItem"><RiPhoneLine /> 1588-0000</li>
              <li className="footer-contactItem"><RiMailLine /> help@HealthSnap.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-copyright">
          <p>© 2025 HealthSnap. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

function App() {
  // HTTPS 강제 리다이렉트
  React.useEffect(() => {
    if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
      window.location.href = window.location.href.replace('http:', 'https:');
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="appContainer">
          <GlobalStyles />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/input" element={<InputPage />} />
              <Route path="/result" element={<ResultPage />} />
              <Route path="/history" element={<Mypage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;