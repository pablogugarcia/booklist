import rootReducer from './rootReducer';
import thunkMiddleware from 'redux-thunk';
import { applyMiddleware, createStore, combineReducers } from 'redux';
import throttle from 'lodash.throttle';

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



let initialState = void 0;
if (localStorage){
    try {
        initialState = JSON.parse(localStorage.getItem('reduxState'));
        console.log('initial state', initialState)
    }catch (err){
        console.log('Error parsing state', err);
    }
}

export const store = createStoreWithMiddleware(getNewReducer(null, initialState), initialState);

if (localStorage){
    function saveState(){
        try {
            localStorage.setItem('reduxState', JSON.stringify(store.getState()));
        } catch(err){
            console.log('Error parsing and saving state', err);
        }
    }
    store.subscribe(throttle(saveState, 1000));
}