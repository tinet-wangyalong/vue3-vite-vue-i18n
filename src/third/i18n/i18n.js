import { createI18n } from 'vue-i18n'
import en from './language/en'
import zh from './language/zh'

const messages = {
    'zh_CN': zh, // 中文语言包
    'en_US': en // 英文语言包
}
const localeData = {
    legacy: false,
    locale: localStorage.getItem('language') || navigator.language,
    messages,
    // 控制器的警告隐藏
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false
}

export default createI18n(localeData);