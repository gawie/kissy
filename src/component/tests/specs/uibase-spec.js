/**
 * uibase tc
 * @author yiminghe@gmaill.com
 */
KISSY.use("component", function (S, Component) {

    var UIBase = Component.UIBase, $ = S.all;

    describe('uibase', function () {
        it(" will works as multi-inheritance", function () {

            var x = 0, y = 0, z = 0;

            function h1() {

            }

            h1.prototype.xx = function () {
                x = 1;
            };

            function h2() {

            }

            h2.prototype.yy = function () {
                y = 1;
            };


            var h3 = UIBase.create(h2, [h1], {
                zz:function () {
                    z = 1;
                }
            });


            var h = new h3();

            h.xx();
            h.yy();
            h.zz();

            expect(x).toBe(1);
            expect(y).toBe(1);
            expect(z).toBe(1);

        });


        describe("extension attr", function () {

            it("does not override main attr,and last extension takes precedence", function () {

                function getter1() {
                }

                var x = function () {
                };
                x.ATTRS = {
                    y:{
                        value:1,
                        getter:getter1
                    },
                    x:{
                        value:9
                    }
                };

                var x3 = function () {
                };
                x3.ATTRS = {
                    y:{
                        value:4
                    },
                    x:{
                        value:8
                    }
                };

                var x2 = UIBase.create([x, x3], {

                }, {
                    ATTRS:{
                        y:{
                            value:2
                        },
                        z:{
                            value:9
                        }
                    }
                });

                var x2AttrsY = x2.ATTRS.y;

                expect(x2.ATTRS.z.value).toBe(9);
                expect(x2AttrsY.value).toBe(2);
                expect(x2AttrsY.getter).toBe(getter1);

                expect(x2.ATTRS.x.value).toBe(8);


            });

        });


        describe("extension method", function () {

            it("should run by order before main", function () {
                var ret = [];
                var x = function () {
                };

                x.prototype = {
                    __renderUI:function () {
                        ret.push(1);
                    }
                };

                var x3 = function () {
                };

                x3.prototype = {
                    __renderUI:function () {
                        ret.push(2);
                    }
                };

                var x2 = UIBase.create([x, x3], {
                    renderUI:function () {
                        ret.push(3);
                    }
                });

                new x2().render();

                expect(ret).toEqual([1, 2, 3]);

            });

        });

        describe("srcNode", function () {

            var SrcNode = UIBase.create([], {}, {
                HTML_PARSER:{
                    contentAttr:function (el) {
                        return el.attr("data-contentAttr")
                    }
                }
            });

            var BoxRender = UIBase.create([UIBase.Box.Render]);

            it("will get attribute from node", function () {

                var node = $("<div data-contentAttr='x'></div>").appendTo("body");

                var n = new SrcNode({
                    srcNode:node
                });

                expect(n.get("contentAttr")).toBe('x');

                node.remove();

            });


            it("will override attribute from node", function () {

                var node = $("<div data-contentAttr='x'></div>").appendTo("body");

                var n = new SrcNode({
                    srcNode:node,
                    "contentAttr":'y'
                });

                expect(n.get("contentAttr")).toBe('y');

                node.remove();

            });

            it("should get html", function () {
                var node = $("<div>123</div>").appendTo("body");
                var n = new BoxRender({
                    srcNode:node
                });
                expect(n.get("content")).toBe('123');
                node.remove();

            });

            it("should override html", function () {
                var node = $("<div>123</div>").appendTo("body");
                var n = new BoxRender({
                    el:node,
                    srcNode:node,
                    content:'4',
                    autoRender:true
                });
                expect(n.get("content")).toBe('4');
                expect(node.html().toLowerCase()).toBe('4');
                node.remove();

            });

            it("html can be node", function () {
                var node = $("<div>123</div>").appendTo("body");
                var n = new BoxRender({
                    el:node,
                    srcNode:node,
                    content:$('<span>4</span>'),
                    autoRender:true
                });
                expect(n.get("content").html()).toBe('4');
                expect(node.html().toLowerCase()).toBe('<span>4</span>');
                node.remove();
            });
        });

        describe("contentEl", function () {

            var ContentEl = UIBase.create([UIBase.Box.Render, UIBase.ContentBox.Render]);

            describe("srcNode", function () {

                it('transform el', function () {

                    var el = $("<div>23</div>").appendTo("body");

                    var content = new ContentEl({
                        srcNode:el,
                        el:el
                    }).render();

                    expect(content.get("content")).toBe("23");

                    expect(el.html().toLowerCase())
                        .toBe("<div class=\"ks-contentbox \">23</div>");

                    el.remove();

                });

                it('transform el with string content', function () {

                    var el = $("<div>23</div>").appendTo("body");

                    var content = new ContentEl({
                        srcNode:el,
                        el:el,
                        content:'4'
                    }).render();

                    expect(content.get("content")).toBe("4");

                    expect(el.html().toLowerCase())
                        .toBe("<div class=\"ks-contentbox \">4</div>");

                    el.remove();
                });


                it('transform el with node content', function () {

                    var el = $("<div>23</div>").appendTo("body");

                    var content = new ContentEl({
                        srcNode:el,
                        el:el,
                        content:$('<s>4</s>')
                    }).render();

                    expect(content.get("content").html()).toBe("4");

                    expect(el.html().toLowerCase())
                        .toBe("<div class=\"ks-contentbox \"><s>4</s></div>");

                    el.remove();

                });

            });


        });

    });

});
