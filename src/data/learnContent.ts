/**
 * Conteúdo educativo (dados em "JSON") exibido na tela Aprender.
 * Explica, em linguagem simples, o que é otimização topológica e por que
 * ela importa para a economia espacial.
 */
export interface LearnCard {
  id: string;
  icon: string;
  title: string;
  body: string;
}

export const LEARN_CARDS: LearnCard[] = [
  {
    id: 'what',
    icon: '🧠',
    title: 'O que é otimização topológica?',
    body:
      'É uma técnica de engenharia que descobre, por meio de cálculo, a melhor ' +
      'distribuição de material dentro de uma peça. Ela mantém o material apenas ' +
      'onde ele realmente carrega esforço e remove o resto — gerando estruturas ' +
      'leves, vazadas e de aparência orgânica.',
  },
  {
    id: 'why-space',
    icon: '🛰️',
    title: 'Por que importa no espaço?',
    body:
      'No espaço, cada grama custa caro: o lançamento é cobrado por quilo. ' +
      'Reduzir a massa das estruturas de um satélite diminui diretamente o custo ' +
      'de colocá-lo em órbita e libera capacidade para mais carga útil.',
  },
  {
    id: 'how',
    icon: '⚙️',
    title: 'Como funciona, na prática?',
    body:
      'Define-se o espaço disponível, onde a peça é fixada e quais forças ela ' +
      'sofre. O algoritmo então "esculpe" o material iterativamente, mantendo a ' +
      'rigidez necessária com o menor peso possível. O resultado lembra ossos ou ' +
      'treliças naturais.',
  },
  {
    id: 'benefits',
    icon: '📉',
    title: 'Quais os ganhos?',
    body:
      'Tipicamente é possível remover de 20% a 55% da massa de um componente ' +
      'estrutural mantendo a resistência. Em uma constelação de satélites, essa ' +
      'economia se multiplica por dezenas ou centenas de unidades.',
  },
  {
    id: 'restriction',
    icon: '🌌',
    title: 'Restrição gera criatividade',
    body:
      'O espaço é o ambiente mais restritivo que existe. Soluções criadas para ' +
      'esses limites — menos massa, menos energia, mais autonomia — acabam ' +
      'voltando para a Terra como inovação em carros, próteses e construção civil.',
  },
];
