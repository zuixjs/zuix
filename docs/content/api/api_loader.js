zuix.controller(function (cp) {
    var linkedApi = [
        'ZxQuery',
        'Zuix',
        'ContextOptions',
        'ComponentContext',
        'ContextController'];

    cp.create = function () {

        var apiName = cp.view().attr('data-ui-api');
        cp.view().html('Loading '+apiName+' API...');

        // download the jsDoc data file and HTML-format it.
        zuix.$.ajax({
            url: 'content/api/'+apiName+'.json?'+Date.now(),
            success: function(json) {
                cp.view().html('');
                var dox = JSON.parse(json);
                var html = '';
                zuix.$.each(dox, function () {

                    var isTypeDef = false;
                    var apiMember = (!this.isPrivate && this.ctx != null && (this.ctx.cons === apiName));
                    var params; params = '';
                    zuix.$.each(this.tags, function () {
                        if (this.type === 'param') {
                            params += this.name + ', ';
                        } else if (this.type == 'typedef') {
                            apiMember = isTypeDef = true;
                        }
                    });
                    if (apiMember) {

                        if (params.length > 0)
                            params = params.substring(0, params.length-2);
                        if (this.ctx != null)
                            html += '<div class="title"><h5><i class="material-icons">expand_more</i><code>'+this.ctx.name+'('+params+')</code></h5></div>';
                        html += '<div class="container"><div class="details'+(isTypeDef ? '' : ' collapsed')+'">';

                        var pl = { content: this.description.full };
                        cp.trigger('html:parse', pl, true);
                        html += '<div class="description">'+pl.content+'</div>';

                        var currentType = '', example = '';
                        zuix.$.each(this.tags, function () {

                            var typeName = this.type.toLowerCase();
                            if (typeName.indexOf('return') >= 0)
                                typeName = "RETURNS";
                            else if (typeName.indexOf('param') >= 0)
                                typeName = "PARAMETERS";
                            else if (typeName.indexOf('property') >= 0)
                                typeName = "PROPERTIES";
                            else if (typeName.indexOf("example") == 0) {
                                example += this.string;
                                return true;
                            } else return true;

                            if (currentType !== typeName) {
                                currentType = typeName;
                                html += '<p><strong><small>' + typeName + '</small></strong></p> '
                            }

                            html += '<div class="api-member-details">';

                            var types = '', t = this.types;
                            zuix.$.each(t, function (i) {
                                if (linkedApi.indexOf(this.toString()) >= 0)
                                    types += '<a href="#ZUIX_API--'+this+'">'+this.replace(/</g,"&lt;").replace(/>/g,"&gt;")+'</a>';
                                else
                                    types += this.replace(/</g,"&lt;").replace(/>/g,"&gt;");
                                if (i < t.length-1)
                                    types +=' | ';
                            });

                            if (this.optional)
                                html += ' <strong class="mdl-color-text--grey-500">optional</strong>';

                            html += ' <em class="mdl-color-text--grey-700">{'+types+'}</em>';

                            //noinspection JSPotentiallyInvalidUsageOfThis
                            pl = { content: this.description };
                            if (this.name != null)
                                pl.content = '<code>'+ this.name.replace('[','').replace(']','') +'</code>: '+pl.content;
                            cp.trigger('html:parse', pl, true);
                            if (pl.content.indexOf('<p>') == -1)
                                pl.content = '<p>'+pl.content+'</p>';
                            html += pl.content;

                            html += '</div>';
                        });

                        if (example != '') {
                            var pl = { content: example };
                            cp.trigger('html:parse', pl, true);
                            html += '<div class="example">'+pl.content+'</div>';
                        }

                        html += '</div>';
                        html += '</div><!-- details -->';

                    }
                });
                cp.view()
                    .html(html)
                    .find('div.title')
                    .css('cursor', 'pointer')
                    .on('click', function () {
                        expandItem(this);
                    });
                cp.trigger('view:process', cp.view(), true);
            },
            error: function() {
                cp.view().html('Error loading '+apiName+' API!');
            }
        });

    };

    function expandItem(element) {
        var detail = element.next().children().eq(0);
        var collapsed = detail.hasClass('collapsed');
        if (collapsed) {
            detail.animateCss('fadeInDown', { duration: '0.2s'}).removeClass('collapsed');
            element.find('i').html('expand_less')
                .animateCss('bounce', { duration: '.1s' });
        } else {
            detail.animateCss('fadeOutUp', { duration: '0.2s'}, function () {
                detail.addClass('collapsed');
            });
            element.find('i').html('expand_more')
                .animateCss('bounce', { duration: '.1s' });
        }
        // alternate expand/collapse
        /*cp.view().find('.details').each(function(i, item) {
            if (item !== detail.get())
                this.addClass('collapsed');
        });*/
    }

});