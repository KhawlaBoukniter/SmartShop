
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import LoginPage from './LoginPage';
import { loginUser } from '../../features/auth/authSlice';

const middlewares: any[] = [thunk];
const mockStore = configureStore(middlewares);

jest.mock('../../features/auth/authSlice', () => ({
    ...jest.requireActual('../../features/auth/authSlice'),
    loginUser: jest.fn(() => ({ type: 'auth/login/pending' })),
    resetError: jest.fn(() => ({ type: 'auth/resetError' }))
}));

describe('LoginPage', () => {
    let store: any;

    beforeEach(() => {
        store = mockStore({
            auth: {
                isAuthenticated: false,
                role: null,
                loading: false,
                error: null,
            },
        });
        store.dispatch = jest.fn();
    });

    const renderComponent = () =>
        render(
            <Provider store={store}>
                <BrowserRouter>
                    <LoginPage />
                </BrowserRouter>
            </Provider>
        );

    test('renders login form correctly', () => {
        renderComponent();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    test('validates empty fields', async () => {
        renderComponent();

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
        });
    });

    test('validates email format', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'invalid-email' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
        });
    });

    test('dispatches login action with valid data', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password123' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                email: 'test@example.com',
                password: 'password123'
            });
        });
    });
});
