import { Store } from './store';

function commit(mutationName, ...params) {
  this.mutations[mutationName](this.state, ...params)
}

function dispatch(actionName, ...params) {
  this.actions[actionName](...params);
}

export {
  Store, commit, dispatch
}
