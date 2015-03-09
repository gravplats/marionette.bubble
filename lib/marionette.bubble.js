// Marionette.Bubble
// --------------------
// v0.1.0
// 
// Copyright (c) 2015 Mattias Rydengren <mattias.rydengren@coderesque.com>
// Distributed under MIT license

Marionette.BubbleRegion = (function(Marionette, Backbone, _) {
  'use strict';

  return Marionette.Region.extend({

    ignoredEventNames: [
      'before:close',
      'before:render',
      'before:show',
      'close',
      'render',
      'show',

      'collection:before:render',
      'collection:rendered',

      'composite:collection:before:render',
      'composite:collection:rendered',
      'composite:model:rendered',
      'composite:rendered',

      'before:item:added',
      'after:item:added',

      'item:before:render',
      'item:rendered',
      'item:removed'
    ],

    itemViewEventPrefix: 'itemview',

    onBeforeShow: function(view) {
      this.listenTo(view, 'all', this.bubble);
    },

    bubble: function(eventName) {
      var pattern = new RegExp(this.itemViewEventPrefix + ':', 'g');
      eventName = eventName.replace(pattern, '');

      if (_(this.ignoredEventNames).contains(eventName)) {
        return false;
      }

      this.trigger.apply(this, arguments);
      return true;
    },

    onClose: function(view) {
      this.stopListening(view, 'all');
    }

  });

})(Marionette, Backbone, _);

Marionette.BubbleLayout = (function(Marionette, Backbone, _) {
  'use strict';

  return Marionette.Layout.extend({

    ignoredEventNames: [
      'before:show',
      'show '
    ],

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
        return false;
      }

      this.trigger.apply(this, arguments);
      return true;
    }

  });

})(Marionette, Backbone, _);