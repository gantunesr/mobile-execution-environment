(this["webpackJsonpmobile-execution-environment"]=this["webpackJsonpmobile-execution-environment"]||[]).push([[0],{45:function(e,t,n){},56:function(e,t){},73:function(e,t,n){},75:function(e,t,n){"use strict";n.r(t);var o=n(1),r=n.n(o),a=n(35),i=n.n(a),s=(n(45),n(2)),c=n(7),d=n(36),u=n(17),l=n(20),g=n(18),b=n(38),w=n(37),f=n(19),v="ping",p="executeSnap",m="snapRpc",j="terminate",h="jsonRpc",O="window.postMessage is not a function. This class should only be instantiated in a Window.",_=function(e){Object(b.a)(n,e);var t=Object(w.a)(n);function n(e){var o,r=e.name,a=e.target,i=e.targetOrigin,s=void 0===i?window.location.origin:i,c=e.targetWindow,d=void 0===c?window:c;if(Object(u.a)(this,n),(o=t.call(this))._name=void 0,o._target=void 0,o._targetOrigin=void 0,o._targetWindow=void 0,"undefined"===typeof window||"function"!==typeof window.postMessage)throw new Error(O);return o._name=r,o._target=a,o._targetOrigin=s,o._targetWindow=d,o._onMessage=o._onMessage.bind(Object(g.a)(o)),window.addEventListener("message",o._onMessage,!1),o._handshake(),o}return Object(l.a)(n,[{key:"_postMessage",value:function(e){console.log("[ProxyMessageStream LOG] ProxyService returning result to RN App",e),this._targetWindow.postMessage(JSON.stringify({target:this._target,data:e}))}},{key:"_onMessage",value:function(e){var t=e.data;"object"===typeof t&&null!==t&&t.target===this._name&&(console.log("[ProxyMessageStream LOG] ProxyService sending message to iframe",t.data),this._onData(t.data))}},{key:"_destroy",value:function(){window.removeEventListener("message",this._onMessage,!1)}}]),n}(f.BasePostMessageStream),x=Object(l.a)((function e(t){var n=this,o=t.proxyService;Object(u.a)(this,e),this._jobs=void 0,this._proxyService=void 0,this._createWindow=function(e){return new Promise((function(t,n){var o=document.createElement("iframe");o.setAttribute("id",e),o.setAttribute("src","https://metamask.github.io/iframe-execution-environment/0.11.1"),document.body.appendChild(o),o.addEventListener("load",(function(){o.contentWindow?t(o.contentWindow):n(new Error('iframe.contentWindow not present on load for job "'.concat(e,'".')))})),o.setAttribute("sandbox","allow-scripts")}))},this._deleteWindow=function(e){var t=document.getElementById(e);if(!t||!t.parentNode)throw new Error("Window with the id ".concat(e," was not found"));t.parentNode.removeChild(t)},this._initJobStream=function(){var e=Object(c.a)(Object(s.a)().mark((function e(t){var o,r;return Object(s.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n._createWindow(t);case 2:return o=e.sent,console.log({window:o}),r=new f.WindowPostMessageStream({name:"parent",target:"child",targetWindow:o,targetOrigin:"*"}),console.log({stream:r}),r.on("data",(function(e){console.log("ExecutionController ->",e),n._proxyService.write({data:e,jobId:t}),n._handleJobDeletion({data:e,jobId:t})})),e.abrupt("return",{id:t,window:o,stream:r});case 8:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),this._update=function(e){n._jobs[e.id]=e,console.log("[ExecutionController LOG] updateJobsState:",{newState:n._jobs,newElelment:e})},this._handleJobDeletion=function(e){var t,o,r=e.jobId,a=e.data,i=n.get(r);console.log("ExecutionController ->",null===i||void 0===i?void 0:i.terminateNext,null===a||void 0===a||null===(t=a.data)||void 0===t?void 0:t.id),null!==i&&void 0!==i&&i.terminateNext&&(null===i||void 0===i?void 0:i.terminateNext)===(null===a||void 0===a||null===(o=a.data)||void 0===o?void 0:o.id)&&n.delete(r)},this.init=function(){var e=Object(c.a)(Object(s.a)().mark((function e(t){var o;return Object(s.a)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return console.log("[ExecutionController LOG] initJob: Start new job"),e.next=3,n._initJobStream(t);case 3:o=e.sent,n._update(o);case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),this.get=function(e){var t=n._jobs[e];return console.log("[ExecutionController LOG] getJob:",{jobId:e,job:t}),t},this.delete=function(e){console.log("[ExecutionController LOG] delete:",{jobId:e}),n._jobs[e].stream._destroy(),console.log("[ExecutionController LOG] stream deleted:",{jobId:e}),n._deleteWindow(e),console.log("[ExecutionController LOG] iframe deleted:",{jobId:e}),delete n._jobs[e],console.log("[ExecutionController LOG] job deleted from state:",{jobId:e})},this._jobs={},this._proxyService=o})),y=(n(73),n(8));var E=function(){var e=Object(o.useState)(),t=Object(d.a)(e,2),n=t[0],r=t[1];return Object(o.useEffect)((function(){var e=new _({name:"webview",target:"rnside",targetOrigin:"*",targetWindow:window.ReactNativeWebView});r(e)}),[]),Object(o.useEffect)((function(){if(n){console.log("[WEB APP LOG] Subscribe to events originated on the RN App");var e=new x({proxyService:n});n.on("data",function(){var t=Object(c.a)(Object(s.a)().mark((function t(n){var o,r,a,i,c;return Object(s.a)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(console.log("[WEB APP LOG] Proxy receiving data - ",n),"object"===typeof n&&null!==n){t.next=3;break}return t.abrupt("return");case 3:o=n.data.data,r=o.method,a=o.id,i=n.jobId,t.t0=r,t.next=t.t0===v?7:t.t0===j?13:t.t0===p?18:t.t0===m?21:t.t0===h?24:27;break;case 7:return console.log(e.jobs),t.next=10,e.init(i);case 10:return(c=e.get(i)).stream.write(n.data),t.abrupt("return");case 13:return console.log("[WEB APP LOG] Terminate job",n.data,i,a),(c=e.get(i)).stream.write(n.data),c.terminateNext=a,t.abrupt("return");case 18:case 21:case 24:return(c=e.get(i)).stream.write(n.data),t.abrupt("return");case 27:(c=e.get(i)).stream.write(n.data),console.log("Default case");case 30:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}}),[n]),Object(y.jsx)("div",{className:"App"})},S=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,76)).then((function(t){var n=t.getCLS,o=t.getFID,r=t.getFCP,a=t.getLCP,i=t.getTTFB;n(e),o(e),r(e),a(e),i(e)}))};i.a.createRoot(document.getElementById("root")).render(Object(y.jsx)(r.a.StrictMode,{children:Object(y.jsx)(E,{})})),S()}},[[75,1,2]]]);
//# sourceMappingURL=main.cf2ab5d7.chunk.js.map