(function($){
	$.widget('jui.staticswitch',$.jui.switchable,{
        //default options
		options : {
            itemQuery: '> .items > .item',
            showArraw: true,
            showIndex: true,
            autoStart: true,
            showDuration: 2000,
            effectDuration: 600
        },
        //init method
        _create: function(){
            this._state = {};
            this.reset();

            if(this.options.showArraw)
                this._buildArraws();
            if(this.options.showIndex)
                this._buildIndexs();

            this._initEvent();

            this.switchTo(0);
            if(this.options.autoStart)
                this.start();
        },

        //destruction method
        _destory: function(){

        },

        //reset items
        reset: function(){
            this.items = this.element.find(this.options.itemQuery).hide();
        },

        _buildArraws: function(){
            var prevArraw = $("<a class='arraw arr-prev'  />"),
                nextArraw = $("<a class='arraw arr-next'  />");

            this.element.append(prevArraw).append(nextArraw);

        },

        _buildIndexs: function(){

            var me             = this,
                indexContainer = $('<div class="index-container" />');

            me.items.each(function(idx,item){
                var idxItem = $('<a class="item-index" data-index="'+ idx + '"/>').html(idx + 1);
                indexContainer.append(idxItem);
            });

            me.element.append(indexContainer);

        },

        _switchIndexs: function(to,from){
            var fromIndex = this.element.find('> .index-container > .item-index[data-index="' + from + '"]');
            var toIndex   = this.element.find('> .index-container > .item-index[data-index="' + to + '"]');

            fromIndex.removeClass('item-index-active');
            toIndex.addClass('item-index-active');
        },

        _initEvent: function(){
            var me = this;
            function resetInterval(){
                me.pause();
                me.start();
            }

            //bind event handle for arrows
            this.element.on('click','.arr-prev',function(evt){
                me.prev();
                resetInterval();
            });
            this.element.on('click','.arr-next',function(evt){
                me.next();
                resetInterval();
            });
            //bind event handle for indexs
            this.element.on('click', '.item-index',function(evt){
                me.switchTo($(this).attr('data-index'));
                me.pause();
                me.start();
            });
        },


        switchTo: function(idx){

            idx = parseInt(idx);

            if(!this.items[idx])
                throw new Error('Index out of range');
            
            var prevItem       = this._state.current,
                targetItem     = {idx: idx,element: $(this.items[idx])};
            
            //fadeIn and fadeOut the items
            if(prevItem){
                var me = this;
                prevItem.element.fadeOut(this.options.effectDuration/2,
                    function(){
                        targetItem.element.fadeIn(me.options.effectDuration/2);
                });

                if(this.options.showIndex)
                    this._switchIndexs(targetItem.idx,prevItem.idx);
            }
            else{
                targetItem.element.fadeIn(this.options.effectDuration/2);

                if(this.options.showIndex)
                    this._switchIndexs(targetItem.idx,0);
            }

            this._state.current = targetItem;
            this._trigger('switch',null,{from: prevItem,to: targetItem});


        },
        next: function(){
            var currentIdx = this._state.current.idx,
                nextIdx    = currentIdx == this.items.length - 1  ? 0 : currentIdx + 1;

            this.switchTo(nextIdx); 
        },
        prev: function(){
            var currentIdx = this._state.current.idx,
                prevIdx    = currentIdx === 0 ? this.items.length - 1 :currentIdx - 1;

            this.switchTo(prevIdx);
        },
        start: function(){
            if(!this._state.interval)
                this._state.interval = setInterval($.proxy(this.next,this),this.options.showDuration);
        },
        pause: function(){
            if(this._state.interval)
                clearInterval(this._state.interval);
                this._state.interval = undefined;
        }
	});
})(jQuery);