describe("loader", function () {
    describe("timestamp for individual module works in combine mode", function () {
        var S = KISSY;
        var host = location.hostname;

        it("works theoretically", function () {

            S.Env.mods = {};
            S.Env.packages = {};
            S.Config.mappedRules = [];
            window.TIMESTAMP_X = 0;
            var combine = S.config("combine");

            S.config({
                base:'',
                tag:'',
                combine:true,
                debug:true,
                packages:{
                    'timestamp':{
                        tag:'a',
                        base:'/kissy_git/kissy/src/seed/tests/specs/'
                    }
                },
                modules:{
                    'timestamp/x':{
                        tag:'b',
                        requires:['./z']
                    },
                    'timestamp/y':{
                        requires:['./x']
                    },
                    'timestamp/z':{
                        tag:'z'
                    }
                }
            });

            runs(function () {
                var loader = S.getLoader(), Loader = S.Loader, utils = Loader.Utils;

                var allModNames = loader.calculate(["timestamp/y"]);

                utils.createModulesInfo(S, allModNames);

                var comboUrls = loader.getComboUrls(allModNames);

                expect(comboUrls.js['http://' + host + '/kissy_git/kissy/src/seed/tests/specs/'][0])
                    .toBe("http://" + host + "/kissy_git/kissy/src/seed/tests/specs/timestamp/??y.js,x.js,z.js?t=a");

            });

        });


        it("works practically", function () {
            S.Env.mods = {};
            S.Env.packages = {};
            S.Config.mappedRules = [];
            window.TIMESTAMP_X = 0;
            S.config({
                base:'',
                tag:'',
                combine:true,
                debug:true,
                packages:{
                    'timestamp':{
                        tag:'a',
                        base:'/kissy_git/kissy/src/seed/tests/specs/'
                    }
                },
                modules:{
                    'timestamp/x':{
                        tag:'b',
                        requires:['./z']
                    },
                    'timestamp/y':{
                        requires:['./x']
                    },
                    'timestamp/z':{
                        tag:'z'
                    }
                },
                map:[
                    [
                        /\?t=.+/, ""
                    ]
                ]
            });

            var ok = 0;

            S.use('timestamp/y', function (S, Y) {
                expect(Y).toBe(1);
                ok = 1;
            });

            waitsFor(function () {
                return ok;
            });

        });


        it("works theoretically when package has no combo", function () {

            S.Env.mods = {};
            S.Env.packages = {};
            S.Config.mappedRules = [];
            window.TIMESTAMP_X = 0;
            var combine = S.config("combine");

            S.config({
                base:'',
                tag:'',
                combine:true,
                debug:true,
                packages:{
                    'timestamp':{
                        combine:false,
                        tag:'a',
                        base:'/kissy_git/kissy/src/seed/tests/specs/'
                    }
                },
                modules:{
                    'timestamp/x':{
                        tag:'b',
                        requires:['./z']
                    },
                    'timestamp/y':{
                        requires:['./x']
                    },
                    'timestamp/z':{
                        tag:'z'
                    }
                }
            });

            runs(function () {
                var loader = S.getLoader(), Loader = S.Loader, utils = Loader.Utils;

                var allModNames = loader.calculate(["timestamp/y"]);

                utils.createModulesInfo(S, allModNames);
                var comboUrls = loader.getComboUrls(allModNames);

                var key = "http://" + host + "/kissy_git/kissy/src/seed/tests/specs/";

                var jss = comboUrls.js[key];

                expect(jss[0]).toBe("http://" + host + "/kissy_git/kissy/src/seed/tests/specs/timestamp/??y.js?t=a");
                expect(jss[1]).toBe("http://" + host + "/kissy_git/kissy/src/seed/tests/specs/timestamp/??x.js?t=b");
                expect(jss[2]).toBe("http://" + host + "/kissy_git/kissy/src/seed/tests/specs/timestamp/??z.js?t=z");

            });

        });

        it("works practically when package has no combo", function () {
            S.Env.mods = {};
            S.Env.packages = {};
            S.Config.mappedRules = [];
            window.TIMESTAMP_X = 0;
            S.config({
                base:'',
                tag:'',
                combine:true,
                debug:true,
                packages:{
                    'timestamp':{
                        combine:false,
                        tag:'a',
                        base:'/kissy_git/kissy/src/seed/tests/specs/'
                    }
                },
                modules:{
                    'timestamp/x':{
                        tag:'b',
                        requires:['./z']
                    },
                    'timestamp/y':{
                        requires:['./x']
                    },
                    'timestamp/z':{
                        tag:'z'
                    }
                },
                map:[
                    [
                        /\?t=.+/, ""
                    ]
                ]
            });

            var ok = 0;

            S.use('timestamp/y', function (S, Y) {
                expect(Y).toBe(1);
                ok = 1;
            });

            waitsFor(function () {
                return ok;
            });

        });
    });
});