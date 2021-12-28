export interface Software {
  name: string
  version: string
  buildDate: string
  apiVersion: number
  premium: boolean
  premiumHint: string
  status: string
}

export interface Warnings {
  incompleteResults: boolean
}

export interface DetectedLanguage {
  name: string
  code: string
  confidence: number
}

export interface Language {
  name: string
  code: string
  detectedLanguage: DetectedLanguage
}

export interface Replacement {
  value: string
}

export interface Context {
  text: string
  offset: number
  length: number
}

export interface Type {
  typeName: string
}

export interface Category {
  id: string
  name: string
}

export interface Rule {
  id: string
  description: string
  issueType: string
  category: Category
}

export interface Match {
  message: string
  shortMessage: string
  replacements: Replacement[]
  offset: number
  length: number
  context: Context
  sentence: string
  type: Type
  rule: Rule
  ignoreForIncompleteSentence: boolean
  contextForSureMatch: number
}

export interface LanguageToolResponse {
  software: Software
  warnings: Warnings
  language: Language
  matches: Match[]
}
