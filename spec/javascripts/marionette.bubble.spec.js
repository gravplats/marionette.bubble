describe('Marionette.BubbleRegion', function() {
  'use strict';

  var BubbleRegion, ItemView, CollectionView, CompositeView;

  beforeEach(function () {
    loadFixtures('itemview-template.html', 'compositeview-template.html');

    BubbleRegion = Marionette.BubbleRegion.extend({
      constructor: function() {
        this.triggeredEvents = [];
        Marionette.BubbleRegion.prototype.constructor.apply(this, arguments);
      },

      bubble: function(eventName) {
        var result = Marionette.BubbleRegion.prototype.bubble.apply(this, arguments);
        this.triggeredEvents.push({ event: eventName, bubble: result });
      },

      bubbles: function() {
        return _(this.triggeredEvents).where({ bubble: true });
      },

      traceTriggeredEvents: function() {
        for(var index = 0, len = this.triggeredEvents.length; index < len; index++) {
          if (this.triggeredEvents[index].bubble)
            console.log(this.triggeredEvents[index].event, this.triggeredEvents[index].bubble);
        }
      }
    });

    ItemView = Marionette.ItemView.extend({
      template: '#itemview-template',

      raise: function() {
        this.trigger('custom:itemview:event');
      }
    });

    CollectionView = Marionette.CollectionView.extend({
      itemView: ItemView
    });

    CompositeView = Marionette.CompositeView.extend({
      template: '#compositeview-template',

      itemView: ItemView,

      itemViewContainer: '#collection'
    })
  });

  describe('when view is triggering an event', function() {
    var region, bubbled;

    beforeEach(function() {
      region = new BubbleRegion({ el: '#region' });
      var view = new ItemView();

      region.on('custom:itemview:event', function() {
        bubbled = true;
      });

      region.show(view);
      view.raise();
    });

    it('should be bubbled by region', function() {
      expect(bubbled).toBeTruthy();
    });
  });

  describe('when showing/rendering item view', function() {
    var region;

    beforeEach(function() {
      region = new BubbleRegion({ el: '#region' });

      var view = new ItemView();

      region.show(view);
      view.render();
    });

    it('should ignore default events', function() {
      expect(region.bubbles().length).toBe(0);
    });
  });

  describe('when showing/rendering collection view', function() {
    var region;

    beforeEach(function() {
      region = new BubbleRegion({ el: '#region' });

      var collection = new Backbone.Collection([ true ]);
      var view = new CollectionView({ collection: collection });

      region.show(view);
      view.render();
    });

    it('should ignore default events', function() {
      expect(region.bubbles().length).toBe(0);
    });
  });

  describe('when showing/rendering composite view', function() {
    var region;

    beforeEach(function() {
      region = new BubbleRegion({ el: '#region' });

      var collection = new Backbone.Collection([ true ]);
      var view = new CompositeView({ collection: collection });

      region.show(view);
      view.render();
    });

    it('should ignore default events', function() {
      expect(region.bubbles().length).toBe(0);
    });
  });

  describe('when region has closed view', function() {
    var region, view, bubbled;

    beforeEach(function() {
      region = new BubbleRegion({ el: '#region' });
      view = new ItemView();

      region.on('custom:itemview:event', function() {
        bubbled = true;
      });

      region.show(view);
      region.close();

      view.raise();
    });

    it('should no longer bubble events from view', function() {
      expect(bubbled).toBeFalsy();
    });
  });

});

describe('Marionette.BubbleLayout', function() {

  var Layout, ItemView;

  beforeEach(function () {
    loadFixtures('itemview-template.html', 'layout-template.html');

    Layout = Marionette.BubbleLayout.extend({
      template: '#layout-template',
      regions: {
        'content': '#region'
      }
    });

    ItemView = Marionette.ItemView.extend({
      template: '#itemview-template',

      raise: function() {
        this.trigger('custom:itemview:event');
      }
    });
  });

  describe('when adding a region to layout', function() {
    var layout;

    beforeEach(function() {
      layout = new Layout({ el: '#layout' });
    });

    it('should be a Marionette.BubbleRegion', function() {
      expect(layout.content instanceof Marionette.BubbleRegion).toBeTruthy();
    });
  });

  describe('when view is triggering an event', function() {
    var layout, bubbled;

    beforeEach(function() {
      layout = new Layout({ el: '#layout' });
      layout.on('custom:itemview:event', function() {
        bubbled = true;
      });

      var view = new ItemView();
      layout.content.show(view);

      view.raise();
    });

    it('should be bubbled by layout', function() {
      expect(bubbled).toBeTruthy();
    });
  });

});