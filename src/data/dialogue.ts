import { DialogueStep } from '../types';

export const KEYWORDS_PREVIEW = [
  { word: 'subway', meaningKo: '지하철' },
  { word: 'station', meaningKo: '역' },
  { word: 'left', meaningKo: '왼쪽' },
  { word: 'bank', meaningKo: '은행' },
  { word: 'far', meaningKo: '먼' },
  { word: 'map', meaningKo: '지도' },
];

export const DIALOGUE_STEPS: DialogueStep[] = [
  {
    id: 1,
    partnerLine: 'Hi! You look lost. Can I help you?',
    partnerLineKo: '안녕하세요! 길을 잃으신 것 같네요. 도와드릴까요?',
    targetSentence: 'Yes, please. Where is the subway station?',
    targetSentenceKo: '네, 부탁해요. 지하철역이 어디예요?',
    keyWords: ['where', 'subway', 'station'],
    smallKeywords: ['the'],
    blanksSentence: 'Yes, please. Where is the ______ ______?',
    blankWords: ['subway', 'station'],
    recastFeedback: {
      en: 'Nice try! You can say, "Where is the subway station?"',
      ko: '이렇게 말해 볼까요?',
    },
    elicitationFeedback: {
      en: "You're almost there! \"Where is the subway s___?\"",
      ko: '마지막 단어는 s로 시작해요.',
    },
    chunkingFeedback: {
      en: 'Let\'s say it in small parts: "Where is" … "the subway station?"',
      ko: '짧게 나눠서 따라 말해 봐요.',
    },
    smallWordMissingFeedback: {
      en: 'Good job! Try adding "the": "Where is the subway station?"',
      ko: '"the"도 넣어서 말해 볼까요?',
    },
    successFeedback: {
      en: 'Great! I know exactly where you want to go.',
      ko: '어디 가고 싶은지 정확히 알아들었어요!',
    },
  },
  {
    id: 2,
    partnerLine: 'Go straight and turn left at the bank.',
    partnerLineKo: '직진하다가 은행에서 왼쪽으로 도세요.',
    targetSentence: 'Turn left at the bank?',
    targetSentenceKo: '은행에서 왼쪽으로요?',
    keyWords: ['left', 'bank'],
    smallKeywords: ['the'],
    blanksSentence: 'Turn ______ at the ______?',
    blankWords: ['left', 'bank'],
    recastFeedback: {
      en: 'Nice try! You can say, "Turn left at the bank?"',
      ko: '이렇게 말해 볼까요?',
    },
    elicitationFeedback: {
      en: "You're almost there! \"Turn l___ at the bank?\"",
      ko: '방향 단어는 l로 시작해요.',
    },
    chunkingFeedback: {
      en: 'Let\'s say it in small parts: "Turn left" … "at the bank?"',
      ko: '짧게 나눠서 따라 말해 봐요.',
    },
    smallWordMissingFeedback: {
      en: 'Good job! Try adding "at the": "Turn left at the bank?"',
      ko: '"at the"도 넣어서 또렷하게 말해 볼까요?',
    },
    successFeedback: {
      en: 'Spot on! That corner is easy to remember.',
      ko: '네 맞아요! 그 코너만 기억하시면 돼요.',
    },
  },
  {
    id: 3,
    partnerLine: "That's right. It's next to the park.",
    partnerLineKo: '맞아요. 공원 옆에 있어요.',
    targetSentence: 'Is it far from here?',
    targetSentenceKo: '여기서 멀어요?',
    keyWords: ['far', 'here'],
    smallKeywords: ['is', 'it'],
    blanksSentence: 'Is it ______ from ______?',
    blankWords: ['far', 'here'],
    recastFeedback: {
      en: 'Nice try! You can say, "Is it far from here?"',
      ko: '이렇게 말해 볼까요?',
    },
    elicitationFeedback: {
      en: "You're almost there! \"Is it f___ from here?\"",
      ko: '거리 단어는 f로 시작해요.',
    },
    chunkingFeedback: {
      en: 'Let\'s say it in small parts: "Is it far" … "from here?"',
      ko: '짧게 나눠서 따라 말해 봐요.',
    },
    smallWordMissingFeedback: {
      en: 'Good job! Try asking clearly: "Is it far from here?"',
      ko: '"Is it"도 챙겨서 질문해 볼까요?',
    },
    successFeedback: {
      en: 'Good question! Not far at all.',
      ko: '좋은 질문이에요! 전혀 멀지 않아요.',
    },
  },
  {
    id: 4,
    partnerLine: "No, it's a five-minute walk.",
    partnerLineKo: '아니요, 걸어서 5분 거리예요.',
    targetSentence: 'Can you show me on the map?',
    targetSentenceKo: '지도에서 보여 주실 수 있어요?',
    keyWords: ['show', 'map'],
    smallKeywords: ['the'],
    blanksSentence: 'Can you ______ me on the ______?',
    blankWords: ['show', 'map'],
    recastFeedback: {
      en: 'Nice try! You can say, "Can you show me on the map?"',
      ko: '이렇게 말해 볼까요?',
    },
    elicitationFeedback: {
      en: "You're almost there! \"Can you show me on the m___?\"",
      ko: '마지막 단어는 m으로 시작해요.',
    },
    chunkingFeedback: {
      en: 'Let\'s say it in small parts: "Can you show me" … "on the map?"',
      ko: '짧게 나눠서 따라 말해 봐요.',
    },
    smallWordMissingFeedback: {
      en: 'Good job! Try adding "on the": "Can you show me on the map?"',
      ko: '"on the map"으로 말해 볼까요?',
    },
    successFeedback: {
      en: "Sure thing! Let's take a look together.",
      ko: '그럼요! 지도에서 바로 짚어 드릴게요.',
    },
  },
  {
    id: 5,
    partnerLine: "Sure! It's right here. Have a nice trip!",
    partnerLineKo: '물론이죠! 바로 여기예요. 즐거운 여행 되세요!',
    targetSentence: 'Thank you so much for your help.',
    targetSentenceKo: '도와주셔서 정말 감사해요.',
    keyWords: ['thank', 'help'],
    smallKeywords: ['for', 'your'],
    blanksSentence: '______ you so much for your ______.',
    blankWords: ['Thank', 'help'],
    recastFeedback: {
      en: 'Nice try! You can say, "Thank you so much for your help."',
      ko: '이렇게 말해 볼까요?',
    },
    elicitationFeedback: {
      en: "You're almost there! \"Thank you so much for your h___.\"",
      ko: '마지막 단어는 h로 시작해요.',
    },
    chunkingFeedback: {
      en: 'Let\'s say it in small parts: "Thank you so much" … "for your help."',
      ko: '짧게 나눠서 따라 말해 봐요.',
    },
    smallWordMissingFeedback: {
      en: 'Good job! Try adding "for your": "Thank you so much for your help."',
      ko: '"for your help"도 살려서 말해 볼까요?',
    },
    successFeedback: {
      en: "You're very welcome! Have a fantastic trip!",
      ko: '천만에요! 즐겁고 안전한 여행 되세요!',
    },
  },
];
