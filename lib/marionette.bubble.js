// Marionette.Bubble
// --------------------
// v0.1.0
// 
// Copyright (c) 2014 Mattias Rydengren <mattias.rydengren@coderesque.com>
// Distributed under MIT license

Marionette.BubbleRegion = (function(Marionette, Backbone, _) {
  'use strict';

  return Marionette.Region.extend({

    onBeforeShow: function(view) {
      this.listenTo(view, 'all', function() {
        this.trigger.apply(this, arguments);
      });
    },

    onClose: function(view) {
      this.stopListening(view, 'all');
    }

  });


})(Marionette, Backbone, _);