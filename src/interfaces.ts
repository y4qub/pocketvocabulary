export interface User {
    info: UserInfo
    languages: Array<string>
}

export interface UserInfo {
    streak: number
    practicedWords: number
    wordsToPractice: number
    lastActive: string
    timezone?: string
    practiceOptions: PracticeOptions
}

export interface PracticeOptions {
    repeatWords: boolean
    types: Array<string>
    translation: number
}

export interface Words {
    words1: Array<string>
    words2: Array<string>
}