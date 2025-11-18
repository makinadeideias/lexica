import random
import os
import time

class JogoAdivinhacaoInterativo:
    def __init__(self):
        self.palavras_dicas = {
            "python": "Linguagem de programação muito popular",
            "elefante": "Animal grande com tromba e presas de marfim",
            "computador": "Máquina eletrônica para processar dados",
            "bicicleta": "Veículo de duas rodas movido a pedal",
            "chocolate": "Doce feito de cacau muito apreciado",
            "montanha": "Grande elevação natural do terreno",
            "oceano": "Grande massa de água salgada",
            "livro": "Conjunto de páginas com texto ou imagens",
            "musica": "Arte de combinar sons e silêncios",
            "jardim": "Área com plantas e flores cultivadas",
            "aventura": "Experiência emocionante e cheia de perigos",
            "desafio": "Situação que testa suas habilidades",
            "mistério": "Algo desconhecido que precisa ser desvendado"
        }
        self.palavras_adivinhadas = []
        self.tentativas_totais = 0
        self.acertos_primeira = 0
        self.pontuacao = 0
        
    def limpar_tela(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        
    def animacao_digitacao(self, texto, delay=0.03):
        for char in texto:
            print(char, end='', flush=True)
            time.sleep(delay)
        print()
        
    def mostrar_titulo(self):
        print("🎯" * 30)
        print("           JOGO INTERATIVO DE ADIVINHAÇÃO")
        print("🎯" * 30)
        print()
        
    def obter_palavra_aleatoria(self):
        palavras_disponiveis = [p for p in self.palavras_dicas.keys() 
                               if p not in self.palavras_adivinhadas]
        if not palavras_disponiveis:
            return None, None
        palavra = random.choice(palavras_disponiveis)
        return palavra, self.palavras_dicas[palavra]
    
    def gerar_dica_apos_erro(self, palavra_correta, tentativa_errada):
        """Gera dica revelando 3-4 letras da posição correta de forma inteligente"""
        letras_reveladas = []
        
        # Primeiro: verifica letras na posição correta
        for i in range(min(len(palavra_correta), len(tentativa_errada))):
            if palavra_correta[i] == tentativa_errada[i]:
                letras_reveladas.append((i, palavra_correta[i]))
        
        # Segundo: se não tem letras corretas, revela vogais primeiro
        if not letras_reveladas:
            vogais = [i for i, letra in enumerate(palavra_correta) 
                     if letra.lower() in 'aeiouáéíóúâêîôûàèìòù']
            if vogais:
                qtd_vogais = min(2, len(vogais))
                for i in random.sample(vogais, qtd_vogais):
                    letras_reveladas.append((i, palavra_correta[i]))
        
        # Terceiro: completa com letras aleatórias até ter 3-4
        indices_disponiveis = [i for i in range(len(palavra_correta)) 
                             if i not in [pos for pos, _ in letras_reveladas]]
        
        qtd_necessaria = random.randint(3, 4) - len(letras_reveladas)
        if qtd_necessaria > 0 and indices_disponiveis:
            indices_adicionais = random.sample(indices_disponiveis, 
                                            min(qtd_necessaria, len(indices_disponiveis)))
            for i in indices_adicionais:
                letras_reveladas.append((i, palavra_correta[i]))
        
        # Cria a representação visual da dica
        dica_visual = ["_"] * len(palavra_correta)
        for pos, letra in letras_reveladas:
            dica_visual[pos] = letra.upper()
            
        return " ".join(dica_visual), letras_reveladas
    
    def mostrar_palavra_com_dica(self, palavra, letras_reveladas=None):
        """Mostra a palavra com letras reveladas e escondidas"""
        if letras_reveladas is None:
            letras_reveladas = []
            
        display = []
        for i in range(len(palavra)):
            if any(pos == i for pos, _ in letras_reveladas):
                display.append(palavra[i].upper())
            else:
                display.append("_")
        return " ".join(display)
    
    def calcular_pontos(self, tentativa_numero, palavra, dica_usada):
        """Calcula pontos baseado no desempenho"""
        base_points = len(palavra) * 10
        
        if tentativa_numero == 1:
            return base_points + 50  # Bônus por acertar de primeira
        elif tentativa_numero == 2:
            return base_points + 20  # Bônus por acertar rápido
        else:
            return max(base_points - (tentativa_numero * 5), 10)  # Pontuação reduzida
    
    def jogar_rodada(self, palavra, dica):
        """Executa uma rodada completa para uma palavra"""
        self.limpar_tela()
        self.mostrar_titulo()
        
        print(f"📝 DICA: {dica}")
        print(f"🔤 A palavra tem {len(palavra)} letras")
        print()
        
        tentativa_numero = 1
        dica_gerada = False
        letras_reveladas = []
        
        while True:
            # Mostra o estado atual da palavra
            display_atual = self.mostrar_palavra_com_dica(palavra, letras_reveladas)
            print(f"🔍 Palavra: {display_atual}")
            print(f"🎯 Tentativa #{tentativa_numero}")
            
            tentativa = input("\n💭 Sua tentativa: ").lower().strip()
            self.tentativas_totais += 1
            
            if tentativa == palavra:
                pontos = self.calcular_pontos(tentativa_numero, palavra, dica_gerada)
                self.pontuacao += pontos
                
                print(f"\n{'🎉' * 10}")
                self.animacao_digitacao(f"✅ CORRETO! A palavra era: {palavra.upper()}")
                print(f"🏆 Pontos ganhos: +{pontos}")
                print(f"💰 Pontuação total: {self.pontuacao}")
                print(f"{'🎉' * 10}")
                
                if tentativa_numero == 1:
                    self.acertos_primeira += 1
                    print("⭐ BÔNUS: Acertou de primeira!")
                
                time.sleep(2)
                self.palavras_adivinhadas.append(palavra)
                return True
            else:
                print("\n❌ Incorreto!")
                
                if len(tentativa) != len(palavra):
                    print(f"💡 Atenção: a palavra tem {len(palavra)} letras!")
                
                if not dica_gerada:
                    print("\n🔄 Gerando dica...")
                    time.sleep(1)
                    
                    dica_visual, novas_letras = self.gerar_dica_apos_erro(palavra, tentativa)
                    letras_reveladas.extend(novas_letras)
                    
                    print(f"💡 DICA REVELADA: {dica_visual}")
                    print(f"🔓 Letras reveladas: {len(letras_reveladas)}/{len(palavra)}")
                    dica_gerada = True
                    
                    # Dica extra sobre a tentativa
                    letras_corretas_posicao = sum(1 for i in range(min(len(palavra), len(tentativa))) 
                                               if palavra[i] == tentativa[i])
                    if letras_corretas_posicao > 0:
                        print(f"📊 Na sua tentativa: {letras_corretas_posicao} letra(s) na posição correta")
                
                tentativa_numero += 1
                print("\n" + "─" * 50)
    
    def mostrar_progresso(self):
        """Mostra barra de progresso"""
        total = len(self.palavras_dicas)
        atual = len(self.palavras_adivinhadas)
        percentual = (atual / total) * 100
        
        barra = "█" * int(percentual / 5) + "░" * (20 - int(percentual / 5))
        print(f"\n📊 PROGRESSO: [{barra}] {atual}/{total} ({percentual:.1f}%)")
    
    def jogar(self):
        """Loop principal do jogo"""
        self.limpar_tela()
        self.mostrar_titulo()
        
        print("Bem-vindo ao Jogo Interativo de Adivinhação!")
        print("Tente adivinhar a palavra baseada na dica.")
        print("Se errar, receberá letras reveladas como ajuda!")
        print("\nPressione Enter para começar...")
        input()
        
        while True:
            palavra, dica = self.obter_palavra_aleatoria()
            if palavra is None:
                break
                
            self.mostrar_progresso()
            self.jogar_rodada(palavra, dica)
            
            # Verifica se quer continuar (após algumas palavras)
            if len(self.palavras_adivinhadas) < len(self.palavras_dicas):
                if len(self.palavras_adivinhadas) % 3 == 0:
                    print("\n" + "="*50)
                    continuar = input("Deseja continuar jogando? (s/n): ").lower()
                    if continuar != 's':
                        break
        
        self.mostrar_resultado_final()
    
    def mostrar_resultado_final(self):
        """Mostra estatísticas finais do jogo"""
        self.limpar_tela()
        print("🏁" * 25)
        print("           RESULTADO FINAL")
        print("🏁" * 25)
        
        print(f"\n🎯 PALAVRAS ADIVINHADAS: {len(self.palavras_adivinhadas)}/{len(self.palavras_dicas)}")
        print(f"📊 TOTAL DE TENTATIVAS: {self.tentativas_totais}")
        print(f"⭐ ACERTOS DE PRIMEIRA: {self.acertos_primeira}")
        print(f"💰 PONTUAÇÃO FINAL: {self.pontuacao}")
        
        # Calcula estatísticas
        if self.tentativas_totais > 0:
            eficiencia = (len(self.palavras_adivinhadas) / self.tentativas_totais) * 100
            print(f"📈 EFICIÊNCIA: {eficiencia:.1f}%")
        
        print(f"\n📝 PALAVRAS RESOLVIDAS:")
        for i, palavra in enumerate(self.palavras_adivinhadas, 1):
            print(f"   {i}. {palavra.upper()}")
        
        print(f"\n🎮 Obrigado por jogar!")
        
        # Mensagem final baseada na performance
        if len(self.palavras_adivinhadas) == len(self.palavras_dicas):
            print("🏆 PARABÉNS! Você completou todas as palavras!")
        elif self.pontuacao > 500:
            print("👏 Excelente desempenho!")
        else:
            print("👍 Boa tentativa! Jogue novamente para melhorar!")

# Executar o jogo
if __name__ == "__main__":
    try:
        jogo = JogoAdivinhacaoInterativo()
        jogo.jogar()
    except KeyboardInterrupt:
        print("\n\nJogo interrompido. Até a próxima! 👋")