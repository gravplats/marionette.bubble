describe('bubble', function() {
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
    })
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