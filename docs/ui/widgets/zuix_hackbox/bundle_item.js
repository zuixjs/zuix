zuix.controller(function (cp) {

    var instances = 0, resources = ' ';

    cp.create = function () {
        cp.view().on('click', function () {
           cp.trigger('item:click', cp.model());
        });
        cp.expose('count', function () {
            return instances;
        });
        var isHackBox = cp.model().componentId.indexOf('/zuix_hackbox') > 0;
        if (isHackBox)
            this.view().children().eq(0).addClass('zuix-hackbox');
        // populate fixed fields
        var c = cp.model();
        cp.field('componentId').html(c.componentId);
        if (c.controller != null && c.controller.toString().length > 30)
            resources += 'js ';
        if (c.view != null)
            resources += 'html ';
        if (c.css != null)
            resources += 'css ';
        cp.field('resources').html(resources);
        // display variable data
        cp.update();
        // expose public interface members
        cp.expose({
            'instanceCount': countInstances,
            'hasResource': hasResource,
            'isHackBox': function () {
                return isHackBox;
            }
        });
    };

    cp.update = function () {
        instances = countInstances();
        cp.field('instances').html(instances);
        cp.trigger('item:update');
    };

    function countInstances() {
        var components = zuix.dumpContexts(),
            count = 0;
        for(var i = 0; i < components.length; i++)
            if (components[i].componentId == cp.model().componentId)
                count++;
        return count;
    }

    function hasResource(resourceType) {
        return (resources.indexOf(' '+resourceType+' ') >= 0);
    }

});