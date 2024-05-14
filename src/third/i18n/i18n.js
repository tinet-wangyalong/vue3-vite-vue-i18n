import { createI18n } from 'vue-i18n'   //引入vue-i18n组件
import en from './language/en'
import zh from './language/zh'
console.log(localStorage.getItem('language'))
const messages = {
    'zh_CN': zh, // 中文语言包
    'en_US': en // 英文语言包
}
const localeData = {
    legacy: false,
    locacy: localStorage.getItem('language') || 'zh_CN',
    messages,
    silentTranslationWarn: true,
    missingWarn: false,
    silentFallbackWarn: true,
    fallbackWarn: false
}

 // setup i18n instance with glob
export default createI18n(localeData);