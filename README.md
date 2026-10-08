# Gustavo Santana · Portfólio

Portfólio pessoal bilíngue (PT-BR em `/`, EN em `/en/`). Next.js com export estático, TypeScript e
CSS Modules.

A ideia central é **"Do clique ao commit"**: o hero mostra uma tela do Pulso e deixa o visitante ver
a mesma ação por dentro, como uma requisição passando por controller, use case, repository e banco,
inclusive o caminho de erro (422). A página segue uma narrativa: quem sou → resumo para recrutadores
→ como cheguei aqui → o que construí → como construo → fora do código → vamos conversar.

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000 (PT) e /en/ (EN)
npm run build      # gera o site estático em out/
npm run start      # serve out/ localmente
npm run lint
npm run typecheck
```

`npm run build` roda antes `scripts/sync-github.mjs`, que atualiza
`src/data/generated/github.json` (commits recentes e linguagens por ano). Se o GitHub estiver fora do
ar ou limitar as requisições, o build segue com o snapshot anterior. Defina `GITHUB_TOKEN` para
evitar o limite de 60 requisições/hora.

## Onde editar o conteúdo

| Arquivo                     | O quê                                                               |
| --------------------------- | ------------------------------------------------------------------- |
| `src/i18n/content/pt-BR.ts` | Todo o texto em português: hero, resumo, trajetória, projetos, etc. |
| `src/i18n/content/en.ts`    | O mesmo em inglês. O tipo `SiteContent` obriga os dois a terem tudo |
| `src/data/profile.ts`       | Nome, e-mail, links, disponibilidade, caminhos dos currículos       |
| `src/data/projects.ts`      | Dados neutros dos projetos: links, stack, arquivos de cada decisão  |
| `src/data/certificates.ts`  | Certificados da seção Formação (título, emissor, link, habilidades) |
| `src/data/stack.ts`         | Ferramentas por camada; `evidence` liga cada uma aos projetos       |

### Pendências (procure por `TODO(gustavo)`)

- **Cargo na Pixel Code:** está como "Fundador e desenvolvedor"; confirme nos dois idiomas.
- **Jogando / Lendo:** campos vazios ficam escondidos.
- **Domínio:** defina `NEXT_PUBLIC_SITE_URL` (canonical, hreflang, Open Graph, sitemap).

## Currículos

`public/resume/resume-gustavo-santana-pt-br.pdf` e `public/resume/resume-gustavo-santana-en.pdf`.
Cada idioma do site baixa o seu. Para atualizar, substitua o arquivo mantendo o nome e rode um novo
build; se um arquivo sumir, os botões daquele idioma deixam de aparecer em vez de quebrar.

## Logos

As logos de tecnologia vêm do [Simple Icons](https://simpleicons.org) (CC0), ficam em `public/tech/`
e são desenhadas como máscara CSS, herdando a cor do texto. Para adicionar uma, copie o SVG para
`public/tech/` e mapeie o nome em `src/data/tech-icons.ts`.

## Estrutura

```txt
src/
├── app/
│   ├── [[...locale]]/   layout raiz (lang, metadata, hreflang, JSON-LD) e página, em / e /en/
│   ├── og/[file]/       imagens de compartilhamento por idioma (/og/pt-br.png, /og/en.png)
│   └── global-not-found, sitemap, robots, ícone
├── i18n/          config dos idiomas, tipo SiteContent, conteúdo PT/EN, provider do cliente
├── sections/      hero, glance (resumo), journey (mapa de progressão), projects, stack, about, contact
├── components/    header, idioma, tema, currículo, diagrama de arquitetura, conquistas
├── data/          dados neutros + snapshot gerado do GitHub
├── hooks/  lib/  styles/
```

## Decisões

- **i18n próprio, sem biblioteca.** Dois idiomas num site estático não justificam next-intl ou
  i18next. O conteúdo é TypeScript tipado: esquecer um texto no inglês é erro de compilação.
- **Rotas por idioma.** `/` e `/en/` são geradas a partir de `app/[[...locale]]`, cada uma com HTML,
  `lang`, metadata e hreflang próprios. Trocar de idioma é uma navegação client-side: não recarrega,
  mantém o scroll e salva a escolha. Na primeira visita a `/`, um navegador que não está em
  português vai para `/en/` (crawlers não são redirecionados).
- **Trajetória como mapa de progressão.** Um SVG liga os checkpoints. O traço se preenche com o scroll
  (requestAnimationFrame + busca binária no comprimento do path) e cada checkpoint é "desbloqueado"
  quando o traço chega nele. O progresso não regride, como um save. Sem JS ou com movimento
  reduzido, tudo aparece completo.
- **Sem biblioteca de animação.** Transições CSS e IntersectionObserver. O JS inicial é basicamente o
  runtime do React/Next.
- **Foco em vaga.** O contato é voltado a recrutadores (nome, empresa e mensagem sobre a vaga) e
  abre o app de e-mail do visitante com o assunto "Oportunidade · Empresa"; não há servidor.
- **Degradês.** Tema escuro com um brilho vermelho difuso fixo na tela; tema claro com papel quente
  clareando para quase branco no centro.
- **Formação.** Seção própria com o JS Expert (Erick Wendel) em destaque e os certificados com link
  para conferir; a lista vem de `src/data/certificates.ts`.
- **Acessibilidade.** HTML semântico, skip link, foco visível, abas com teclado, `aria-live`,
  `prefers-reduced-motion` e contraste AA nos dois temas e nos dois idiomas.

## Deploy

Na Vercel, importe o repositório; o framework é detectado sozinho. Em qualquer outro host estático,
publique a pasta `out/` gerada por `npm run build`.
