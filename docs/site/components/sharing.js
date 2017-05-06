zuix.controller(function (cp) {
    cp.create = function () {
        var parsedHtml = zuix.$.replaceBraces(cp.view().html(), function (varName) {
            switch (varName) {
                case 'url':
                    return encodeURIComponent(cp.model()[varName].href);
                case 'description':
                    return encodeURIComponent(cp.model()[varName].innerHTML);
            }
        });
        if (parsedHtml != null)
            cp.view().html(parsedHtml);
    };
});
