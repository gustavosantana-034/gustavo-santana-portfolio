import { LOCALE_STORAGE_KEY } from '@/i18n/config'

export const THEME_STORAGE_KEY = 'gs-theme'

/**
 * Runs in <head> before first paint:
 * - on `/`, sends visitors to `/en/` when they chose English before, or, on a
 *   first visit, when the browser language is not Portuguese (crawlers are
 *   left alone so each URL is indexed in its own language);
 * - applies the saved theme, or the system one, so there is no flash;
 * - opts the page into scroll reveals, with a safety timeout that shows
 *   everything if the app never hydrates.
 */
export const bootScript = `(function(){
var r=document.documentElement;
r.classList.add('js');
try{if(location.pathname==='/'){
var l=localStorage.getItem('${LOCALE_STORAGE_KEY}');
var bot=/bot|crawl|spider|slurp|lighthouse|preview|linkedin|facebookexternalhit/i.test(navigator.userAgent);
var en=l?l==='en':(!bot&&!/^pt/i.test(navigator.language||'pt'));
if(en){location.replace('/en/'+location.search+location.hash);return;}}}catch(e){}
try{var s=localStorage.getItem('${THEME_STORAGE_KEY}');
var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
r.dataset.theme=d?'dark':'light';}catch(e){r.dataset.theme='light';}
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
r.classList.add('js-reveal');
setTimeout(function(){if(!window.__revealReady)r.classList.remove('js-reveal');},4000);}
})();`
