# 🛰️ VoxelSat — Otimização Topológica para Estruturas de Satélites

Aplicativo mobile desenvolvido para a **Global Solution** (tema: **Economia Espacial**).
O VoxelSat ajuda a entender e a **simular a otimização topológica** de componentes
estruturais de satélites, mostrando quanta **massa** e quanto **custo de lançamento**
podem ser economizados.

> **Por que isso importa?** No espaço, o lançamento é cobrado por quilo. Reduzir a
> massa das estruturas de um satélite diminui diretamente o custo de colocá-lo em
> órbita e libera capacidade para mais carga útil — uma oportunidade central da
> economia espacial. O tema reforça que *"criatividade nasce de restrição"*, e o
> espaço é o ambiente mais restritivo que existe.

---

## ✨ O que o app faz

1. **Aprender** — explica, em linguagem simples, o que é otimização topológica e por
   que ela é estratégica no espaço, com uma demonstração visual "antes/depois".
2. **Cadastrar um projeto** — o usuário escolhe o componente estrutural, o material,
   o nível de otimização, o veículo de lançamento e a quantidade de unidades
   (ex.: tamanho de uma constelação), e pode anexar uma foto de referência da peça.
3. **Simular** — o app "processa" a otimização e dispara uma **notificação** ao
   concluir, calculando a redução de massa e a economia de lançamento.
4. **Ver o resultado** — visualização 2D da estrutura otimizada, massa antes/depois,
   percentual reduzido, rigidez mantida e custo economizado.
5. **Histórico** — todos os projetos ficam salvos no dispositivo e podem ser
   reabertos em detalhe ou excluídos.

> ℹ️ A otimização é **simulada** (não roda elementos finitos reais). Ela combina
> faixas típicas de redução por tipo de componente, fatores de material e custo por
> veículo de lançamento em fórmulas determinísticas — produzindo resultados
> plausíveis, variados e reproduzíveis.

---

## 🧭 Fluxo de uso (navegação completa)

```
Início ──▶ Novo projeto (cadastro) ──▶ Simulação (resposta do sistema)
                                           │
                                           ▼
Histórico ◀── Confirmação (status) ◀── Resultado (detalhes) ──▶ salvar
   │
   └──▶ Detalhes do projeto ──▶ excluir
```

---

## 🛠️ Tecnologias

- **React Native + Expo** (managed workflow) · **TypeScript**
- **React Navigation** (abas inferiores + pilha)
- **AsyncStorage** — persistência local dos projetos
- **expo-image-picker** — câmera e galeria (recurso nativo)
- **expo-notifications** — notificações locais (recurso nativo)
- **react-native-svg** — visualização 2D da estrutura otimizada

---

## 📁 Estrutura do projeto

```
src/
├── components/      # Componentes de UI reutilizáveis
│   ├── Button.tsx, Card.tsx, Input.tsx, SegmentedControl.tsx
│   ├── SelectableRow.tsx, StatCard.tsx, SectionTitle.tsx, EmptyState.tsx
│   ├── ScreenContainer.tsx        # contêiner base de tela
│   ├── StructurePreview.tsx       # desenho SVG da estrutura (antes/depois)
│   └── ResultView.tsx             # bloco de resultado reaproveitado
├── data/            # Dados de catálogo (JSON em TS)
│   ├── components.ts              # tipos de peça e faixas de redução
│   ├── materials.ts               # materiais e densidades
│   ├── launchVehicles.ts          # veículos e custo por kg
│   └── learnContent.ts            # conteúdo educativo
├── navigation/      # Navegação e tipagem das rotas
│   ├── AppNavigator.tsx
│   └── types.ts
├── screens/         # Telas do app
│   ├── HomeScreen.tsx             # tela inicial / dashboard
│   ├── LearnScreen.tsx            # conteúdo educativo
│   ├── NewProjectScreen.tsx       # cadastro / formulário
│   ├── SimulationScreen.tsx       # processamento + notificação
│   ├── ResultScreen.tsx           # resultado da simulação
│   ├── ConfirmationScreen.tsx     # status de sucesso
│   ├── HistoryScreen.tsx          # listagem
│   └── ProjectDetailScreen.tsx    # detalhes de um projeto
├── services/        # Lógica e integrações
│   ├── simulation.ts              # cálculo da otimização
│   ├── storage.ts                 # CRUD em AsyncStorage
│   ├── notifications.ts           # notificações locais
│   └── imagePicker.ts             # câmera / galeria
├── theme/           # Cores, espaçamentos, tipografia
├── types/           # Tipos TypeScript centrais
└── utils/           # Formatação e validações
```

---

## ▶️ Como executar

Pré-requisitos: **Node.js 18+** e o app **Expo Go** no celular (Android/iOS).

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar o servidor de desenvolvimento
npx expo start
```

Em seguida, **escaneie o QR Code** exibido no terminal com o app **Expo Go**
(Android) ou com a **câmera** (iOS). O app abrirá no seu dispositivo.

> Para rodar em emulador: `npm run android` ou `npm run ios` (iOS requer macOS).

Scripts úteis:

```bash
npm run android      # abre no emulador/dispositivo Android
npm run ios          # abre no simulador iOS (macOS)
npx tsc --noEmit     # checagem de tipos
npx expo-doctor      # valida configuração do projeto
```

---

## ✅ Atendimento aos requisitos da avaliação

| Critério | Onde é atendido |
|---|---|
| **Interface Mobile (20)** | 8 telas organizadas, navegação por abas + pilha, layout responsivo com tema escuro consistente |
| **Navegação e Fluxo (20)** | Fluxo completo: cadastrar → simular → receber resposta → confirmar → consultar histórico → ver detalhes |
| **Manipulação de Dados (15)** | Catálogos em arquivos de dados, cálculo na camada de serviço, persistência em **AsyncStorage**, exibição clara de massa/custo/percentuais |
| **Recursos Mobile (15)** | **Câmera/Galeria** (`expo-image-picker`) e **Notificações locais** (`expo-notifications`) |
| **Erros e Validações (10)** | Campos obrigatórios e ranges no formulário, tratamento de permissão negada, falha de carregamento, registro não encontrado e erro de simulação |
| **Organização (20)** | Separação `screens` / `components` / `services` / `data`, nomes claros, TypeScript, código comentado e este README |

---

## 📸 Evidências de execução

Para incluir as evidências exigidas, rode o app com `npx expo start`, percorra o
fluxo no dispositivo e adicione as capturas em `docs/screenshots/`, por exemplo:

```
docs/screenshots/
├── 01-inicio.png
├── 02-aprender.png
├── 03-cadastro.png
├── 04-simulacao.png
├── 05-resultado.png
└── 06-historico.png
```

---

## 📝 Observações

- Os valores de custo por kg e as faixas de redução são **estimativas públicas com
  fins didáticos** — o objetivo é ilustrar o impacto da otimização topológica na
  economia espacial, não fornecer um cálculo de engenharia preciso.
- O app funciona **totalmente offline**; não requer backend nem conta.
