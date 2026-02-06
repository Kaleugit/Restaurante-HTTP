# O Restaurante HTTP

Uma metáfora lúdica para entender requisições HTTP como um restaurante: você é o cliente, o garçom é o HTTP e a cozinha é o servidor. Explore os métodos (GET, POST, PUT, PATCH, DELETE), veja status codes e acompanhe as respostas em tempo real.

## Como funciona
- **Tela inicial**: apresentação rápida e botão **Entrar** para abrir a simulação.
- **Ambiente**: fundo ilustrado e áudio ambiente de cafeteria (toggle no topo).
- **Fluxo**: escolha um método HTTP; o garçom anima, a cozinha processa, e os dados são armazenados/atualizados na lista.
- **Status e detalhes**: status code aparece na cozinha, legenda de códigos, e Headers/Body ficam em dropdowns clicáveis.

## Rodando localmente
1. Baixe/clique em "Code" → "Download ZIP" ou clone o repositório.
2. Abra `index.html` no navegador (duplo clique já funciona).
3. Se o navegador bloquear autoplay de áudio, clique em "Ambiente" para ligar.

## Publicar via GitHub Pages (grátis)
1. Crie um repositório **público** no GitHub e suba todos os arquivos (HTML, CSS, JS, imagem e MP3).
2. No GitHub, vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**; selecione a branch (ex.: `main`) e a pasta **/ (root)**; salve.
4. Aguarde ~1 minuto. Acesse em `https://<seu-usuario>.github.io/<nome-do-repo>/`.
5. Se algo não carregar, verifique caminhos relativos (use `./arquivo.ext` ou apenas `arquivo.ext`).

## Estrutura rápida
- `index.html` — layout e tela de introdução.
- `style.css` — estilos, gradiente e responsividade.
- `script.js` — lógica de pedidos, animações, dropdowns, áudio e armazenamento simulado.
- `restaurant-interior.jpg` — fundo ilustrativo.
- `Coffee Shop Sound Effects.mp3` — áudio ambiente.

## Observações
- Tudo é front-end; o "servidor" é simulado em memória. Recarregar a página limpa os dados.
- Autoplay pode ser bloqueado por política do navegador; use o toggle para habilitar.
- GitHub Pages serve apenas conteúdo estático, perfeito para esta demo.
