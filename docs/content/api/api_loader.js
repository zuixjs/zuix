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
                    var apiMember = false;
                    console.log(this.tags);
                    zuix.$.each(this.tags, function () {
                        if (this.type.toLowerCase() === 'memberof' && this.string == apiName) {
                            apiMember = true;
                            return false;
                        }
                    });
                    apiMember = apiMember || (this.ctx != null && (this.ctx.cons === apiName));
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

                        html += '<p class="description"><span>'+this.description.full.replace(/<p>(.*)<\/p>/, '$1')+'</span></p>';
                        //console.log(this.ctx.type + ' ' + this.ctx.cons + '.' + this.ctx.name);
                        //console.log(this.description.full);


                        var currentType = '';
                        zuix.$.each(this.tags, function () {

                            var typeName = this.type.toUpperCase();
                            if (typeName.indexOf('RETURN') >= 0)
                                typeName = "RETURNS";
                            else if (typeName.indexOf('PARAM') >= 0)
                                typeName = "PARAMETERS";
                            else return true;

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
                                html += ' <code>'+ this.name +'</code>';
                            html += '<code class="mdl-color-text--grey">{'+types+'}</code>';
                            html += this.description;

                            html += '</div>';
                            //console.log('\t'+this.type+' '+JSON.stringify(this.types));
                            //console.log('\t'+this.description);
                            //console.log('\t');
                        });

                        html += '</div></div><!-- details -->';

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

    }

    function expandItem(element) {
        var detail = zuix.$(element).next().children().eq(0);
        console.log(detail.hasClass('collapsed'));
        if (detail.hasClass('collapsed')) {
            detail.animateCss('fadeInDown', { duration: '0.2s'}).removeClass('collapsed');
            zuix.$(element).find('i').html('expand_less')
                .animateCss('bounce', { duration: '.1s' });
        } else {
            detail.animateCss('fadeOutUp', { duration: '0.2s'}, function () {
                detail.addClass('collapsed');
            });
            zuix.$(element).find('i').html('expand_more')
                .animateCss('bounce', { duration: '.1s' });
        }

    }

    function stripHtml(html) {
        return html.replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/g, '')
            .split(/\n/)
            .map(function(line) {
                return line.replace(/(&nbsp;)/g, ' ').trim();
            }).filter(function(line) {
                return line != '' && line != '&nbsp;';
            })
            .join('\n');
    }

});