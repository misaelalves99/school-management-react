// src/pages/Privacy/PrivacyPage.test.tsx

import { render, screen } from '@testing-library/react';
import PrivacyPage from './PrivacyPage';

describe('PrivacyPage', () => {
  it('renderiza o título da página', () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });

  it('renderiza a descrição da política de privacidade', () => {
    render(<PrivacyPage />);
    expect(screen.getByText(/Use this page to detail your site's privacy policy/i)).toBeInTheDocument();
  });
});
