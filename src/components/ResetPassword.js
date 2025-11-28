import React, { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Para React Router

const ResetPassword = () => {
    // 1. Capturar email e token da URL
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        if (newPassword !== confirmPassword) {
            setError('As senhas não coincidem.');
            setIsLoading(false);
            return;
        }

        if (!token || !email) {
            setError('Link inválido. Por favor, solicite um novo.');
            setIsLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/login/resetar-senha', {
                // 2. Enviar o Payload com os nomes exatos esperados pelo C# Backend:
                email: email, 
                token: token, 
                newPassword: newPassword // Deve ser 'newPassword' (camelCase)
            });

            setMessage('Senha redefinida com sucesso! Redirecionando para o login...');
            setTimeout(() => {
                navigate('/login'); // Redirecionar para a sua rota de login
            }, 3000);

        } catch (err) {
            // Se o Backend retornar Bad Request (400), o token expirou ou é inválido.
            const errMsg = err.response?.data || 'Erro desconhecido. Link inválido ou expirado.';
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // Modal Backdrop: Ocupa toda a tela e escurece o fundo
        <div className="modal-backdrop">
            
            {/* Modal Content: O contêiner centralizado */}
            <div className="modal-content">

                <h3>Redefinir Senha</h3>
                <p>Conta: <strong>{email}</strong></p> 

                <form onSubmit={handleSubmit}>
                    
                    {/* Campo Nova Senha */}
                    <div className="form-group">
                        <label htmlFor="newPassword">Nova Senha</label>
                        <input
                            id="newPassword"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Campo Confirmação de Senha */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmação de Senha</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            placeholder="Repita a nova senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Exibição de Mensagens */}
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}

                    {/* Botão de Redefinir Senha */}
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                    </button>
                    
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;