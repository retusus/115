!function(){"use strict";var e=function(){this._listeners={}};e.prototype.on=function(e,t){(this._listeners[e]=this._listeners[e]||[]).push(t)},e.prototype.trigger=function(e,t){(this._listeners[e]||[]).forEach((function(e){return e(t)}))},e.prototype.off=function(e){delete this._listeners[e]};var t=new(function(e){function t(){e.call(this),this.defaultRPC=[{name:"ARIA2 RPC",url:"http://localhost:6800/jsonrpc"}],this.defaultUserAgent="Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36 115Browser/5.1.3",this.defaultReferer="https://115.com/",this.defaultConfigData={rpcList:this.defaultRPC,configSync:!1,sha1Check:!1,ssl:!1,small:!1,interval:300,downloadPath:"",userAgent:this.defaultUserAgent,browserUserAgent:!0,referer:this.defaultReferer,headers:""},this.configData={},this.on("initConfigData",this.init.bind(this)),this.on("setConfigData",this.set.bind(this)),this.on("clearConfigData",this.clear.bind(this))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.init=function(){var e=this;chrome.storage.sync.get(null,(function(e){var t=function(t){chrome.storage.local.set({key:e[t]},(function(){console.log("chrome first local set: %s, %s",t,e[t])}))};for(var n in e)t(n)})),chrome.storage.local.get(null,(function(t){e.configData=Object.assign({},e.defaultConfigData,t),e.trigger("updateView",e.configData)}))},t.prototype.getConfigData=function(e){return void 0===e&&(e=null),e?this.configData[e]:this.configData},t.prototype.set=function(e){this.configData=e,this.save(e),this.trigger("updateView",e)},t.prototype.save=function(e){var t,n,o=function(o){chrome.storage.local.set(((t={})[o]=e[o],t),(function(){console.log("chrome local set: %s, %s",o,e[o])})),!0===e.configSync&&chrome.storage.sync.set(((n={})[o]=e[o],n),(function(){console.log("chrome sync set: %s, %s",o,e[o])}))};for(var i in e)o(i)},t.prototype.clear=function(){chrome.storage.sync.clear(),chrome.storage.local.clear(),this.configData=this.defaultConfigData,this.trigger("updateView",this.configData)},t}(e)),n=function(){this.cookies={}};n.prototype.httpSend=function(e,t,n){var o=e.url,i=e.options;fetch(o,i).then((function(e){e.ok?e.json().then((function(e){t(e)})):n(e)})).catch((function(e){n(e)}))},n.prototype.getConfigData=function(e){return void 0===e&&(e=null),t.getConfigData(e)},n.prototype.objectToQueryString=function(e){return Object.keys(e).map((function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])})).join("&")},n.prototype.sendToBackground=function(e,t,n){chrome.runtime.sendMessage({method:e,data:t},n)},n.prototype.showToast=function(e,t){window.postMessage({type:"showToast",data:{message:e,type:t}},location.origin)},n.prototype.getHashParameter=function(e){var t=window.location.hash.substr(1);return new URLSearchParams(t).get(e)},n.prototype.formatCookies=function(){var e=[];for(var t in this.cookies)e.push(t+"="+this.cookies[t]);return e.join("; ")},n.prototype.getHeader=function(e){void 0===e&&(e="RPC");var t=[],n=this.getConfigData("browserUserAgent"),o=this.getConfigData("userAgent");if(n){var i=navigator.userAgent;i&&i.length&&(o=i)}t.push("User-Agent: "+o),t.push("Referer: "+this.getConfigData("referer")),t.push("Cookie: "+this.formatCookies());var r=this.getConfigData("headers");return r&&r.split("\n").forEach((function(e){t.push(e)})),"RPC"===e?t:"aria2Cmd"===e?t.map((function(e){return"--header "+JSON.stringify(e)})).join(" "):"aria2c"===e?t.map((function(e){return" header="+e})).join("\n"):"idm"===e?t.map((function(e){var t=e.split(": ");return t[0].toLowerCase()+": "+t[1]})).join("\r\n"):void 0},n.prototype.parseURL=function(e){var t=new URL(e),n=t.username?t.username+":"+decodeURI(t.password):null;n&&(n.includes("token:")||(n="Basic "+btoa(n)));var o=t.hash.substr(1),i={},r=new URLSearchParams(o);for(var s of r)i[s[0]]=2===s.length?s[1]:"enabled";return{authStr:n,path:t.origin+t.pathname,options:i}},n.prototype.generateParameter=function(e,t,n){e&&e.startsWith("token")&&n.params.unshift(e);var o={url:t,options:{method:"POST",headers:{},body:JSON.stringify(n)}};return e&&e.startsWith("Basic")&&(o.options.headers.Authorization=e),o},n.prototype.getVersion=function(e,t){var n=this.parseURL(e),o=n.authStr,i=n.path;this.sendToBackground("rpcVersion",this.generateParameter(o,i,{jsonrpc:"2.0",method:"aria2.getVersion",id:1,params:[]}),(function(e){t.innerText=e?"Aria2版本为: "+e:"错误,请查看是否开启Aria2"}))},n.prototype.copyText=function(e){var t=document.createElement("textarea");document.body.appendChild(t),t.value=e,t.focus(),t.select();var n=document.execCommand("copy");t.remove(),n?this.showToast("拷贝成功~","inf"):this.showToast("拷贝失败 QAQ","err")},n.prototype.requestCookies=function(e){var t=this;return new Promise((function(n){t.sendToBackground("getCookies",e,(function(e){n(e)}))}))},n.prototype.aria2RPCMode=function(e,t){var n=this,o=this.parseURL(e),i=o.authStr,r=o.path,s=o.options,a=this.getConfigData("ssl");this.getConfigData("small")&&t.sort((function(e,t){return e.size-t.size})),t.forEach((function(e){n.cookies=e.cookies,a&&(e.link=e.link.replace(/^(http:\/\/)/,"https://"));var t={jsonrpc:"2.0",method:"aria2.addUri",id:(new Date).getTime(),params:[[e.link],{out:e.name,header:n.getHeader()}]},o=n.getConfigData("sha1Check"),c=t.params[1],l=n.getConfigData("downloadPath");if(l&&(c.dir=l),o&&(c.checksum="sha-1="+e.sha1),s)for(var u in s)c[u]=s[u];n.sendToBackground("rpcData",n.generateParameter(i,r,t),(function(e){e?n.showToast("下载成功!赶紧去看看吧~","inf"):n.showToast("下载失败!是不是没有开启Aria2?","err")}))}))},n.prototype.aria2TXTMode=function(e){var t=this,n=[],o=[],i=[],r=[],s="data:text/plain;charset=utf-8,",a=this.getConfigData("ssl");e.forEach((function(e){t.cookies=e.cookies,a&&(e.link=e.link.replace(/^(http:\/\/)/,"https://"));var s="aria2c -c -s10 -k1M -x16 --enable-rpc=false -o "+JSON.stringify(e.name)+" "+t.getHeader("aria2Cmd")+" "+JSON.stringify(e.link),c=[e.link,t.getHeader("aria2c")," out="+e.name].join("\n");t.getConfigData("sha1Check")&&(s+=" --checksum=sha-1="+e.sha1,c+="\n checksum=sha-1="+e.sha1),n.push(s),o.push(c);var l=["<",e.link,t.getHeader("idm"),">"].join("\r\n");i.push(l),r.push(e.link)})),document.querySelector("#aria2CmdTxt").value=""+n.join("\n"),document.querySelector("#aria2Txt").href=""+s+encodeURIComponent(o.join("\n")),document.querySelector("#idmTxt").href=""+s+encodeURIComponent(i.join("\r\n")+"\r\n"),document.querySelector("#downloadLinkTxt").href=""+s+encodeURIComponent(r.join("\n")),document.querySelector("#copyDownloadLinkTxt").dataset.link=r.join("\n")};var o=new n,i=function(){var e=this;this.version="0.3.6",this.updateDate="2019/12/13",t.on("updateView",(function(t){e.updateSetting(t),e.updateMenu(t)}))};i.prototype.init=function(){this.context=document.querySelector('iframe[rel="wangpan"]').contentDocument,this.addSettingUI(),this.addTextExport(),t.trigger("initConfigData")},i.prototype.addMenu=function(e,t){if(e){e.insertAdjacentHTML(t,'\n      <div id="exportMenu" class="export">\n        <a class="export-button">导出下载</a>\n        <div id="aria2List" class="export-menu">\n          <a class="export-menu-item" id="batchOpen" href="javascript:void(0);">批量打开</a>\n          <a class="export-menu-item" id="aria2Text" href="javascript:void(0);">文本导出</a>\n          <a class="export-menu-item" id="settingButton" href="javascript:void(0);">设置</a>\n        </div>\n      </div>');var n=this.context.querySelector("#exportMenu");n.addEventListener("mouseenter",(function(){n.classList.add("open-o")})),n.addEventListener("mouseleave",(function(){n.classList.remove("open-o")}));var o=this.context.querySelector("#settingButton"),i=document.querySelector("#settingMenu");o.addEventListener("click",(function(e){i.classList.add("open-o")})),this.context.querySelector("#aria2List").addEventListener("mousedown",(function(e){e.stopPropagation()}))}},i.prototype.addContextMenuRPCSectionWithCallback=function(e){var t=this,n=function(n){n.insertAdjacentHTML("beforebegin",'<div class="cell" id="more-menu-rpc-section"><ul></ul></div>'),t.mostRecentConfigData&&t.updateMenu(t.mostRecentConfigData),e&&e()},o=this.context.querySelector("body > .context-menu .cell");if(o)n(o);else if("MutationObserver"in window){var i=this.context.querySelector("body"),r=new MutationObserver((function(e){var o=t.context.querySelector("body > .context-menu .cell");o&&(r.disconnect(),n(o))}));r.observe(i,{childList:!0})}},i.prototype.resetMenu=function(){this.context.querySelectorAll("#more-menu-rpc-section li").forEach((function(e){e.remove()})),this.context.querySelectorAll(".rpc-button").forEach((function(e){e.remove()}))},i.prototype.updateMenu=function(e){this.resetMenu();var t=e.rpcList,n="",o="";t.forEach((function(e){var t='<a class="export-menu-item rpc-button" href="javascript:void(0);" data-url='+e.url+">"+e.name+"</a>";n+=t,o+='<li><a href="javascript:void(0);" data-url='+e.url+">"+e.name+"</a></li>"})),this.context.querySelector("#aria2List").insertAdjacentHTML("afterbegin",n);var i=this.context.querySelector("#more-menu-rpc-section ul");i&&i.insertAdjacentHTML("afterbegin",o)},i.prototype.addTextExport=function(){var e=this;document.body.insertAdjacentHTML("beforeend",'\n      <div id="textMenu" class="modal text-menu">\n        <div class="modal-inner">\n          <div class="modal-header">\n            <div class="modal-title">文本导出</div>\n            <div class="modal-close">×</div>\n          </div>\n          <div class="modal-body">\n            <div class="text-menu-row">\n              <a class="text-menu-button" href="javascript:void(0);" id="aria2Txt" download="aria2c.down">存为Aria2文件</a>\n              <a class="text-menu-button" href="javascript:void(0);" id="idmTxt" download="idm.ef2">存为IDM文件</a>\n              <a class="text-menu-button" href="javascript:void(0);" id="downloadLinkTxt" download="link.txt">保存下载链接</a>\n              <a class="text-menu-button" href="javascript:void(0);" id="copyDownloadLinkTxt">拷贝下载链接</a>\n            </div>\n            <div class="text-menu-row">\n              <textarea class="text-menu-textarea" type="textarea" wrap="off" spellcheck="false" id="aria2CmdTxt"></textarea>\n            </div>\n          </div>\n        </div>\n      </div>');var t=document.querySelector("#textMenu"),n=t.querySelector(".modal-close"),i=t.querySelector("#copyDownloadLinkTxt");i.addEventListener("click",(function(){o.copyText(i.dataset.link)})),n.addEventListener("click",(function(){t.classList.remove("open-o"),e.resetTextExport()}))},i.prototype.resetTextExport=function(){var e=document.querySelector("#textMenu");e.querySelector("#aria2Txt").href="",e.querySelector("#idmTxt").href="",e.querySelector("#downloadLinkTxt").href="",e.querySelector("#aria2CmdTxt").value="",e.querySelector("#copyDownloadLinkTxt").dataset.link=""},i.prototype.addSettingUI=function(){var e=this,n='\n      <div id="settingMenu" class="modal setting-menu">\n        <div class="modal-inner">\n          <div class="modal-header">\n            <div class="modal-title">导出设置</div>\n            <div class="modal-close">×</div>\n          </div>\n          <div class="modal-body">\n            <div class="setting-menu-message">\n              <label class="setting-menu-label orange-o" id="message"></label>\n            </div>\n            <div class="setting-menu-row rpc-s">\n              <div class="setting-menu-name">\n                <input class="setting-menu-input name-s" spellcheck="false">\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input url-s" spellcheck="false">\n                <a class="setting-menu-button" id="addRPC" href="javascript:void(0);">添加RPC地址</a>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">配置同步</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox configSync-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">SHA1校验</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox sha1Check-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">小文件优先</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox small-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">强制SSL下载</label>\n              </div>\n              <div class="setting-menu-value">\n                <input type="checkbox" class="setting-menu-checkbox ssl-s">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">递归下载间隔</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input small-o interval-s" type="number" spellcheck="false">\n                <label class="setting-menu-label">(单位:毫秒)</label>\n                <a class="setting-menu-button version-s" id="testAria2" href="javascript:void(0);">测试连接，成功显示版本号</a>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">下载路径</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input downloadPath-s" placeholder="只能设置为绝对路径" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">User-Agent</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input userAgent-s" spellcheck="false">\n                <label class="setting-menu-label"></label>\n                <input type="checkbox" class="setting-menu-checkbox browser-userAgent-s">\n                <label class="setting-menu-label for-checkbox">使用浏览器 UA</label>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">Referer</label>\n              </div>\n              <div class="setting-menu-value">\n                <input class="setting-menu-input referer-s" spellcheck="false">\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n            <div class="setting-menu-row">\n              <div class="setting-menu-name">\n                <label class="setting-menu-label">Headers</label>\n              </div>\n              <div class="setting-menu-value">\n                <textarea class="setting-menu-input textarea-o headers-s" type="textarea" spellcheck="false"></textarea>\n              </div>\n            </div>\x3c!-- /.setting-menu-row --\x3e\n          </div>\x3c!-- /.setting-menu-body --\x3e\n          <div class="modal-footer">\n            <div class="setting-menu-copyright">\n              <div class="setting-menu-item">\n                <label class="setting-menu-label">&copy; Copyright</label>\n                <a class="setting-menu-link" href="https://github.com/acgotaku/115" target="_blank">雪月秋水</a>\n              </div>\n              <div class="setting-menu-item">\n                <label class="setting-menu-label">Version: '+this.version+'</label>\n                <label class="setting-menu-label">Update date: '+this.updateDate+'</label>\n              </div>\n            </div>\x3c!-- /.setting-menu-copyright --\x3e\n            <div class="setting-menu-operate">\n              <a class="setting-menu-button large-o blue-o" id="apply" href="javascript:void(0);">应用</a>\n              <a class="setting-menu-button large-o" id="reset" href="javascript:void(0);">重置</a>\n            </div>\n          </div>\n        </div>\n      </div>';document.body.insertAdjacentHTML("beforeend",n);var i=document.querySelector("#settingMenu");i.querySelector(".modal-close").addEventListener("click",(function(){i.classList.remove("open-o"),e.resetSetting()})),document.querySelector("#addRPC").addEventListener("click",(function(){var e=document.querySelectorAll(".rpc-s");Array.from(e).pop().insertAdjacentHTML("afterend",'\n        <div class="setting-menu-row rpc-s">\n          <div class="setting-menu-name">\n            <input class="setting-menu-input name-s" spellcheck="false">\n          </div>\n          <div class="setting-menu-value">\n            <input class="setting-menu-input url-s" spellcheck="false">\n          </div>\n        </div>\x3c!-- /.setting-menu-row --\x3e')}));var r=document.querySelector("#apply"),s=document.querySelector("#message");r.addEventListener("click",(function(){e.saveSetting(),s.innerText="设置已保存"})),document.querySelector("#reset").addEventListener("click",(function(){t.trigger("clearConfigData"),s.innerText="设置已重置"}));var a=document.querySelector("#testAria2");a.addEventListener("click",(function(){o.getVersion(t.getConfigData("rpcList")[0].url,a)}));var c=document.querySelector(".userAgent-s"),l=document.querySelector(".browser-userAgent-s");l.addEventListener("change",(function(){c.disabled=l.checked}))},i.prototype.resetSetting=function(){document.querySelector("#message").innerText="",document.querySelector("#testAria2").innerText="测试连接，成功显示版本号"},i.prototype.updateSetting=function(e){var t=e.rpcList,n=e.configSync,o=e.sha1Check,i=e.ssl,r=e.small,s=e.interval,a=e.downloadPath,c=e.userAgent,l=e.browserUserAgent,u=e.referer,d=e.headers;document.querySelectorAll(".rpc-s").forEach((function(e,t){0!==t&&e.remove()})),t.forEach((function(e,t){var n=document.querySelectorAll(".rpc-s");if(0===t)n[t].querySelector(".name-s").value=e.name,n[t].querySelector(".url-s").value=e.url;else{var o='\n          <div class="setting-menu-row rpc-s">\n            <div class="setting-menu-name">\n              <input class="setting-menu-input name-s" value="'+e.name+'" spellcheck="false">\n            </div>\n            <div class="setting-menu-value">\n              <input class="setting-menu-input url-s" value="'+e.url+'" spellcheck="false">\n            </div>\n          </div>\x3c!-- /.setting-menu-row --\x3e';Array.from(n).pop().insertAdjacentHTML("afterend",o)}})),document.querySelector(".configSync-s").checked=n,document.querySelector(".sha1Check-s").checked=o,document.querySelector(".ssl-s").checked=i,document.querySelector(".small-s").checked=r,document.querySelector(".interval-s").value=s,document.querySelector(".downloadPath-s").value=a,document.querySelector(".userAgent-s").value=c,document.querySelector(".userAgent-s").disabled=l,document.querySelector(".browser-userAgent-s").checked=l,document.querySelector(".referer-s").value=u,document.querySelector(".headers-s").value=d,this.mostRecentConfigData=e},i.prototype.saveSetting=function(){var e=document.querySelectorAll(".rpc-s"),n={rpcList:Array.from(e).map((function(e){var t=e.querySelector(".name-s").value,n=e.querySelector(".url-s").value;if(t&&n)return{name:t,url:n}})).filter((function(e){return e})),configSync:document.querySelector(".configSync-s").checked,sha1Check:document.querySelector(".sha1Check-s").checked,ssl:document.querySelector(".ssl-s").checked,small:document.querySelector(".small-s").checked,interval:document.querySelector(".interval-s").value,downloadPath:document.querySelector(".downloadPath-s").value,userAgent:document.querySelector(".userAgent-s").value,browserUserAgent:document.querySelector(".browser-userAgent-s").checked,referer:document.querySelector(".referer-s").value,headers:document.querySelector(".headers-s").value};t.trigger("setConfigData",n)};var r=new i,s=function(e){this.listParameter=e,this.fileDownloadInfo=[],this.currentTaskId=0,this.completedCount=0,this.folders=[],this.files={}};s.prototype.start=function(e,t){void 0===e&&(e=300),this.interval=e,this.done=t,this.currentTaskId=(new Date).getTime(),this.getNextFile(this.currentTaskId)},s.prototype.reset=function(){this.fileDownloadInfo=[],this.currentTaskId=0,this.folders=[],this.files={},this.completedCount=0},s.prototype.addFolder=function(e){this.folders.push(e)},s.prototype.addFile=function(e){this.files[e.pick_code]=e},s.prototype.getNextFile=function(e){var t=this;if(e===this.currentTaskId)if(0!==this.folders.length){this.completedCount++,o.showToast("正在获取文件列表... "+this.completedCount+"/"+(this.completedCount+this.folders.length-1),"inf");var n=this.folders.pop();this.listParameter.search.cid=n.cate_id,o.sendToBackground("fetch",{url:""+this.listParameter.url+o.objectToQueryString(this.listParameter.search),options:this.listParameter.options},(function(o){setTimeout((function(){return t.getNextFile(e)}),t.interval);var i=n.path+o.path[o.path.length-1].name+"/";o.data.forEach((function(e){e.sha?t.files[e.pc]={path:i,isdir:!1,sha1:e.sha,pick_code:e.pc}:t.folders.push({cate_id:e.cid,path:i})}))}))}else 0!==this.files.length?(o.showToast("正在获取下载地址...","inf"),this.getFiles(this.files).then((function(){t.done(t.fileDownloadInfo)}))):(o.showToast("一个文件都没有哦...","war"),this.reset())},s.prototype.getFiles=function(e){throw new Error("subclass should implement this method!")};var a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};var c,l,u=(function(e){!function(t){function n(e,t){var n=(65535&e)+(65535&t);return(e>>16)+(t>>16)+(n>>16)<<16|65535&n}function o(e,t,o,i,r,s){return n((a=n(n(t,e),n(i,s)))<<(c=r)|a>>>32-c,o);var a,c}function i(e,t,n,i,r,s,a){return o(t&n|~t&i,e,t,r,s,a)}function r(e,t,n,i,r,s,a){return o(t&i|n&~i,e,t,r,s,a)}function s(e,t,n,i,r,s,a){return o(t^n^i,e,t,r,s,a)}function a(e,t,n,i,r,s,a){return o(n^(t|~i),e,t,r,s,a)}function c(e,t){var o,c,l,u,d;e[t>>5]|=128<<t%32,e[14+(t+64>>>9<<4)]=t;var h=1732584193,p=-271733879,f=-1732584194,m=271733878;for(o=0;o<e.length;o+=16)c=h,l=p,u=f,d=m,h=i(h,p,f,m,e[o],7,-680876936),m=i(m,h,p,f,e[o+1],12,-389564586),f=i(f,m,h,p,e[o+2],17,606105819),p=i(p,f,m,h,e[o+3],22,-1044525330),h=i(h,p,f,m,e[o+4],7,-176418897),m=i(m,h,p,f,e[o+5],12,1200080426),f=i(f,m,h,p,e[o+6],17,-1473231341),p=i(p,f,m,h,e[o+7],22,-45705983),h=i(h,p,f,m,e[o+8],7,1770035416),m=i(m,h,p,f,e[o+9],12,-1958414417),f=i(f,m,h,p,e[o+10],17,-42063),p=i(p,f,m,h,e[o+11],22,-1990404162),h=i(h,p,f,m,e[o+12],7,1804603682),m=i(m,h,p,f,e[o+13],12,-40341101),f=i(f,m,h,p,e[o+14],17,-1502002290),h=r(h,p=i(p,f,m,h,e[o+15],22,1236535329),f,m,e[o+1],5,-165796510),m=r(m,h,p,f,e[o+6],9,-1069501632),f=r(f,m,h,p,e[o+11],14,643717713),p=r(p,f,m,h,e[o],20,-373897302),h=r(h,p,f,m,e[o+5],5,-701558691),m=r(m,h,p,f,e[o+10],9,38016083),f=r(f,m,h,p,e[o+15],14,-660478335),p=r(p,f,m,h,e[o+4],20,-405537848),h=r(h,p,f,m,e[o+9],5,568446438),m=r(m,h,p,f,e[o+14],9,-1019803690),f=r(f,m,h,p,e[o+3],14,-187363961),p=r(p,f,m,h,e[o+8],20,1163531501),h=r(h,p,f,m,e[o+13],5,-1444681467),m=r(m,h,p,f,e[o+2],9,-51403784),f=r(f,m,h,p,e[o+7],14,1735328473),h=s(h,p=r(p,f,m,h,e[o+12],20,-1926607734),f,m,e[o+5],4,-378558),m=s(m,h,p,f,e[o+8],11,-2022574463),f=s(f,m,h,p,e[o+11],16,1839030562),p=s(p,f,m,h,e[o+14],23,-35309556),h=s(h,p,f,m,e[o+1],4,-1530992060),m=s(m,h,p,f,e[o+4],11,1272893353),f=s(f,m,h,p,e[o+7],16,-155497632),p=s(p,f,m,h,e[o+10],23,-1094730640),h=s(h,p,f,m,e[o+13],4,681279174),m=s(m,h,p,f,e[o],11,-358537222),f=s(f,m,h,p,e[o+3],16,-722521979),p=s(p,f,m,h,e[o+6],23,76029189),h=s(h,p,f,m,e[o+9],4,-640364487),m=s(m,h,p,f,e[o+12],11,-421815835),f=s(f,m,h,p,e[o+15],16,530742520),h=a(h,p=s(p,f,m,h,e[o+2],23,-995338651),f,m,e[o],6,-198630844),m=a(m,h,p,f,e[o+7],10,1126891415),f=a(f,m,h,p,e[o+14],15,-1416354905),p=a(p,f,m,h,e[o+5],21,-57434055),h=a(h,p,f,m,e[o+12],6,1700485571),m=a(m,h,p,f,e[o+3],10,-1894986606),f=a(f,m,h,p,e[o+10],15,-1051523),p=a(p,f,m,h,e[o+1],21,-2054922799),h=a(h,p,f,m,e[o+8],6,1873313359),m=a(m,h,p,f,e[o+15],10,-30611744),f=a(f,m,h,p,e[o+6],15,-1560198380),p=a(p,f,m,h,e[o+13],21,1309151649),h=a(h,p,f,m,e[o+4],6,-145523070),m=a(m,h,p,f,e[o+11],10,-1120210379),f=a(f,m,h,p,e[o+2],15,718787259),p=a(p,f,m,h,e[o+9],21,-343485551),h=n(h,c),p=n(p,l),f=n(f,u),m=n(m,d);return[h,p,f,m]}function l(e){var t,n="",o=32*e.length;for(t=0;t<o;t+=8)n+=String.fromCharCode(e[t>>5]>>>t%32&255);return n}function u(e){var t,n=[];for(n[(e.length>>2)-1]=void 0,t=0;t<n.length;t+=1)n[t]=0;var o=8*e.length;for(t=0;t<o;t+=8)n[t>>5]|=(255&e.charCodeAt(t/8))<<t%32;return n}function d(e){var t,n,o="0123456789abcdef",i="";for(n=0;n<e.length;n+=1)t=e.charCodeAt(n),i+=o.charAt(t>>>4&15)+o.charAt(15&t);return i}function h(e){return unescape(encodeURIComponent(e))}function p(e){return function(e){return l(c(u(e),8*e.length))}(h(e))}function f(e,t){return function(e,t){var n,o,i=u(e),r=[],s=[];for(r[15]=s[15]=void 0,i.length>16&&(i=c(i,8*e.length)),n=0;n<16;n+=1)r[n]=909522486^i[n],s[n]=1549556828^i[n];return o=c(r.concat(u(t)),512+8*t.length),l(c(s.concat(o),640))}(h(e),h(t))}function m(e,t,n){return t?n?f(t,e):d(f(t,e)):n?p(e):d(p(e))}e.exports?e.exports=m:t.md5=m}(a)}(l={path:c,exports:{},require:function(e,t){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==t&&l.path)}},l.exports),l.exports),d=function(){this.publicKey=new window.JSEncrypt,this.publicKey.setPublicKey("-----BEGIN RSA PUBLIC KEY-----\n    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDR3rWmeYnRClwLBB0Rq0dlm8Mr\n    PmWpL5I23SzCFAoNpJX6Dn74dfb6y02YH15eO6XmeBHdc7ekEFJUIi+swganTokR\n    IVRRr/z16/3oh7ya22dcAqg191y+d6YDr4IGg/Q5587UKJMj35yQVXaeFXmLlFPo\n    kFiz4uPxhrB7BGqZbQIDAQAB\n    -----END RSA PUBLIC KEY-----"),this.privateKey=new window.JSEncrypt,this.privateKey.setPrivateKey("-----BEGIN RSA PRIVATE KEY-----\n    MIICXAIBAAKBgQCMgUJLwWb0kYdW6feyLvqgNHmwgeYYlocst8UckQ1+waTOKHFC\n    TVyRSb1eCKJZWaGa08mB5lEu/asruNo/HjFcKUvRF6n7nYzo5jO0li4IfGKdxso6\n    FJIUtAke8rA2PLOubH7nAjd/BV7TzZP2w0IlanZVS76n8gNDe75l8tonQQIDAQAB\n    AoGANwTasA2Awl5GT/t4WhbZX2iNClgjgRdYwWMI1aHbVfqADZZ6m0rt55qng63/\n    3NsjVByAuNQ2kB8XKxzMoZCyJNvnd78YuW3Zowqs6HgDUHk6T5CmRad0fvaVYi6t\n    viOkxtiPIuh4QrQ7NUhsLRtbH6d9s1KLCRDKhO23pGr9vtECQQDpjKYssF+kq9iy\n    A9WvXRjbY9+ca27YfarD9WVzWS2rFg8MsCbvCo9ebXcmju44QhCghQFIVXuebQ7Q\n    pydvqF0lAkEAmgLnib1XonYOxjVJM2jqy5zEGe6vzg8aSwKCYec14iiJKmEYcP4z\n    DSRms43hnQsp8M2ynjnsYCjyiegg+AZ87QJANuwwmAnSNDOFfjeQpPDLy6wtBeft\n    5VOIORUYiovKRZWmbGFwhn6BQL+VaafrNaezqUweBRi1PYiAF2l3yLZbUQJAf/nN\n    4Hz/pzYmzLlWnGugP5WCtnHKkJWoKZBqO2RfOBCq+hY4sxvn3BHVbXqGcXLnZPvo\n    YuaK7tTXxZSoYLEzeQJBAL8Mt3AkF1Gci5HOug6jT4s4Z+qDDrUXo9BlTwSWP90v\n    wlHF+mkTJpKd5Wacef0vV+xumqNorvLpIXWKwxNaoHM=\n    -----END RSA PRIVATE KEY-----"),this.kts=[240,229,105,174,191,220,191,90,26,69,232,190,125,166,115,136,222,143,231,196,69,218,134,148,155,105,146,11,106,184,241,122,56,6,60,149,38,109,44,86,0,112,86,156,54,56,98,118,47,155,95,15,242,254,253,45,112,156,134,68,143,61,20,39,113,147,138,228,14,193,72,174,220,52,127,207,254,178,127,246,85,154,70,200,235,55,119,164,224,107,114,147,126,81,203,241,55,239,173,42,222,238,249,201,57,107,50,161,186,53,177,184,190,218,120,115,248,32,213,39,4,90,111,253,94,114,57,207,59,156,43,87,92,249,124,75,123,210,18,102,204,119,9,166],this.keyS=[41,35,33,94],this.keyL=[66,218,19,186,120,118,141,55,232,238,4,145]};d.prototype.xor115Enc=function(e,t,n,o){var i,r,s,a,c,l,u,d;if(d=[],0!==(a=t%4))for(i=r=0,c=a;c>=0?r<c:r>c;i=c>=0?++r:--r)d.push(e[i]^n[i%o]);for(i=s=l=a,u=t;l<=u?s<u:s>u;i=l<=u?++s:--s)d.push(e[i]^n[(i-a)%o]);return d},d.prototype.getkey=function(e,t){var n,o=this;return null!=t?function(){var i,r,s;for(s=[],n=i=0,r=e;r>=0?i<r:i>r;n=r>=0?++i:--i)s.push(t[n]+o.kts[e*n]&255^o.kts[e*(e-1-n)]);return s}():12===e?this.keyL.slice(0):this.keyS.slice(0)},d.prototype.asymEncode=function(e,t){var n,o,i,r,s;for(i=117,s="",n=o=0,r=Math.floor((t+i-1)/i);r>=0?o<r:o>r;n=r>=0?++o:--o)s+=window.atob(this.publicKey.encrypt(this.bytesToString(e.slice(n*i,Math.min((n+1)*i,t)))));return window.btoa(s)},d.prototype.asymDecode=function(e,t){var n,o,i,r,s;for(i=128,s="",n=o=0,r=Math.floor((t+i-1)/i);r>=0?o<r:o>r;n=r>=0?++o:--o)s+=this.privateKey.decrypt(window.btoa(this.bytesToString(e.slice(n*i,Math.min((n+1)*i,t)))));return this.stringToBytes(s)},d.prototype.symEncode=function(e,t,n,o){var i,r,s;return i=this.getkey(4,n),r=this.getkey(12,o),(s=this.xor115Enc(e,t,i,4)).reverse(),s=this.xor115Enc(s,t,r,12)},d.prototype.symDecode=function(e,t,n,o){var i,r,s;return i=this.getkey(4,n),r=this.getkey(12,o),(s=this.xor115Enc(e,t,r,12)).reverse(),s=this.xor115Enc(s,t,i,4)},d.prototype.bytesToString=function(e){var t,n,o,i;for(i="",n=0,o=e.length;n<o;n++)t=e[n],i+=String.fromCharCode(t);return i},d.prototype.stringToBytes=function(e){var t,n,o,i;for(i=[],t=n=0,o=e.length;o>=0?n<o:n>o;t=o>=0?++n:--n)i.push(e.charCodeAt(t));return i},d.prototype.encode=function(e,t){var n=this.stringToBytes(u("!@###@#"+t+"DFDR@#@#")),o=this.stringToBytes(e);return o=this.symEncode(o,o.length,n,null),o=n.slice(0,16).concat(o),{data:this.asymEncode(o,o.length),key:n}},d.prototype.decode=function(e,t){var n=this.stringToBytes(window.atob(e));return n=this.asymDecode(n,n.length),this.bytesToString(this.symDecode(n.slice(16),n.length-16,t,n.slice(0,16)))};var h=new d;(new(function(e){function t(){var t={search:{aid:1,limit:1e3,show_dir:1,cid:""},url:location.protocol+"//webapi.115.com/files?",options:{credentials:"include",method:"GET"}};e.call(this,t),this.mode="RPC",this.rpcURL="http://localhost:6800/jsonrpc",this.iframe=document.querySelector('iframe[rel="wangpan"]')}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.initialize=function(){var e=this;return this.context=document.querySelector('iframe[rel="wangpan"]').contentDocument,r.init(),r.addMenu(this.context.querySelector("#js_fake_path"),"beforebegin"),this.context.querySelector(".right-tvf").style.display="block",this.addMenuButtonEventListener(),r.addContextMenuRPCSectionWithCallback((function(){e.addContextMenuEventListener()})),o.showToast("初始化成功!","inf"),this},t.prototype.startListen=function(){var e=this;window.addEventListener("message",(function(t){var n=t.data.type;if(n&&("selected"===n||"hovered"===n)){e.reset();var i=t.data.data;if(0===i.length)return void o.showToast("请选择一下你要保存的文件哦","war");i.forEach((function(t){t.isdir?e.addFolder(t):e.addFile(t)})),e.start(o.getConfigData("interval"),(function(t){if("RPC"===e.mode&&o.aria2RPCMode(e.rpcURL,t),"TXT"===e.mode&&(o.aria2TXTMode(t),document.querySelector("#textMenu").classList.add("open-o")),"OPEN"===e.mode)for(var n of t)window.open("https://115.com/?ct=play&ac=location&pickcode="+n.pickcode)}))}})),this.iframe.addEventListener("load",(function(){e.initialize(),window.postMessage({type:"refresh"},location.origin)}))},t.prototype.addMenuButtonEventListener=function(){var e=this;this.context.querySelector("#aria2List").addEventListener("click",(function(t){var n=t.target.dataset.url;n&&(e.rpcURL=n,e.getSelected(),e.mode="RPC"),"aria2Text"===t.target.id&&(e.getSelected(),e.mode="TXT"),"batchOpen"===t.target.id&&(e.getSelected(),e.mode="OPEN")}))},t.prototype.addContextMenuEventListener=function(){var e=this;this.context.querySelector("#more-menu-rpc-section").addEventListener("click",(function(t){var n=t.target.dataset.url;n&&(e.rpcURL=n,e.getHovered(),e.mode="RPC")}))},t.prototype.getSelected=function(){window.postMessage({type:"getSelected"},location.origin)},t.prototype.getHovered=function(){window.postMessage({type:"getHovered"},location.origin)},t.prototype.getFile=function(e){var t=Date.now(),n=Math.floor(t/1e3),i=h.encode(JSON.stringify({pickcode:e}),n),r=i.data,s=i.key,a={credentials:"include",method:"POST",body:"data="+encodeURIComponent(r)};return new Promise((function(e){o.sendToBackground("fetch",{url:"https://proapi.115.com/app/chrome/downurl?t="+n,options:a},(function(t){if(t.state){var n=JSON.parse(h.decode(t.data,s)),i=Object.values(n).pop();i.pickcode=i.pick_code,i.file_url=i.url.url;var r=i.file_url.match(/.*115.com(\/.*\/)/)[1];o.requestCookies([{path:r}]).then((function(t){i.cookies=t,e(i)}))}}))}))},t.prototype.getFiles=function(e){var t=this,n=Object.keys(e).map((function(e){return t.getFile(e)}));return new Promise((function(o){Promise.all(n).then((function(n){n.forEach((function(n){t.fileDownloadInfo.push({name:e[n.pickcode].path+n.file_name,link:n.file_url,size:n.file_size,sha1:e[n.pickcode].sha1,cookies:n.cookies,pickcode:n.pickcode}),o()}))}))}))},t}(s))).initialize().startListen()}();