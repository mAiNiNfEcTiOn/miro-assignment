parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"ceC6":[function(require,module,exports) {

},{}],"cEiX":[function(require,module,exports) {
"use strict";function e(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function t(t){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?e(Object(a),!0).forEach(function(e){r(t,e,a[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):e(Object(a)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))})}return t}function r(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}require("./emails-input.css"),function(e,r){for(var n=[],a=48;a<=57;a+=1)n.push(String.fromCharCode(a));for(var o=65;o<=90;o+=1)n.push(String.fromCharCode(o));for(var i=97;i<=122;i+=1)n.push(String.fromCharCode(i));function l(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:8,t="",r=0;r<e;r+=1)t+=n[Math.floor(Math.random()*n.length)];return t+="@miro.com"}function c(e){var t=e.value,n=e.store;t&&t.split(",").forEach(function(t){if((t=t&&t.trim())&&!n.some(function(e){return e.value===t})){var a=r.createElement("input");a.type="email",a.value=t;var o=a.checkValidity();n.push({value:t,isValid:o}),e.node.insertAdjacentElement("beforebegin",function(e){var t=r.createElement("div"),n=r.createElement("span"),a=r.createElement("button");a.className="emails-input__root__pill__button",t.className="emails-input__root__pill",n.textContent=e.value,a.type="button",a.innerHTML='<svg focusable="false" tabindex="-1" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0.8L7.2 0L4 3.2L0.8 0L0 0.8L3.2 4L0 7.2L0.8 8L4 4.8L7.2 8L8 7.2L4.8 4L8 0.8Z" fill="#050038"/></svg>',a.addEventListener("click",function(t){for(var r=a.parentNode,n=0;n<e.store.length;n+=1)if(e.store[n].value===e.value){e.store.splice(n,1);break}r.parentNode.querySelector("input").focus(),r.parentNode.removeChild(r)}),t.insertAdjacentElement("afterbegin",n),t.insertAdjacentElement("beforeend",a),e.isValid||t.classList.add("emails-input__root__pill--invalid");return t.addEventListener("click",function(e){return e.stopPropagation()}),t}({value:t,isValid:o,store:n}))}})}e.EmailsInput=function(n){var a=[],o=[],i=r.createElement("div");i.className="emails-input__root",o.push=function(e){return a.forEach(function(r){r({event:"ADDITION",data:[t({},e)]})}),Array.prototype.push.call(o,e)},o.pop=function(){var e=Array.prototype.pop.call(o);return a.forEach(function(r){r({event:"REMOVAL",data:[t({},e)]})}),e},o.splice=function(){for(var e,r=arguments.length,n=new Array(r),i=0;i<r;i++)n[i]=arguments[i];var l=(e=Array.prototype.splice).call.apply(e,[o].concat(n));return a.forEach(function(e){e({event:"REMOVAL",data:l.map(function(e){return t({},e)})})}),l};var u=function(t){var n=r.createElement("input");return n.className="emails-input__root__input",n.placeholder="add more people...",n.addEventListener("blur",function(e){var r=e.currentTarget;c({node:r,store:t,value:r.value}),e.currentTarget.value=""}),n.addEventListener("keyup",function(e){var r=e.currentTarget;if(-1!==[188,13].indexOf(e.keyCode)&&(c({node:r,store:t,value:r.value}),r.value=""),8===e.keyCode&&""===r.value){var a=n.parentNode.querySelectorAll("div");a.length&&(r.parentNode.removeChild(a[a.length-1]),t.pop())}}),n.addEventListener("paste",function(r){var n=r.currentTarget,a=(r.clipboardData||e.clipboardData).getData("text");c({node:n,store:t,value:a}),n.value="",r.preventDefault()}),n.addEventListener("click",function(e){return e.stopPropagation()}),n}(o);i.addEventListener("click",function(){return u.focus()}),i.insertAdjacentElement("beforeend",u),n.insertAdjacentElement("beforeend",i),n.getAllEmails=function(){return o.concat([])},n.addNewEmail=function(){c({node:u,store:o,value:l()})},n.subscribe=function(e){return"function"==typeof e&&a.push(e),function(){var t=a.indexOf(e);-1!==t&&a.splice(t,1)}},n.replaceAllEmails=function(){Array.prototype.slice.call(i.querySelectorAll("div.emails-input__root__pill"),0).forEach(function(e){e.parentNode.removeChild(e)});var e=o.length;o.splice(0,o.length);for(var t=0;t<e;t+=1)n.addNewEmail()}}}(window,document);
},{"./emails-input.css":"ceC6"}]},{},["cEiX"], null)
//# sourceMappingURL=emails-input.a7f3ff8c.js.map