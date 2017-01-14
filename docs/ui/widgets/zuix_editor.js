zuix.controller(function (zc) {
    zc.create = function () {
        console.log(zc, zc.view(), zc.field('code-wrapper'));

        //var flask = new CodeFlask;
        //flask.run(zc.field('code-wrapper'), { language: 'html' });
        //flask.update(zc.view().innerHTML)
    }
});