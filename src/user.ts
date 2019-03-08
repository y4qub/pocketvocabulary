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
}