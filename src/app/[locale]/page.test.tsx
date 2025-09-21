import { render, screen } from '@testing-library/react';
import HomePage from './page';
import { ROUTES } from '@/lib/constants/routes';

describe('Home page', () => {
  test('renders main heading and sections', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: 'HomePage.title', level: 2 })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: 'HomePage.aboutProjectTitle',
        level: 5,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'HomePage.aboutTeamTitle', level: 5 })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'HomePage.aboutCourseTitle',
        level: 5,
      })
    ).toBeInTheDocument();

    expect(screen.getByText('HomePage.aboutProjectText')).toBeInTheDocument();
    expect(screen.getByText('HomePage.aboutCourseText')).toBeInTheDocument();
  });

  test('has Sign In / Sign Up buttons rendered as links with correct href', () => {
    render(<HomePage />);

    const signIn = screen.getByRole('link', { name: 'HomePage.signIn' });
    const signUp = screen.getByRole('link', { name: 'HomePage.signUp' });

    expect(signIn).toBeInTheDocument();
    expect(signUp).toBeInTheDocument();

    expect(signIn).toHaveAttribute('href', ROUTES.login);
    expect(signUp).toHaveAttribute('href', ROUTES.signup);
  });

  test('renders three team avatars with provided alt texts', () => {
    render(<HomePage />);

    expect(screen.getByAltText('Developer 1')).toBeInTheDocument();
    expect(screen.getByAltText('Developer 2')).toBeInTheDocument();
    expect(screen.getByAltText('Developer 3')).toBeInTheDocument();

    expect(screen.getByText('HomePage.developer1')).toBeInTheDocument();
    expect(screen.getByText('HomePage.developer2')).toBeInTheDocument();
    expect(screen.getByText('HomePage.developer3')).toBeInTheDocument();

    expect(
      screen.getByText('HomePage.teamLeadDescription')
    ).toBeInTheDocument();
    expect(screen.getByText('HomePage.dev1Description')).toBeInTheDocument();
    expect(screen.getByText('HomePage.dev2Description')).toBeInTheDocument();
  });
});
