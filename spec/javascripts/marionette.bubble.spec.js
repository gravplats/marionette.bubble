describe('Marionette.BubbleRegion', function() {
  'use strict';

  var ItemView;

  beforeEach(function () {
    loadFixtures('itemview-template.html');

    ItemView = Marionette.ItemView.extend({
      template: '#itemview-template',

      raise: function() {
        this.trigger('custom:itemview:event');
      }
    });
  });

  describe('when view is triggering an event', function() {
    var region, view, bubbled;

    beforeEach(function() {
      region = new Marionette.BubbleRegion({ el: '#region' });
      view = new ItemView();

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

  describe('when region has closed view', function() {
    var region, view, bubbled;

    beforeEach(function() {
      region = new Marionette.BubbleRegion({ el: '#region' });
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
    loadFixtures('itemview-template.html');

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