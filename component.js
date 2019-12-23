import _ from 'lodash';

export function Component(options) {
  try {
    options.createdList = options.created ? [options.created] : [];

    if (options.mixins ?.length) {
      options.mixins.forEach(mixin => {
        options.injectors = [...(mixin.injectors || []), ...(options.injectors || [])];

        options.props = Object.assign({}, convertPropsToObject(mixin.props), convertPropsToObject(options.props));
        options.data = Object.assign({}, mixin.data, options.data);
        options.computed = Object.assign({}, mixin.computed, options.computed);
        options.methods = Object.assign({}, mixin.methods, options.methods);

        if (mixin.created) {
          options.createdList.push(mixin.created);
        }
      });
    }

    const Controller = function (...injectors) {
      if (options.injectors ?.length) {
        options.injectors.forEach((injectorName, index) => {
          this[injectorName] = injectors[index];
        });
      }

      if (options.data) {
        Object.keys(options.data).forEach(dataName => {
          if (this[dataName]) {
            throw new Error(`${dataName} is an injector name, plese do not use.`);
          }
          this[dataName] = options.data[dataName];
        });
      }

      if (options.computed) {
        Object.keys(options.computed).forEach(propertyName => {
          if (this[propertyName]) {
            throw new Error(`computed name: ${propertyName} is has already been defined.`);
          }
          Object.defineProperty(this, propertyName, {
            get: options.computed[propertyName]
          });
        });
      }

      if (options.methods) {
        Object.keys(options.methods).forEach(methodName => {
          if (this[methodName]) {
            throw new Error(`method name: ${methodName} is has already been defined.`);
          }
          this[methodName] = options.methods[methodName];
        });
      }

      this.$onInit = function () {
        options.createdList.forEach(created => {
          created.call(this);
        });
      };
    };

    Controller.$inject = options.injectors;

    let bindings = {};

    if (options.props) {
      bindings = Object.assign({}, convertPropsToObject(options.props));
    }

    const template = options.template;
    const transclude = !!options.transclude;

    return {
      controllerAs: 'vm',
      bindToController: true,
      transclude,
      bindings,
      controller: Controller,
      template,
    }
  } catch (ex) {
    console.log(ex);
  }
}

function convertPropsToObject(props) {
  if (Array.isArray(props)) {
    const obj = {};
    props.forEach(prop => {
      obj[prop] = '@';
    });

    return obj;
  }

  return props;
}
