function evaluate(){var e=$(this),t=$("#"+e.attr("data-related-item")).parent();e.is(":checked")?$(this).closest("div.visibility-container").removeClass("hidden"):t.fadeOut()}function makeIds(){var e=document.querySelector(".js-toc-content").querySelectorAll("h1, h2, h3, h4, h5, h6, h7"),n={};Array.prototype.forEach.call(e,function(e){var t=e.id||e.textContent.trim().toLowerCase().split(" ").join("-").replace(/[!@#$%^&*():]/gi,"").replace(/\//gi,"-");n[t]=isNaN(n[t])?0:++n[t],e.id=n[t]?t+"-"+n[t]:t})}!function(l){"use strict";l.fn.fitVids=function(e){var t,n,i={customSelector:null,ignore:null};return document.getElementById("fit-vids-style")||(t=document.head||document.getElementsByTagName("head")[0],(n=document.createElement("div")).innerHTML='<p>x</p><style id="fit-vids-style">.fluid-width-video-container{flex-grow: 1;width:100%;}.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>',t.appendChild(n.childNodes[1])),e&&l.extend(i,e),this.each(function(){var e=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"],o=(i.customSelector&&e.push(i.customSelector),".fitvidsignore"),e=(i.ignore&&(o=o+", "+i.ignore),l(this).find(e.join(",")));(e=(e=e.not("object object")).not(o)).each(function(){var e,t,n=l(this);0<n.parents(o).length||"embed"===this.tagName.toLowerCase()&&n.parent("object").length||n.parent(".fluid-width-video-wrapper").length||(n.css("height")||n.css("width")||!isNaN(n.attr("height"))&&!isNaN(n.attr("width"))||(n.attr("height",9),n.attr("width",16)),e=("object"===this.tagName.toLowerCase()||n.attr("height")&&!isNaN(parseInt(n.attr("height"),10))?parseInt(n.attr("height"),10):n.height())/(isNaN(parseInt(n.attr("width"),10))?n.width():parseInt(n.attr("width"),10)),n.attr("name")||(t="fitvid"+l.fn.fitVids._count,n.attr("name",t),l.fn.fitVids._count++),n.wrap('<div class="fluid-width-video-container"><div class="fluid-width-video-wrapper"></div></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*e+"%"),n.removeAttr("height").removeAttr("width"))})})},l.fn.fitVids._count=0}(window.jQuery||window.Zepto),$('input[type="checkbox"]').click(evaluate).each(evaluate),function(e){e.addEventListener("DOMContentLoaded",function(){e.querySelectorAll(".kg-gallery-image img").forEach(function(e){var t=e.closest(".kg-gallery-image"),n=e.attributes.width.value,e=e.attributes.height.value;t.style.flex=n/e+" 1 0%"})})}((window,document)),$(".postItem:empty").parent().remove(),function(t,n){var o,i,l,r,s,a,c,d=n.querySelector("link[rel=next]");function u(){var e;404===this.status?(t.removeEventListener("scroll",f),t.removeEventListener("resize",m)):(this.response.querySelectorAll("article.post-card").forEach(function(e){o.appendChild(n.importNode(e,!0))}),(e=this.response.querySelector("link[rel=next]"))?d.href=e.href:(t.removeEventListener("scroll",f),t.removeEventListener("resize",m)),c=n.documentElement.scrollHeight,r=l=!1)}function e(){var e;r||(s+a<=c-i?l=!1:(r=!0,(e=new t.XMLHttpRequest).responseType="document",e.addEventListener("load",u),e.open("GET",d.href),e.send(null)))}function h(){l||t.requestAnimationFrame(e),l=!0}function f(){s=t.scrollY,h()}function m(){a=t.innerHeight,c=n.documentElement.scrollHeight,h()}!d||(o=n.querySelector(".post-feed"))&&(r=l=!(i=300),s=t.scrollY,a=t.innerHeight,c=n.documentElement.scrollHeight,t.addEventListener("scroll",f,{passive:!0}),t.addEventListener("resize",m),h())}(window,document),(()=>{var n={163:e=>{e.exports=function(s){var r,a=[].forEach,c=[].some,d=document.body,u=!0,h=" ";function f(e){var t=s.orderedList?"ol":"ul",t=document.createElement(t),n=s.listClass+h+s.extraListClasses;return e&&(n=(n+=h+s.collapsibleClass)+(h+s.isCollapsedClass)),t.setAttribute("class",n),t}return{enableTocAnimation:function(){u=!0},disableTocAnimation:function(e){e=e.target||e.srcElement;"string"==typeof e.className&&-1!==e.className.indexOf(s.linkClass)&&(u=!1)},render:function(e,t){var n=f(!1);if(t.forEach(function(e){!function t(e,n){var o,i,l,r,n=n.appendChild((n=e,o=document.createElement("li"),(i=document.createElement("input")).type="checkbox",s.listItemClass&&o.setAttribute("class",s.listItemClass),i.value=n.id,i.setAttribute("data-related-item",n.id),i.name=n.textContent,i.setAttribute("class",s.linkClass+h+"node-name--"+n.nodeName+h+s.extraLinkClasses),(l=document.createElement("label")).htmlFor=n.id,l.appendChild(document.createTextNode(n.textContent)),o.appendChild(i),o.appendChild(l),o));e.children.length&&(r=f(e.isCollapsed),e.children.forEach(function(e){t(e,r)}),n.appendChild(r))}(e,n)}),null!==(r=e||r))return r.firstChild&&r.removeChild(r.firstChild),0===t.length?r:r.appendChild(n)},updateToc:function(e){var n=s.scrollContainer&&document.querySelector(s.scrollContainer)?document.querySelector(s.scrollContainer).scrollTop:document.documentElement.scrollTop||d.scrollTop;s.positionFixedSelector&&(t=s.scrollContainer&&document.querySelector(s.scrollContainer)?document.querySelector(s.scrollContainer).scrollTop:document.documentElement.scrollTop||d.scrollTop,i=document.querySelector(s.positionFixedSelector),"auto"===s.fixedSidebarOffset&&(s.fixedSidebarOffset=r.offsetTop),t>s.fixedSidebarOffset?-1===i.className.indexOf(s.positionFixedClass)&&(i.className+=h+s.positionFixedClass):i.className=i.className.split(h+s.positionFixedClass).join(""));var o,t,i,l=e;u&&null!==r&&0<l.length&&(c.call(l,function(e,t){return function e(t){var n=0;return null!==t&&(n=t.offsetTop,s.hasInnerContainers&&(n+=e(t.offsetParent))),n}(e)>n+s.headingsOffset+10?(o=l[0===t?t:t-1],!0):t===l.length-1?(o=l[l.length-1],!0):void 0}),r.querySelector("."+s.activeLinkClass)!==(t=r.querySelector("."+s.linkClass+".node-name--"+o.nodeName+'[href="'+s.basePath+"#"+o.id.replace(/([ #;&,.+*~':"!^$[\]()=>|/\\@])/g,"\\$1")+'"]'))&&(i=r.querySelectorAll("."+s.linkClass),a.call(i,function(e){e.className=e.className.split(h+s.activeLinkClass).join("")}),e=r.querySelectorAll("."+s.listItemClass),a.call(e,function(e){e.className=e.className.split(h+s.activeListItemClass).join("")}),t&&-1===t.className.indexOf(s.activeLinkClass)&&(t.className+=h+s.activeLinkClass),(e=t&&t.parentNode)&&-1===e.className.indexOf(s.activeListItemClass)&&(e.className+=h+s.activeListItemClass),e=r.querySelectorAll("."+s.listClass+"."+s.collapsibleClass),a.call(e,function(e){-1===e.className.indexOf(s.isCollapsedClass)&&(e.className+=h+s.isCollapsedClass)}),t&&t.nextSibling&&-1!==t.nextSibling.className.indexOf(s.isCollapsedClass)&&(t.nextSibling.className=t.nextSibling.className.split(h+s.isCollapsedClass).join("")),function e(t){return t&&-1!==t.className.indexOf(s.collapsibleClass)&&-1!==t.className.indexOf(s.isCollapsedClass)?(t.className=t.className.split(h+s.isCollapsedClass).join(""),e(t.parentNode.parentNode)):t}(t&&t.parentNode.parentNode)))}}}},547:e=>{e.exports={tocSelector:".js-toc",contentSelector:".js-toc-content",headingSelector:"h1, h2, h3",ignoreSelector:".js-toc-ignore",hasInnerContainers:!1,linkClass:"toc-link",extraLinkClasses:"",activeLinkClass:"is-active-link",listClass:"toc-list",extraListClasses:"",isCollapsedClass:"is-collapsed",collapsibleClass:"is-collapsible",listItemClass:"toc-list-item",activeListItemClass:"is-active-li",collapseDepth:0,scrollSmooth:!0,scrollSmoothDuration:420,scrollSmoothOffset:0,scrollEndCallback:function(e){},headingsOffset:1,throttleTimeout:50,positionFixedSelector:null,positionFixedClass:"is-position-fixed",fixedSidebarOffset:"auto",includeHtml:!1,includeTitleTags:!1,onClick:function(e){},orderedList:!0,scrollContainer:null,skipRendering:!1,headingLabelCallback:!1,ignoreHiddenElements:!1,headingObjectCallback:null,basePath:"",disableTocScrollSync:!1,tocScrollOffset:0}},971:(e,t,g)=>{var n,o=[];void 0!==(t="function"==typeof(n=function(e){"use strict";var o,i,l,r,s=g(547),a={},c={},d=g(163),u=g(279),h=g(938),f=!!(e&&e.document&&e.document.querySelector&&e.addEventListener);if("undefined"!=typeof window||f)return r=Object.prototype.hasOwnProperty,c.destroy=function(){var e=p(a);null!==e&&(a.skipRendering||e&&(e.innerHTML=""),a.scrollContainer&&document.querySelector(a.scrollContainer)?(document.querySelector(a.scrollContainer).removeEventListener("scroll",this._scrollListener,!1),document.querySelector(a.scrollContainer).removeEventListener("resize",this._scrollListener,!1),o&&document.querySelector(a.scrollContainer).removeEventListener("click",this._clickListener,!1)):(document.removeEventListener("scroll",this._scrollListener,!1),document.removeEventListener("resize",this._scrollListener,!1),o&&document.removeEventListener("click",this._clickListener,!1)))},c.init=function(e){if(f){a=function(){for(var e={},t=0;t<arguments.length;t++){var n,o=arguments[t];for(n in o)r.call(o,n)&&(e[n]=o[n])}return e}(s,e||{}),this.options=a,this.state={},a.scrollSmooth&&(a.duration=a.scrollSmoothDuration,a.offset=a.scrollSmoothOffset,c.scrollSmooth=g(374).initSmoothScrolling(a)),o=d(a),i=u(a),this._buildHtml=o,this._parseContent=i,this._headingsArray=l,c.destroy();e=function(t){try{return t.contentElement||document.querySelector(t.contentSelector)}catch(e){return console.warn("Contents element not found: "+t.contentSelector),null}}(a);if(null!==e){var t,n=p(a);if(null!==n&&null!==(l=i.selectHeadings(e,a.headingSelector)))return e=i.nestHeadingsArray(l).nest,a.skipRendering||o.render(n,e),this._scrollListener=m(function(e){o.updateToc(l),a.disableTocScrollSync||h(a);var t=e&&e.target&&e.target.scrollingElement&&0===e.target.scrollingElement.scrollTop;(e&&(0===e.eventPhase||null===e.currentTarget)||t)&&(o.updateToc(l),a.scrollEndCallback&&a.scrollEndCallback(e))},a.throttleTimeout),this._scrollListener(),(a.scrollContainer&&document.querySelector(a.scrollContainer)?(document.querySelector(a.scrollContainer).addEventListener("scroll",this._scrollListener,!1),document.querySelector(a.scrollContainer)):(document.addEventListener("scroll",this._scrollListener,!1),document)).addEventListener("resize",this._scrollListener,!1),t=null,this._clickListener=m(function(e){a.scrollSmooth&&o.disableTocAnimation(e),o.updateToc(l),t&&clearTimeout(t),t=setTimeout(function(){o.enableTocAnimation()},a.scrollSmoothDuration)},a.throttleTimeout),(a.scrollContainer&&document.querySelector(a.scrollContainer)?document.querySelector(a.scrollContainer):document).addEventListener("click",this._clickListener,!1),this}}},c.refresh=function(e){c.destroy(),c.init(e||this.options)},e.tocbot=c;function m(o,i,l){var r,s;return i=i||250,function(){var e=l||this,t=+new Date,n=arguments;r&&t<r+i?(clearTimeout(s),s=setTimeout(function(){r=t,o.apply(e,n)},i)):(r=t,o.apply(e,n))}}function p(t){try{return t.tocElement||document.querySelector(t.tocSelector)}catch(e){return console.warn("TOC element not found: "+t.tocSelector),null}}}(void 0===g.g&&window||g.g))?n.apply(t,o):n)&&(e.exports=t)},279:e=>{e.exports=function(s){var t=[].reduce;function a(e){return e[e.length-1]}function c(e){var t;return e instanceof window.HTMLElement?!s.ignoreHiddenElements||e.offsetHeight&&e.offsetParent?(t=e.getAttribute("data-heading-label")||(s.headingLabelCallback?String(s.headingLabelCallback(e.textContent)):e.textContent.trim()),t={id:e.id,children:[],nodeName:e.nodeName,headingLevel:+e.nodeName.toUpperCase().replace("H",""),textContent:t},s.includeHtml&&(t.childNodes=e.childNodes),s.headingObjectCallback?s.headingObjectCallback(t,e):t):null:e}return{nestHeadingsArray:function(e){return t.call(e,function(e,t){t=c(t);if(t){for(var n=e.nest,t,o=(t=c(t)).headingLevel,i=n,l=a(i),r=o-(l?l.headingLevel:0);0<r&&(!(l=a(i))||o!==l.headingLevel);)l&&void 0!==l.children&&(i=l.children),r--;o>=s.collapseDepth&&(t.isCollapsed=!0),i.push(t)}return e},{nest:[]})},selectHeadings:function(e,t){var n=t;s.ignoreSelector&&(n=t.split(",").map(function(e){return e.trim()+":not("+s.ignoreSelector+")"}));try{return e.querySelectorAll(n)}catch(e){return console.warn("Headers not found with selector: "+n),null}}}}},374:(e,t)=>{t.initSmoothScrolling=function(d){var u=d.duration,h=d.offset,f=location.hash?m(location.href):location.href;function m(e){return e.slice(0,e.lastIndexOf("#"))}document.body.addEventListener("click",function(t){var e,n,o,i,l,r,s,a;function c(e){i=e-o,window.scrollTo(0,r.easing(i,l,s,a)),i<a?requestAnimationFrame(c):(window.scrollTo(0,l+s),"function"==typeof r.callback&&r.callback())}"a"!==(e=t.target).tagName.toLowerCase()||!(0<e.hash.length||"#"===e.href.charAt(e.href.length-1))||m(e.href)!==f&&m(e.href)+"#"!==f||-1<t.target.className.indexOf("no-smooth-scroll")||"#"===t.target.href.charAt(t.target.href.length-2)&&"!"===t.target.href.charAt(t.target.href.length-1)||-1===t.target.className.indexOf(d.linkClass)||(e=t.target.hash,n={duration:u,offset:h,callback:function(){var e=t.target.hash;(e=document.getElementById(e.substring(1)))&&(/^(?:a|select|input|button|textarea)$/i.test(e.tagName)||(e.tabIndex=-1),e.focus())}},l=window.pageYOffset,r={duration:n.duration,offset:n.offset||0,callback:n.callback,easing:n.easing||function(e,t,n,o){return(e/=o/2)<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t}},n=document.querySelector('[id="'+decodeURI(e).split("#").join("")+'"]')||document.querySelector('[id="'+e.split("#").join("")+'"]'),s="string"==typeof e?r.offset+(e?n&&n.getBoundingClientRect().top||0:-(document.documentElement.scrollTop||document.body.scrollTop)):e,a="function"==typeof r.duration?r.duration(s):r.duration,requestAnimationFrame(function(e){c(o=e)}))},!1)}},938:e=>{e.exports=function(e){var t,n=e.tocElement||document.querySelector(e.tocSelector);n&&n.scrollHeight>n.clientHeight&&((t=n.querySelector("."+e.activeListItemClass))&&(n.scrollTop=t.offsetTop-e.tocScrollOffset))}}},o={};function i(e){var t=o[e];return void 0!==t||(t=o[e]={exports:{}},n[e](t,t.exports,i)),t.exports}i.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),i(971)})();
//# sourceMappingURL=sonar.js.map