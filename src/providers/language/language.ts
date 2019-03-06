import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'firebase'

/*
  Generated class for the LanguagesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class LanguageProvider {
  user: User
  constructor(public auth: AngularFireAuth, public db: AngularFireDatabase) {
    this.auth.authState.subscribe((auth: User) => {
      this.user = auth
    })
  }
  getLanguageList() {
    return languageList
  }

  getLanguageNames() {
    return languageList.map(item => {
      // Simplify the name
      let name = item.name
      if (item.name.includes(','))
        name = item.name.split(',')[0]
      if (item.name.includes(';'))
        name = item.name.split(';')[0]
      return name
    })
  }

  getLanguageName(code: string) {
    return new Promise((resolve, reject) => {
      languageList.forEach(element => {
        if (element.code == code) resolve(element.name)
      })
      reject('No match')
    })
  }

  getLanguageCode(name: string) {
    return new Promise((resolve, reject) => {
      languageList.forEach(element => {
        if (element.name.includes(name)) resolve(element.code)
      })
      reject('No match')
    })
  }

  fetchWords(language: string, cb) {
    let words1 = null
    let words2 = null
    if (!this.user || !language || typeof language !== 'string') return
    this.db.database.ref(`users/${this.user.uid}/languages/${language}`).once('value').then(snapshot => {
      const value = snapshot.val()
      // Check if the selected language has vocabulary
      if (value && Object.keys(value).indexOf('vocabulary') != -1) {
        words1 = Object.keys(value['vocabulary'])
        words2 = []
        words1.forEach(element => {
          words2.push(value['vocabulary'][element])
        })
      }
      cb(words1, words2)
    })
  }

  fetchLanguages(cb) {
    let languages
    if (!this.user) return
    this.db.database.ref(`users/${this.user.uid}`).once('value').then(snapshot => {
      // Check if the selected user has any lanaguages
      if (snapshot && snapshot.val() && snapshot.val()['languages'])
        languages = Object.keys(snapshot.val()['languages'])
      cb(languages)
    })
  }

}

const languageList = [
  {
    "code": "af",
    "name": "Afrikaans",
    "nativeName": "Afrikaans"
  },
  {
    "code": "am",
    "name": "Amharic",
    "nativeName": "አማርኛ"
  },
  {
    "code": "ar",
    "name": "Arabic",
    "nativeName": "العربية"
  },
  {
    "code": "az",
    "name": "Azerbaijani",
    "nativeName": "azərbaycan dili"
  },
  {
    "code": "be",
    "name": "Belarusian",
    "nativeName": "Беларуская"
  },
  {
    "code": "bg",
    "name": "Bulgarian",
    "nativeName": "български език"
  },
  {
    "code": "bn",
    "name": "Bengali",
    "nativeName": "বাংলা"
  },
  {
    "code": "bs",
    "name": "Bosnian",
    "nativeName": "bosanski jezik"
  },
  {
    "code": "ca",
    "name": "Catalan; Valencian",
    "nativeName": "Català"
  },
  {
    "code": "co",
    "name": "Corsican",
    "nativeName": "corsu, lingua corsa"
  },
  {
    "code": "cs",
    "name": "Czech",
    "nativeName": "česky, čeština"
  },
  {
    "code": "cy",
    "name": "Welsh",
    "nativeName": "Cymraeg"
  },
  {
    "code": "da",
    "name": "Danish",
    "nativeName": "dansk"
  },
  {
    "code": "de",
    "name": "German",
    "nativeName": "Deutsch"
  },
  {
    "code": "el",
    "name": "Greek, Modern",
    "nativeName": "Ελληνικά"
  },
  {
    "code": "en",
    "name": "English",
    "nativeName": "English"
  },
  {
    "code": "eo",
    "name": "Esperanto",
    "nativeName": "Esperanto"
  },
  {
    "code": "es",
    "name": "Spanish; Castilian",
    "nativeName": "español, castellano"
  },
  {
    "code": "et",
    "name": "Estonian",
    "nativeName": "eesti, eesti keel"
  },
  {
    "code": "eu",
    "name": "Basque",
    "nativeName": "euskara, euskera"
  },
  {
    "code": "fa",
    "name": "Persian",
    "nativeName": "فارسی"
  },
  {
    "code": "fi",
    "name": "Finnish",
    "nativeName": "suomi, suomen kieli"
  },
  {
    "code": "fr",
    "name": "French",
    "nativeName": "français, langue française"
  },
  {
    "code": "fy",
    "name": "Western Frisian",
    "nativeName": "Frysk"
  },
  {
    "code": "ga",
    "name": "Irish",
    "nativeName": "Gaeilge"
  },
  {
    "code": "gd",
    "name": "Scottish Gaelic; Gaelic",
    "nativeName": "Gàidhlig"
  },
  {
    "code": "gl",
    "name": "Galician",
    "nativeName": "Galego"
  },
  {
    "code": "gu",
    "name": "Gujarati",
    "nativeName": "ગુજરાતી"
  },
  {
    "code": "ha",
    "name": "Hausa",
    "nativeName": "Hausa, هَوُسَ"
  },
  {
    "code": "hi",
    "name": "Hindi",
    "nativeName": "हिन्दी, हिंदी"
  },
  {
    "code": "hr",
    "name": "Croatian",
    "nativeName": "hrvatski"
  },
  {
    "code": "ht",
    "name": "Haitian; Haitian Creole",
    "nativeName": "Kreyòl ayisyen"
  },
  {
    "code": "hu",
    "name": "Hungarian",
    "nativeName": "Magyar"
  },
  {
    "code": "hy",
    "name": "Armenian",
    "nativeName": "Հայերեն"
  },
  {
    "code": "id",
    "name": "Indonesian",
    "nativeName": "Bahasa Indonesia"
  },
  {
    "code": "ig",
    "name": "Igbo",
    "nativeName": "Asụsụ Igbo"
  },
  {
    "code": "is",
    "name": "Icelandic",
    "nativeName": "Íslenska"
  },
  {
    "code": "it",
    "name": "Italian",
    "nativeName": "Italiano"
  },
  {
    "code": "ja",
    "name": "Japanese",
    "nativeName": "日本語 (にほんご／にっぽんご)"
  },
  {
    "code": "ka",
    "name": "Georgian",
    "nativeName": "ქართული"
  },
  {
    "code": "kk",
    "name": "Kazakh",
    "nativeName": "Қазақ тілі"
  },
  {
    "code": "km",
    "name": "Khmer",
    "nativeName": "ភាសាខ្មែរ"
  },
  {
    "code": "kn",
    "name": "Kannada",
    "nativeName": "ಕನ್ನಡ"
  },
  {
    "code": "ko",
    "name": "Korean",
    "nativeName": "한국어 (韓國語), 조선말 (朝鮮語)"
  },
  {
    "code": "ku",
    "name": "Kurdish",
    "nativeName": "Kurdî, كوردی‎"
  },
  {
    "code": "ky",
    "name": "Kirghiz, Kyrgyz",
    "nativeName": "кыргыз тили"
  },
  {
    "code": "la",
    "name": "Latin",
    "nativeName": "latine, lingua latina"
  },
  {
    "code": "lb",
    "name": "Luxembourgish, Letzeburgesch",
    "nativeName": "Lëtzebuergesch"
  },
  {
    "code": "lo",
    "name": "Lao",
    "nativeName": "ພາສາລາວ"
  },
  {
    "code": "lt",
    "name": "Lithuanian",
    "nativeName": "lietuvių kalba"
  },
  {
    "code": "lv",
    "name": "Latvian",
    "nativeName": "latviešu valoda"
  },
  {
    "code": "mg",
    "name": "Malagasy",
    "nativeName": "Malagasy fiteny"
  },
  {
    "code": "mi",
    "name": "Māori",
    "nativeName": "te reo Māori"
  },
  {
    "code": "mk",
    "name": "Macedonian",
    "nativeName": "македонски јазик"
  },
  {
    "code": "ml",
    "name": "Malayalam",
    "nativeName": "മലയാളം"
  },
  {
    "code": "mn",
    "name": "Mongolian",
    "nativeName": "монгол"
  },
  {
    "code": "mr",
    "name": "Marathi (Marāṭhī)",
    "nativeName": "मराठी"
  },
  {
    "code": "ms",
    "name": "Malay",
    "nativeName": "bahasa Melayu, بهاس ملايو‎"
  },
  {
    "code": "mt",
    "name": "Maltese",
    "nativeName": "Malti"
  },
  {
    "code": "my",
    "name": "Burmese",
    "nativeName": "ဗမာစာ"
  },
  {
    "code": "ne",
    "name": "Nepali",
    "nativeName": "नेपाली"
  },
  {
    "code": "nl",
    "name": "Dutch",
    "nativeName": "Nederlands, Vlaams"
  },
  {
    "code": "no",
    "name": "Norwegian",
    "nativeName": "Norsk"
  },
  {
    "code": "ny",
    "name": "Chichewa; Chewa; Nyanja",
    "nativeName": "chiCheŵa, chinyanja"
  },
  {
    "code": "pa",
    "name": "Panjabi, Punjabi",
    "nativeName": "ਪੰਜਾਬੀ, پنجابی‎"
  },
  {
    "code": "pl",
    "name": "Polish",
    "nativeName": "polski"
  },
  {
    "code": "ps",
    "name": "Pashto, Pushto",
    "nativeName": "پښتو"
  },
  {
    "code": "pt",
    "name": "Portuguese",
    "nativeName": "Português"
  },
  {
    "code": "ro",
    "name": "Romanian, Moldavian, Moldovan",
    "nativeName": "română"
  },
  {
    "code": "ru",
    "name": "Russian",
    "nativeName": "русский язык"
  },
  {
    "code": "sd",
    "name": "Sindhi",
    "nativeName": "सिन्धी, سنڌي، سندھی‎"
  },
  {
    "code": "si",
    "name": "Sinhala, Sinhalese",
    "nativeName": "සිංහල"
  },
  {
    "code": "sk",
    "name": "Slovak",
    "nativeName": "slovenčina"
  },
  {
    "code": "sl",
    "name": "Slovene",
    "nativeName": "slovenščina"
  },
  {
    "code": "sm",
    "name": "Samoan",
    "nativeName": "gagana faa Samoa"
  },
  {
    "code": "sn",
    "name": "Shona",
    "nativeName": "chiShona"
  },
  {
    "code": "so",
    "name": "Somali",
    "nativeName": "Soomaaliga, af Soomaali"
  },
  {
    "code": "sq",
    "name": "Albanian",
    "nativeName": "Shqip"
  },
  {
    "code": "sr",
    "name": "Serbian",
    "nativeName": "српски језик"
  },
  {
    "code": "st",
    "name": "Southern Sotho",
    "nativeName": "Sesotho"
  },
  {
    "code": "su",
    "name": "Sundanese",
    "nativeName": "Basa Sunda"
  },
  {
    "code": "sv",
    "name": "Swedish",
    "nativeName": "svenska"
  },
  {
    "code": "sw",
    "name": "Swahili",
    "nativeName": "Kiswahili"
  },
  {
    "code": "ta",
    "name": "Tamil",
    "nativeName": "தமிழ்"
  },
  {
    "code": "te",
    "name": "Telugu",
    "nativeName": "తెలుగు"
  },
  {
    "code": "tg",
    "name": "Tajik",
    "nativeName": "тоҷикӣ, toğikī, تاجیکی‎"
  },
  {
    "code": "th",
    "name": "Thai",
    "nativeName": "ไทย"
  },
  {
    "code": "tl",
    "name": "Tagalog",
    "nativeName": "Wikang Tagalog, ᜏᜒᜃᜅ᜔ ᜆᜄᜎᜓᜄ᜔"
  },
  {
    "code": "tr",
    "name": "Turkish",
    "nativeName": "Türkçe"
  },
  {
    "code": "uk",
    "name": "Ukrainian",
    "nativeName": "українська"
  },
  {
    "code": "ur",
    "name": "Urdu",
    "nativeName": "اردو"
  },
  {
    "code": "uz",
    "name": "Uzbek",
    "nativeName": "zbek, Ўзбек, أۇزبېك‎"
  },
  {
    "code": "vi",
    "name": "Vietnamese",
    "nativeName": "Tiếng Việt"
  },
  {
    "code": "xh",
    "name": "Xhosa",
    "nativeName": "isiXhosa"
  },
  {
    "code": "yi",
    "name": "Yiddish",
    "nativeName": "ייִדיש"
  },
  {
    "code": "yo",
    "name": "Yoruba",
    "nativeName": "Yorùbá"
  },
  {
    "code": "zh",
    "name": "Chinese",
    "nativeName": "中文 (Zhōngwén), 汉语, 漢語"
  }
]