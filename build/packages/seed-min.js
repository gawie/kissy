/*
Copyright 2010, KISSY UI Library v1.1.4
MIT Licensed
build time: Sep 16 14:55
*/
(function(o,g,p){if(o[g]===p)o[g]={};g=o[g];var s=o.document,x=location,q=function(a,c,d,e){if(!c||!a)return a;if(d===p)d=true;var f,h,k;if(e&&(k=e.length))for(f=0;f<k;f++){h=e[f];if(h in c)if(d||!(h in a))a[h]=c[h]}else for(h in c)if(d||!(h in a))a[h]=c[h];return a},y=false,t=[],v=false,z=/^#?([\w-]+)$/,A=0;q(g,{version:"1.1.4",__init:function(){this.Env={mods:{},_loadQueue:{}};var a=s.getElementsByTagName("script");this.Config={debug:"",base:a[a.length-1].src.replace(/^(.*)(seed|kissy).*$/i,
"$1"),timeout:10}},ready:function(a){v||this._bindReady();y?a.call(o,this):t.push(a);return this},_bindReady:function(){var a=this,c=s.documentElement.doScroll,d=c?"onreadystatechange":"DOMContentLoaded",e=function(){a._fireReady()};v=true;if(s.readyState==="complete")return e();if(s.addEventListener){var f=function(){s.removeEventListener(d,f,false);e()};s.addEventListener(d,f,false);o.addEventListener("load",e,false)}else{var h=function(){if(s.readyState==="complete"){s.detachEvent(d,h);e()}};s.attachEvent(d,
h);o.attachEvent("onload",e);if(o==o.top){var k=function(){try{c("left");e()}catch(u){setTimeout(k,1)}};k()}}},_fireReady:function(){if(!y){y=true;if(t){for(var a,c=0;a=t[c++];)a.call(o,this);t=null}}},available:function(a,c){if((a=(a+"").match(z)[1])&&g.isFunction(c))var d=1,e=g.later(function(){if(s.getElementById(a)&&(c()||1)||++d>500)e.cancel()},40,true)},mix:q,merge:function(){var a={},c,d=arguments.length;for(c=0;c<d;++c)q(a,arguments[c]);return a},augment:function(){var a=arguments,c=a.length-
2,d=a[0],e=a[c],f=a[c+1],h=1;if(!g.isArray(f)){e=f;f=p;c++}if(!g.isBoolean(e)){e=p;c++}for(;h<c;h++)q(d.prototype,a[h].prototype||a[h],e,f);return d},extend:function(a,c,d,e){if(!c||!a)return a;var f=Object.prototype,h=c.prototype,k=function(u){function m(){}m.prototype=u;return new m}(h);a.prototype=k;k.constructor=a;a.superclass=h;if(c!==Object&&h.constructor===f.constructor)h.constructor=c;d&&q(k,d);e&&q(a,e);return a},namespace:function(){var a=arguments,c=a.length,d=null,e,f,h,k=a[c-1]===true&&
c--;for(e=0;e<c;++e){h=(""+a[e]).split(".");d=k?o:this;for(f=o[h[0]]===d?1:0;f<h.length;++f)d=d[h[f]]=d[h[f]]||{}}return d},app:function(a,c){var d=g.isString(a),e=d?o[a]||{}:a;q(e,this,true,g.__APP_MEMBERS);e.__init();q(e,g.isFunction(c)?c():c);d&&(o[a]=e);return e},log:function(a,c,d){if(g.Config.debug){if(d)a=d+": "+a;if(o.console!==p&&console.log)console[c&&console[c]?c:"log"](a)}},error:function(a){if(g.Config.debug)throw a;},guid:function(a){var c=A++ +"";return a?a+c:c}});g.__init();g.__APP_MEMBERS=
["__init","namespace"];if(x&&(x.search||"").indexOf("ks-debug")!==-1)g.Config.debug=true})(window,"KISSY");
(function(o,g,p){function s(b){var i=typeof b;return b===null||i!=="object"&&i!=="function"}function x(b){return t.slice.call(b)}var q=document,y=q.documentElement,t=Array.prototype,v=t.indexOf,z=t.lastIndexOf,A=t.filter,a=String.prototype.trim,c=Object.prototype.toString,d=encodeURIComponent,e=decodeURIComponent,f=d("[]"),h=/^\s+|\s+$/g,k=/^(\w+)\[\]$/,u=/\S/;g.mix(g,{isUndefined:function(b){return b===p},isBoolean:function(b){return c.call(b)==="[object Boolean]"},isString:function(b){return c.call(b)===
"[object String]"},isNumber:function(b){return c.call(b)==="[object Number]"&&isFinite(b)},isPlainObject:function(b){return b&&c.call(b)==="[object Object]"&&!b.nodeType&&!b.setInterval},isEmptyObject:function(b){for(var i in b)return false;return true},isFunction:function(b){return c.call(b)==="[object Function]"},isArray:function(b){return c.call(b)==="[object Array]"},trim:a?function(b){return b==p?"":a.call(b)}:function(b){return b==p?"":b.toString().replace(h,"")},substitute:function(b,i,j){if(!g.isString(b)||
!g.isPlainObject(i))return b;return b.replace(j||/\\?\{([^{}]+)\}/g,function(l,n){if(l.charAt(0)==="\\")return l.slice(1);return i[n]!==p?i[n]:""})},each:function(b,i,j){var l,n=0,r=b.length,w=r===p||g.isFunction(b);j=j||o;if(w)for(l in b){if(i.call(j,b[l],l,b)===false)break}else for(l=b[0];n<r&&i.call(j,l,n,b)!==false;l=b[++n]);return b},indexOf:v?function(b,i){return v.call(i,b)}:function(b,i){for(var j=0,l=i.length;j<l;++j)if(i[j]===b)return j;return-1},lastIndexOf:z?function(b,i){return z.call(i,
b)}:function(b,i){for(var j=i.length-1;j>=0;j--)if(i[j]===b)break;return j},unique:function(b,i){i&&b.reverse();b=b.slice();for(var j=0,l,n;j<b.length;){for(n=b[j];(l=g.lastIndexOf(n,b))!==j;)b.splice(l,1);j+=1}i&&b.reverse();return b},inArray:function(b,i){return g.indexOf(b,i)>-1},makeArray:function(b){if(b===null||b===p)return[];if(g.isArray(b))return b;if(typeof b.length!=="number"||g.isString(b)||g.isFunction(b))return[b];return x(b)},filter:A?function(b,i,j){return A.call(b,i,j)}:function(b,
i,j){var l=[];g.each(b,function(n,r,w){i.call(j,n,r,w)&&l.push(n)});return l},param:function(b,i){if(!g.isPlainObject(b))return"";i=i||"&";var j=[],l,n;for(l in b){n=b[l];l=d(l);if(s(n))j.push(l,"=",d(n+""),i);else if(g.isArray(n)&&n.length)for(var r=0,w=n.length;r<w;++r)s(n[r])&&j.push(l,f+"=",d(n[r]+""),i)}j.pop();return j.join("")},unparam:function(b,i){if(typeof b!=="string"||(b=g.trim(b)).length===0)return{};var j={};b=b.split(i||"&");for(var l,n,r,w=0,B=b.length;w<B;++w){i=b[w].split("=");l=
e(i[0]);try{n=e(i[1]||"")}catch(C){n=i[1]||""}if((r=l.match(k))&&r[1]){j[r[1]]=j[r[1]]||[];j[r[1]].push(n)}else j[l]=n}return j},later:function(b,i,j,l,n){i=i||0;l=l||{};var r=b,w=g.makeArray(n),B;if(g.isString(b))r=l[b];r||g.error("method undefined");b=function(){r.apply(l,w)};B=j?setInterval(b,i):setTimeout(b,i);return{id:B,interval:j,cancel:function(){this.interval?clearInterval(B):clearTimeout(B)}}},clone:function(b){var i=b,j,l;if(b&&((j=g.isArray(b))||g.isPlainObject(b))){i=j?[]:{};for(l in b)if(b.hasOwnProperty(l))i[l]=
g.clone(b[l])}return i},now:function(){return(new Date).getTime()},globalEval:function(b){if(b&&u.test(b)){var i=q.getElementsByTagName("head")[0]||y,j=q.createElement("script");j.text=b;i.insertBefore(j,i.firstChild);i.removeChild(j)}}});try{x(y.childNodes)}catch(m){x=function(b){for(var i=[],j=b.length-1;j>=0;j--)i[j]=b[j];return i}}})(window,KISSY);
(function(o,g,p){var s=o.document,x=s.getElementsByTagName("head")[0]||s.documentElement,q=2,y=3,t=4,v=g.mix,z=s.createElement("script").readyState?function(a,c){var d=a.onreadystatechange;a.onreadystatechange=function(){var e=a.readyState;if(e==="loaded"||e==="complete"){a.onreadystatechange=null;d&&d();c.call(this)}}}:function(a,c){a.addEventListener("load",c,false)},A=/\.css(?:\?|$)/i;o={add:function(a,c,d){var e=this.Env.mods,f;if(g.isString(a)&&!d&&g.isPlainObject(c)){f={};f[a]=c;a=f}if(g.isPlainObject(a)){g.each(a,
function(h,k){h.name=k;e[k]&&v(h,e[k],false)});v(e,a)}else{d=d||{};f=e[a]||{};a=d.host||f.host||a;f=e[a]||{};v(f,{name:a,status:q});if(!f.fns)f.fns=[];c&&f.fns.push(c);v(e[a]=f,d);f.attach!==false&&this.__isAttached(f.requires)&&this.__attachMod(f)}return this},use:function(a,c,d){a=a.replace(/\s+/g,"").split(",");d=d||{};var e=this,f=e.Env.mods,h=(d||0).global,k,u=a.length,m,b,i;h&&e.__mixMods(h);if(e.__isAttached(a))c&&c(e);else{for(k=0;k<u&&(m=f[a[k]]);k++)if(m.status!==t){if(d.order&&k>0){if(!m.requires)m.requires=
[];m._requires=m.requires.concat();b=a[k-1];if(!g.inArray(b,m.requires)&&!g.inArray(m.name,f[b].requires||[]))m.requires.push(b)}e.__attach(m,function(){if(!i&&e.__isAttached(a)){i=true;if(m._requires)m.requires=m._requires;c&&c(e)}},h)}return e}},__attach:function(a,c,d){function e(){if(f.__isAttached(h)){a.status===q&&f.__attachMod(a);a.status===t&&c()}}for(var f=this,h=a.requires||[],k=0,u=h.length;k<u;k++)f.__attach(f.Env.mods[h[k]],e,d);f.__buildPath(a);f.__load(a,e,d)},__mixMods:function(a){var c=
this.Env.mods,d=a.Env.mods,e;for(e in d)this.__mixMod(c,d,e,a)},__mixMod:function(a,c,d,e){var f=a[d]||{},h=f.status;g.mix(f,g.clone(c[d]));if(h)f.status=h;e&&this.__buildPath(f,e.Config.base);a[d]=f},__attachMod:function(a){var c=this;if(a.fns){g.each(a.fns,function(d){d&&d(c)});a.fns=p}a.status=t},__isAttached:function(a){for(var c=this.Env.mods,d,e=(a=g.makeArray(a)).length-1;e>=0&&(d=c[a[e]]);e--)if(d.status!==t)return false;return true},__load:function(a,c,d){function e(){f();if(a.status!==y){d&&
h.__mixMod(h.Env.mods,d.Env.mods,a.name,d);if(a.status!==t)a.status=q;c()}}function f(){u[k]=q}var h=this,k=a.fullpath,u=g.Env._loadQueue,m=u[k];a.status=a.status||0;if(a.status<1&&m)a.status=m.nodeName?1:q;if(g.isString(a.cssfullpath)){h.getScript(a.cssfullpath);a.cssfullpath=q}if(a.status<1&&k){a.status=1;m=h.getScript(k,{success:function(){KISSY.log(a.name+" is loaded.","info");e()},error:function(){a.status=y;f()},charset:a.charset});A.test(k)||(u[k]=m)}else a.status===1?z(m,e):c()},__buildPath:function(a,
c){function d(f,h){if(!a[h]&&a[f])a[h]=(c||e.base)+a[f];if(a[h]&&e.debug)a[h]=a[h].replace(/-min/g,"")}var e=this.Config;d("path","fullpath");a.cssfullpath!==q&&d("csspath","cssfullpath")},getScript:function(a,c,d){var e=A.test(a),f=s.createElement(e?"link":"script"),h=c,k,u,m;if(g.isPlainObject(h)){c=h.success;k=h.error;u=h.timeout;d=h.charset}if(e){f.href=a;f.rel="stylesheet"}else{f.src=a;f.async=true}if(d)f.charset=d;if(g.isFunction(c))e?c.call(f):z(f,function(){if(m){m.cancel();m=p}c.call(f)});
if(g.isFunction(k))m=g.later(function(){m=p;k()},(u||this.Config.timeout)*1E3);x.insertBefore(f,x.firstChild);return f}};v(g,o);g.each(o,function(a,c){g.__APP_MEMBERS.push(c)})})(window,KISSY);(function(o){var g={core:{path:"packages/core-min.js",charset:"utf-8"}};o.each(["sizzle","datalazyload","flash","switchable","suggest","overlay","imagezoom","calendar"],function(p){g[p]={path:p+"/"+p+"-pkg-min.js",requires:["core"],charset:"utf-8"}});g.calendar.csspath="calendar/default-min.css";o.add(g)})(KISSY);