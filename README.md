
# SAFE.App – Aplicativo de Monitoramento de Desastres Naturais 🌍

**Global Solution 2025 – FIAP**  
Disciplina: Mobile Application Development (React Native)

---

## 👥 Integrantes do Grupo

- **Marcus Vinicius de Souza Calazans** – RM: 556620  
- **Fernando Hitoshi Hirashima** – RM: 558730  
- **Felipe Nogueira Ramon** – RM: 555335

---

## 📱 Sobre o Projeto

O **SAFE.App** é um aplicativo móvel desenvolvido em **React Native**. Ele se conecta à API **SAFE.Core** para exibir dados em tempo real de sensores ambientais. O sistema tem como objetivo principal o monitoramento de riscos naturais, leitura de sensores, gestão de alertas e estações de monitoramento, com uma interface amigável e responsiva.

Este aplicativo é totalmente integrado à **Global Solution 2025** e busca fornecer uma ferramenta eficaz para o monitoramento de desastres naturais e segurança pública.

---

## 🚀 Funcionalidades

- **Autenticação JWT** para login seguro.
- **Visualização de estações** monitoradas em tempo real.
- **Leitura de sensores**: temperatura, umidade, pressão, etc.
- **Registro e exclusão de alertas** de risco.
- **Painel de riscos** por região e data.
- **Configurações** de idioma, notificações e tema (claro/escuro).
- **Instruções de uso** para facilitar a navegação e operação.

---

## 🧪 Tecnologias Utilizadas

- **React Native** com **Expo** para desenvolvimento mobile.
- **React Navigation** para navegação via abas (Tabs).
- **Axios** para realizar chamadas HTTP à API.
- **AsyncStorage** para armazenar o JWT e manter a sessão.
- **TypeScript** para garantir tipagem estática e maior segurança no código.
- **react-native-picker/picker** para seleção de opções, como idioma e notificações.
- **Estilização customizada** utilizando o arquivo `theme.ts` para cores e espaçamentos.

---

## 🧭 Telas Implementadas

- **LoginScreen**: Tela de autenticação com JWT.
- **HomeScreen**: Tela inicial com informações e navegação.
- **EstacoesScreen**: Visualização das estações cadastradas.
- **LeiturasScreen**: Exibição de leituras dos sensores.
- **RiscosScreen**: Visualização dos riscos monitorados por data e região.
- **AlertasScreen**: Gerenciamento de alertas.
- **MapaScreen**: Mapa com visualização de riscos e estações.
- **ConfigScreen**: Configurações de tema, idioma e notificações.
- **InstrucoesScreen**: Instruções de uso e navegação do aplicativo.

---

## 🔗 Links Importantes

- 🔗 **Repositório GitHub**: [https://github.com/seu-usuario/SAFE.App](https://github.com/seu-usuario/SAFE.App)
- 🎥 **Vídeo Apresentação**: [https://youtu.be/seu-video-safe-app](https://youtu.be/seu-video-safe-app)

> **Obs**: *Substitua os links acima pelos corretos antes da entrega final.*

---

## 📦 Como Executar o Projeto

### Passos:

1. **Clone o repositório**:
```bash
git clone https://github.com/seu-usuario/SAFE.App.git
cd SAFE.App
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Inicie o servidor**:
```bash
npx expo start
```

> O app será carregado no navegador. Você pode testar via **emulador Android/iOS** ou utilizando o app **Expo Go** no celular.

---

## ✅ Testes

- Você pode testar as funcionalidades principais autenticando-se com as credenciais padrão:

```
Usuário: admin
Senha: admin
```

> As chamadas serão realizadas para a **API SAFE.Core**, que pode estar executando localmente ou em um servidor remoto.

---

## 💡 Slogan

**SAFE.Guard – Prever para proteger. Agir antes que o desastre aconteça.**

---

## 🏁 Status

✔️ **Finalizado** e pronto para entrega.
