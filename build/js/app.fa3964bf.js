(function(t){function e(e){for(var r,i,s=e[0],o=e[1],u=e[2],l=0,b=[];l<s.length;l++)i=s[l],Object.prototype.hasOwnProperty.call(c,i)&&c[i]&&b.push(c[i][0]),c[i]=0;for(r in o)Object.prototype.hasOwnProperty.call(o,r)&&(t[r]=o[r]);d&&d(e);while(b.length)b.shift()();return n.push.apply(n,u||[]),a()}function a(){for(var t,e=0;e<n.length;e++){for(var a=n[e],r=!0,s=1;s<a.length;s++){var o=a[s];0!==c[o]&&(r=!1)}r&&(n.splice(e--,1),t=i(i.s=a[0]))}return t}var r={},c={app:0},n=[];function i(e){if(r[e])return r[e].exports;var a=r[e]={i:e,l:!1,exports:{}};return t[e].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=t,i.c=r,i.d=function(t,e,a){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:a})},i.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)i.d(a,r,function(e){return t[e]}.bind(null,r));return a},i.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="/";var s=window["webpackJsonp"]=window["webpackJsonp"]||[],o=s.push.bind(s);s.push=e,s=s.slice();for(var u=0;u<s.length;u++)e(s[u]);var d=o;n.push([0,"chunk-vendors"]),a()})({0:function(t,e,a){t.exports=a("56d7")},"018c":function(t,e,a){},"56d7":function(t,e,a){"use strict";a.r(e);a("e260"),a("e6cf"),a("cca6"),a("a79d");var r=a("7a23"),c=a("5502"),n=Object(r["p"])("data-v-b7a44e56");Object(r["j"])("data-v-b7a44e56");var i={class:"navbar",role:"navigation","aria-label":"main navigation"},s=Object(r["f"])("div",{class:"navbar-brand"},[Object(r["f"])("a",{class:"navbar-item",href:"https://bulma.io"},[Object(r["f"])("img",{src:"https://bulma.io/images/bulma-logo.png",width:"112",height:"28"})]),Object(r["f"])("a",{role:"button",class:"navbar-burger","aria-label":"menu","aria-expanded":"false","data-target":"navbarBasicExample"},[Object(r["f"])("span",{"aria-hidden":"true"}),Object(r["f"])("span",{"aria-hidden":"true"}),Object(r["f"])("span",{"aria-hidden":"true"})])],-1),o={id:"navbarBasicExample",class:"navbar-menu"},u=Object(r["f"])("div",{class:"navbar-start"},[Object(r["f"])("a",{class:"navbar-item"},[Object(r["f"])("span",{class:"icon"},[Object(r["f"])("i",{class:"icon ion-md-logo-github has-text-danger so-icon-large"})])])],-1),d={key:0,class:"navbar-item"},l={class:"navbar-end"},b=Object(r["f"])("div",{class:"navbar-item"}," Add clock for auto update ",-1),f={class:"navbar-item"},v=Object(r["f"])("strong",null,"Update Now",-1),p={key:0,class:"overview"},O=Object(r["f"])("div",null,[Object(r["e"])(" Scanner Input: "),Object(r["f"])("span",{id:"scanned-cart"})],-1),j=Object(r["e"])(" Routes: "),h={id:"route-amount"},g=Object(r["e"])(" Stage Time: "),m={id:"stage-by-time"},y=Object(r["e"])(" Depart Time: "),D={id:"depart-time"},k={key:1,class:"container is-fluid tabcontent"};Object(r["i"])();var S=n((function(t,e,a,c,n,S){var A=Object(r["m"])("Pagination"),I=Object(r["m"])("RouteContainer"),w=Object(r["m"])("Scanner");return Object(r["h"])(),Object(r["c"])("div",null,[Object(r["f"])("nav",i,[s,Object(r["f"])("div",o,[u,n.processed?(Object(r["h"])(),Object(r["c"])("div",d,[Object(r["f"])(A,{waves:t.$store.state.sortedStageTimes.length},null,8,["waves"])])):Object(r["d"])("",!0),Object(r["f"])("div",l,[b,Object(r["f"])("div",f,[Object(r["f"])("button",{class:["button is-link",S.isLoading()],onClick:e[1]||(e[1]=function(t){return S.updateCartData()})},[v],2)])])])]),n.processed?(Object(r["h"])(),Object(r["c"])("div",p,[O,Object(r["f"])("div",null,[j,Object(r["f"])("span",h,Object(r["n"])(S.routesInWave),1)]),Object(r["f"])("div",null,[g,Object(r["f"])("span",m,Object(r["n"])(S.stageByTime),1)]),Object(r["f"])("div",null,[y,Object(r["f"])("span",D,Object(r["n"])(S.departTime),1)])])):Object(r["d"])("",!0),n.processed?(Object(r["h"])(),Object(r["c"])("div",k,[(Object(r["h"])(),Object(r["c"])(r["a"],null,Object(r["l"])(5,(function(t){return Object(r["f"])("div",{key:t,class:"columns tab-spacing"},[(Object(r["h"])(),Object(r["c"])(r["a"],null,Object(r["l"])(4,(function(e){return Object(r["f"])(I,{key:e,routeData:S.setRouteData(e+4*(t-1))},null,8,["routeData"])})),64))])})),64))])):Object(r["d"])("",!0),Object(r["f"])(w)])})),A=a("1da1"),I=a("5530"),w=(a("96cf"),a("b64b"),a("ac1f"),a("1276"),a("d3b7"),a("4de4"),a("fb6a"),Object(r["p"])("data-v-188da724"));Object(r["j"])("data-v-188da724");var C={class:"column"},T={class:"card"},x={key:0,class:"card-header"},_={class:"card-header-title"},$={class:"card-header-title so-title-font"},R={key:1,class:"card-header"},W=Object(r["f"])("p",{class:"card-header-title so-title-font is-centered"}," Empty ",-1),E={class:"card-content"};Object(r["i"])();var P=w((function(t,e,a,c,n,i){var s=Object(r["m"])("CheckCircle"),o=Object(r["m"])("ListItem");return Object(r["h"])(),Object(r["c"])("div",C,[Object(r["f"])("div",T,[Object.keys(a.routeData).length>0?(Object(r["h"])(),Object(r["c"])("header",x,[Object(r["f"])("p",_,Object(r["n"])(i.splitLocation),1),Object(r["f"])("p",$,Object(r["n"])(a.routeData.route),1),Object(r["f"])("div",{class:"so-button card-header-icon is-inverted",onClick:e[1]||(e[1]=function(){return i.auditRoute&&i.auditRoute.apply(i,arguments)})},[Object(r["f"])(s,{isAudited:i.isAudited},null,8,["isAudited"])])])):(Object(r["h"])(),Object(r["c"])("header",R,[W])),Object(r["f"])("div",E,[(Object(r["h"])(!0),Object(r["c"])(r["a"],null,Object(r["l"])(a.routeData.carts,(function(t){return Object(r["h"])(),Object(r["c"])(o,{key:t,cartData:t},null,8,["cartData"])})),128))])])])})),B=(a("159b"),Object(r["p"])("data-v-4f50a18a"));Object(r["j"])("data-v-4f50a18a");var M={class:"level"},L={class:"level-left"},N={class:"level-right"};Object(r["i"])();var J=B((function(t,e,a,c,n,i){var s=Object(r["m"])("CheckCircle");return Object(r["h"])(),Object(r["c"])("div",{class:"so-button",onClick:e[1]||(e[1]=function(){return i.auditCart&&i.auditCart.apply(i,arguments)})},[Object(r["f"])("div",M,[Object(r["f"])("div",L,[Object(r["f"])(s,{class:"so-icon-margin-right",isAudited:a.cartData.isAudited},null,8,["isAudited"]),Object(r["f"])("span",null,Object(r["n"])(a.cartData.cart),1)]),Object(r["f"])("div",N,[Object(r["f"])("div",{class:["tag",n.statusMap[a.cartData.status]]},Object(r["n"])(a.cartData.status),3)])])])})),q=Object(r["p"])("data-v-3c0c0c28");Object(r["j"])("data-v-3c0c0c28");var F={class:"icon"},U={key:0,class:"icon has-text-success ion-md-checkmark-circle so-icon-large"},G={key:1,class:"icon has-text-danger ion-md-radio-button-off so-icon-large"};Object(r["i"])();var H=q((function(t,e,a,c,n,i){return Object(r["h"])(),Object(r["c"])("span",F,[a.isAudited?(Object(r["h"])(),Object(r["c"])("i",U)):(Object(r["h"])(),Object(r["c"])("i",G))])})),z={props:{isAudited:{required:!0,type:Boolean}}};a("5cc5");z.render=H,z.__scopeId="data-v-3c0c0c28";var K=z,Q={components:{CheckCircle:K},props:{cartData:{required:!0,type:Object}},data:function(){return{statusMap:{Staged:"is-success",Ready:"is-warning","Not Ready":"is-light",Missing:"is-danger",Sidelined:"is-danger"}}},methods:{auditCart:function(){this.cartData.isAudited=!this.cartData.isAudited,this.$store.commit("exportAuditData")}}};a("8147");Q.render=J,Q.__scopeId="data-v-4f50a18a";var V=Q,X={components:{ListItem:V,CheckCircle:K},props:{routeData:{type:Object}},computed:{splitLocation:function(){return void 0!==this.routeData.loc?this.routeData.loc.split(".")[1]:""},isAudited:function(){var t=this.routeData.carts[0].cart;return this.routeData.carts.forEach((function(e){t=t&&e.isAudited})),this.routeAuditState=t,t}},data:function(){return{routeAuditState:!1}},methods:{auditRoute:function(){var t=this;this.routeAuditState=!this.routeAuditState,this.routeData.carts.forEach((function(e){e.isAudited=t.routeAuditState})),this.$store.commit("exportAuditData")}}};a("e800");X.render=P,X.__scopeId="data-v-188da724";var Y=X,Z={class:"pagination is-centered",role:"navigation","aria-label":"pagination"},tt={class:"pagination-list"};function et(t,e,a,c,n,i){return Object(r["h"])(),Object(r["c"])("nav",Z,[Object(r["f"])("ul",tt,[(Object(r["h"])(!0),Object(r["c"])(r["a"],null,Object(r["l"])(a.waves,(function(t){return Object(r["h"])(),Object(r["c"])("li",{key:t},[Object(r["f"])("a",{class:["pagination-link",i.isSelected(t)],onClick:function(e){return i.clickButton(t)}},Object(r["n"])(t-1),11,["onClick"])])})),128))])])}a("a9e3");var at={props:{waves:{required:!0,type:Number}},data:function(){return{selectedIndex:1}},methods:{isSelected:function(t){return{"is-current":this.selectedIndex===t}},clickButton:function(t){this.selectedIndex=t,this.$store.commit("setActiveWave",t-1)}}};at.render=et;var rt=at,ct=Object(r["p"])("data-v-f6f688ae");Object(r["j"])("data-v-f6f688ae");var nt={type:"text",id:"cart-scanner",class:"scanner",name:"cart-scanner"};Object(r["i"])();var it=ct((function(t,e,a,c,n,i){return Object(r["h"])(),Object(r["c"])("input",nt)})),st={methods:{checkForCart:function(t){var e=this,a=this.$store.getters.getWaveData;Object.keys(a).forEach((function(r){a[r].carts.forEach((function(a){if(t===a.cart)return a.isAudited=!0,void e.$store.commit("exportAuditData")}))}))},getCartInput:function(){var t=document.getElementById("cart-scanner");document.getElementById("scanned-cart").innerHTML=t.value,this.checkForCart(t.value),t.value="",t.blur()}},created:function(){var t=this;return Object(A["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:window.addEventListener("keypress",(function(e){if("INPUT"!==e.target.tagName){var a=document.getElementById("cart-scanner");a.select(),a.value=e.key,e.preventDefault(),setTimeout(t.getCartInput,200)}}));case 1:case"end":return e.stop()}}),e)})))()}};a("9b38");st.render=it,st.__scopeId="data-v-f6f688ae";var ot=st,ut={name:"Sally Ops Dashboard",components:{RouteContainer:Y,Pagination:rt,Scanner:ot},data:function(){return{processed:!1,gettingData:!1}},computed:{routesInWave:function(){return void 0!==this.$store.getters.getWaveData?Object.keys(this.$store.getters.getWaveData).length:0},stageByTime:function(){if(void 0!==this.$store.getters.getActiveStageTime){var t=this.$store.getters.getActiveStageTime.split(":");return parseInt(t[0])+":"+t[1]}return"0:00"},departTime:function(){if(void 0!==this.$store.getters.getActiveStageTime){var t=this.$store.getters.getActiveStageTime.split(":");return parseInt(t[1])+30>=60?parseInt(t[0])+1+":"+(parseInt(t[1])-30):parseInt(t[0])+":"+(parseInt(t[1])+30)}return"0:00"}},methods:{isLoading:function(t){return{"is-loading":this.gettingData}},processCartData:function(){var t=this;return browser.storage.local.get("carts").then((function(e){var a=Object.keys(e.carts).sort((function(t,e){var a=t.split(":"),r=e.split(":"),c=parseInt(a[0]),n=parseInt(r[0]);if(c<n)return-1;if(c>n)return 1;if(c===n){var i=parseInt(a[1]),s=parseInt(r[1]);if(i<s)return-1;if(i>s)return 1}return 0}));return t.$store.commit("setSortedStageTimes",{stageTimes:a}),t.$store.commit("importAuditData",{cartData:e.carts}),Promise.resolve()}))},setRouteData:function(t){var e=this.$store.getters.getWaveData;if(void 0!==e){t--;var a=Object.keys(e).filter((function(t){var a=e[t].loc.split(".");return"STG"===a[0]}));if(a.sort((function(t,a){var r=e[t].loc.split(".")[1].charAt(0),c=e[a].loc.split(".")[1].charAt(0);if(r<c)return-1;if(r>c)return 1;if(r===c){var n=parseInt(e[t].loc.split(".")[1].slice(1)),i=parseInt(e[a].loc.split(".")[1].slice(1));if(n<i)return-1;if(n>i)return 1}return 0})),void 0!==e[a[t]])return Object(I["a"])({route:a[t]},e[a[t]])}return{}},updateCartData:function(){this.gettingData=!0,browser.runtime.sendMessage({command:"SO_reload_content"})}},created:function(){var t=this;return Object(A["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:t.processCartData().then((function(){t.processed=!0})),browser.runtime.onMessage.addListener((function(e){"SO_carts_updated"===e.command&&(t.processCartData(),t.gettingData=!1)}));case 2:case"end":return e.stop()}}),e)})))()}};a("5ec9");ut.render=S,ut.__scopeId="data-v-b7a44e56";var dt=ut,lt=Object(c["a"])({state:{cartData:{},sortedStageTimes:[],activeWave:0},getters:{getWaveData:function(t){return t.cartData[t.sortedStageTimes[t.activeWave]]},getActiveStageTime:function(t){return t.sortedStageTimes[t.activeWave]}},mutations:{importAuditData:function(t,e){t.cartData=e.cartData},setSortedStageTimes:function(t,e){t.sortedStageTimes=e.stageTimes},exportAuditData:function(t){browser.storage.local.set({carts:JSON.parse(JSON.stringify(t.cartData))})},setActiveWave:function(t,e){t.activeWave=e}}});Object(r["b"])(dt).use(lt).mount("#app")},"5cc5":function(t,e,a){"use strict";a("af3d")},"5ec9":function(t,e,a){"use strict";a("ba22")},"60c8":function(t,e,a){},"7c13":function(t,e,a){},8147:function(t,e,a){"use strict";a("60c8")},"9b38":function(t,e,a){"use strict";a("7c13")},af3d:function(t,e,a){},ba22:function(t,e,a){},e800:function(t,e,a){"use strict";a("018c")}});
//# sourceMappingURL=app.fa3964bf.js.map