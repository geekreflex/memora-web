'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { styled } from 'styled-components';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Editor', href: '/editor' },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <HeaderWrap>
      <div className="container">
        <div className="main">
          <Link href="/">Home</Link>
          <nav>
            {navLinks.map((link) => {
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link
                  className={isActive ? 'text-blue' : 'text-black'}
                  href={link.href}
                  key={link.name}
                >
                  {link.name}
                </Link>
              );
            })}
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
