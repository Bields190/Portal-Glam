// ==UserScript==
// @name         Portal do Aluno UFAC
// @namespace    http://tampermonkey.net/
// @version      V1
// @description  Arredondando o Layout de muitos anos atrás!
// @author       Gabs
// @match        https://portal.ufac.br/aluno/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ufac.br
// @grant        GM_addStyle
// @run-at       document-end

// ==/UserScript==

(function() {
    'use strict';

    // 1. Remove o meta refresh
    const meta = document.querySelector('meta[http-equiv="refresh"]');
    if (meta) meta.remove();

    // VARIÁVEIS DE TEMA
    const DARK_BG = 'linear-gradient(135deg, #0a1a2a 0%, #05101a 100%)';
    const LIGHT_BG = 'linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%)';
    const DARK_TEXT = '#e0e0e0';
    const LIGHT_TEXT = '#333333';
    const DARK_CARD = 'rgba(255, 255, 255, 0.08)';
    const LIGHT_CARD = 'rgba(0, 0, 0, 0.05)';
    const HEADER_HEIGHT = '150px'; // Espaço reservado para o cabeçalho e logo

    // Função para aplicar o tema com base no nome do tema
    function applyTheme(theme) {
        let css = '';
        if (theme === 'dark') {
            css = `
                /* TEMA ESCURO */
                body, html {
                    background: ${DARK_BG} !important;
                    color: ${DARK_TEXT} !important;
                }
                .header-custom a {
                    color: #fff !important;
                }
                .header-custom img {
                    filter: brightness(1);
                }
                #corpo-login {
                    background: ${DARK_CARD} !important;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.6) !important;
                }
                #col1, #col3, #col5, #col7, #col8, #Col9 {
                    color: ${DARK_TEXT} !important;
                }
                input[type="text"], input[type="password"] {
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    background: rgba(0, 0, 0, 0.3) !important;
                    color: #fff !important;
                }
                #col7 a, #Col9 a { color: #a0a0a0 !important; }
                #col7 a:hover, #Col9 a:hover { color: #00c8ff !important; }
                .theme-toggle-button { background: rgba(0, 0, 0, 0.3); color: #fff; }
                .theme-toggle-button::before { content: '🌙'; }
                body::before { opacity: 0.05; }
            `;

        } else { // light theme
            css = `
                /* TEMA CLARO */
                body, html {
                    background: ${LIGHT_BG} !important;
                    color: ${LIGHT_TEXT} !important;
                }
                .header-custom a {
                    color: #333 !important;
                }
                .header-custom img {
                    filter: brightness(0.2);
                }
                #corpo-login {
                    background: ${LIGHT_CARD} !important;
                    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2) !important;
                }
                #col1, #col3, #col5, #col7, #col8, #Col9 {
                    color: ${LIGHT_TEXT} !important;
                }
                input[type="text"], input[type="password"] {
                    border: 1px solid rgba(0, 0, 0, 0.1) !important;
                    background: #fff !important;
                    color: #333 !important;
                }
                #col7 a, #Col9 a { color: #007bff !important; }
                #col7 a:hover, #Col9 a:hover { color: #0056b3 !important; }
                .theme-toggle-button { background: #fff; color: #333; }
                .theme-toggle-button::before { content: '☀️'; }
                body::before { opacity: 0.02; }
            `;
        }

        const oldStyle = document.getElementById('ufac-theme-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        const style = document.createElement('style');
        style.id = 'ufac-theme-style';
        style.innerHTML = css;
        document.head.appendChild(style);

        localStorage.setItem('ufac-theme', theme);
        document.body.classList.remove('dark', 'light');
        document.body.classList.add(theme);
    }

    // Tenta carregar o tema do localStorage ou define como 'dark'
    const initialTheme = localStorage.getItem('ufac-theme') || 'dark';
    applyTheme(initialTheme);


    // 2. Injeta CSS moderno (Constante, independente do tema)
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        body, html {
            font-family: 'Poppins', sans-serif !important;
            transition: background 0.5s ease, color 0.5s ease;

            /* CENTRALIZAÇÃO CORRIGIDA: Usa Flexbox para centralizar o conteúdo */
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important; /* Centraliza o formulário verticalmente */
            align-items: center !important; /* Centraliza o formulário horizontalmente */
            padding-top: ${HEADER_HEIGHT}; /* Reserva espaço para o cabeçalho fixo */
            min-height: 100vh;
        }

        /* 🚫 ELIMINAÇÃO E LIMPEZA DE ITENS ANTIGOS */
        #topo-corpo > table > tbody > tr > td:first-child { display: none !important; }
        #topo-corpo, #topo-corpo table, #topo-corpo table td, #col5, #col7 {
            background-image: none !important;
            background-color: transparent !important;
            border: none !important;
            width: auto !important; /* Permite que o Flexbox controle a largura */
        }
        #corpo-login > div, #corpo-login > div * {
            background-color: transparent !important;
            background-image: none !important;
            padding: 0 !important;
        }

        /* ⭐️ Centraliza o Container do Login */
        #topo-corpo {
            position: relative !important; /* Volta para relative */
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            flex-grow: 1; /* Permite que ocupe o espaço restante */
            width: 100% !important;
            margin-top: -${HEADER_HEIGHT}; /* Compensa o padding-top do body */
        }

        /* Garante que o TD de login não flutue e não tenha largura 100% */
        #td-login {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: auto !important;
        }


        /* 🔝 NOVO CABEÇALHO E BOTÃO DE TEMA - FIXADO */
        .header-wrapper {
            position: fixed; /* Fixa no topo para não atrapalhar a centralização do form */
            top: 0;
            left: 0;
            width: 100%;
            height: ${HEADER_HEIGHT};
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            background: rgba(0, 0, 0, 0.3); /* Fundo sutil */
            backdrop-filter: blur(5px);
            transition: background 0.5s ease;
        }

        .header-custom {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            width: 100%;
            max-width: 600px;
        }

        .theme-toggle-button {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            z-index: 101; /* Acima do wrapper */
            transition: background 0.5s ease, color 0.5s ease, box-shadow 0.3s ease;
        }

        /* 💳 Card de Login (Glassmorphism) */
        #corpo-login {
            backdrop-filter: blur(15px) !important;
            border: 1px solid rgba(255, 255, 255, 0.15) !important;
            padding: 40px !important;
            border-radius: 20px !important;
            width: 100%;
            max-width: 450px;
            box-sizing: border-box;
            text-align: center;
            position: relative;
            z-index: 2;
            /* Remove margens verticais para o body centralizar */
            margin-top: 0;
            margin-bottom: 0;
            transition: background 0.5s ease, box-shadow 0.5s ease;
        }

        /* ✒️ Títulos, Labels e Inputs */
        #col1 { font-size: 32px !important; font-weight: 600 !important; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 10px !important; transition: color 0.5s ease; }
        #col3 { font-size: 16px !important; margin-bottom: 30px !important; transition: color 0.5s ease; }
        #col5, #col7, #col8, #Col9 { padding: 0 !important; font-size: 15px !important; text-align: left; margin-bottom: 5px; }

        input[type="text"], input[type="password"] {
            width: 100% !important;
            padding: 15px !important;
            border-radius: 12px !important;
            font-size: 18px !important;
            box-sizing: border-box;
            margin-bottom: 25px !important;
            transition: border-color 0.5s ease, background 0.5s ease, color 0.5s ease;
        }

        .button {
            background: linear-gradient(45deg, #00c8ff 0%, #007bff 100%) !important;
            border: none !important;
            padding: 14px 25px !important;
            color: white !important;
            border-radius: 12px !important;
            cursor: pointer !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            letter-spacing: 1px;
            width: 100%;
            box-shadow: 0 4px 15px rgba(0, 190, 255, 0.4);
        }

        /* 🦶 Rodapé (Fixado na parte inferior) */
        #rodape {
            text-align: center !important;
            color: #888 !important;
            padding: 15px 20px !important;
            font-size: 12px !important;
            width: 100%;
            box-sizing: border-box;
            position: fixed;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.3);
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            z-index: 999;
        }
    `);

    // 3. Injeta o novo cabeçalho e o botão de tema
    const body = document.body;

    // Header Wrapper (Novo elemento para conter e fixar o cabeçalho)
    const headerWrapperHtml = `
        <div class="header-wrapper">
            <div class="header-custom">
                <img src="/aluno/img/logo_portal.png" alt="Logo UFAC" />
                <a href="http://www.ufac.br" title="Ir para o Site" target="_blank">UFAC</a>
            </div>
        </div>
    `;
    body.insertAdjacentHTML('afterbegin', headerWrapperHtml);

    // Botão de Tema
    const buttonHtml = '<button class="theme-toggle-button"></button>';
    body.insertAdjacentHTML('afterbegin', buttonHtml);

    // Lógica do Botão de Tema
    const themeButton = document.querySelector('.theme-toggle-button');
    themeButton.addEventListener('click', () => {
        const currentTheme = localStorage.getItem('ufac-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // 4. Foca no campo de usuário ao carregar
    window.addEventListener('load', function() {
        const usernameInput = document.getElementById('j_username');
        if (usernameInput) {
            usernameInput.focus();
        }
    });

})();