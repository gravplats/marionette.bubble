Marionette.BubbleRegion = (function(Marionette, Backbone, _) {
  'use strict';

  return Marionette.Region.extend({

    ignoredEventNames: [ 'before:close', 'before:show', 'close', 'render', 'show '],

    onBeforeShow: function(view) {
      this.listenTo(view, 'all', function(eventName) {
        if (_(this.ignoredEventNames).contains(eventName)) {
          return;
        }

        this.trigger.apply(this, arguments);
      });
    },

    onClose: function(view) {
      this.stopListening(view, 'all');
    }

  });

})(Marionette, Backbone, _);

Marionette.BubbleLayout = (function(Marionette, Backbone, _) {
  'use strict';

  return Marionette.Layout.extend({

    ignoredEventNames: [ 'before:show', 'show '],

    constructor: function() {
      this.listenTo(this, 'region:add', function(name, region) {
        this.listenTo(region, 'all', function(eventName) {
          if (_(this.ignoredEventNames).contains(eventName)) {
            return;
          }

          this.trigger.apply(this, arguments);
        });
      });

      this.listenTo(this, 'region:remove', function(name, region) {
        this.stopListening(region, 'all');
      });

      Marionette.Layout.prototype.constructor.apply(this, arguments);
    },

    regionType: Marionette.BubbleRegion

  });

})(Marionette, Backbone, _);