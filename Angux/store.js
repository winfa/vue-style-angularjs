export function Store(options) {

  return function(...injectors) {
    const inject = 'hello';

    if (options.injectors?.length) {
      options.injectors.forEach((injectorName, index) => {
        this[injectorName] = injectors[index];
      });
    }

    const { state, getters, mutations, actions } = options;

    const outPutGetters = {};
    Object.keys(getters).forEach(getterKey => {
      const getterFun = getters[getterKey];

      outPutGetters[getterKey] = function(...params) {
        return getterFun({
          state,
         })(...params);
      }
    });

    return {
      state,
      getters: outPutGetters,
      mutations,
      actions,
    };
  }
}
