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