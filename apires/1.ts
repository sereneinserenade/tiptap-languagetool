// @ts-nocheck
const query = "http://localhost:8081/v2/check?language=en-US&text=LanguageTool%20Extensin%20is%20the%20best%20onee%20there%20shud%20be."

const res = {
  "software": {
    "name": "LanguageTool",
    "version": "5.5",
    "buildDate": "2021-10-02 12:33:00 +0000",
    "apiVersion": 1,
    "premium": false,
    "premiumHint": "You might be missing errors only the Premium version can find. Contact us at support<at>languagetoolplus.com.",
    "status": ""
  },
  "warnings": {
    "incompleteResults": false
  },
  "language": {
    "name": "English (US)",
    "code": "en-US",
    "detectedLanguage": {
      "name": "English (US)",
      "code": "en-US",
      "confidence": 0.9999967
    }
  },
  "matches": [
    {
      "message": "Possible spelling mistake found.",
      "shortMessage": "Spelling mistake",
      "replacements": [
        {
          "value": "Extension"
        }
      ],
      "offset": 13,
      "length": 8,
      "context": {
        "text": "LanguageTool Extensin is the best onee there shud be.",
        "offset": 13,
        "length": 8
      },
      "sentence": "LanguageTool Extensin is the best onee there shud be.",
      "type": {
        "typeName": "Other"
      },
      "rule": {
        "id": "MORFOLOGIK_RULE_EN_US",
        "description": "Possible spelling mistake",
        "issueType": "misspelling",
        "category": {
          "id": "TYPOS",
          "name": "Possible Typo"
        }
      },
      "ignoreForIncompleteSentence": false,
      "contextForSureMatch": 0
    },
    {
      "message": "Possible spelling mistake found.",
      "shortMessage": "Spelling mistake",
      "replacements": [
        {
          "value": "one"
        },
        {
          "value": "once"
        },
        {
          "value": "ones"
        },
        {
          "value": "knee"
        },
        {
          "value": "nee"
        },
        {
          "value": "née"
        },
        {
          "value": "NEE"
        },
        {
          "value": "ONCE"
        },
        {
          "value": "ONE"
        },
        {
          "value": "ONEM"
        },
        {
          "value": "o nee"
        }
      ],
      "offset": 34,
      "length": 4,
      "context": {
        "text": "LanguageTool Extensin is the best onee there shud be.",
        "offset": 34,
        "length": 4
      },
      "sentence": "LanguageTool Extensin is the best onee there shud be.",
      "type": {
        "typeName": "Other"
      },
      "rule": {
        "id": "MORFOLOGIK_RULE_EN_US",
        "description": "Possible spelling mistake",
        "issueType": "misspelling",
        "category": {
          "id": "TYPOS",
          "name": "Possible Typo"
        }
      },
      "ignoreForIncompleteSentence": false,
      "contextForSureMatch": 0
    },
    {
      "message": "Possible spelling mistake found.",
      "shortMessage": "Spelling mistake",
      "replacements": [
        {
          "value": "shut"
        },
        {
          "value": "shed"
        },
        {
          "value": "HUD"
        },
        {
          "value": "shad"
        },
        {
          "value": "shun"
        },
        {
          "value": "Scud"
        },
        {
          "value": "spud"
        },
        {
          "value": "scud"
        },
        {
          "value": "SHD"
        },
        {
          "value": "SHU"
        },
        {
          "value": "SOUD"
        },
        {
          "value": "SUD"
        },
        {
          "value": "shod"
        },
        {
          "value": "stud"
        },
        {
          "value": "thud"
        }
      ],
      "offset": 45,
      "length": 4,
      "context": {
        "text": "...ageTool Extensin is the best onee there shud be.",
        "offset": 43,
        "length": 4
      },
      "sentence": "LanguageTool Extensin is the best onee there shud be.",
      "type": {
        "typeName": "Other"
      },
      "rule": {
        "id": "MORFOLOGIK_RULE_EN_US",
        "description": "Possible spelling mistake",
        "issueType": "misspelling",
        "category": {
          "id": "TYPOS",
          "name": "Possible Typo"
        }
      },
      "ignoreForIncompleteSentence": false,
      "contextForSureMatch": 0
    }
  ]
}