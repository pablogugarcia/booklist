import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);

const rootReducerInitialState = {
    rootA: 1,
    rootB: 1
}
const rootReducer = (state = rootReducerInitialState, action) => {
    switch (action.type){
        case 'INC_A': return {...state, rootA: state.rootA + 1};
        case 'DEC_A': return {...state, rootA: state.rootA - 1};
        case 'INC_B': return {...state, rootB: state.rootB + 1};
        case 'DEC_B': return {...state, rootB: state.rootB - 1};
    }
    return state;
}

const store = createStoreWithMiddleware(combineReducers({app: rootReducer}));

const asyncReducers = {};
const getNewReducer = newModuleInfo => {
    asyncReducers[newModuleInfo.name] = newModuleInfo.reducer;
    
    store.replaceReducer(combineReducers({
        app: rootReducer,
        ...asyncReducers
    }));
}

debugger;
console.log(store.getState());
store.dispatch({type: 'INC_A'})
console.log(store.getState());
store.dispatch({type: 'INC_B'})
console.log(store.getState());
store.dispatch({type: 'INC_B'})
console.log(store.getState());
store.dispatch({type: 'DEC_B'})
console.log(store.getState());
store.dispatch({type: 'DEC_A'})
console.log(store.getState());
debugger;

// let's pretend this reducer was just dynamically loaded
//-------------------------------------------------------
const codeSplitA = {
    aValue: ''
}
const splitReducerA = (state = codeSplitA, action) => {
    switch (action.type){
        case 'set_A': return {...state, aValue: action.value};
    }
    return state;
}
//-------------------------------------------------------

getNewReducer({name: 'aModule', reducer: splitReducerA});


debugger;
console.log(store.getState());
store.dispatch({type: 'set_A', value: 'Hello'})
console.log(store.getState());
debugger;
store.dispatch({type: 'set_A', value: 'World'})
console.log(store.getState());
debugger;




// and then this reducer
//-------------------------------------------------------
const codeSplitB = {
    BValue: ''
}
const splitReducerB = (state = codeSplitB, action) => {
    switch (action.type){
        case 'set_B': return {...state, bValue: action.value};
    }
    return state;
}
//-------------------------------------------------------

getNewReducer({name: 'bModule', reducer: splitReducerB});



debugger;
console.log(store.getState());
store.dispatch({type: 'set_B', value: 'Foo'})
console.log(store.getState());
debugger;
store.dispatch({type: 'set_B', value: 'Bar'})
console.log(store.getState());
debugger;







export default {};



/*import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';

let asyncReducers = { };
export function getNewReducer(moduleInfo?, initialState = {}) : any {
    if (!moduleInfo) return combineLazyReducers({ app: rootReducer }, initialState);

    if (asyncReducers[`${moduleInfo.name}Module`]) return; //registering an async reducer we already have - do nothing and get out

    asyncReducers[`${moduleInfo.name}Module`] = moduleInfo.reducer;

    store.replaceReducer(combineLazyReducers({
        app: rootReducer,
        ...asyncReducers
    }, store.getState()));

    if (moduleInfo.initialize){
        store.dispatch(moduleInfo.initialize({priorState: moduleInfo.priorState}));
    }
}

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);


function combineLazyReducers(reducers, existingState){
    existingState = existingState || {};
    let handler = {
        ownKeys(target){
            return Array.from(new Set([...Reflect.ownKeys(target), ...Reflect.ownKeys(existingState)]));
        },
        get(target, key){
            return target[key] || (state => state === void 0 ? null : state); // <--- stub for Redux if not present
        },
        getOwnPropertyDescriptor(target, key){
            return Reflect.getOwnPropertyDescriptor(target, key) || Reflect.getOwnPropertyDescriptor(existingState, key);
        }
    };    
    return combineReducers(new Proxy(reducers, handler));
}


export const store = createStoreWithMiddleware(getNewReducer(null, initialState), initialState);*/