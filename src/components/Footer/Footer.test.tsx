// src/components/Footer/Footer.test.tsx

import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renderiza o footer com o ano atual', () => {
    render(<Footer />);
    
    const year = new Date().getFullYear();
    expect(screen.getByText(`© ${year} Minha Escola`)).toBeInTheDocument();
  });
});
