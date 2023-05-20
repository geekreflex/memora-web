'use client';

import Link from 'next/link';
import { styled } from 'styled-components';

export default function Header() {
  return (
    <HeaderWrap>
      <div className="container">
        <div className="main">
          <Link href="/">Home</Link>
          <nav>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/editor">Editor</Link>
          </nav>
        </div>
      </div>
    </HeaderWrap>
  );
}

const HeaderWrap = styled.div`
  .main {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  nav {
    display: flex;
    gap: 20px;
  }
`;
