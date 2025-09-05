import { Footer } from './footer';
import Header from './header';

interface Props {
  children: React.ReactNode;
}

export function MainLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
