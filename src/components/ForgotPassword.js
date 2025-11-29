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
        // Modal Backdrop: Ocupa toda a tela e escurece o fundo
        <div className="modal-backdrop">
            
            {/* Modal Content: O contêiner centralizado */}
            <div className="modal-content">

                <h3>Esqueci Minha Senha</h3>
                <p>Insira seu e-mail para receber o link de redefinição.</p>

                <form onSubmit={handleSubmit}>
                    
                    {/* Campo E-mail */}
                    <div className="form-group">
                        <label htmlFor="emailInput">E-mail</label>
                        <input
                            id="emailInput"
                            type="email"
                            placeholder="Seu email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Botão de Enviar Link */}
                    <button type="submit" disabled={isLoading} className="btn-primary">
                        {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                    </button>
                    
                </form>
                
                {/* Exibição de Mensagens (ajustado para usar as classes do modal) */}
                {message && <p className="success-message">{message}</p>}
                
            </div>
        </div>
    );
};

export default ForgotPassword;