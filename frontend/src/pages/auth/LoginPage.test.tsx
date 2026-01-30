
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
        expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    test('validates empty fields', async () => {
        renderComponent();

        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
            expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
        });
    });

    test('validates username format', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'invalid-username' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(screen.getByText(/Invalid username/i)).toBeInTheDocument();
        });
    });

    test('dispatches login action with valid data', async () => {
        renderComponent();

        fireEvent.change(screen.getByLabelText(/Username/i), { target: { value: 'testUsername' } });
        fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByRole('button', { name: /Login/i }));

        await waitFor(() => {
            expect(loginUser).toHaveBeenCalledWith({
                username: 'testUsername',
                password: 'password'
            });
        });
    });
});
