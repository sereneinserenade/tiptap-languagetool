/* eslint-disable max-len */
export default {
  software: {
    name: 'LanguageTool',
    version: '5.5',
    buildDate: '2021-10-02 12:33:00 +0000',
    apiVersion: 1,
    premium: false,
    premiumHint:
      'You might be missing errors only the Premium version can find. Contact us at support<at>languagetoolplus.com.',
    status: '',
  },
  warnings: {
    incompleteResults: false,
  },
  language: {
    name: 'English (US)',
    code: 'en-US',
    detectedLanguage: {
      name: 'English (US)',
      code: 'en-US',
      confidence: 0.99999416,
    },
  },
  matches: [
    {
      message: 'Possible typo: you repeated a whitespace',
      shortMessage: '',
      replacements: [
        {
          value: ' ',
        },
      ],
      offset: 21,
      length: 2,
      context: {
        text: 'Welcome to the Editor  The LanguageTool Editor is built by writ...',
        offset: 21,
        length: 2,
      },
      sentence: 'Welcome to the Editor  The LanguageTool Editor is built by writers for writers.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'WHITESPACE_RULE',
        description: 'Whitespace repetition (bad formatting)',
        issueType: 'whitespace',
        category: {
          id: 'TYPOGRAPHY',
          name: 'Typography',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: -1,
    },
    {
      message: 'Consider using an extreme adjective for ‘good’.',
      shortMessage: 'Use an extreme adjective instead.',
      replacements: [
        {
          value: 'Perfect',
        },
        {
          value: 'Excellent',
        },
        {
          value: 'Superb',
        },
        {
          value: 'Wonderful',
        },
        {
          value: 'Fantastic',
        },
      ],
      offset: 148,
      length: 11,
      context: {
        text: '...duction including some example errors.  Really good spelling and grammar make you writing m...',
        offset: 43,
        length: 11,
      },
      sentence:
        'Really good spelling and grammar make you writing more credible and set you up for succes in a time where written communication gets more and more important.',
      type: {
        typeName: 'Hint',
      },
      rule: {
        id: 'EXTREME_ADJECTIVES',
        subId: '9',
        sourceFile: 'grammar.xml',
        description: 'Extreme adjectives',
        issueType: 'style',
        urls: [
          {
            value: 'https://insights.languagetool.com/post/really-very/',
          },
        ],
        category: {
          id: 'STYLE',
          name: 'Style',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: -1,
    },
    {
      message: '‘you’ (personal pronoun) seems less likely than ‘your’ (belonging to you).',
      shortMessage: 'Possible word confusion',
      replacements: [
        {
          value: 'your',
          shortDescription: 'belonging to you',
        },
      ],
      offset: 186,
      length: 3,
      context: {
        text: '...  Really good spelling and grammar make you writing more credible and set you up fo...',
        offset: 43,
        length: 3,
      },
      sentence:
        'Really good spelling and grammar make you writing more credible and set you up for succes in a time where written communication gets more and more important.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'CONFUSION_RULE_YOU_YOUR',
        description: 'Detects potentially wrong usage of "you" instead of "your"',
        issueType: 'non-conformance',
        category: {
          id: 'TYPOS',
          name: 'Possible Typo',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 3,
    },
    {
      message: 'Possible spelling mistake found.',
      shortMessage: 'Spelling mistake',
      replacements: [
        {
          value: 'success',
        },
      ],
      offset: 231,
      length: 6,
      context: {
        text: '...riting more credible and set you up for succes in a time where written communication g...',
        offset: 43,
        length: 6,
      },
      sentence:
        'Really good spelling and grammar make you writing more credible and set you up for succes in a time where written communication gets more and more important.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'MORFOLOGIK_RULE_EN_US',
        description: 'Possible spelling mistake',
        issueType: 'misspelling',
        category: {
          id: 'TYPOS',
          name: 'Possible Typo',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 0,
    },
    {
      message:
        'It might be better to use ‘time’ with the time-relative pronoun ‘when’. (Alternatively, use ‘in/on which’.)',
      shortMessage: '',
      replacements: [
        {
          value: 'time when',
        },
      ],
      offset: 243,
      length: 10,
      context: {
        text: '...credible and set you up for succes in a time where written communication gets more and mor...',
        offset: 43,
        length: 10,
      },
      sentence:
        'Really good spelling and grammar make you writing more credible and set you up for succes in a time where written communication gets more and more important.',
      type: {
        typeName: 'Hint',
      },
      rule: {
        id: 'WHEN_WHERE',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: 'where/when',
        issueType: 'style',
        urls: [
          {
            value: 'https://www.dictionary.com/browse/where',
          },
        ],
        category: {
          id: 'STYLE',
          name: 'Style',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 0,
    },
    {
      message: 'Did you mean “than”?',
      shortMessage: 'Possible typo',
      replacements: [
        {
          value: 'than',
          shortDescription: 'used in comparisons',
        },
      ],
      offset: 344,
      length: 4,
      context: {
        text: '.... LanguageTool finds many more mistakes then other writing tools and is available fo...',
        offset: 43,
        length: 4,
      },
      sentence:
        'LanguageTool finds many more mistakes then other writing tools and is available for more than 20+ languages.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'LESS_MORE_THEN',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: 'less/more ... then (than)',
        issueType: 'misspelling',
        category: {
          id: 'CONFUSED_WORDS',
          name: 'Commonly Confused Words',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 2,
    },
    {
      message: 'The “+” seems to be redundant in this sentence. Consider removing it.',
      shortMessage: '',
      replacements: [
        {
          value: '20',
        },
      ],
      offset: 400,
      length: 3,
      context: {
        text: '...ng tools and is available for more than 20+ languages.  We provide you with a state...',
        offset: 43,
        length: 3,
      },
      sentence:
        'LanguageTool finds many more mistakes then other writing tools and is available for more than 20+ languages.',
      type: {
        typeName: 'Hint',
      },
      rule: {
        id: 'MORE_THAN_CD_PLUS',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: "Redundant 'plus': 100+ and more",
        issueType: 'style',
        category: {
          id: 'REDUNDANCY',
          name: 'Redundant Phrases',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 0,
    },
    {
      message: 'Consider adding hyphens to this phrasal adjective.',
      shortMessage: '',
      replacements: [
        {
          value: 'state-of-the-art',
        },
      ],
      offset: 438,
      length: 16,
      context: {
        text: '...n 20+ languages.  We provide you with a state of the art grammar and spell checker and ensure co...',
        offset: 43,
        length: 16,
      },
      sentence:
        'We provide you with a state of the art grammar and spell checker and ensure correct punctuation and typography.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'STATE_OF_THE_ART',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: 'state of the art (state-of-the-art)',
        issueType: 'typographical',
        category: {
          id: 'PUNCTUATION',
          name: 'Punctuation',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 1,
    },
    {
      message: 'A comma may be missing after the conjunctive/linking adverb ‘However’.',
      shortMessage: 'Punctuation error',
      replacements: [
        {
          value: 'However,',
        },
      ],
      offset: 528,
      length: 7,
      context: {
        text: '...ure correct punctuation and typography. However LanguageTool goes far beyond that: It e...',
        offset: 43,
        length: 7,
      },
      sentence:
        'However LanguageTool goes far beyond that: It enriches your writing experience with style and tone suggestions that take your writing to the next level.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'SENT_START_CONJUNCTIVE_LINKING_ADVERB_COMMA',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: 'Commas after conjunctive/linking adverbs in front of a new sentence.',
        issueType: 'typographical',
        urls: [
          {
            value: 'https://writing.wisc.edu/handbook/grammarpunct/conjadv/',
          },
        ],
        category: {
          id: 'PUNCTUATION',
          name: 'Punctuation',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: 10,
    },
    {
      message: 'Possible typo: you repeated a whitespace',
      shortMessage: '',
      replacements: [
        {
          value: ' ',
        },
      ],
      offset: 692,
      length: 2,
      context: {
        text: '...r writing to the next level.  The Basics  Regular spelling mistakes are underlind ...',
        offset: 43,
        length: 2,
      },
      sentence: 'The Basics  Regular spelling mistakes are underlind in red.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'WHITESPACE_RULE',
        description: 'Whitespace repetition (bad formatting)',
        issueType: 'whitespace',
        category: {
          id: 'TYPOGRAPHY',
          name: 'Typography',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: -1,
    },
    {
      message: 'Possible spelling mistake found.',
      shortMessage: 'Spelling mistake',
      replacements: [
        {
          value: 'underlined',
        },
        {
          value: 'underline',
        },
        {
          value: 'underling',
        },
      ],
      offset: 724,
      length: 9,
      context: {
        text: '...e Basics  Regular spelling mistakes are underlind in red. You can ether click directly on...',
        offset: 43,
        length: 9,
      },
      sentence: 'The Basics  Regular spelling mistakes are underlind in red.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'MORFOLOGIK_RULE_EN_US',
        description: 'Possible spelling mistake',
        issueType: 'misspelling',
        category: {
          id: 'TYPOS',
          name: 'Possible Typo',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 0,
    },
    {
      message: 'Did you mean “either”?',
      shortMessage: '',
      replacements: [
        {
          value: 'either',
        },
      ],
      offset: 750,
      length: 5,
      context: {
        text: '... mistakes are underlind in red. You can ether click directly on the word you want to ...',
        offset: 43,
        length: 5,
      },
      sentence:
        'You can ether click directly on the word you want to correct or hit the corresponding card on the right hand side to get even more information regarding the error.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'ETHER_EITHER',
        subId: '2',
        sourceFile: 'grammar.xml',
        description: 'ether vs either',
        issueType: 'misspelling',
        category: {
          id: 'CONFUSED_WORDS',
          name: 'Commonly Confused Words',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: 12,
    },
    {
      message: 'Did you mean the adjective “right-hand”?',
      shortMessage: 'Missing hyphen',
      replacements: [
        {
          value: 'right-hand',
        },
      ],
      offset: 840,
      length: 10,
      context: {
        text: '...ct or hit the corresponding card on the right hand side to get even more information regar...',
        offset: 43,
        length: 10,
      },
      sentence:
        'You can ether click directly on the word you want to correct or hit the corresponding card on the right hand side to get even more information regarding the error.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'MISSING_HYPHEN',
        subId: '13',
        sourceFile: 'grammar.xml',
        description: 'Missing hyphens in compounds',
        issueType: 'typographical',
        category: {
          id: 'PUNCTUATION',
          name: 'Punctuation',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: 6,
    },
    {
      message: 'The word “quick” is an adjective and doesn’t fit in this context. Did you mean the adverb “quickly”?',
      shortMessage: 'Adverb expected',
      replacements: [
        {
          value: 'quickly',
        },
      ],
      offset: 969,
      length: 5,
      context: {
        text: '... editor will be stored for you. You can quick switch between texts by using the overv...',
        offset: 43,
        length: 5,
      },
      sentence: 'You can quick switch between texts by using the overview on the left-hand side.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'ADJECTIVE_ADVERB',
        subId: '17',
        sourceFile: 'grammar.xml',
        description: 'adjective vs. adverb',
        issueType: 'misspelling',
        category: {
          id: 'CONFUSED_WORDS',
          name: 'Commonly Confused Words',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: -1,
    },
    {
      message: 'Did you mean: “By default,”?',
      shortMessage: 'Punctuation error',
      replacements: [
        {
          value: 'By default,',
        },
      ],
      offset: 1088,
      length: 10,
      context: {
        text: '...xts are not meant to be stored forever. By default texts will disappear from your text lis...',
        offset: 43,
        length: 10,
      },
      sentence:
        'By default texts will disappear from your text list after two weeks to keep your overview clutter-free and tidy.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'BY_DEFAULT_COMMA',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: 'Comma after by default at the beginning of a sentence.',
        issueType: 'typographical',
        category: {
          id: 'PUNCTUATION',
          name: 'Punctuation',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 1,
    },
    {
      message: 'Typo. Did you mean “be recovered”?',
      shortMessage: 'Possible agreement error',
      replacements: [
        {
          value: 'be recovered',
        },
      ],
      offset: 1244,
      length: 9,
      context: {
        text: '... your texts are still available and can recovered from the settings page. If you want to ...',
        offset: 43,
        length: 9,
      },
      sentence: 'All your texts are still available and can recovered from the settings page.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'WILL_BASED_ON',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: 'it would (be) appreciated',
        issueType: 'grammar',
        category: {
          id: 'GRAMMAR',
          name: 'Grammar',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: 6,
    },
    {
      message: 'Possible typo: you repeated a whitespace',
      shortMessage: '',
      replacements: [
        {
          value: ' ',
        },
      ],
      offset: 1368,
      length: 2,
      context: {
        text: '...just mark them as permanent.  Picky Mode  Every now and then, a text has to be fla...',
        offset: 43,
        length: 2,
      },
      sentence:
        'Picky Mode  Every now and then, a text has to be flawless and respect strict rules and conventions that are a bit over-the-top for every day conversations.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'WHITESPACE_RULE',
        description: 'Whitespace repetition (bad formatting)',
        issueType: 'whitespace',
        category: {
          id: 'TYPOGRAPHY',
          name: 'Typography',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: -1,
    },
    {
      message: 'Consider an alternative to strengthen your wording.',
      shortMessage: 'Possible redundant phrase',
      replacements: [
        {
          value: 'Sometimes',
        },
        {
          value: 'Occasionally',
        },
        {
          value: 'Sporadically',
        },
        {
          value: 'Now and then',
        },
      ],
      offset: 1370,
      length: 18,
      context: {
        text: '...st mark them as permanent.  Picky Mode  Every now and then, a text has to be flawless and respect ...',
        offset: 43,
        length: 18,
      },
      sentence:
        'Picky Mode  Every now and then, a text has to be flawless and respect strict rules and conventions that are a bit over-the-top for every day conversations.',
      type: {
        typeName: 'Hint',
      },
      rule: {
        id: 'EVERY_NOW_AND_THEN',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: 'every now and then (now and then)',
        issueType: 'style',
        urls: [
          {
            value: 'https://www.collinsdictionary.com/dictionary/english/now-and-then',
          },
        ],
        category: {
          id: 'REDUNDANCY',
          name: 'Redundant Phrases',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 0,
    },
    {
      message: 'Did you mean “for everyday”?',
      shortMessage: '',
      replacements: [
        {
          value: 'for everyday',
        },
      ],
      offset: 1485,
      length: 13,
      context: {
        text: '...conventions that are a bit over-the-top for every day conversations. In those cases, you have...',
        offset: 43,
        length: 13,
      },
      sentence:
        'Picky Mode  Every now and then, a text has to be flawless and respect strict rules and conventions that are a bit over-the-top for every day conversations.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'ANINFOR_EVERY_DAY',
        subId: '2',
        sourceFile: 'grammar.xml',
        description: 'an every day (everyday)',
        issueType: 'misspelling',
        category: {
          id: 'TYPOS',
          name: 'Possible Typo',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 1,
    },
    {
      message: 'Possible typo: you repeated a whitespace',
      shortMessage: '',
      replacements: [
        {
          value: ' ',
        },
      ],
      offset: 1712,
      length: 2,
      context: {
        text: "... your writing.  Distraction-free Writing  In the top-right corner, you'll find opt...",
        offset: 43,
        length: 2,
      },
      sentence: "Distraction-free Writing  In the top-right corner, you'll find options to toggle the side bars.",
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'WHITESPACE_RULE',
        description: 'Whitespace repetition (bad formatting)',
        issueType: 'whitespace',
        category: {
          id: 'TYPOGRAPHY',
          name: 'Typography',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: -1,
    },
    {
      message: 'This word is normally spelled as one.',
      shortMessage: 'Compound',
      replacements: [
        {
          value: 'sidebars',
        },
      ],
      offset: 1773,
      length: 9,
      context: {
        text: "...rner, you'll find options to toggle the side bars. By blending out all noise, you can foc...",
        offset: 43,
        length: 9,
      },
      sentence: "Distraction-free Writing  In the top-right corner, you'll find options to toggle the side bars.",
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'EN_COMPOUNDS',
        description: "Hyphenated words, e.g., 'case-sensitive' instead of 'case sensitive'",
        issueType: 'misspelling',
        category: {
          id: 'MISC',
          name: 'Miscellaneous',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 1,
    },
    {
      message: 'Possible typo: you repeated a whitespace',
      shortMessage: '',
      replacements: [
        {
          value: ' ',
        },
      ],
      offset: 1938,
      length: 2,
      context: {
        text: '...onyms, Grammatical Gender, Pronunciation  Double clicking on any word will provide...',
        offset: 43,
        length: 2,
      },
      sentence:
        'Synonyms, Grammatical Gender, Pronunciation  Double clicking on any word will provide you with more context or alternative words to make your texts sound more diverse.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'WHITESPACE_RULE',
        description: 'Whitespace repetition (bad formatting)',
        issueType: 'whitespace',
        category: {
          id: 'TYPOGRAPHY',
          name: 'Typography',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: -1,
    },
    {
      message: 'This expression is usually spelled with a hyphen.',
      shortMessage: '',
      replacements: [
        {
          value: 'Double-clicking',
        },
      ],
      offset: 1940,
      length: 15,
      context: {
        text: '...yms, Grammatical Gender, Pronunciation  Double clicking on any word will provide you with more ...',
        offset: 43,
        length: 15,
      },
      sentence:
        'Synonyms, Grammatical Gender, Pronunciation  Double clicking on any word will provide you with more context or alternative words to make your texts sound more diverse.',
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'DOUBLE_CLICK_HYPHEN',
        subId: '3',
        sourceFile: 'grammar.xml',
        description: "missing hyphen in 'double click' (verb)",
        issueType: 'grammar',
        category: {
          id: 'GRAMMAR',
          name: 'Grammar',
        },
      },
      ignoreForIncompleteSentence: false,
      contextForSureMatch: 1,
    },
    {
      message: 'A comma may be missing after the conjunctive/linking adverb ‘Also’.',
      shortMessage: 'Punctuation error',
      replacements: [
        {
          value: 'Also,',
        },
      ],
      offset: 2181,
      length: 4,
      context: {
        text: '... the grammatical gender for every noun. Also there is the option to make your browse...',
        offset: 43,
        length: 4,
      },
      sentence:
        "Also there is the option to make your browser read out loud any word if you are unsure about it's pronunciation (only available in Google Chrome).",
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'SENT_START_CONJUNCTIVE_LINKING_ADVERB_COMMA',
        subId: '1',
        sourceFile: 'grammar.xml',
        description: 'Commas after conjunctive/linking adverbs in front of a new sentence.',
        issueType: 'typographical',
        urls: [
          {
            value: 'https://writing.wisc.edu/handbook/grammarpunct/conjadv/',
          },
        ],
        category: {
          id: 'PUNCTUATION',
          name: 'Punctuation',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: 10,
    },
    {
      message: 'Did you mean “its” (possessive pronoun) instead of ‘it’s’ (short for ‘it is’)?',
      shortMessage: '',
      replacements: [
        {
          value: 'its',
          shortDescription: 'belonging to it',
        },
      ],
      offset: 2274,
      length: 4,
      context: {
        text: '...t loud any word if you are unsure about it’s pronunciation (only available in Google...',
        offset: 43,
        length: 4,
      },
      sentence:
        "Also there is the option to make your browser read out loud any word if you are unsure about it's pronunciation (only available in Google Chrome).",
      type: {
        typeName: 'Other',
      },
      rule: {
        id: 'ABOUT_ITS_NN',
        subId: '49',
        sourceFile: 'grammar.xml',
        description: 'about its NN (possessive)',
        issueType: 'misspelling',
        urls: [
          {
            value: 'https://www.dictionary.com/e/its-vs-its/',
          },
        ],
        category: {
          id: 'TYPOS',
          name: 'Possible Typo',
        },
      },
      ignoreForIncompleteSentence: true,
      contextForSureMatch: 6,
    },
  ],
}
