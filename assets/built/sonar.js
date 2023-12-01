function buildChecks(){var e=document.querySelectorAll("[data-slug]"),t=document.getElementById("toc-list");for(i=0;i<e.length;i++){var n=document.createElement("li"),r=(n.className="toc-list-item",document.createElement("input")),o=(r.type="checkbox",r.value="#"+e[i].id,r.name=e[i].textContent.trim(),r.addEventListener("click",renderBoxes),document.createElement("label"));o.htmlFor=r.value,o.textContent=e[i].textContent.trim(),r.classList="mr-4 form-check text-primary-900 dark:text-accent-400 rounded",o.classList="text-primary-900 dark:text-accent-400 font-medium",t.appendChild(n),n.appendChild(r),n.appendChild(o)}}function renderBoxes(){0<document.querySelectorAll(":checked").length?console.log("At least one box checked"):console.log("No boxes checked")}!function(o){"use strict";o.fn.fitVids=function(e){var t,i,r={customSelector:null,ignore:null};return document.getElementById("fit-vids-style")||(t=document.head||document.getElementsByTagName("head")[0],(i=document.createElement("div")).innerHTML='<p>x</p><style id="fit-vids-style">.fluid-width-video-container{flex-grow: 1;width:100%;}.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>',t.appendChild(i.childNodes[1])),e&&o.extend(r,e),this.each(function(){var e=['iframe[src*="player.vimeo.com"]','iframe[src*="youtube.com"]','iframe[src*="youtube-nocookie.com"]','iframe[src*="kickstarter.com"][src*="video.html"]',"object","embed"],n=(r.customSelector&&e.push(r.customSelector),".fitvidsignore"),e=(r.ignore&&(n=n+", "+r.ignore),o(this).find(e.join(",")));(e=(e=e.not("object object")).not(n)).each(function(){var e,t,i=o(this);0<i.parents(n).length||"embed"===this.tagName.toLowerCase()&&i.parent("object").length||i.parent(".fluid-width-video-wrapper").length||(i.css("height")||i.css("width")||!isNaN(i.attr("height"))&&!isNaN(i.attr("width"))||(i.attr("height",9),i.attr("width",16)),e=("object"===this.tagName.toLowerCase()||i.attr("height")&&!isNaN(parseInt(i.attr("height"),10))?parseInt(i.attr("height"),10):i.height())/(isNaN(parseInt(i.attr("width"),10))?i.width():parseInt(i.attr("width"),10)),i.attr("name")||(t="fitvid"+o.fn.fitVids._count,i.attr("name",t),o.fn.fitVids._count++),i.wrap('<div class="fluid-width-video-container"><div class="fluid-width-video-wrapper"></div></div>').parent(".fluid-width-video-wrapper").css("padding-top",100*e+"%"),i.removeAttr("height").removeAttr("width"))})})},o.fn.fitVids._count=0}(window.jQuery||window.Zepto),$(".postItem:empty").parent().remove(),buildChecks(),function(e){e.addEventListener("DOMContentLoaded",function(){e.querySelectorAll(".kg-gallery-image img").forEach(function(e){var t=e.closest(".kg-gallery-image"),i=e.attributes.width.value,e=e.attributes.height.value;t.style.flex=i/e+" 1 0%"})})}((window,document)),function(t,i){var n,r,o,d,a,c,l,s=i.querySelector("link[rel=next]");function h(){var e;404===this.status?(t.removeEventListener("scroll",m),t.removeEventListener("resize",p)):(this.response.querySelectorAll("article.post-card").forEach(function(e){n.appendChild(i.importNode(e,!0))}),(e=this.response.querySelector("link[rel=next]"))?s.href=e.href:(t.removeEventListener("scroll",m),t.removeEventListener("resize",p)),l=i.documentElement.scrollHeight,d=o=!1)}function e(){var e;d||(a+c<=l-r?o=!1:(d=!0,(e=new t.XMLHttpRequest).responseType="document",e.addEventListener("load",h),e.open("GET",s.href),e.send(null)))}function u(){o||t.requestAnimationFrame(e),o=!0}function m(){a=t.scrollY,u()}function p(){c=t.innerHeight,l=i.documentElement.scrollHeight,u()}!s||(n=i.querySelector(".post-feed"))&&(d=o=!(r=300),a=t.scrollY,c=t.innerHeight,l=i.documentElement.scrollHeight,t.addEventListener("scroll",m,{passive:!0}),t.addEventListener("resize",p),u())}(window,document);
//# sourceMappingURL=sonar.js.map