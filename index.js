// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// A script preamble that provides the ability to load a single outfile
// TypeScript "bundle" where a main module is loaded which recursively
// instantiates all the other modules in the bundle.  This code is used to load
// bundles when creating snapshots, but is also used when emitting bundles from
// Deno cli.

// @ts-nocheck

/**
 * @type {(name: string, deps: ReadonlyArray<string>, factory: (...deps: any[]) => void) => void=}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let define;

/**
 * @type {(mod: string) => any=}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let instantiate;

/**
 * @callback Factory
 * @argument {...any[]} args
 * @returns {object | void}
 */

/**
 * @typedef ModuleMetaData
 * @property {ReadonlyArray<string>} dependencies
 * @property {(Factory | object)=} factory
 * @property {object} exports
 */

(function() {
  /**
   * @type {Map<string, ModuleMetaData>}
   */
  const modules = new Map();

  /**
   * Bundles in theory can support "dynamic" imports, but for internal bundles
   * we can't go outside to fetch any modules that haven't been statically
   * defined.
   * @param {string[]} deps
   * @param {(...deps: any[]) => void} resolve
   * @param {(err: any) => void} reject
   */
  const require = (deps, resolve, reject) => {
    try {
      if (deps.length !== 1) {
        throw new TypeError("Expected only a single module specifier.");
      }
      if (!modules.has(deps[0])) {
        throw new RangeError(`Module "${deps[0]}" not defined.`);
      }
      resolve(getExports(deps[0]));
    } catch (e) {
      if (reject) {
        reject(e);
      } else {
        throw e;
      }
    }
  };

  define = (id, dependencies, factory) => {
    if (modules.has(id)) {
      throw new RangeError(`Module "${id}" has already been defined.`);
    }
    modules.set(id, {
      dependencies,
      factory,
      exports: {}
    });
  };

  /**
   * @param {string} id
   * @returns {any}
   */
  function getExports(id) {
    const module = modules.get(id);
    if (!module) {
      // because `$deno$/ts_global.d.ts` looks like a real script, it doesn't
      // get erased from output as an import, but it doesn't get defined, so
      // we don't have a cache for it, so because this is an internal bundle
      // we can just safely return an empty object literal.
      return {};
    }
    if (!module.factory) {
      return module.exports;
    } else if (module.factory) {
      const { factory, exports } = module;
      delete module.factory;
      if (typeof factory === "function") {
        const dependencies = module.dependencies.map(id => {
          if (id === "require") {
            return require;
          } else if (id === "exports") {
            return exports;
          }
          return getExports(id);
        });
        factory(...dependencies);
      } else {
        Object.assign(exports, factory);
      }
      return exports;
    }
  }

  instantiate = dep => {
    define = undefined;
    const result = getExports(dep);
    // clean up, or otherwise these end up in the runtime environment
    instantiate = undefined;
    return result;
  };
})();

define("app/dashboard/dashboard.component", ["require", "exports", "app/global.service"], function (require, exports, global_service_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var templates = {
        selector: 'app-dashboard',
        html: './app/dashboard/dashboard.component.html',
        style: './app/dashboard/dashboard.component.css'
    };
    class values {
    }
    exports.values = values;
    values.myName = 'Eduards';
    values.piens = 3;
    values.udens = 6;
    values.olas = [
        {
            title: 'manas',
            value: 4
        },
        {
            title: 'tavas',
            value: 8
        }
    ];
    values.naudaMaka = 100;
    class Dashboard {
        constructor(global, component_tag) {
            this.global = global;
            this.component_tag = component_tag;
            this.html = global_service_ts_1.build(templates, component_tag, values);
        }
    }
    exports.Dashboard = Dashboard;
});
define("app/listeners", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var document = window['document'];
    class twowayBinds {
    }
    exports.twowayBinds = twowayBinds;
    twowayBinds.binded = [];
    twowayBinds.listeners = {};
    function InitEventListener() {
        for (let events of twowayBinds.binded) {
            if (!twowayBinds.listeners[events.eventName]) {
                console.log('adding ', events.eventName);
                document.addEventListener(events.eventName, e => {
                    let details = e.detail;
                    console.log('eventRunned', e.srcElement.activeElement.value, details);
                    // for textarea let text=e.srcElement.activeElement.innerText
                    // console.log(text)
                });
                twowayBinds.listeners[events.eventName] = true;
            }
        }
        console.log(twowayBinds.listeners);
    }
    exports.InitEventListener = InitEventListener;
    function addEventToBind(eventName, value) {
        twowayBinds.binded.push({
            eventName,
            value
        });
        InitEventListener();
        // document.addEventListener('naudaMaka', e => {
        //     console.log('eventRunned')
        //     let details=e.detail
        //     let text=e.srcElement.activeElement.innerText
        //      console.log(details,text)
        //   });
        console.log(twowayBinds.binded);
    }
    exports.addEventToBind = addEventToBind;
});
define("app/global.service", ["require", "exports", "app/listeners"], function (require, exports, listeners_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var document = window["document"];
    var chrome = window["chrome"];
    class GlobalService {
        constructor() {
            this.document = window["document"];
            this.chrome = window["chrome"];
            this.api = "localhost";
            this.local = "localhost";
        }
    }
    exports.GlobalService = GlobalService;
    GlobalService.builtCompnents = {};
    async function build(templates, component_tag, values) {
        console.log('getting files', templates);
        asingFileToObject(templates.html, templates.style).then(html => {
            let Component = GlobalService.builtCompnents[component_tag];
            if (Component) {
                Component.innerHTML = html;
                return Component;
            }
            let child = document.createElement(component_tag);
            if (values) {
                child.innerHTML = generateObjectHTML(html, values);
            }
            else {
                child.innerHTML = html;
            }
            return GlobalService.builtCompnents[component_tag] = document.body.appendChild(child);
        });
    }
    exports.build = build;
    async function asingFileToObject(html, style) {
        let fechedHtml = await fetch(chrome.runtime.getURL(html))
            .then(response => response.text())
            .then(text => {
            return text;
        });
        let fechedstyle = await fetch(chrome.runtime.getURL(style))
            .then(response => response.text())
            .then(text => {
            return text;
        });
        return "<style>" + fechedstyle + "</style>" + fechedHtml;
    }
    function generateObjectHTML(HTMLString, values) {
        let loopRegex = new RegExp(/([{]{1}[REPEAT^}][^}]*[}]{1})/g);
        let splitByREAPET = HTMLString.split(loopRegex);
        let getfuntion = HTMLString.match(loopRegex);
        // console.log(getfuntion,splitByREAPET)
        let html = '';
        if (splitByREAPET.length > 1) {
            let repeatStarted = false;
            let repietObject = [];
            let eventKey = '';
            for (let HTMLPeace of splitByREAPET) {
                let match = HTMLPeace.match(loopRegex);
                //console.log('what regex found',match)
                if (!match) {
                    // console.log('not function')
                    if (repeatStarted) {
                        let countKeys = 0;
                        for (let event of repietObject) { ///repietObject=[{value:{x:0,y:0,...data}}]
                            // console.log('itkā ok....',event,HTMLPeace)
                            html += HTMLRegex(event, HTMLPeace, countKeys);
                            //  console.log('done successfull',html)
                            countKeys++;
                        }
                        continue;
                    }
                    html += HTMLRegex(values, HTMLPeace);
                    continue;
                }
                ///// {REAPEAT;let value of values} -> nogriez {} malas
                let params = match[0].substr(1, match[0].length - 2);
                if (params.match(';')) {
                    ///// sadala REAPEAT;let value of values -> ['REAPEAT','let value of values']
                    console.log();
                    repeatStarted = true;
                    //console.log('Params')
                    let spliKeys = params.split(';')[1].split(' '); //// ['let','value','of','values']
                    eventKey = spliKeys[1]; ///'value'
                    params = spliKeys[3].split('.'); /// ['values']
                    for (let obj of params.reduce(index, values)) {
                        repietObject.push(JSON.parse(JSON.stringify({ [eventKey]: obj })));
                    }
                    ///repietObject = [{value:{x:0,y:0,...data}}]
                    //console.log(repietObject,params)
                    continue;
                }
                if (params == "REPEAT") {
                    repeatStarted = false;
                    repietObject = [];
                    eventKey = '';
                }
                // console.log('none shownde')
            }
        }
        else {
            html += HTMLRegex(values, HTMLString);
        }
        return html;
    }
    function HTMLRegex(JSONObject, HTML, i) {
        //reggex prieks {{ ....  }}
        var regex = new RegExp(/([{]{2})([^}]*)([}]{2})/g);
        let dats = HTML.replace(regex, ((match, capture) => {
            // //console.log('p1',match)
            let needToCalculate = false;
            let id2 = (match.substr(2, match.length - 4));
            let dateFormat;
            if (id2.split('|').length > 1) {
                dateFormat = id2.split('|')[1];
                id2 = id2.split('|')[0];
                // //console.log('dateFormat',dateFormat)
                let res = id2.split('.');
                let time = res.reduce(index, JSONObject);
                // //console.log('time',time)
                return this.dateReturner(dateFormat, time);
            }
            let stringValue = '';
            //nogriež {{ sakumā un beigās  }}
            let fullString = (match.substr(2, match.length - 4));
            //atrod matemātiskos simbolus
            let variables = fullString.split(/([*+\-\/]{1})/g);
            for (let variable of variables) {
                variable = variable.replace(',', '.');
                if (!isNaN(variable)) {
                    //     //console.log('Ir Cipars',variable)
                    stringValue += variable;
                    continue;
                }
                if (variable == 'index') {
                    stringValue += (i);
                    continue;
                }
                if (['*', '+', '-', '/'].indexOf(variable) != -1) {
                    stringValue += variable;
                    //   //console.log('Matematikas zīme',variable)
                    needToCalculate = true;
                    continue;
                }
                let sqareBrackets = new RegExp(/\[([^\]]+)]/g);
                let squaretext = variable.match(sqareBrackets);
                variable = variable.replace(sqareBrackets, '.valueReserved');
                //console.log(squaretext)
                //console.log(variable)
                variable = variable.split('.');
                //console.log(variable)
                let newVariable = [];
                for (let vv of variable) {
                    if (vv == "" || vv.length < 1) {
                        continue;
                    }
                    if (vv == 'valueReserved') {
                        newVariable.push(squaretext[0].substr(1, squaretext[0].length - 2));
                        continue;
                    }
                    newVariable.push(vv);
                }
                //console.log(newVariable,element)
                variable = newVariable.reduce(index, JSONObject);
                stringValue += variable;
            }
            if (needToCalculate) {
                return eval(stringValue);
            }
            return stringValue;
            // //console.log(stringValue)
        }));
        /////////here 2way binding
        let bindingRegex = RegExp(/([\[][(][^=]*)([=])(["][^"]*["])/g);
        dats = dats.replace(bindingRegex, ((match, capture) => {
            let bindings = [];
            let regexBindKey = new RegExp(/(["][^"]*["])/g);
            //let values=['naudaMaka'];
            console.log('atrada ', match);
            let matchSplited = match.split(regexBindKey);
            if (matchSplited[1]) {
                let key = matchSplited[1];
                key = key.substr(1, key.length - 2);
                let keyValue = key.split('.');
                console.log(key, JSONObject[key]);
                listeners_ts_1.addEventToBind(key, keyValue.reduce(index, JSONObject));
                return `oninput="document.dispatchEvent(new CustomEvent('` + key + `',{detail:{ component:'' }}))"`;
            }
        }));
        ///////
        return dats;
    }
    function index(obj, i) {
        return obj[i];
    }
});
define("app/app.component", ["require", "exports", "app/global.service"], function (require, exports, global_service_ts_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var templates = {
        selector: 'app-root',
        html: './app/app.component.html',
        style: './app/app.component.css'
    };
    class AppRoot {
        constructor(global, component_tag) {
            this.global = global;
            this.component_tag = component_tag;
            this.html = global_service_ts_2.build(templates, component_tag);
            console.log(this.html);
        }
    }
    exports.AppRoot = AppRoot;
});
define("app/app.module", ["require", "exports", "app/app.component", "app/global.service", "app/dashboard/dashboard.component"], function (require, exports, app_component_ts_1, global_service_ts_3, dashboard_component_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class AppModule {
    }
    exports.AppModule = AppModule;
    AppModule.componenets = [
        {
            selector: 'app-root',
            component: app_component_ts_1.AppRoot
        },
        {
            selector: 'app-dashboard',
            component: dashboard_component_ts_1.Dashboard
        }
    ];
    AppModule.services = [
        global_service_ts_3.GlobalService
    ];
    async function runApp() {
        console.log('do SomethingHere');
        for (let comp of AppModule.componenets) {
            await new comp.component(new global_service_ts_3.GlobalService, comp.selector);
        }
    }
    exports.runApp = runApp;
});
define("index", ["require", "exports", "app/app.module"], function (require, exports, app_module_ts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var requestIdleCallback = window['requestIdleCallback'];
    var document = window['document'];
    console.log('EXTENTION INITIALIZED');
    requestIdleCallback(checkForDOM);
    //startup loop check////////////////////////////////////////
    function checkForDOM() {
        if (document.body && document.head) {
            setTimeout(() => {
                loopRendered();
            }, 1000);
        }
        else {
            requestIdleCallback(checkForDOM);
        }
    }
    /////////////////////////////////////////////////////
    function loopRendered() {
        app_module_ts_1.AppModule;
        app_module_ts_1.runApp();
        //updateAditionalElements()
        // setTimeout(() => {
        //   loopRendered()
        // }, 300)
    }
});

instantiate("index");
