const LOCALE_LIST = ["en_US", "zh_CN", "zh_TW", "ja_JP", "ko_KR", "fr_FR", "de_DE", "es_ES"]

export const getLuckyLocale = () => {
  const randomIndex = Math.floor(Math.random() * LOCALE_LIST.length)
  return LOCALE_LIST[randomIndex]
}


