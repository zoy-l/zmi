(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{68:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return i})),n.d(t,"metadata",(function(){return b})),n.d(t,"toc",(function(){return c})),n.d(t,"default",(function(){return u}));var l=n(3),r=n(7),a=(n(0),n(96)),i={id:"miniapp",title:"\u5c0f\u7a0b\u5e8f\u914d\u7f6e"},b={type:"mdx",permalink:"/zmi/miniapp",source:"@site/src/pages/miniapp.md"},c=[{value:"\u4ecb\u7ecd",id:"\u4ecb\u7ecd",children:[]},{value:"ESLint",id:"eslint",children:[]},{value:"config",id:"config",children:[]},{value:"paths",id:"paths",children:[]},{value:"entry",id:"entry",children:[]},{value:"output",id:"output",children:[]},{value:"esBuild",id:"esbuild",children:[]},{value:"disableTypes",id:"disabletypes",children:[]},{value:"lessOptions",id:"lessoptions",children:[]},{value:"extraBabelPlugins",id:"extrababelplugins",children:[]},{value:"extraBabelPresets",id:"extrababelpresets",children:[]},{value:"beforeReadWriteStream",id:"beforereadwritestream",children:[]},{value:"afterReadWriteStream",id:"afterreadwritestream",children:[]},{value:"afterHook",id:"afterhook",children:[]}],p={toc:c};function u(e){var t=e.components,n=Object(r.a)(e,["components"]);return Object(a.b)("wrapper",Object(l.a)({},p,n,{components:t,mdxType:"MDXLayout"}),Object(a.b)("h3",{id:"\u4ecb\u7ecd"},"\u4ecb\u7ecd"),Object(a.b)("p",null,"\u5c0f\u7a0b\u5e8f\u914d\u7f6e\u662f\u72ec\u7acb\u7684, \u9ed8\u8ba4\u6a21\u677f\u7684\u662f ",Object(a.b)("inlineCode",{parentName:"p"},"\u5fae\u4fe1\u5c0f\u7a0b\u5e8f")," \u7684, \u5982\u679c\u60f3\u7528\u4e8e\u5176\u5b83\u5c0f\u7a0b\u5e8f, \u624b\u52a8\u62f7\u8d1d\u4e00\u4e0b\u4ee3\u7801\u5230",Object(a.b)("inlineCode",{parentName:"p"},"src"),"\u76ee\u5f55\u4e0b, \u5b89\u88c5\u76f8\u5173\u5c0f\u7a0b\u5e8f\u7684",Object(a.b)("inlineCode",{parentName:"p"},"types"),"\u5373\u53ef, js \u7f16\u8bd1\u4e5f\u662f\u652f\u6301\u7684"),Object(a.b)("p",null,"\u5c0f\u7a0b\u5e8f\u7f16\u8bd1\u662f file for file \u6a21\u5f0f, \u9ed8\u8ba4\u652f\u6301 ",Object(a.b)("inlineCode",{parentName:"p"},"less")," \u9884\u5904\u7406\u5668,"),Object(a.b)("h3",{id:"eslint"},"ESLint"),Object(a.b)("p",null,"\u9ed8\u8ba4\u662f\u652f\u6301\u7684, \u7531\u4e8e\u5c0f\u7a0b\u5e8f\u5b98\u65b9\u6ca1\u6709 eslint \u63d2\u4ef6, \u53ea\u80fd\u7528 extends:",'["zmi-miniapp/base"]'," \u6216\u8005 extends:",'["zmi-miniapp/typescript"]'),Object(a.b)("p",null,"\u6bd4\u5982:"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-js"},'// .erlintrc\n{\n  "root": true,\n  "extends": ["zmi-miniapp/typescript"]\n}\n')),Object(a.b)("h3",{id:"config"},"config"),Object(a.b)("p",null,"Zmi \u5728 ",Object(a.b)("inlineCode",{parentName:"p"},".zmirc.js")," \u4e2d\u914d\u7f6e\u9879\u76ee\u548c\u63d2\u4ef6\uff0c\u652f\u6301 ts\u3002\u4e00\u4efd\u5e38\u89c1\u7684\u914d\u7f6e\u5982\u4e0b\uff0c"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-javascript"},"export default {\n  entry: 'src',\n  paths: :{\n    '@':'./src'\n  }\n}\n")),Object(a.b)("h3",{id:"paths"},"paths"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"object")),Object(a.b)("li",{parentName:"ul"},"Default: ",Object(a.b)("inlineCode",{parentName:"li"},"{}"))),Object(a.b)("p",null,"\u914d\u7f6e\u522b\u540d\uff0c\u5bf9\u5f15\u7528\u8def\u5f84\u8fdb\u884c\u6620\u5c04\u3002"),Object(a.b)("p",null,"\u6bd4\u5982\uff1a"),Object(a.b)("pre",null,Object(a.b)("code",{parentName:"pre",className:"language-js"},"export default {\n  paths: {\n    '@': '/tmp/a/b/foo'\n  }\n}\n")),Object(a.b)("h3",{id:"entry"},"entry"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"string")),Object(a.b)("li",{parentName:"ul"},"Default: ",Object(a.b)("inlineCode",{parentName:"li"},"src"))),Object(a.b)("p",null,"\u76d1\u542c\u7684\u76ee\u5f55\u3002"),Object(a.b)("h3",{id:"output"},"output"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"string")),Object(a.b)("li",{parentName:"ul"},"Default: ",Object(a.b)("inlineCode",{parentName:"li"},"miniprogram"))),Object(a.b)("p",null,"\u8f93\u51fa\u7684\u76ee\u5f55\u3002"),Object(a.b)("h3",{id:"esbuild"},"esBuild"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"boolean")),Object(a.b)("li",{parentName:"ul"},"Default: ",Object(a.b)("inlineCode",{parentName:"li"},"false"))),Object(a.b)("p",null,"\u662f\u5426\u542f\u7528",Object(a.b)("inlineCode",{parentName:"p"},"esbuild"),"\u7f16\u8bd1, \u9ed8\u8ba4\u662f",Object(a.b)("inlineCode",{parentName:"p"},"babel")),Object(a.b)("h3",{id:"disabletypes"},"disableTypes"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"boolean")),Object(a.b)("li",{parentName:"ul"},"Default: ",Object(a.b)("inlineCode",{parentName:"li"},"false"))),Object(a.b)("p",null,"\u662f\u5426\u9700\u8981\u8f93\u51fa d.ts \u6587\u4ef6"),Object(a.b)("h3",{id:"lessoptions"},"lessOptions"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"object")),Object(a.b)("li",{parentName:"ul"},"Default: ",Object(a.b)("inlineCode",{parentName:"li"},"{}"))),Object(a.b)("p",null,"\u8be6\u7ec6\u914d\u7f6e\u8bf7\u53c2\u8003",Object(a.b)("a",{parentName:"p",href:"https://github.com/gulp-community/gulp-less"},"gulp-less")),Object(a.b)("h3",{id:"extrababelplugins"},"extraBabelPlugins"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"string[]")),Object(a.b)("li",{parentName:"ul"},"Default: ",Object(a.b)("inlineCode",{parentName:"li"},"[]"))),Object(a.b)("p",null,"\u989d\u5916\u7684 babel \u63d2\u4ef6"),Object(a.b)("h3",{id:"extrababelpresets"},"extraBabelPresets"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"string[]")),Object(a.b)("li",{parentName:"ul"},"Default: ",Object(a.b)("inlineCode",{parentName:"li"},"[]"))),Object(a.b)("p",null,"\u989d\u5916\u7684 babel \u9884\u8bbe"),Object(a.b)("h3",{id:"beforereadwritestream"},"beforeReadWriteStream"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"Function"))),Object(a.b)("p",null,"\u6587\u4ef6 tranfrom \u5f00\u59cb\u524d\u6267\u884c"),Object(a.b)("h3",{id:"afterreadwritestream"},"afterReadWriteStream"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"Function"))),Object(a.b)("p",null,"\u6587\u4ef6 tranfrom \u5f00\u59cb\u540e, \u8f93\u51fa\u524d\u6267\u884c"),Object(a.b)("h3",{id:"afterhook"},"afterHook"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},"Type: ",Object(a.b)("inlineCode",{parentName:"li"},"Function"))),Object(a.b)("p",null,"\u8f93\u51fa\u76ee\u5f55\u540e\u6267\u884c"))}u.isMDXComponent=!0},96:function(e,t,n){"use strict";n.d(t,"a",(function(){return o})),n.d(t,"b",(function(){return d}));var l=n(0),r=n.n(l);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);t&&(l=l.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,l)}return n}function b(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,l,r=function(e,t){if(null==e)return{};var n,l,r={},a=Object.keys(e);for(l=0;l<a.length;l++)n=a[l],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(l=0;l<a.length;l++)n=a[l],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=r.a.createContext({}),u=function(e){var t=r.a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):b(b({},t),e)),n},o=function(e){var t=u(e.components);return r.a.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},O=r.a.forwardRef((function(e,t){var n=e.components,l=e.mdxType,a=e.originalType,i=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),o=u(n),O=l,d=o["".concat(i,".").concat(O)]||o[O]||s[O]||a;return n?r.a.createElement(d,b(b({ref:t},p),{},{components:n})):r.a.createElement(d,b({ref:t},p))}));function d(e,t){var n=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var a=n.length,i=new Array(a);i[0]=O;var b={};for(var c in t)hasOwnProperty.call(t,c)&&(b[c]=t[c]);b.originalType=e,b.mdxType="string"==typeof e?e:l,i[1]=b;for(var p=2;p<a;p++)i[p]=n[p];return r.a.createElement.apply(null,i)}return r.a.createElement.apply(null,n)}O.displayName="MDXCreateElement"}}]);