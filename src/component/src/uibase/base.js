/**
 * @fileOverview UIBase
 * @author yiminghe@gmail.com, lifesinger@gmail.com
 */
KISSY.add('component/uibase/base', function (S, Base, Node, undefined) {

    var UI_SET = '_uiSet',
        SRC_NODE = 'srcNode',
        ATTRS = 'ATTRS',
        HTML_PARSER = 'HTML_PARSER',
        ucfirst = S.ucfirst,
        noop = S.noop;

    function constructPlugins(plugins) {
        S.each(plugins, function (plugin, i) {
            if (S.isFunction(plugin)) {
                plugins[i] = new plugin();
            }
        });
    }


    function actionPlugins(self, plugins, action) {
        S.each(plugins, function (plugin) {
            if (plugin[action]) {
                plugin[action](self);
            }
        });
    }

    /**
     * @name UIBase
     * @memberOf Component
     * @extends Base
     * @class
     * UIBase for class-based component.
     */
    function UIBase(config) {
        var self = this;

        // 读取用户设置的属性值并设置到自身
        Base.apply(self, arguments);
        // 根据 srcNode 设置属性值
        // 按照类层次执行初始函数，主类执行 initializer 函数，扩展类执行构造器函数
        initHierarchy(self, config);

        var listener,
            n,
            plugins = self.get("plugins"),
            listeners = self.get("listeners");

        constructPlugins(plugins);

        actionPlugins(self, plugins, "initializer");

        for (n in listeners) {
            listener = listeners[n];
            self.on(n, listener.fn || listener, listener.scope);
        }


        // 是否自动渲染
        config && config.autoRender && self.render();

        /**
         * @name Component.UIBase#afterRenderUI
         * @description fired when root node is ready
         * @event
         * @param e
         */


        /**
         * @name Component.UIBase#afterBindUI
         * @description fired when component 's internal event is binded.
         * @event
         * @param e
         */
    }

    /**
     * 模拟多继承
     * init attr using constructors ATTRS meta info
     */
    function initHierarchy(host, config) {

        var c = host.constructor;

        while (c) {

            // 从 markup 生成相应的属性项
            if (config &&
                config[SRC_NODE] &&
                c.HTML_PARSER) {
                if ((config[SRC_NODE] = Node.one(config[SRC_NODE]))) {
                    applyParser.call(host, config, c.HTML_PARSER);
                }
            }

            c = c.superclass && c.superclass.constructor;
        }

        callMethodByHierarchy(host, "initializer", "constructor");

    }

    function callMethodByHierarchy(host, mainMethod, extMethod) {
        var c = host.constructor,
            extChains = [],
            ext,
            main,
            exts,
            t;

        // define
        while (c) {

            // 收集扩展类
            t = [];
            if (exts = c.__ks_exts) {
                for (var i = 0; i < exts.length; i++) {
                    ext = exts[i];
                    if (ext) {
                        if (extMethod != "constructor") {
                            //只调用真正自己构造器原型的定义，继承原型链上的不要管
                            if (ext.prototype.hasOwnProperty(extMethod)) {
                                ext = ext.prototype[extMethod];
                            } else {
                                ext = null;
                            }
                        }
                        ext && t.push(ext);
                    }
                }
            }

            // 收集主类
            // 只调用真正自己构造器原型的定义，继承原型链上的不要管 !important
            // 所以不用自己在 renderUI 中调用 superclass.renderUI 了，UIBase 构造器自动搜寻
            // 以及 initializer 等同理
            if (c.prototype.hasOwnProperty(mainMethod) && (main = c.prototype[mainMethod])) {
                t.push(main);
            }

            // 原地 reverse
            if (t.length) {
                extChains.push.apply(extChains, t.reverse());
            }

            c = c.superclass && c.superclass.constructor;
        }

        // 初始化函数
        // 顺序：父类的所有扩展类函数 -> 父类对应函数 -> 子类的所有扩展函数 -> 子类对应函数
        for (i = extChains.length - 1; i >= 0; i--) {
            extChains[i] && extChains[i].call(host);
        }
    }

    /**
     * 销毁组件
     * 顺序： 子类 destructor -> 子类扩展 destructor -> 父类 destructor -> 父类扩展 destructor
     */
    function destroyHierarchy(host) {
        var c = host.constructor,
            extensions,
            d,
            i;

        while (c) {
            // 只触发该类真正的析构器，和父亲没关系，所以不要在子类析构器中调用 superclass
            if (c.prototype.hasOwnProperty("destructor")) {
                c.prototype.destructor.apply(host);
            }

            if ((extensions = c.__ks_exts)) {
                for (i = extensions.length - 1; i >= 0; i--) {
                    d = extensions[i] && extensions[i].prototype.__destructor;
                    d && d.apply(host);
                }
            }

            c = c.superclass && c.superclass.constructor;
        }
    }

    function applyParser(config, parser) {
        var host = this, p, v, srcNode = config[SRC_NODE];

        // 从 parser 中，默默设置属性，不触发事件
        for (p in parser) {
            if (parser.hasOwnProperty(p) &&
                // 用户设置过那么这里不从 dom 节点取
                config[p] === undefined) {
                v = parser[p];
                // 函数
                if (S.isFunction(v)) {
                    host.__set(p, v.call(host, srcNode));
                }
                // 单选选择器
                else if (S.isString(v)) {
                    host.__set(p, srcNode.one(v));
                }
                // 多选选择器
                else if (S.isArray(v) && v[0]) {
                    host.__set(p, srcNode.all(v[0]))
                }
            }
        }
    }

    /**
     * 根据属性变化设置 UI
     */
    function bindUI(self) {
        var attrs = self.getAttrs(),
            attr, m;

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                m = UI_SET + ucfirst(attr);
                if (self[m]) {
                    // 自动绑定事件到对应函数
                    (function (attr, m) {
                        self.on('after' + ucfirst(attr) + 'Change', function (ev) {
                            // fix! 防止冒泡过来的
                            if (ev.target === self) {
                                self[m](ev.newVal, ev);
                            }
                        });
                    })(attr, m);
                }
            }
        }
    }

    /**
     * 根据当前（初始化）状态来设置 UI
     */
    function syncUI(self) {
        var v,
            f,
            attrs = self.getAttrs();
        for (var a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                var m = UI_SET + ucfirst(a);
                //存在方法，并且用户设置了初始值或者存在默认值，就同步状态
                if ((f = self[m])
                    // 用户如果设置了显式不同步，就不同步，比如一些值从 html 中读取，不需要同步再次设置
                    && attrs[a].sync !== false
                    && (v = self.get(a)) !== undefined) {
                    f.call(self, v);
                }
            }
        }
    }

    /**
     * Parse attribute from existing dom node.
     * @type Object
     * @memberOf Component.UIBase
     * @example
     * Overlay.HTML_PARSER={
     *    // el: root element of current component.
     *    "isRed":function(el){
     *       return el.hasClass("ks-red");
     *    }
     * };
     */
    UIBase.HTML_PARSER = {};

    UIBase.ATTRS =
    /**
     * @lends Component.UIBase#
     */
    {
        /**
         * Whether this component is rendered.
         * @type Boolean
         */
        rendered:{
            value:false
        },
        /**
         * Whether this component 's dom structure is created.
         * @type Boolean
         */
        created:{
            value:false
        },

        /**
         * Config listener on created.
         * @example
         * <code>
         * {
         *  click:{
         *      scope:{x:1},
         *      fn:function(){
         *          alert(this.x);
         *      }
         *  }
         * }
         * or
         * {
         *  click:function(){
         *          alert(this.x);
         *        }
         * }
         * </code>
         */
        listeners:{
            value:{}
        },

        /**
         * Plugins
         * @type Function[]|Object[]
         */
        plugins:{
            value:[]
        }
    };

    S.extend(UIBase, Base,
        /**
         * @lends Component.UIBase.prototype
         */
        {

            /**
             * Create dom structure of this component.
             */
            create:function () {
                var self = this;
                // 是否生成过节点
                if (!self.get("created")) {
                    self.fire('beforeCreateDom');
                    callMethodByHierarchy(self, "createDom", "__createDom");
                    self.__set("created", true);
                    self.fire('afterCreateDom');
                    actionPlugins(self, self.get("plugins"), "createDom");
                }
                return self;
            },

            /**
             * Put dom structure of this component to document and bind event.
             */
            render:function () {
                var self = this;
                // 是否已经渲染过
                if (!self.get("rendered")) {
                    var plugins = self.get("plugins");
                    self.create(undefined);
                    self.fire('beforeRenderUI');
                    callMethodByHierarchy(self, "renderUI", "__renderUI");
                    self.fire('afterRenderUI');
                    actionPlugins(self, plugins, "renderUI");
                    self.fire('beforeBindUI');
                    bindUI(self);
                    callMethodByHierarchy(self, "bindUI", "__bindUI");
                    self.fire('afterBindUI');
                    actionPlugins(self, plugins, "bindUI");
                    self.fire('beforeSyncUI');
                    syncUI(self);
                    callMethodByHierarchy(self, "syncUI", "__syncUI");
                    self.fire('afterSyncUI');
                    actionPlugins(self, plugins, "syncUI");
                    self.__set("rendered", true);
                }
                return self;
            },

            /**
             * For overridden. DOM creation logic of subclass component.
             * @protected
             * @function
             */
            createDom:noop,

            /**
             * For overridden. Render logic of subclass component.
             * @protected
             * @function
             */
            renderUI:noop,

            /**
             * For overridden. Bind logic for subclass component.
             * @protected
             * @function
             */
            bindUI:noop,

            /**
             * For overridden. Sync attribute with ui.
             * protected
             * @function
             */
            syncUI:noop,


            /**
             * Destroy this component.
             */
            destroy:function () {
                var self = this;
                destroyHierarchy(self);
                self.fire('destroy');
                self.detach();
                return self;
            }
        },
        /**
         * @lends Component.UIBase
         */
        {
            /**
             * Create a new class which extends UIBase.
             * @param {Function|Function[]} base Parent class constructor.
             * @param {Function[]} extensions Class constructors for extending.
             * @param {Object} px Object to be mixed into new class 's prototype.
             * @param {Object} sx Object to be mixed into new class.
             * @returns {UIBase} A new class which extends UIBase.
             */
            create:function (base, extensions, px, sx) {
                var args = S.makeArray(arguments), t;
                if (S.isArray(base)) {
                    sx = px;
                    px = extensions;
                    extensions = /*@type Function[]*/base;
                    base = UIBase;
                }
                base = base || UIBase;
                if (S.isObject(extensions)) {
                    sx = px;
                    px = extensions;
                    extensions = [];
                }

                var name = "UIBaseDerived";

                if (S.isString(t = args[args.length - 1])) {
                    name = t;
                }

                function C() {
                    UIBase.apply(this, arguments);
                }

                // debug mode , give the right name for constructor
                // refer : http://limu.iteye.com/blog/1136712
                S.log("UIBase.create : " + name, eval("C=function " + name.replace(/[-.]/g, "_") + "(){ UIBase.apply(this, arguments);}"));

                S.extend(C, base, px, sx);

                if (extensions) {
                    C.__ks_exts = extensions;

                    var desc = {
                        // ATTRS:
                        // HTML_PARSER:
                    }, constructors = extensions['concat'](C);

                    // [ex1,ex2]，扩展类后面的优先，ex2 定义的覆盖 ex1 定义的
                    // 主类最优先
                    S.each(constructors, function (ext) {
                        if (ext) {
                            // 合并 ATTRS/HTML_PARSER 到主类
                            S.each([ATTRS, HTML_PARSER], function (K) {
                                if (ext[K]) {
                                    desc[K] = desc[K] || {};
                                    // 不覆盖主类上的定义，因为继承层次上扩展类比主类层次高
                                    // 但是值是对象的话会深度合并
                                    // 注意：最好值是简单对象，自定义 new 出来的对象就会有问题(用 function return 出来)!
                                    S.mix(desc[K], ext[K], {
                                        deep:true
                                    });
                                }
                            });
                        }
                    });

                    S.each(desc, function (v, k) {
                        C[k] = v;
                    });

                    var prototype = {};

                    // 主类最优先
                    S.each(constructors, function (ext) {
                        if (ext) {
                            var proto = ext.prototype;
                            // 合并功能代码到主类，不覆盖
                            for (var p in proto) {
                                // 不覆盖主类，但是主类的父类还是覆盖吧
                                if (proto.hasOwnProperty(p)) {
                                    prototype[p] = proto[p];
                                }
                            }
                        }
                    });

                    S.each(prototype, function (v, k) {
                        C.prototype[k] = v;
                    });
                }
                return C;
            }
        });

    return UIBase;
}, {
    requires:["base", "node"]
});
/**
 * Refer:
 *  - http://martinfowler.com/eaaDev/uiArchs.html
 *
 * render 和 create 区别
 *  - render 包括 create ，以及把生成的节点放在 document 中
 *  - create 仅仅包括创建节点
 **/