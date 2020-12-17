(this["webpackJsonpmembrane-simulation"]=this["webpackJsonpmembrane-simulation"]||[]).push([[0],{20:function(e,t,n){e.exports=n(33)},25:function(e,t,n){},26:function(e,t,n){},33:function(e,t,n){"use strict";n.r(t);var a=n(0),r=n.n(a),o=n(6),l=n.n(o),s=(n(25),n(26),n(63)),i=n(62),c=n(15),u=n.n(c);n(27);function m(e){return(m="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function f(e,t,n,a,r,o,l){try{var s=e[o](l),i=s.value}catch(c){return void n(c)}s.done?t(i):Promise.resolve(i).then(a,r)}function _(e){return function(){var t=this,n=arguments;return new Promise((function(a,r){var o=e.apply(t,n);function l(e){f(o,a,r,l,s,"next",e)}function s(e){f(o,a,r,l,s,"throw",e)}l(void 0)}))}}function p(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}function h(e,t){return(h=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function d(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}();return function(){var n,a=g(e);if(t){var r=g(this).constructor;n=Reflect.construct(a,arguments,r)}else n=a.apply(this,arguments);return v(this,n)}}function v(e,t){return!t||"object"!==m(t)&&"function"!==typeof t?b(e):t}function b(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function y(e,t){for(var n=function(e){var t="",n="";for(var a in e)t+=a+",",n+=e[a]+",";return t.slice(0,-1)+"\n"+n.slice(0,-1)}(e)+"\n\n",a=Object.keys(t),r=0;r<a.length;r++)n+=a[r]+",";n=n.slice(0,n.length-1)+"\n";for(var o=0;o<t[a[0]].length;o++){for(var l=0;l<a.length;l++)n+=t[a[l]][o]+",";n=n.slice(0,n.length-1)+"\n"}return n}var E=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&h(e,t)}(l,e);var t,n,a,o=d(l);function l(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(t=o.call(this,e)).state={permeate_valve:!0,feed_valve:!1,buffer_valve:!0,p_init_mass:100,membrane_selected:"1"},t.membrane={1:{dex_rej:.92,rb_rej:.01,surface_area:1},2:{dex_rej:.92,rb_rej:.1,surface_area:1},3:{dex_rej:.65,rb_rej:.01,surface_area:1}},t.valveConstants={buffer_closed_volume_percentage_loss_per_hour:.1,feed_open_volume_percentage_loss_per_hour:.2,permeate_closed_tmp_percentage_loss_per_hour:.3},t.molarMass={dex:504.4,rb:479.02},t.modelParameters={a:-.002749688274522191,b:-8301768508494198e-20,c:.03741113513434366},t.options=["1","2","3"],t.default_option=t.options[0],t._onSelect=t._onSelect.bind(b(t)),t.onPermValv=t.onPermValv.bind(b(t)),t.onFeedValv=t.onFeedValv.bind(b(t)),t.onBufferValv=t.onBufferValv.bind(b(t)),t}return t=l,(n=[{key:"handleCalculations",value:function(){var e=_(regeneratorRuntime.mark((function e(){var t,n,a,r,o,l,s,i,c,u,m,f,_,p,h,d,v,b,g,y,E,x,w,C,B;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(t=this.membrane[this.state.membrane_selected],n=t.dex_rej,a=t.rb_rej,r=t.surface_area,o=this.state.b_dex_conc,l=this.state.b_rb_conc,s=[this.state.p_dex_conc*this.state.p_init_mass/1e3*this.molarMass.dex],i=[this.state.p_dex_conc],c=[this.state.f_dex_conc],u=[this.state.f_dex_conc*this.state.f_init_mass/1e3*this.molarMass.dex],m=[this.state.p_rb_conc*this.state.p_init_mass/1e3*this.molarMass.rb],f=[this.state.p_rb_conc],_=[this.state.f_rb_conc],p=[this.state.f_rb_conc*this.state.f_init_mass/1e3*this.molarMass.rb],h=this.state.f_init_mass,d=this.state.flow_rate,v=[0],b=[0],g=0,y=this.state.interval;y<this.state.runtime/this.state.interval;y+=this.state.interval)b.push(y),R=this.modelParameters,F=this.state.tmp,P=this.state.flow_rate,E=(P*R.a/(F-P*R.b)+P*R.c)*r*this.state.interval,g+=E,v.push(E),x=c[c.length-1]*Math.exp(E/d*-(1-n))*E/1e3*this.molarMass.dex,w=_[_.length-1]*Math.exp(E/d*-(1-a))*E/1e3*this.molarMass.rb,C=E*o/1e3*this.molarMass.dex,B=E*l/1e3*this.molarMass.rb,i.push((s[s.length-1]+x)/g),f.push((m[m.length-1]+w)/g),s.push(s[s.length-1]+x),m.push(m[m.length-1]+w),u.push(u[u.length-1]-x+C),c.push(u[u.length-1]/h),p.push(p[p.length-1]-w+B),_.push(p[p.length-1]/h),this.state.permeate_valve||(this.state.tmp=this.state.tmp-this.state.tmp*this.state.interval/60*this.valveConstants.permeate_closed_tmp_percentage_loss_per_hour),this.state.feed_valve&&(d-=d*this.state.interval/60*this.valveConstants.feed_open_volume_percentage_loss_per_hour),this.state.buffer_valve||(d-=d*this.state.interval/60*this.valveConstants.buffer_closed_volume_percentage_loss_per_hour);return e.abrupt("return",{time:b,permeate_dex_mass:s,permeate_dex_conc:i,flow_rates:v,feed_dex_conc:c,feed_dex_mass:u,permeate_rb_mass:m,permeate_rb_conc:f,feed_rb_conc:_,feed_rb_mass:p});case 21:case"end":return e.stop()}var R,F,P}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"_onSelect",value:function(e){this.setState({membrane_selected:e.value})}},{key:"onPermValv",value:function(e){this.setState({permeate_valve:"on"===e.target.value})}},{key:"onFeedValv",value:function(e){this.setState({feed_valve:"on"===e.target.value})}},{key:"onBufferValv",value:function(e){this.setState({buffer_valve:"on"===e.target.value})}},{key:"downloadTxtFile",value:function(){var e=_(regeneratorRuntime.mark((function e(t){var n,a,r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),e.next=3,this.handleCalculations();case 3:return n=e.sent,a=document.createElement("a"),r=new Blob([y(this.state,n)],{type:"text/plain;charset=utf-8"}),a.href=URL.createObjectURL(r),a.download="membrane_data.csv",document.body.appendChild(a),a.click(),e.abrupt("return",!1);case 11:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"get_flow",value:function(){var e=_(regeneratorRuntime.mark((function e(t,n,a){var r;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=0,e.next=3,fetch("/rc_flow?flowrate=".concat(t,"&tmp=").concat(n,"&interval=").concat(a)).then((function(e){return e.json()})).then((function(e){r=e.flow}));case 3:return e.abrupt("return",r);case 4:case"end":return e.stop()}}),e)})));return function(t,n,a){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this;return r.a.createElement("div",null,r.a.createElement(s.a,null,r.a.createElement("div",null,r.a.createElement("h5",{className:"intro_header"},"Operating Parameters"),r.a.createElement(i.a,{id:"flow_rate",label:"Volumetric Flow Rate",onChange:function(){e.state.flow_rate=parseFloat(document.getElementById("flow_rate").value)},helperText:"Volumetric Flow Rate of Recirculation (mL/min)"}),r.a.createElement(i.a,{id:"tmp",label:"TMP",onChange:function(){e.state.tmp=parseFloat(document.getElementById("tmp").value)},helperText:"Transmembrane Pressure (atm)"}),r.a.createElement(i.a,{id:"runtime",label:"Runtime",onChange:function(){e.state.runtime=parseInt(document.getElementById("runtime").value)},helperText:"Experimental Runtime (minutes)"}),r.a.createElement(i.a,{id:"interval",label:"Intervals",onChange:function(){e.state.interval=parseFloat(document.getElementById("interval").value)},helperText:"Length of Interval (minutes)"})),r.a.createElement("div",null,r.a.createElement("h5",{className:"intro_header"},"Permeate Reservoir"),r.a.createElement("div",{className:"radio-div"},r.a.createElement("div",null,"Valve"),r.a.createElement("div",{onChange:this.onPermValv},r.a.createElement("input",{type:"radio",value:"on",name:"perm_valv"})," Open '",r.a.createElement("input",{type:"radio",value:"off",name:"perm_valv"})," Closed")),r.a.createElement(i.a,{id:"p_init_mass",label:"Mass",onChange:function(){e.state.p_init_mass=parseFloat(document.getElementById("p_init_mass").value)},helperText:"Permeate Initial Mass (g)"}),r.a.createElement(i.a,{id:"p_rb_conc",label:"RB",onChange:function(){e.state.p_rb_conc=parseFloat(document.getElementById("p_rb_conc").value)},helperText:"Permeate RB Concentration (mol/L)"}),r.a.createElement(i.a,{id:"p_dex_conc",label:"Dextran",onChange:function(){e.state.p_dex_conc=parseFloat(document.getElementById("p_dex_conc").value)},helperText:"Permeate Dextran Concentration (mol/L)"})),r.a.createElement("div",null,r.a.createElement("h5",{className:"intro_header"},"Feed Reservoir"),r.a.createElement("div",{className:"radio-div"},r.a.createElement("div",null,"Valve"),r.a.createElement("div",{onChange:this.onFeedValv},r.a.createElement("input",{type:"radio",value:"on",name:"feed_valv"})," Open '",r.a.createElement("input",{type:"radio",value:"off",name:"feed_valv"})," Closed")),r.a.createElement(i.a,{id:"f_init_mass",label:"Mass",onChange:function(){e.state.f_init_mass=parseFloat(document.getElementById("f_init_mass").value)},helperText:"Feed Initial Mass (g)"}),r.a.createElement(i.a,{id:"f_rb_conc",label:"RB",onChange:function(){e.state.f_rb_conc=parseFloat(document.getElementById("f_rb_conc").value)},helperText:"Feed RB Concentration (mol/L)"}),r.a.createElement(i.a,{id:"f_dex_conc",label:"Dextran",onChange:function(){e.state.f_dex_conc=parseFloat(document.getElementById("f_dex_conc").value)},helperText:"Feed Dextran Concentration (mol/L)"})),r.a.createElement("div",null,r.a.createElement("h5",{className:"intro_header"},"Buffer Reservoir"),r.a.createElement("div",{className:"radio-div"},r.a.createElement("div",null,"Valve"),r.a.createElement("div",{onChange:this.onBufferValv},r.a.createElement("input",{type:"radio",value:"on",name:"buffer_valv"})," Open '",r.a.createElement("input",{type:"radio",value:"off",name:"buffer_valv"})," Closed")),r.a.createElement(i.a,{id:"b_init_mass",label:"Mass",onChange:function(){e.state.b_init_mass=parseFloat(document.getElementById("b_init_mass").value)},helperText:"Buffer Initial Mass (g)"}),r.a.createElement(i.a,{id:"b_rb_conc",label:"RB",onChange:function(){e.state.b_rb_conc=parseFloat(document.getElementById("b_rb_conc").value)},helperText:"Buffer RB Concentration (mol/L)"}),r.a.createElement(i.a,{id:"b_dex_conc",label:"Dextran",onChange:function(){e.state.b_dex_conc=parseFloat(document.getElementById("b_dex_conc").value)},helperText:"Buffer Dextran Concentration (mol/L)"})),r.a.createElement("div",null,r.a.createElement("h5",{className:"intro_header"},"Membrane Selection"),r.a.createElement(u.a,{className:"dropdown",options:this.options,onChange:this._onSelect,value:this.default_option})),r.a.createElement("button",{className:"submit",onClick:this.downloadTxtFile.bind(this)},"Download")))}}])&&p(t.prototype,n),a&&p(t,a),l}(r.a.Component);n(32);var x=function(){return r.a.createElement("div",{className:"base-app"},r.a.createElement(E,null,"temp"))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(x,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[20,1,2]]]);
//# sourceMappingURL=main.615c94c2.chunk.js.map