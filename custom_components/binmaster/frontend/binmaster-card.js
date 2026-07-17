var Ee=Object.defineProperty;var xe=(n,e,t)=>e in n?Ee(n,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[e]=t;var z=(n,e,t)=>(xe(n,typeof e!="symbol"?e+"":e,t),t);var O=globalThis,L=O.ShadowRoot&&(O.ShadyCSS===void 0||O.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,W=Symbol(),te=new WeakMap,x=class{constructor(e,t,r){if(this._$cssResult$=!0,r!==W)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o,t=this.t;if(L&&e===void 0){let r=t!==void 0&&t.length===1;r&&(e=te.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),r&&te.set(t,e))}return e}toString(){return this.cssText}},re=n=>new x(typeof n=="string"?n:n+"",void 0,W),B=(n,...e)=>{let t=n.length===1?n[0]:e.reduce((r,i,s)=>r+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[s+1],n[0]);return new x(t,n,W)},ie=(n,e)=>{if(L)n.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(let t of e){let r=document.createElement("style"),i=O.litNonce;i!==void 0&&r.setAttribute("nonce",i),r.textContent=t.cssText,n.appendChild(r)}},q=L?n=>n:n=>n instanceof CSSStyleSheet?(e=>{let t="";for(let r of e.cssRules)t+=r.cssText;return re(t)})(n):n;var{is:ke,defineProperty:De,getOwnPropertyDescriptor:Te,getOwnPropertyNames:Me,getOwnPropertySymbols:Ne,getPrototypeOf:Ce}=Object,_=globalThis,ne=_.trustedTypes,Ie=ne?ne.emptyScript:"",Pe=_.reactiveElementPolyfillSupport,k=(n,e)=>n,V={toAttribute(n,e){switch(e){case Boolean:n=n?Ie:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,e){let t=n;switch(e){case Boolean:t=n!==null;break;case Number:t=n===null?null:Number(n);break;case Object:case Array:try{t=JSON.parse(n)}catch{t=null}}return t}},oe=(n,e)=>!ke(n,e),se={attribute:!0,type:String,converter:V,reflect:!1,useDefault:!1,hasChanged:oe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),_.litPropertyMetadata??(_.litPropertyMetadata=new WeakMap);var f=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??(this.l=[])).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=se){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){let r=Symbol(),i=this.getPropertyDescriptor(e,r,t);i!==void 0&&De(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){let{get:i,set:s}=Te(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:i,set(o){let c=i?.call(this);s?.call(this,o),this.requestUpdate(e,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??se}static _$Ei(){if(this.hasOwnProperty(k("elementProperties")))return;let e=Ce(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(k("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(k("properties"))){let t=this.properties,r=[...Me(t),...Ne(t)];for(let i of r)this.createProperty(i,t[i])}let e=this[Symbol.metadata];if(e!==null){let t=litPropertyMetadata.get(e);if(t!==void 0)for(let[r,i]of t)this.elementProperties.set(r,i)}this._$Eh=new Map;for(let[t,r]of this.elementProperties){let i=this._$Eu(t,r);i!==void 0&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){let t=[];if(Array.isArray(e)){let r=new Set(e.flat(1/0).reverse());for(let i of r)t.unshift(q(i))}else e!==void 0&&t.push(q(e));return t}static _$Eu(e,t){let r=t.attribute;return r===!1?void 0:typeof r=="string"?r:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??(this._$EO=new Set)).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){let e=new Map,t=this.constructor.elementProperties;for(let r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){let e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ie(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){let r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(i!==void 0&&r.reflect===!0){let s=(r.converter?.toAttribute!==void 0?r.converter:V).toAttribute(t,r.type);this._$Em=e,s==null?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){let r=this.constructor,i=r._$Eh.get(e);if(i!==void 0&&this._$Em!==i){let s=r.getPropertyOptions(i),o=typeof s.converter=="function"?{fromAttribute:s.converter}:s.converter?.fromAttribute!==void 0?s.converter:V;this._$Em=i;let c=o.fromAttribute(t,s.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(e,t,r,i=!1,s){if(e!==void 0){let o=this.constructor;if(i===!1&&(s=this[e]),r??(r=o.getPropertyOptions(e)),!((r.hasChanged??oe)(s,t)||r.useDefault&&r.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,r))))return;this.C(e,t,r)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:i,wrapped:s},o){r&&!(this._$Ej??(this._$Ej=new Map)).has(e)&&(this._$Ej.set(e,o??t??this[e]),s!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),i===!0&&this._$Em!==e&&(this._$Eq??(this._$Eq=new Set)).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}let e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(let[i,s]of this._$Ep)this[i]=s;this._$Ep=void 0}let r=this.constructor.elementProperties;if(r.size>0)for(let[i,s]of r){let{wrapped:o}=s,c=this[i];o!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,s,c)}}let e=!1,t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(r=>r.hostUpdate?.()),this.update(t)):this._$EM()}catch(r){throw e=!1,this._$EM(),r}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(t=>this._$ET(t,this[t]))),this._$EM()}updated(e){}firstUpdated(e){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[k("elementProperties")]=new Map,f[k("finalized")]=new Map,Pe?.({ReactiveElement:f}),(_.reactiveElementVersions??(_.reactiveElementVersions=[])).push("2.1.2");var T=globalThis,ae=n=>n,H=T.trustedTypes,ce=H?H.createPolicy("lit-html",{createHTML:n=>n}):void 0,fe="$lit$",g=`lit$${Math.random().toFixed(9).slice(2)}$`,pe="?"+g,Re=`<${pe}>`,w=document,M=()=>w.createComment(""),N=n=>n===null||typeof n!="object"&&typeof n!="function",Q=Array.isArray,Ue=n=>Q(n)||typeof n?.[Symbol.iterator]=="function",Y=`[ 	
\f\r]`,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ue=/-->/g,le=/>/g,b=RegExp(`>|${Y}(?:([^\\s"'>=/]+)(${Y}*=${Y}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),de=/'/g,me=/"/g,_e=/^(?:script|style|textarea|title)$/i,X=n=>(e,...t)=>({_$litType$:n,strings:e,values:t}),y=X(1),Je=X(2),Ze=X(3),A=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),he=new WeakMap,$=w.createTreeWalker(w,129);function ge(n,e){if(!Q(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return ce!==void 0?ce.createHTML(e):e}var Oe=(n,e)=>{let t=n.length-1,r=[],i,s=e===2?"<svg>":e===3?"<math>":"",o=D;for(let c=0;c<t;c++){let a=n[c],l,d,u=-1,h=0;for(;h<a.length&&(o.lastIndex=h,d=o.exec(a),d!==null);)h=o.lastIndex,o===D?d[1]==="!--"?o=ue:d[1]!==void 0?o=le:d[2]!==void 0?(_e.test(d[2])&&(i=RegExp("</"+d[2],"g")),o=b):d[3]!==void 0&&(o=b):o===b?d[0]===">"?(o=i??D,u=-1):d[1]===void 0?u=-2:(u=o.lastIndex-d[2].length,l=d[1],o=d[3]===void 0?b:d[3]==='"'?me:de):o===me||o===de?o=b:o===ue||o===le?o=D:(o=b,i=void 0);let p=o===b&&n[c+1].startsWith("/>")?" ":"";s+=o===D?a+Re:u>=0?(r.push(l),a.slice(0,u)+fe+a.slice(u)+g+p):a+g+(u===-2?c:p)}return[ge(n,s+(n[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),r]},C=class n{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let s=0,o=0,c=e.length-1,a=this.parts,[l,d]=Oe(e,t);if(this.el=n.createElement(l,r),$.currentNode=this.el.content,t===2||t===3){let u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=$.nextNode())!==null&&a.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(let u of i.getAttributeNames())if(u.endsWith(fe)){let h=d[o++],p=i.getAttribute(u).split(g),U=/([.?@])?(.*)/.exec(h);a.push({type:1,index:s,name:U[2],strings:p,ctor:U[1]==="."?j:U[1]==="?"?G:U[1]==="@"?J:E}),i.removeAttribute(u)}else u.startsWith(g)&&(a.push({type:6,index:s}),i.removeAttribute(u));if(_e.test(i.tagName)){let u=i.textContent.split(g),h=u.length-1;if(h>0){i.textContent=H?H.emptyScript:"";for(let p=0;p<h;p++)i.append(u[p],M()),$.nextNode(),a.push({type:2,index:++s});i.append(u[h],M())}}}else if(i.nodeType===8)if(i.data===pe)a.push({type:2,index:s});else{let u=-1;for(;(u=i.data.indexOf(g,u+1))!==-1;)a.push({type:7,index:s}),u+=g.length-1}s++}}static createElement(e,t){let r=w.createElement("template");return r.innerHTML=e,r}};function S(n,e,t=n,r){if(e===A)return e;let i=r!==void 0?t._$Co?.[r]:t._$Cl,s=N(e)?void 0:e._$litDirective$;return i?.constructor!==s&&(i?._$AO?.(!1),s===void 0?i=void 0:(i=new s(n),i._$AT(n,t,r)),r!==void 0?(t._$Co??(t._$Co=[]))[r]=i:t._$Cl=i),i!==void 0&&(e=S(n,i._$AS(n,e.values),i,r)),e}var K=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){let{el:{content:t},parts:r}=this._$AD,i=(e?.creationScope??w).importNode(t,!0);$.currentNode=i;let s=$.nextNode(),o=0,c=0,a=r[0];for(;a!==void 0;){if(o===a.index){let l;a.type===2?l=new I(s,s.nextSibling,this,e):a.type===1?l=new a.ctor(s,a.name,a.strings,this,e):a.type===6&&(l=new Z(s,this,e)),this._$AV.push(l),a=r[++c]}o!==a?.index&&(s=$.nextNode(),o++)}return $.currentNode=w,i}p(e){let t=0;for(let r of this._$AV)r!==void 0&&(r.strings!==void 0?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}},I=class n{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode,t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=S(this,e,t),N(e)?e===m||e==null||e===""?(this._$AH!==m&&this._$AR(),this._$AH=m):e!==this._$AH&&e!==A&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Ue(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==m&&N(this._$AH)?this._$AA.nextSibling.data=e:this.T(w.createTextNode(e)),this._$AH=e}$(e){let{values:t,_$litType$:r}=e,i=typeof r=="number"?this._$AC(e):(r.el===void 0&&(r.el=C.createElement(ge(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(t);else{let s=new K(i,this),o=s.u(this.options);s.p(t),this.T(o),this._$AH=s}}_$AC(e){let t=he.get(e.strings);return t===void 0&&he.set(e.strings,t=new C(e)),t}k(e){Q(this._$AH)||(this._$AH=[],this._$AR());let t=this._$AH,r,i=0;for(let s of e)i===t.length?t.push(r=new n(this.O(M()),this.O(M()),this,this.options)):r=t[i],r._$AI(s),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){let r=ae(e).nextSibling;ae(e).remove(),e=r}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}},E=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,s){this.type=1,this._$AH=m,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=m}_$AI(e,t=this,r,i){let s=this.strings,o=!1;if(s===void 0)e=S(this,e,t,0),o=!N(e)||e!==this._$AH&&e!==A,o&&(this._$AH=e);else{let c=e,a,l;for(e=s[0],a=0;a<s.length-1;a++)l=S(this,c[r+a],t,a),l===A&&(l=this._$AH[a]),o||(o=!N(l)||l!==this._$AH[a]),l===m?e=m:e!==m&&(e+=(l??"")+s[a+1]),this._$AH[a]=l}o&&!i&&this.j(e)}j(e){e===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}},j=class extends E{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===m?void 0:e}},G=class extends E{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==m)}},J=class extends E{constructor(e,t,r,i,s){super(e,t,r,i,s),this.type=5}_$AI(e,t=this){if((e=S(this,e,t,0)??m)===A)return;let r=this._$AH,i=e===m&&r!==m||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,s=e!==m&&(r===m||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}},Z=class{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){S(this,e)}};var Le=T.litHtmlPolyfillSupport;Le?.(C,I),(T.litHtmlVersions??(T.litHtmlVersions=[])).push("3.3.3");var ye=(n,e,t)=>{let r=t?.renderBefore??e,i=r._$litPart$;if(i===void 0){let s=t?.renderBefore??null;r._$litPart$=i=new I(e.insertBefore(M(),s),s,void 0,t??{})}return i._$AI(n),i};var P=globalThis,v=class extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;let e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(e){let t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=ye(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return A}};v._$litElement$=!0,v.finalized=!0,P.litElementHydrateSupport?.({LitElement:v});var He=P.litElementPolyfillSupport;He?.({LitElement:v});(P.litElementVersions??(P.litElementVersions=[])).push("4.2.2");var F=function(){return F=Object.assign||function(n){for(var e,t=1,r=arguments.length;t<r;t++){e=arguments[t];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(n[i]=e[i])}return n},F.apply(this,arguments)},Fe=1e3,ve=60,be=ve*60,$e=be*24,ze=$e*7;function ee(n,e,t){e===void 0&&(e=Date.now()),t===void 0&&(t={});var r=F(F({},We),t||{}),i=(+n-+e)/Fe;if(Math.abs(i)<r.second)return{value:Math.round(i),unit:"second"};var s=i/ve;if(Math.abs(s)<r.minute)return{value:Math.round(s),unit:"minute"};var o=i/be;if(Math.abs(o)<r.hour)return{value:Math.round(o),unit:"hour"};var c=i/$e;if(Math.abs(c)<r.day)return{value:Math.round(c),unit:"day"};var a=new Date(n),l=new Date(e),d=a.getFullYear()-l.getFullYear();if(Math.round(Math.abs(d))>0)return{value:Math.round(d),unit:"year"};var u=d*12+a.getMonth()-l.getMonth();if(Math.round(Math.abs(u))>0)return{value:Math.round(u),unit:"month"};var h=i/ze;return{value:Math.round(h),unit:"week"}}var We={second:45,minute:45,hour:22,day:5};var we;(function(n){n.language="language",n.system="system",n.comma_decimal="comma_decimal",n.decimal_comma="decimal_comma",n.space_comma="space_comma",n.none="none"})(we||(we={}));var Ae;(function(n){n.language="language",n.system="system",n.am_pm="12",n.twenty_four="24"})(Ae||(Ae={}));var Be=n=>new Intl.RelativeTimeFormat(n.language,{numeric:"auto"}),Se=(n,e,t,r=!0)=>{let i=ee(n,t);return r?Be(e).format(i.value,i.unit):Intl.NumberFormat(e.language,{style:"unit",unit:i.unit,unitDisplay:"long"}).format(Math.abs(i.value))};function qe(n,e){let t=document.createElement("div");t.style.color=n,t.style.display="none",document.body.appendChild(t);let r=getComputedStyle(t).color;document.body.removeChild(t);let i=r.match(/\d+(\.\d+)?/g);if(!i||i.length<3)return`rgba(117, 117, 117, ${e})`;let[s,o,c]=i;return`rgba(${s}, ${o}, ${c}, ${e})`}var R=class extends v{setConfig(e){if(!e||!e.entity)throw new Error("You must define an entity");this._config=e}getCardSize(){return 2}static getStubConfig(e){return{entity:Object.keys(e.states).find(r=>r.startsWith("sensor.binmaster_"))??""}}_relativeLabel(e){let t=new Date;return t.setHours(0,0,0,0),t.setDate(t.getDate()+e),Se(t,this.hass.locale)}_handleCheckIn(e){e.stopPropagation(),this.hass.callService("binmaster","check_in",{entity_id:this._config.entity})}render(){if(!this._config)return y``;if(!this.hass)return y`<ha-card><div class="placeholder">Loading…</div></ha-card>`;let e=this.hass.states[this._config.entity];if(!e)return y`<ha-card
        ><div class="placeholder">Entity not found: ${this._config.entity}</div></ha-card
      >`;let t=e.attributes,r=Number(e.state),i=Number.isFinite(r),s=t.color||"#757575",o=t.icon||"mdi:trash-can",c=!!t.checked_in,a=i&&!c&&(r===0||r===1);return y`
      <ha-card>
        <div class="row">
          <div class="icon-container" style="background:${qe(s,.2)}">
            <ha-icon .icon=${o} style="color:${s}"></ha-icon>
            ${c?y`<div class="badge"><ha-icon icon="mdi:check-circle"></ha-icon></div>`:""}
          </div>
          <div class="info">
            <div class="primary">${t.friendly_name??e.entity_id}</div>
            <div class="secondary">
              ${i?y`${this._relativeLabel(r)} · ${t.formatted_date??""}`:e.state}
            </div>
          </div>
          ${a?y`
                <ha-icon-button
                  class="check-in"
                  label="Check in"
                  @click=${this._handleCheckIn}
                >
                  <ha-icon icon="mdi:check-circle-outline"></ha-icon>
                </ha-icon-button>
              `:""}
        </div>
      </ha-card>
    `}};z(R,"properties",{hass:{attribute:!1},_config:{state:!0}}),z(R,"styles",B`
    ha-card {
      padding: 8px 16px;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .icon-container {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .badge {
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
    .badge ha-icon {
      --mdc-icon-size: 14px;
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    .primary {
      font-weight: 500;
      color: var(--primary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .secondary {
      font-size: 0.875em;
      color: var(--secondary-text-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .check-in {
      color: var(--secondary-text-color);
      flex-shrink: 0;
    }
    .placeholder {
      padding: 16px;
      color: var(--secondary-text-color);
    }
  `);customElements.define("binmaster-card",R);window.customCards=window.customCards||[];window.customCards.push({type:"binmaster-card",name:"BinMaster Card",description:"Tile-style card for a BinMaster bin-collection sensor."});
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
