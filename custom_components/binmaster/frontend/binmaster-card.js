var Ct=Object.defineProperty;var It=(n,t,e)=>t in n?Ct(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var g=(n,t,e)=>(It(n,typeof t!="symbol"?t+"":t,e),e);var W=globalThis,z=W.ShadowRoot&&(W.ShadyCSS===void 0||W.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,J=Symbol(),ct=new WeakMap,D=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==J)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o,e=this.t;if(z&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=ct.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&ct.set(e,t))}return t}toString(){return this.cssText}},ut=n=>new D(typeof n=="string"?n:n+"",void 0,J),y=(n,...t)=>{let e=n.length===1?n[0]:t.reduce((i,r,s)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+n[s+1],n[0]);return new D(e,n,J)},lt=(n,t)=>{if(z)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),r=W.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=e.cssText,n.appendChild(i)}},Z=z?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return ut(e)})(n):n;var{is:Pt,defineProperty:Rt,getOwnPropertyDescriptor:Ut,getOwnPropertyNames:Lt,getOwnPropertySymbols:Ot,getPrototypeOf:Ht}=Object,b=globalThis,dt=b.trustedTypes,Ft=dt?dt.emptyScript:"",Wt=b.reactiveElementPolyfillSupport,T=(n,t)=>n,Q={toAttribute(n,t){switch(t){case Boolean:n=n?Ft:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},ht=(n,t)=>!Pt(n,t),mt={attribute:!0,type:String,converter:Q,reflect:!1,useDefault:!1,hasChanged:ht};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),b.litPropertyMetadata??(b.litPropertyMetadata=new WeakMap);var v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=mt){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),r=this.getPropertyDescriptor(t,i,e);r!==void 0&&Rt(this.prototype,t,r)}}static getPropertyDescriptor(t,e,i){let{get:r,set:s}=Ut(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){let u=r?.call(this);s?.call(this,o),this.requestUpdate(t,u,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??mt}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let t=Ht(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let e=this.properties,i=[...Lt(e),...Ot(e)];for(let r of i)this.createProperty(r,e[r])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,r]of e)this.elementProperties.set(i,r)}this._$Eh=new Map;for(let[e,i]of this.elementProperties){let r=this._$Eu(e,i);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let r of i)e.unshift(Z(r))}else t!==void 0&&e.push(Z(t));return e}static _$Eu(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return lt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){let i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){let s=(i.converter?.toAttribute!==void 0?i.converter:Q).toAttribute(e,i.type);this._$Em=t,s==null?this.removeAttribute(r):this.setAttribute(r,s),this._$Em=null}}_$AK(t,e){let i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let s=i.getPropertyOptions(r),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:Q;this._$Em=r;let u=o.fromAttribute(e,s.type);this[r]=u??this._$Ej?.get(r)??u,this._$Em=null}}requestUpdate(t,e,i,r=!1,s){if(t!==void 0){let o=this.constructor;if(r===!1&&(s=this[t]),i??(i=o.getPropertyOptions(t)),!((i.hasChanged??ht)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:r,wrapped:s},o){i&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,o??e??this[t]),s!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),r===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[r,s]of this._$Ep)this[r]=s;this._$Ep=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[r,s]of i){let{wrapped:o}=s,u=this[r];o!==!0||this._$AL.has(r)||u===void 0||this.C(r,void 0,s,u)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(e)):this._$EM()}catch(i){throw t=!1,this._$EM(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[T("elementProperties")]=new Map,v[T("finalized")]=new Map,Wt?.({ReactiveElement:v}),(b.reactiveElementVersions??(b.reactiveElementVersions=[])).push("2.1.2");var N=globalThis,ft=n=>n,q=N.trustedTypes,pt=q?q.createPolicy("lit-html",{createHTML:n=>n}):void 0,$t="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,wt="?"+$,zt=`<${wt}>`,A=document,C=()=>A.createComment(""),I=n=>n===null||typeof n!="object"&&typeof n!="function",st=Array.isArray,qt=n=>st(n)||typeof n?.[Symbol.iterator]=="function",X=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,gt=/-->/g,_t=/>/g,w=RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),yt=/'/g,vt=/"/g,St=/^(?:script|style|textarea|title)$/i,ot=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),m=ot(1),se=ot(2),oe=ot(3),E=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),bt=new WeakMap,S=A.createTreeWalker(A,129);function At(n,t){if(!st(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return pt!==void 0?pt.createHTML(t):t}var Bt=(n,t)=>{let e=n.length-1,i=[],r,s=t===2?"<svg>":t===3?"<math>":"",o=M;for(let u=0;u<e;u++){let a=n[u],l,d,c=-1,p=0;for(;p<a.length&&(o.lastIndex=p,d=o.exec(a),d!==null);)p=o.lastIndex,o===M?d[1]==="!--"?o=gt:d[1]!==void 0?o=_t:d[2]!==void 0?(St.test(d[2])&&(r=RegExp("</"+d[2],"g")),o=w):d[3]!==void 0&&(o=w):o===w?d[0]===">"?(o=r??M,c=-1):d[1]===void 0?c=-2:(c=o.lastIndex-d[2].length,l=d[1],o=d[3]===void 0?w:d[3]==='"'?vt:yt):o===vt||o===yt?o=w:o===gt||o===_t?o=M:(o=w,r=void 0);let _=o===w&&n[u+1].startsWith("/>")?" ":"";s+=o===M?a+zt:c>=0?(i.push(l),a.slice(0,c)+$t+a.slice(c)+$+_):a+$+(c===-2?u:_)}return[At(n,s+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},P=class n{constructor({strings:t,_$litType$:e},i){let r;this.parts=[];let s=0,o=0,u=t.length-1,a=this.parts,[l,d]=Bt(t,e);if(this.el=n.createElement(l,i),S.currentNode=this.el.content,e===2||e===3){let c=this.el.content.firstChild;c.replaceWith(...c.childNodes)}for(;(r=S.nextNode())!==null&&a.length<u;){if(r.nodeType===1){if(r.hasAttributes())for(let c of r.getAttributeNames())if(c.endsWith($t)){let p=d[o++],_=r.getAttribute(c).split($),F=/([.?@])?(.*)/.exec(p);a.push({type:1,index:s,name:F[2],strings:_,ctor:F[1]==="."?et:F[1]==="?"?it:F[1]==="@"?rt:k}),r.removeAttribute(c)}else c.startsWith($)&&(a.push({type:6,index:s}),r.removeAttribute(c));if(St.test(r.tagName)){let c=r.textContent.split($),p=c.length-1;if(p>0){r.textContent=q?q.emptyScript:"";for(let _=0;_<p;_++)r.append(c[_],C()),S.nextNode(),a.push({type:2,index:++s});r.append(c[p],C())}}}else if(r.nodeType===8)if(r.data===wt)a.push({type:2,index:s});else{let c=-1;for(;(c=r.data.indexOf($,c+1))!==-1;)a.push({type:7,index:s}),c+=$.length-1}s++}}static createElement(t,e){let i=A.createElement("template");return i.innerHTML=t,i}};function x(n,t,e=n,i){if(t===E)return t;let r=i!==void 0?e._$Co?.[i]:e._$Cl,s=I(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),s===void 0?r=void 0:(r=new s(n),r._$AT(n,e,i)),i!==void 0?(e._$Co??(e._$Co=[]))[i]=r:e._$Cl=r),r!==void 0&&(t=x(n,r._$AS(n,t.values),r,i)),t}var tt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,r=(t?.creationScope??A).importNode(e,!0);S.currentNode=r;let s=S.nextNode(),o=0,u=0,a=i[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new R(s,s.nextSibling,this,t):a.type===1?l=new a.ctor(s,a.name,a.strings,this,t):a.type===6&&(l=new nt(s,this,t)),this._$AV.push(l),a=i[++u]}o!==a?.index&&(s=S.nextNode(),o++)}return S.currentNode=A,r}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},R=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,r){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=x(this,t,e),I(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):qt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(A.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=P.createElement(At(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(e);else{let s=new tt(r,this),o=s.u(this.options);s.p(e),this.T(o),this._$AH=s}}_$AC(t){let e=bt.get(t.strings);return e===void 0&&bt.set(t.strings,e=new P(t)),e}k(t){st(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,r=0;for(let s of t)r===e.length?e.push(i=new n(this.O(C()),this.O(C()),this,this.options)):i=e[r],i._$AI(s),r++;r<e.length&&(this._$AR(i&&i._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=ft(t).nextSibling;ft(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},k=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,r,s){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=s,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=h}_$AI(t,e=this,i,r){let s=this.strings,o=!1;if(s===void 0)t=x(this,t,e,0),o=!I(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else{let u=t,a,l;for(t=s[0],a=0;a<s.length-1;a++)l=x(this,u[i+a],e,a),l===E&&(l=this._$AH[a]),o||(o=!I(l)||l!==this._$AH[a]),l===h?t=h:t!==h&&(t+=(l??"")+s[a+1]),this._$AH[a]=l}o&&!r&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},et=class extends k{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}},it=class extends k{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}},rt=class extends k{constructor(t,e,i,r,s){super(t,e,i,r,s),this.type=5}_$AI(t,e=this){if((t=x(this,t,e,0)??h)===E)return;let i=this._$AH,r=t===h&&i!==h||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==h&&(i===h||r);r&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},nt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){x(this,t)}};var Vt=N.litHtmlPolyfillSupport;Vt?.(P,R),(N.litHtmlVersions??(N.litHtmlVersions=[])).push("3.3.3");var Et=(n,t,e)=>{let i=e?.renderBefore??t,r=i._$litPart$;if(r===void 0){let s=e?.renderBefore??null;i._$litPart$=r=new R(t.insertBefore(C(),s),s,void 0,e??{})}return r._$AI(n),r};var U=globalThis,f=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;let t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Et(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};f._$litElement$=!0,f.finalized=!0,U.litElementHydrateSupport?.({LitElement:f});var Yt=U.litElementPolyfillSupport;Yt?.({LitElement:f});(U.litElementVersions??(U.litElementVersions=[])).push("4.2.2");var B=function(){return B=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},B.apply(this,arguments)},Kt=1e3,xt=60,kt=xt*60,Dt=kt*24,jt=Dt*7;function at(n,t,e){t===void 0&&(t=Date.now()),e===void 0&&(e={});var i=B(B({},Gt),e||{}),r=(+n-+t)/Kt;if(Math.abs(r)<i.second)return{value:Math.round(r),unit:"second"};var s=r/xt;if(Math.abs(s)<i.minute)return{value:Math.round(s),unit:"minute"};var o=r/kt;if(Math.abs(o)<i.hour)return{value:Math.round(o),unit:"hour"};var u=r/Dt;if(Math.abs(u)<i.day)return{value:Math.round(u),unit:"day"};var a=new Date(n),l=new Date(t),d=a.getFullYear()-l.getFullYear();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"year"};var c=d*12+a.getMonth()-l.getMonth();if(Math.round(Math.abs(c))>0)return{value:Math.round(c),unit:"month"};var p=r/jt;return{value:Math.round(p),unit:"week"}}var Gt={second:45,minute:45,hour:22,day:5};var Tt;(function(n){n.language="language",n.system="system",n.comma_decimal="comma_decimal",n.decimal_comma="decimal_comma",n.space_comma="space_comma",n.none="none"})(Tt||(Tt={}));var Mt;(function(n){n.language="language",n.system="system",n.am_pm="12",n.twenty_four="24"})(Mt||(Mt={}));var V=(n,t,e,i)=>{i=i||{},e=e??{};let r=new Event(t,{bubbles:i.bubbles===void 0?!0:i.bubbles,cancelable:!!i.cancelable,composed:i.composed===void 0?!0:i.composed});return r.detail=e,n.dispatchEvent(r),r};var Jt=n=>new Intl.RelativeTimeFormat(n.language,{numeric:"auto"}),Nt=(n,t,e,i=!0)=>{let r=at(n,e);return i?Jt(t).format(r.value,r.unit):Intl.NumberFormat(t.language,{style:"unit",unit:r.unit,unitDisplay:"long"}).format(Math.abs(r.value))};function Zt(n,t){let e=document.createElement("div");e.style.color=n,e.style.display="none",document.body.appendChild(e);let i=getComputedStyle(e).color;document.body.removeChild(e);let r=i.match(/\d+(\.\d+)?/g);if(!r||r.length<3)return`rgba(117, 117, 117, ${t})`;let[s,o,u]=r;return`rgba(${s}, ${o}, ${u}, ${t})`}function Qt(n,t){let e=n.entities;if(!e)return;let i=e[t];return!i||!i.device_id?void 0:Object.values(e).find(s=>s.device_id===i.device_id&&s.entity_id.startsWith("switch."))?.entity_id}function Xt(n,t){let e=new Date;return e.setHours(0,0,0,0),e.setDate(e.getDate()+t),Nt(e,n.locale)}function Y(n,t){let e=n.states[t];if(!e)return m`<div class="bm-row bm-placeholder">Entity not found: ${t}</div>`;let i=e.attributes,r=Number(e.state),s=Number.isFinite(r),o=i.color||"#757575",u=i.icon||"mdi:trash-can",a=Qt(n,t),l=a?n.states[a]:void 0,d=l?l.state==="on":!!i.checked_in,c=s&&(r===0||r===1)&&!!a,p=_=>{_.stopPropagation(),n.callService("switch","toggle",{entity_id:a})};return m`
    <div class="bm-row">
      <div class="bm-icon-container" style="background:${Zt(o,.2)}">
        <ha-icon .icon=${u} style="color:${o}"></ha-icon>
        ${d?m`<div class="bm-badge"><ha-icon icon="mdi:check-circle"></ha-icon></div>`:""}
      </div>
      <div class="bm-info">
        <div class="bm-primary">${i.friendly_name??e.entity_id}</div>
        <div class="bm-secondary">
          ${s?m`${Xt(n,r)} · ${i.formatted_date??""}`:e.state}
        </div>
      </div>
      ${c?m`
            <ha-icon-button class="bm-check-in" label="Check in" @click=${p}>
              <ha-icon
                icon=${d?"mdi:check-circle":"mdi:check-circle-outline"}
              ></ha-icon>
            </ha-icon-button>
          `:""}
    </div>
  `}var K=y`
  .bm-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .bm-icon-container {
    position: relative;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .bm-badge {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--card-background-color, #fff);
    color: var(--success-color, #4caf50);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .bm-badge ha-icon {
    --mdc-icon-size: 14px;
  }
  .bm-info {
    flex: 1;
    min-width: 0;
  }
  .bm-primary {
    font-weight: 500;
    color: var(--primary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bm-secondary {
    font-size: 0.875em;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .bm-check-in {
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }
  .bm-placeholder {
    padding: 16px;
    color: var(--secondary-text-color);
  }
`;var j=class extends f{setConfig(t){this._config=t}render(){return!this.hass||!this._config?m``:m`
      <ha-entity-picker
        .hass=${this.hass}
        .value=${this._config.entity??""}
        .includeDomains=${["sensor"]}
        .entityFilter=${t=>t.entity_id.startsWith("sensor.binmaster_")}
        label="Entity"
        allow-custom-entity
        @value-changed=${this._entityChanged}
      ></ha-entity-picker>
    `}_entityChanged(t){V(this,"config-changed",{config:{...this._config,entity:t.detail.value}})}};g(j,"properties",{hass:{attribute:!1},_config:{state:!0}});customElements.define("binmaster-card-editor",j);var L=class extends f{setConfig(t){if(!t||!t.entity)throw new Error("You must define an entity");this._config=t}getCardSize(){return 2}static getStubConfig(t){return{entity:Object.keys(t.states).find(i=>i.startsWith("sensor.binmaster_"))??""}}static getConfigElement(){return document.createElement("binmaster-card-editor")}render(){return this._config?this.hass?this.hass.states[this._config.entity]?m`<ha-card>${Y(this.hass,this._config.entity)}</ha-card>`:m`<ha-card
        ><div class="bm-placeholder">Entity not found: ${this._config.entity}</div></ha-card
      >`:m`<ha-card><div class="bm-placeholder">Loading…</div></ha-card>`:m``}};g(L,"properties",{hass:{attribute:!1},_config:{state:!0}}),g(L,"styles",[K,y`
      ha-card {
        padding: 8px 16px;
      }
    `]);customElements.define("binmaster-card",L);window.customCards=window.customCards||[];window.customCards.push({type:"binmaster-card",name:"BinMaster Card",description:"Tile-style card for a BinMaster bin-collection sensor."});var O=class extends f{setConfig(t){this._config=t}render(){if(!this.hass||!this._config)return m``;let t=this._config.layout??"list";return m`
      <ha-select
        label="Layout"
        .value=${t}
        naturalMenuWidth
        @selected=${this._layoutChanged}
        @closed=${e=>e.stopPropagation()}
      >
        <ha-list-item value="list">List</ha-list-item>
        <ha-list-item value="grid">Grid</ha-list-item>
      </ha-select>

      ${t==="grid"?m`
            <ha-input
              type="number"
              label="Columns"
              min="1"
              max="6"
              .value=${String(this._config.columns??2)}
              @change=${this._columnsChanged}
            ></ha-input>
          `:""}

      <ha-entities-picker
        .hass=${this.hass}
        .value=${this._config.exclude??[]}
        .includeDomains=${["sensor"]}
        label="Exclude entities"
        @value-changed=${this._excludeChanged}
      ></ha-entities-picker>
    `}_layoutChanged(t){let e=t.detail.value;!e||e===this._config.layout||this._update({layout:e})}_columnsChanged(t){this._update({columns:Number(t.target.value)||2})}_excludeChanged(t){this._update({exclude:t.detail.value})}_update(t){V(this,"config-changed",{config:{...this._config,...t}})}};g(O,"properties",{hass:{attribute:!1},_config:{state:!0}}),g(O,"styles",y`
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `);customElements.define("binmaster-overview-card-editor",O);var G=2,H=class extends f{setConfig(t){this._config={layout:"list",columns:G,exclude:[],...t}}getCardSize(){let t=this._entityIds().length||1;return this._config?.layout==="grid"?Math.ceil(t/(this._config.columns||G))*2+1:t*2+1}static getStubConfig(){return{layout:"list",columns:G,exclude:[]}}static getConfigElement(){return document.createElement("binmaster-overview-card-editor")}_entityIds(){if(!this.hass)return[];let t=new Set(this._config?.exclude??[]);return Object.keys(this.hass.states).filter(e=>e.startsWith("sensor.binmaster_")&&!t.has(e)).sort((e,i)=>this._sortKey(e)-this._sortKey(i))}_sortKey(t){let e=this.hass.states[t],i=Number(e?.state);return(!!e?.attributes?.checked_in?1e5:0)+(Number.isFinite(i)?i:99999)}render(){if(!this._config)return m``;if(!this.hass)return m`<ha-card><div class="bm-placeholder">Loading…</div></ha-card>`;let t=this._entityIds();if(!t.length)return m`<ha-card
        ><div class="bm-placeholder">No BinMaster entities found</div></ha-card
      >`;let e=this._config.layout==="grid";return m`
      <ha-card .header=${this._config.title}>
        <div
          class="${e?"bm-grid":"bm-list"}"
          style=${e?`--bm-columns: ${this._config.columns||G}`:""}
        >
          ${t.map(i=>Y(this.hass,i))}
        </div>
      </ha-card>
    `}};g(H,"properties",{hass:{attribute:!1},_config:{state:!0}}),g(H,"styles",[K,y`
      ha-card {
        padding: 8px 16px;
      }
      .bm-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .bm-grid {
        display: grid;
        grid-template-columns: repeat(var(--bm-columns, 2), 1fr);
        gap: 12px;
      }
    `]);customElements.define("binmaster-overview-card",H);window.customCards=window.customCards||[];window.customCards.push({type:"binmaster-overview-card",name:"BinMaster Overview Card",description:"Shows all (or selected) BinMaster bin types at once, list or grid layout."});
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
