# vue-style-angularjs

## What is it?
If you are working on AngularJS project, and there is no resource to convert the project to new framework like Angular or VueJS.
There is a lot of thing you can do.
You can improve the quality by several steps as in this style guild: https://github.com/toddmotto/angularjs-styleguide
- Use Component instead of Directive.
- New file structure.

Actually, you can even write your AngularJS code with a more VueJS style. With the class of Component and Store.

## How to use it?
It's pretty like ust like the Vue.js. Actually, the style is mostly following the vue.js api document. 
- **Component**: the component class you can call to generate AngularJS coponent object.
- **Options**: passed in to generate the component object.
- **mixins**, **data**, **created**, **computed**, **methods**, **data**, **data**, **data**: it is the same as vue.js document.
- **props**: the same as **bindings** in angularJS, just changed the name to be **props**, to be more like **Vue.js**. You can also use `['propName1', 'propName2']`, if you do not specify the type, it will be `string(@)` as default.
- **injectors**: you can just pass the angularJS injections as string name here. And call `this.[injectorName]` in any place you needed in **Component**.
## Example:
```javascript
import { Component } from 'vue-style-angularjs';
import { widgetMixin } from '../../mixins/widget.mixin';

export const ArrayWidgetItemsComponent = new Component({
  mixins: [widgetMixin],

  injectors: ['$timeout', '$state'],

  props: [],

  data: {
    queryPath: '',
  },

  created: function() {
    this.queryPath = this.$state.params.path;
    this.selectedIndex = this.widgetStore.actions.getItemIndex(this.queryPath, this.mappingPath);
  },

  computed: {
    itemOverview: function() {
      return this?.mapping?.fragments?.itemOverview;
    }
  },

  methods: {
    getItemPath: function(index) {
      return this.mappingPath.replace(/(\{\d*\})?$/, `{${index}}`)
    },

    removeItem: function($event, itemIndex) {
      $event.stopPropagation();
      $event.preventDefault();
      this.source = this.source.filter((item, index) => index !== itemIndex);
      this.$timeout(() => {});
    },

    addNewItem: function() {
      const emptyItem = {};
      this.source.push(emptyItem);

      this.$state.go(this.$state.current.name, { path: this.getItemPath(this.source.length - 1) });
    },

    editItem: function(index) {
      this.$state.go(this.$state.current.name, { path: this.getItemPath(index) });
    }
  },

  template,
});
```
