zuix.controller(function (cp) {

    cp.create = function () {

        var apiName = cp.view().attr('data-ui-api');
        cp.view().html('Loading '+apiName+' API...');
        zuix.$.ajax({
            url: 'content/api/'+apiName+'.json?'+Date.now(),
            success: function(json) {
                cp.view().html('');
                var dox = JSON.parse(json);
                var html = '';
                zuix.$.each(dox, function () {
                    var apiMember = (this.ctx != null && (this.ctx.cons === apiName));
                    if (apiMember) {

                        var params; params = '';
                        zuix.$.each(this.tags, function () {
                            if (this.type === 'param') {
                                params += this.name + ', ';
                            }
                        });

                        if (params.length > 0)
                            params = params.substring(0, params.length-2);
                        html += '<div class="title"><h5><i class="material-icons">expand_more</i><code>'+this.ctx.name+'( '+params+' )</code></h5></div>';
                        html += '<div class="container"><div class="details collapsed">';

                        var pl = { content: this.description.full };
                        zuix.trigger(cp.context, 'html:parse', pl);
                        html += '<div class="description">'+pl.content+'</div>';

                        var currentType = '', example = '';
                        zuix.$.each(this.tags, function () {

                            var typeName = this.type.toUpperCase();
                            if (typeName.indexOf('RETURN') >= 0)
                                typeName = "RETURNS";
                            else if (typeName.indexOf('PARAM') >= 0)
                                typeName = "PARAMETERS";
                            else if (typeName.indexOf("EXAMPLE") == 0) {
                                example += this.string;
                                return true;
                            } else return true;

                            if (currentType !== typeName) {
                                currentType = typeName;
                                html += '<p><strong><small>' + typeName + '</small></strong></p> '
                            }

                            html += '<div class="api-member-details">';

                            var types = '';
                            zuix.$.each(this.types, function () {
                                types += this+' ';
                            });
                            types = types.trim();

                            if (this.name != null)
                                html += ' <code>'+ this.name.replace('[','').replace(']','') +'</code>';
                            html += ' <code class="mdl-color-text--grey">{'+types+'}</code>';

                            if (this.optional)
                                html += ' <em class="mdl-color-text--grey">[optional]</em>';

                            //noinspection JSPotentiallyInvalidUsageOfThis
                            var pl = { content: this.description };
                            zuix.trigger(cp.context, 'html:parse', pl);
                            if (pl.content.indexOf('<p>') == -1)
                                pl.content = '<p>'+pl.content+'</p>';
                            html += pl.content;

                            html += '</div>';
                        });

                        if (example != '') {
                            var pl = { content: example };
                            zuix.trigger(cp.context, 'html:parse', pl);
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
                zuix.trigger(cp.context, 'view:process', cp.view());
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
        /*cp.view().find('.details').each(function(i, item) {
            if (item !== detail.get())
                this.addClass('collapsed');
        });*/
    }

});