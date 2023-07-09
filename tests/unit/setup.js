// require("@babel/register");
// import { TextEncoder, TextDecoder } from 'util'
// global.TextEncoder = TextEncoder
// global.TextDecoder = TextDecoder
// require('jsdom-global')();
/**
 * this line code is to fix 'TypeError: Super expression must either be null or a function' issues
 * @link https://github.com/vuejs/vue-test-utils/issues/936
 */

window.Date = Date
