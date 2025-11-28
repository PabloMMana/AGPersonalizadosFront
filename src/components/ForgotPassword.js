import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsLoading(true);

        try {
            // URL e endpoint do seu Backend
            await axios.post('http://localhost:5000/api/login/esqueci-senha', {
                email: email // Note que o C# Backend espera { "email": "..." }
            });

            // Mensagem de segurança: sempre a mesma, se a requisição for 200/OK.
            setMessage('Se o e-mail estiver cadastrado, instruções de recuperação de senha foram enviadas.');
        } catch (err) {
            // Se houver erro de rede ou o Backend retornar um erro, ainda mostramos a mensagem segura.
            setMessage('Se o e-mail estiver cadastrado, instruções de recuperação de senha foram enviadas.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card">
            <h3>Esqueci Minha Senha</h3>
            <p>Insira seu e-mail para receber o link de redefinição.</p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Seu email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar Link'}
                </button>
            </form>
            {message && <p className="success-message">{message}</p>}
        </div>
    );
};

export default ForgotPassword;