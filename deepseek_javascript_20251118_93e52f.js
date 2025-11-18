class JogoAdivinhacao {
    constructor() {
        this.palavrasDicas = [
            { palavra: "python", dica: "Linguagem de programação muito popular" },
            { palavra: "elefante", dica: "Animal grande com tromba e presas de marfim" },
            { palavra: "computador", dica: "Máquina eletrônica para processar dados" },
            { palavra: "bicicleta", dica: "Veículo de duas rodas movido a pedal" },
            { palavra: "chocolate", dica: "Doce feito de cacau muito apreciado" },
            { palavra: "montanha", dica: "Grande elevação natural do terreno" },
            { palavra: "oceano", dica: "Grande massa de água salgada" },
            { palavra: "livro", dica: "Conjunto de páginas com texto ou imagens" },
            { palavra: "musica", dica: "Arte de combinar sons e silêncios" },
            { palavra: "jardim", dica: "Área com plantas e flores cultivadas" }
        ];
        
        this.resetarJogo();
    }
    
    resetarJogo() {
        this.palavrasAdivinhadas = [];
        this.pontuacao = 0;
        this.acertosPrimeira = 0;
        this.tentativasTotais = 0;
        this.palavrasRestantes = [...this.palavrasDicas];
        this.palavraAtual = null;
        this.tentativasAtuais = 0;
        this.letrasReveladas = [];
        this.historicoTentativas = [];
    }
    
    obterProximaPalavra() {
        if (this.palavrasRestantes.length === 0) {
            return null;
        }
        
        const index = Math.floor(Math.random() * this.palavrasRestantes.length);
        this.palavraAtual = this.palavrasRestantes[index];
        this.tentativasAtuais = 0;
        this.letrasReveladas = [];
        this.historicoTentativas = [];
        
        return this.palavraAtual;
    }
    
    processarTentativa(tentativa) {
        if (!this.palavraAtual) return { tipo: 'erro', mensagem: 'Nenhuma palavra ativa' };
        
        tentativa = tentativa.toLowerCase().trim();
        this.tentativasAtuais++;
        this.tentativasTotais++;
        this.historicoTentativas.push(tentativa);
        
        const resultado = {
            tentativa: tentativa,
            numeroTentativa: this.tentativasAtuais
        };
        
        if (tentativa === this.palavraAtual.palavra) {
            // Acertou!
            const pontos = this.calcularPontos();
            this.pontuacao += pontos;
            this.palavrasAdivinhadas.push(this.palavraAtual);
            
            // Remove a palavra das restantes
            this.palavrasRestantes = this.palavrasRestantes.filter(
                p => p.palavra !== this.palavraAtual.palavra
            );
            
            resultado.tipo = 'acerto';
            resultado.mensagem = `🎉 CORRETO! A palavra era: ${this.palavraAtual.palavra.toUpperCase()}`;
            resultado.pontos = pontos;
            resultado.fimRodada = true;
            
            if (this.tentativasAtuais === 1) {
                this.acertosPrimeira++;
            }
            
        } else {
            // Errou - gerar dica
            resultado.tipo = 'erro';
            resultado.mensagem = '❌ Incorreto!';
            
            if (tentativa.length !== this.palavraAtual.palavra.length) {
                resultado.mensagem += ` A palavra tem ${this.palavraAtual.palavra.length} letras!`;
            }
            
            if (this.tentativasAtuais === 1) {
                this.gerarDicaInicial();
                resultado.dica = true;
                resultado.letrasReveladas = [...this.letrasReveladas];
                resultado.mensagem += ' Dica gerada!';
            }
        }
        
        return resultado;
    }
    
    gerarDicaInicial() {
        const palavra = this.palavraAtual.palavra;
        const letrasParaRevelar = Math.min(4, Math.max(3, Math.floor(palavra.length / 2)));
        
        // Revela algumas letras aleatórias
        const indicesDisponiveis = Array.from({length: palavra.length}, (_, i) => i);
        
        for (let i = 0; i < letrasParaRevelar && indicesDisponiveis.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * indicesDisponiveis.length);
            const posicao = indicesDisponiveis.splice(randomIndex, 1)[0];
            this.letrasReveladas.push({
                posicao: posicao,
                letra: palavra[posicao]
            });
        }
    }
    
    calcularPontos() {
        const base = this.palavraAtual.palavra.length * 10;
        
        if (this.tentativasAtuais === 1) {
            return base + 50; // Bônus por acertar de primeira
        } else if (this.tentativasAtuais === 2) {
            return base + 20; // Bônus por acertar rápido
        } else {
            return Math.max(base - (this.tentativasAtuais * 5), 10);
        }
    }
    
    getDisplayPalavra() {
        if (!this.palavraAtual) return '';
        
        const display = [];
        for (let i = 0; i < this.palavraAtual.palavra.length; i++) {
            const letraRevelada = this.letrasReveladas.find(lr => lr.posicao === i);
            if (letraRevelada) {
                display.push({ letra: letraRevelada.letra, revelada: true });
            } else {
                display.push({ letra: '_', revelada: false });
            }
        }
        return display;
    }
    
    getEstatisticas() {
        const eficiencia = this.tentativasTotais > 0 
            ? ((this.palavrasAdivinhadas.length / this.tentativasTotais) * 100).toFixed(1)
            : '0';
            
        return {
            palavrasAdivinhadas: this.palavrasAdivinhadas.length,
            totalPalavras: this.palavrasDicas.length,
            pontuacao: this.pontuacao,
            acertosPrimeira: this.acertosPrimeira,
            eficiencia: eficiencia,
            tentativasTotais: this.tentativasTotais
        };
    }
}

// Gerenciamento da Interface
class InterfaceJogo {
    constructor() {
        this.jogo = new JogoAdivinhacao();
        this.inicializarElementos();
        this.inicializarEventos();
        this.mostrarTela('inicio');
    }
    
    inicializarElementos() {
        // Telas
        this.telaInicio = document.getElementById('tela-inicio');
        this.telaJogo = document.getElementById('tela-jogo');
        this.telaResultados = document.getElementById('tela-resultados');
        
        // Botões
        this.btnComecar = document.getElementById('btn-comecar');
        this.btnTentar = document.getElementById('btn-tentar');
        this.btnProxima = document.getElementById('btn-proxima');
        this.btnReiniciar = document.getElementById('btn-reiniciar');
        this.btnJogarNovamente = document.getElementById('btn-jogar-novamente');
        this.btnCompartilhar = document.getElementById('btn-compartilhar');
        
        // Elementos do jogo
        this.inputTentativa = document.getElementById('input-tentativa');
        this.dicaTexto = document.getElementById('dica-texto');
        this.palavraDisplay = document.getElementById('palavra-display');
        this.tamanhoPalavra = document.getElementById('tamanho-palavra');
        this.feedback = document.getElementById('feedback');
        this.historicoTentativas = document.getElementById('historico-tentativas');
        
        // Estatísticas
        this.pontuacaoElement = document.getElementById('pontuacao');
        this.palavrasAcertadas = document.getElementById('palavras-acertadas');
        this.totalPalavras = document.getElementById('total-palavras');
        
        // Resultados
        this.resultPalavras = document.getElementById('result-palavras');
        this.resultPontuacao = document.getElementById('result-pontuacao');
        this.resultPrimeira = document.getElementById('result-primeira');
        this.resultEficiencia = document.getElementById('result-eficiencia');
        this.listaPalavras = document.getElementById('lista-palavras');
    }
    
    inicializarEventos() {
        this.btnComecar.addEventListener('click', () => this.comecarJogo());
        this.btnTentar.addEventListener('click', () => this.processarTentativa());
        this.btnProxima.addEventListener('click', () => this.proximaPalavra());
        this.btnReiniciar.addEventListener('click', () => this.reiniciarJogo());
        this.btnJogarNovamente.addEventListener('click', () => this.reiniciarJogo());
        this.btnCompartilhar.addEventListener('click', () => this.compartilharResultados());
        
        this.inputTentativa.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.processarTentativa();
            }
        });
    }
    
    mostrarTela(tela) {
        // Esconde todas as telas
        this.telaInicio.classList.remove('ativa');
        this.telaJogo.classList.remove('ativa');
        this.telaResultados.classList.remove('ativa');
        
        // Mostra a tela solicitada
        switch(tela) {
            case 'inicio':
                this.telaInicio.classList.add('ativa');
                break;
            case 'jogo':
                this.telaJogo.classList.add('ativa');
                break;
            case 'resultados':
                this.telaResultados.classList.add('ativa');
                break;
        }
    }
    
    comecarJogo() {
        this.jogo.resetarJogo();
        this.atualizarEstatisticas();
        this.proximaPalavra();
        this.mostrarTela('jogo');
    }
    
    proximaPalavra() {
        const proxima = this.jogo.obterProximaPalavra();
        
        if (!proxima) {
            this.mostrarResultados();
            return;
        }
        
        this.dicaTexto.textContent = proxima.dica;
        this.tamanhoPalavra.textContent = proxima.palavra.length;
        this.atualizarDisplayPalavra();
        this.limparFeedback();
        this.limparHistorico();
        this.btnProxima.style.display = 'none';
        this.inputTentativa.value = '';
        this.inputTentativa.focus();
    }
    
    processarTentativa() {
        const tentativa = this.inputTentativa.value.trim();
        
        if (!tentativa) {
            this.mostrarFeedback('Por favor, digite uma tentativa!', 'erro');
            return;
        }
        
        const resultado = this.jogo.processarTentativa(tentativa);
        
        if (resultado.tipo === 'acerto') {
            this.mostrarFeedback(resultado.mensagem, 'correto');
            this.atualizarDisplayPalavra(true);
            this.btnProxima.style.display = 'block';
            this.inputTentativa.disabled = true;
            
            // Atualiza estatísticas
            this.atualizarEstatisticas();
            
        } else {
            this.mostrarFeedback(resultado.mensagem, 'erro');
            this.adicionarHistorico(tentativa, false);
            
            if (resultado.dica) {
                this.atualizarDisplayPalavra();
                this.mostrarFeedback('💡 Dicas reveladas! Continue tentando!', 'dica');
            }
        }
        
        this.inputTentativa.value = '';
        this.inputTentativa.focus();
    }
    
    atualizarDisplayPalavra(revelarTudo = false) {
        this.palavraDisplay.innerHTML = '';
        
        const display = this.jogo.getDisplayPalavra();
        
        display.forEach((item, index) => {
            const span = document.createElement('span');
            span.className = `letra ${item.revelada || revelarTudo ? 'revelada' : ''}`;
            span.textContent = revelarTudo ? this.jogo.palavraAtual.palavra[index].toUpperCase() : item.letra.toUpperCase();
            span.style.animationDelay = `${index * 0.1}s`;
            span.classList.add('slide-in');
            this.palavraDisplay.appendChild(span);
        });
    }
    
    mostrarFeedback(mensagem, tipo) {
        this.feedback.textContent = mensagem;
        this.feedback.className = `feedback ${tipo}`;
        this.feedback.classList.add('pulse');
        
        setTimeout(() => {
            this.feedback.classList.remove('pulse');
        }, 500);
    }
    
    limparFeedback() {
        this.feedback.textContent = '';
        this.feedback.className = 'feedback';
        this.inputTentativa.disabled = false;
    }
    
    adicionarHistorico(tentativa, acerto) {
        const div = document.createElement('div');
        div.className = `tentativa-item ${acerto ? 'acerto' : 'erro'}`;
        div.textContent = `Tentativa ${this.jogo.historicoTentativas.length}: "${tentativa}"`;
        this.historicoTentativas.appendChild(div);
        this.historicoTentativas.scrollTop = this.historicoTentativas.scrollHeight;
    }
    
    limparHistorico() {
        this.historicoTentativas.innerHTML = '';
    }
    
    atualizarEstatisticas() {
        const stats = this.jogo.getEstatisticas();
        this.pontuacaoElement.textContent = stats.pontuacao;
        this.palavrasAcertadas.textContent = stats.palavrasAdivinhadas;
        this.totalPalavras.textContent = stats.totalPalavras;
    }
    
    mostrarResultados() {
        const stats = this.jogo.getEstatisticas();
        
        this.resultPalavras.textContent = `${stats.palavrasAdivinhadas}/${stats.totalPalavras}`;
        this.resultPontuacao.textContent = stats.pontuacao;
        this.resultPrimeira.textContent = stats.acertosPrimeira;
        this.resultEficiencia.textContent = `${stats.eficiencia}%`;
        
        // Lista de palavras adivinhadas
        this.listaPalavras.innerHTML = '';
        this.jogo.palavrasAdivinhadas.forEach(palavraObj => {
            const div = document.createElement('div');
            div.className = 'palavra-item';
            div.textContent = palavraObj.palavra.toUpperCase();
            this.listaPalavras.appendChild(div);
        });
        
        this.mostrarTela('resultados');
    }
    
    reiniciarJogo() {
        this.jogo.resetarJogo();
        this.mostrarTela('inicio');
    }
    
    compartilharResultados() {
        const stats = this.jogo.getEstatisticas();
        const texto = `🎯 Joguei o Jogo de Adivinhação e fiz ${stats.pontuacao} pontos! Adivinhei ${stats.palavrasAdivinhadas}/${stats.totalPalavras} palavras com ${stats.eficiencia}% de eficiência!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Meu resultado no Jogo de Adivinhação',
                text: texto,
                url: window.location.href
            });
        } else {
            // Fallback para copiar para área de transferência
            navigator.clipboard.writeText(texto).then(() => {
                alert('Resultado copiado para a área de transferência!');
            });
        }
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new InterfaceJogo();
});