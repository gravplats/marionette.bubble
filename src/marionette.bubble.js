Marionette.BubbleRegion = (function(Marionette, Backbone, _) {
  'use strict';

  return Marionette.Region.extend({

    ignoredEventNames: [ 'before:close', 'before:show', 'close', 'render', 'show '],

    onBeforeShow: function(view) {
      this.listenTo(view, 'all', this.bubble);
    },

    bubble: function(eventName) {
      if (_(this.ignoredEventNames).contains(eventName)) {
        return;
      }

      this.trigger.apply(this, arguments);
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

    regionType: Marionette.BubbleRegion,

    constructor: function() {
      this.listenTo(this, 'region:add', function(name, region) {
        this.listenTo(region, 'all', this.bubble);
      });

      this.listenTo(this, 'region:remove', function(name, region) {
        this.stopListening(region, 'all');
      });

      Marionette.Layout.prototype.constructor.apply(this, arguments);
    },

    bubble: function(eventName) {
      if (_(this.ignoredEventNames).contains(eventName)) {
        return;
      }

      this.trigger.apply(this, arguments);
    }

  });

})(Marionette, Backbone, _);