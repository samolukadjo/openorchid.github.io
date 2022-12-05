// Omit this line if loading form a CDN
const fs = require('fs');
const translate = require('translate');

translate.engine = 'google';
translate.key = 'AIzaSyBJHGk4_lPVNEyL6-n_VkbfmOGuC2bd8dQ';

var languages = [];
var productionMode = false;

if (productionMode) {
  languages = ['af', 'am', 'ar', 'as', 'ast', 'be', 'bg', 'bm',
               'bn-BD', 'bn-IN', 'br', 'bs', 'ca', 'cs', 'cy', 'da',
               'de', 'dsb', 'ee', 'el', 'en-GB', 'eo', 'es', 'gd',
               'gl', 'gu', 'ha', 'he', 'hi-IN', 'hr', 'hsb', 'ht',
               'hu', 'hy-AM', 'id', 'ig', 'it', 'ja', 'km', 'kn',
               'ko', 'lg', 'lij', 'ln', 'lt', 'lv', 'mai', 'mg',
               'mk', 'ml', 'mr', 'ms', 'my', 'nb-NO', 'ne-NP', 'nl',
               'or', 'pa', 'pl', 'pt-BR', 'pt-PT', 'ro', 'ru', 'si',
               'sk', 'sl', 'son', 'sq', 'sr-Cyrl', 'sr-Latn', 'sv-SE', 'sw',
               'ta', 'te', 'th', 'tl', 'tn', 'tr', 'uk', 'ur',
               'vi', 'wo', 'xh', 'yo', 'zam', 'zh-CN', 'zh-TW', 'zu'];
} else {
  languages = ['af', 'ar', 'da', 'de', 'el', 'es', 'fi', 'fr',
               'ga', 'he', 'hi', 'hu', 'id', 'ja', 'ko', 'ku',
               'lv', 'nl', 'no', 'pt', 'zh'];
}

var localesIndex = fs.readFileSync('bin/developer/locales_index.txt');
localesIndex = localesIndex.toString().split('\n');

localesIndex.forEach(function(file, delay) {
  if (file !== '' && file !== null) {
    console.log(`[translator] Translating "${file}"...`);

    var locale = fs.readFileSync(file);
    languages.forEach(function(lang) {
      if (fs.existsSync(file.replaceAll('en-US', lang))) {
        fs.unlinkSync(file.replaceAll('en-US', lang));
      }
      translateLocale(file.replaceAll('en-US', lang), locale.toString(), lang);
    });
  }
});

function translateLocale(filepath, text, lang, callback) {
  var localeLines = text.split('\n');

  localeLines.forEach(function(line, index) {
    var params = line.split('=');
    params[0] = params[0].replaceAll(' ', '');
    var translation = '';
    var cachedText = '';

    (async function() {
      if (line.includes('=') && !line.startsWith('#')) {
        refetch();
      }
    })();

    async function refetch() {
      try {
        translation = await translate(params[1], lang);
        finalize();
      } catch(e) {
        console.log(`[translator] Failed to translate "${params[0]}"`);
        refetch();
      }
    }

    function finalize() {
      cachedText += `${params[0]}=${translation}\n`;
      fs.appendFileSync(filepath, cachedText);
    }
  });
}
