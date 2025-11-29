import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            setIsLoading(false);
            return;
        }

        try {
            // O Backend espera { "email": "...", "senha": "..." }
            await axios.post('http://localhost:5000/api/login/registrar', {
                email: email,
                senha: password 
            });

            setMessage('Usuário registrado com sucesso! Redirecionando para o Login...');
            
            // Limpar campos
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Redirecionar para login após 3 segundos
            setTimeout(() => {
                navigate('/login'); 
            }, 3000);

        } catch (err) {
            // Captura a mensagem de erro do Backend (ex: "Este e-mail já está em uso.")
            const errMsg = err.response?.data || 'Erro desconhecido ao tentar registrar.';
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ maxWidth: '500px' }}> {/* Usa a largura ajustada */}
                <h3>Novo Usuário (Registro)</h3>
                <p>Preencha os campos abaixo para criar sua conta.</p>

                <form onSubmit={handleSubmit}>
                    
                    {/* Campo E-mail */}
                    <div className="form-group">
                        <label htmlFor="regEmail">E-mail</label>
                        <input
                            id="regEmail"
                            type="email"
                            placeholder="Seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Campo Senha */}
                    <div className="form-group">
                        <label htmlFor="regPassword">Senha</label>
                        <input
                            id="regPassword"
                            type="password"
                            placeholder="Mínimo 8 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Campo Confirmação de Senha */}
                    <div className="form-group">
                        <label htmlFor="regConfirmPassword">Confirmar Senha</label>
                        <input
                            id="regConfirmPassword"
                            type="password"
                            placeholder="Repita a senha"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Exibição de Mensagens */}
                    {error && <p className="error-message">{error}</p>}
                    {message && <p className="success-message">{message}</p>}

                    {/* Botão de Registro */}
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>

                <p style={{ marginTop: '15px' }}>
                    Já tem conta? <a href="/login">Fazer Login</a>
                </p>
            </div>
        </div>
    );
};

export default Register;