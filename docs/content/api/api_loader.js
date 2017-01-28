zuix.controller(function (cp) {
    cp.create = function () {
        cp.view().html('OK');
        zuix.$.ajax({
            url: 'content/api/ZxQuery.json?'+Date.now(),
            success: function(json) {
                var dox = JSON.parse(json);
                console.log(dox);
                var html = '';
                zuix.$.each(dox, function () {
                    if (this.ctx != null && this.ctx.cons === 'ZxQuery') {
                        var params; params = '';
                        zuix.$.each(this.tags, function () {
                            if (this.type === 'param')
                                params += this.name+', ';
                        });
                        if (params.length > 0)
                            params = params.substring(0, params.length-2);
                        html += '<h5><code>'+this.ctx.name+'('+params+')</code></h5>';
                        html += this.description.full;
                        //console.log(this.ctx.type + ' ' + this.ctx.cons + '.' + this.ctx.name);
                        //console.log(this.description.full);
                        var currentType = '';
                        zuix.$.each(this.tags, function () {
                            if (currentType !== this.type) {
                                html += '<strong>'+this.type.toUpperCase()+'</strong> '
                            }
                            var types = '';
                            zuix.$.each(this.types, function () {
                                types += this+' ';
                            });
                            types = types.trim();
                            html += '<small>';
                            html += '<code class="mdl-color--grey-50">{'+types+'}</code>';
                            if (this.name != null)
                                html += ' <code><strong>'+ this.name +'</strong></code>';
                            html += this.description;
                            html += '</small>';
                            //console.log('\t'+this.type+' '+JSON.stringify(this.types));
                            //console.log('\t'+this.description);
                            //console.log('\t');
                            cp.view().html(html);
                        });
                    }
                });
                zuix.trigger(cp.context, 'view:process', cp.view());
            }
        });

    }
});