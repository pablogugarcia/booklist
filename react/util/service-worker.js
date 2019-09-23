// @ts-ignore
try {
  self['workbox:core:5.0.0-beta.0'] && _();
} catch (e) {}

/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const logger =  (() => {
  let inGroup = false;
  const methodToColorMap = {
    debug: `#7f8c8d`,
    log: `#2ecc71`,
    warn: `#f39c12`,
    error: `#c0392b`,
    groupCollapsed: `#3498db`,
    groupEnd: null
  };

  const print = function (method, args) {
    if (method === 'groupCollapsed') {
      // Safari doesn't print all console.groupCollapsed() arguments:
      // https://bugs.webkit.org/show_bug.cgi?id=182754
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        console[method](...args);
        return;
      }
    }

    const styles = [`background: ${methodToColorMap[method]}`, `border-radius: 0.5em`, `color: white`, `font-weight: bold`, `padding: 2px 0.5em`]; // When in a group, the workbox prefix is not displayed.

    const logPrefix = inGroup ? [] : ['%cworkbox', styles.join(';')];
    console[method](...logPrefix, ...args);

    if (method === 'groupCollapsed') {
      inGroup = true;
    }

    if (method === 'groupEnd') {
      inGroup = false;
    }
  };

  const api = {};
  const loggerMethods = Object.keys(methodToColorMap);

  for (const key of loggerMethods) {
    const method = key;

    api[method] = (...args) => {
      print(method, args);
    };
  }

  return api;
})();

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const messages = {
  'invalid-value': ({
    paramName,
    validValueDescription,
    value
  }) => {
    if (!paramName || !validValueDescription) {
      throw new Error(`Unexpected input to 'invalid-value' error.`);
    }

    return `The '${paramName}' parameter was given a value with an ` + `unexpected value. ${validValueDescription} Received a value of ` + `${JSON.stringify(value)}.`;
  },
  'not-in-sw': ({
    moduleName
  }) => {
    if (!moduleName) {
      throw new Error(`Unexpected input to 'not-in-sw' error.`);
    }

    return `The '${moduleName}' must be used in a service worker.`;
  },
  'not-an-array': ({
    moduleName,
    className,
    funcName,
    paramName
  }) => {
    if (!moduleName || !className || !funcName || !paramName) {
      throw new Error(`Unexpected input to 'not-an-array' error.`);
    }

    return `The parameter '${paramName}' passed into ` + `'${moduleName}.${className}.${funcName}()' must be an array.`;
  },
  'incorrect-type': ({
    expectedType,
    paramName,
    moduleName,
    className,
    funcName
  }) => {
    if (!expectedType || !paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-type' error.`);
    }

    return `The parameter '${paramName}' passed into ` + `'${moduleName}.${className ? className + '.' : ''}` + `${funcName}()' must be of type ${expectedType}.`;
  },
  'incorrect-class': ({
    expectedClass,
    paramName,
    moduleName,
    className,
    funcName,
    isReturnValueProblem
  }) => {
    if (!expectedClass || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'incorrect-class' error.`);
    }

    if (isReturnValueProblem) {
      return `The return value from ` + `'${moduleName}.${className ? className + '.' : ''}${funcName}()' ` + `must be an instance of class ${expectedClass.name}.`;
    }

    return `The parameter '${paramName}' passed into ` + `'${moduleName}.${className ? className + '.' : ''}${funcName}()' ` + `must be an instance of class ${expectedClass.name}.`;
  },
  'missing-a-method': ({
    expectedMethod,
    paramName,
    moduleName,
    className,
    funcName
  }) => {
    if (!expectedMethod || !paramName || !moduleName || !className || !funcName) {
      throw new Error(`Unexpected input to 'missing-a-method' error.`);
    }

    return `${moduleName}.${className}.${funcName}() expected the ` + `'${paramName}' parameter to expose a '${expectedMethod}' method.`;
  },
  'add-to-cache-list-unexpected-type': ({
    entry
  }) => {
    return `An unexpected entry was passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' The entry ` + `'${JSON.stringify(entry)}' isn't supported. You must supply an array of ` + `strings with one or more characters, objects with a url property or ` + `Request objects.`;
  },
  'add-to-cache-list-conflicting-entries': ({
    firstEntry,
    secondEntry
  }) => {
    if (!firstEntry || !secondEntry) {
      throw new Error(`Unexpected input to ` + `'add-to-cache-list-duplicate-entries' error.`);
    }

    return `Two of the entries passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' had the URL ` + `${firstEntry._entryId} but different revision details. Workbox is ` + `is unable to cache and version the asset correctly. Please remove one ` + `of the entries.`;
  },
  'plugin-error-request-will-fetch': ({
    thrownError
  }) => {
    if (!thrownError) {
      throw new Error(`Unexpected input to ` + `'plugin-error-request-will-fetch', error.`);
    }

    return `An error was thrown by a plugins 'requestWillFetch()' method. ` + `The thrown error message was: '${thrownError.message}'.`;
  },
  'invalid-cache-name': ({
    cacheNameId,
    value
  }) => {
    if (!cacheNameId) {
      throw new Error(`Expected a 'cacheNameId' for error 'invalid-cache-name'`);
    }

    return `You must provide a name containing at least one character for ` + `setCacheDetails({${cacheNameId}: '...'}). Received a value of ` + `'${JSON.stringify(value)}'`;
  },
  'unregister-route-but-not-found-with-method': ({
    method
  }) => {
    if (!method) {
      throw new Error(`Unexpected input to ` + `'unregister-route-but-not-found-with-method' error.`);
    }

    return `The route you're trying to unregister was not  previously ` + `registered for the method type '${method}'.`;
  },
  'unregister-route-route-not-registered': () => {
    return `The route you're trying to unregister was not previously ` + `registered.`;
  },
  'queue-replay-failed': ({
    name
  }) => {
    return `Replaying the background sync queue '${name}' failed.`;
  },
  'duplicate-queue-name': ({
    name
  }) => {
    return `The Queue name '${name}' is already being used. ` + `All instances of backgroundSync.Queue must be given unique names.`;
  },
  'expired-test-without-max-age': ({
    methodName,
    paramName
  }) => {
    return `The '${methodName}()' method can only be used when the ` + `'${paramName}' is used in the constructor.`;
  },
  'unsupported-route-type': ({
    moduleName,
    className,
    funcName,
    paramName
  }) => {
    return `The supplied '${paramName}' parameter was an unsupported type. ` + `Please check the docs for ${moduleName}.${className}.${funcName} for ` + `valid input types.`;
  },
  'not-array-of-class': ({
    value,
    expectedClass,
    moduleName,
    className,
    funcName,
    paramName
  }) => {
    return `The supplied '${paramName}' parameter must be an array of ` + `'${expectedClass}' objects. Received '${JSON.stringify(value)},'. ` + `Please check the call to ${moduleName}.${className}.${funcName}() ` + `to fix the issue.`;
  },
  'max-entries-or-age-required': ({
    moduleName,
    className,
    funcName
  }) => {
    return `You must define either config.maxEntries or config.maxAgeSeconds` + `in ${moduleName}.${className}.${funcName}`;
  },
  'statuses-or-headers-required': ({
    moduleName,
    className,
    funcName
  }) => {
    return `You must define either config.statuses or config.headers` + `in ${moduleName}.${className}.${funcName}`;
  },
  'invalid-string': ({
    moduleName,
    funcName,
    paramName
  }) => {
    if (!paramName || !moduleName || !funcName) {
      throw new Error(`Unexpected input to 'invalid-string' error.`);
    }

    return `When using strings, the '${paramName}' parameter must start with ` + `'http' (for cross-origin matches) or '/' (for same-origin matches). ` + `Please see the docs for ${moduleName}.${funcName}() for ` + `more info.`;
  },
  'channel-name-required': () => {
    return `You must provide a channelName to construct a ` + `BroadcastCacheUpdate instance.`;
  },
  'invalid-responses-are-same-args': () => {
    return `The arguments passed into responsesAreSame() appear to be ` + `invalid. Please ensure valid Responses are used.`;
  },
  'expire-custom-caches-only': () => {
    return `You must provide a 'cacheName' property when using the ` + `expiration plugin with a runtime caching strategy.`;
  },
  'unit-must-be-bytes': ({
    normalizedRangeHeader
  }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'unit-must-be-bytes' error.`);
    }

    return `The 'unit' portion of the Range header must be set to 'bytes'. ` + `The Range header provided was "${normalizedRangeHeader}"`;
  },
  'single-range-only': ({
    normalizedRangeHeader
  }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'single-range-only' error.`);
    }

    return `Multiple ranges are not supported. Please use a  single start ` + `value, and optional end value. The Range header provided was ` + `"${normalizedRangeHeader}"`;
  },
  'invalid-range-values': ({
    normalizedRangeHeader
  }) => {
    if (!normalizedRangeHeader) {
      throw new Error(`Unexpected input to 'invalid-range-values' error.`);
    }

    return `The Range header is missing both start and end values. At least ` + `one of those values is needed. The Range header provided was ` + `"${normalizedRangeHeader}"`;
  },
  'no-range-header': () => {
    return `No Range header was found in the Request provided.`;
  },
  'range-not-satisfiable': ({
    size,
    start,
    end
  }) => {
    return `The start (${start}) and end (${end}) values in the Range are ` + `not satisfiable by the cached response, which is ${size} bytes.`;
  },
  'attempt-to-cache-non-get-request': ({
    url,
    method
  }) => {
    return `Unable to cache '${url}' because it is a '${method}' request and ` + `only 'GET' requests can be cached.`;
  },
  'cache-put-with-no-response': ({
    url
  }) => {
    return `There was an attempt to cache '${url}' but the response was not ` + `defined.`;
  },
  'no-response': ({
    url,
    error
  }) => {
    let message = `The strategy could not generate a response for '${url}'.`;

    if (error) {
      message += ` The underlying error is ${error}.`;
    }

    return message;
  },
  'bad-precaching-response': ({
    url,
    status
  }) => {
    return `The precaching request for '${url}' failed with an HTTP ` + `status of ${status}.`;
  },
  'non-precached-url': ({
    url
  }) => {
    return `createHandlerForURL('${url}') was called, but that URL is not ` + `precached. Please pass in a URL that is precached instead.`;
  },
  'add-to-cache-list-conflicting-integrities': ({
    url
  }) => {
    return `Two of the entries passed to ` + `'workbox-precaching.PrecacheController.addToCacheList()' had the URL ` + `${url} with different integrity values. Please remove one of them.`;
  }
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

const generatorFunction = (code, details = {}) => {
  const message = messages[code];

  if (!message) {
    throw new Error(`Unable to find message for code '${code}'.`);
  }

  return message(details);
};

const messageGenerator =  generatorFunction;

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Workbox errors should be thrown with this class.
 * This allows use to ensure the type easily in tests,
 * helps developers identify errors from workbox
 * easily and allows use to optimise error
 * messages correctly.
 *
 * @private
 */

class WorkboxError extends Error {
  /**
   *
   * @param {string} errorCode The error code that
   * identifies this particular error.
   * @param {Object=} details Any relevant arguments
   * that will help developers identify issues should
   * be added as a key on the context object.
   */
  constructor(errorCode, details) {
    let message = messageGenerator(errorCode, details);
    super(message);
    this.name = errorCode;
    this.details = details;
  }

}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/*
 * This method returns true if the current context is a service worker.
 */

const isSWEnv = moduleName => {
  if (!('ServiceWorkerGlobalScope' in self)) {
    throw new WorkboxError('not-in-sw', {
      moduleName
    });
  }
};
/*
 * This method throws if the supplied value is not an array.
 * The destructed values are required to produce a meaningful error for users.
 * The destructed and restructured object is so it's clear what is
 * needed.
 */


const isArray = (value, details) => {
  if (!Array.isArray(value)) {
    throw new WorkboxError('not-an-array', details);
  }
};

const hasMethod = (object, expectedMethod, details) => {
  const type = typeof object[expectedMethod];

  if (type !== 'function') {
    details.expectedMethod = expectedMethod;
    throw new WorkboxError('missing-a-method', details);
  }
};

const isType = (object, expectedType, details) => {
  if (typeof object !== expectedType) {
    details.expectedType = expectedType;
    throw new WorkboxError('incorrect-type', details);
  }
};

const isInstance = (object, expectedClass, details) => {
  if (!(object instanceof expectedClass)) {
    details.expectedClass = expectedClass;
    throw new WorkboxError('incorrect-class', details);
  }
};

const isOneOf = (value, validValues, details) => {
  if (!validValues.includes(value)) {
    details.validValueDescription = `Valid values are ${JSON.stringify(validValues)}.`;
    throw new WorkboxError('invalid-value', details);
  }
};

const isArrayOfClass = (value, expectedClass, details) => {
  const error = new WorkboxError('not-array-of-class', details);

  if (!Array.isArray(value)) {
    throw error;
  }

  for (let item of value) {
    if (!(item instanceof expectedClass)) {
      throw error;
    }
  }
};

const finalAssertExports =  {
  hasMethod,
  isArray,
  isInstance,
  isOneOf,
  isSWEnv,
  isType,
  isArrayOfClass
};

// @ts-ignore
try {
  self['workbox:routing:5.0.0-beta.0'] && _();
} catch (e) {}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * The default HTTP method, 'GET', used when there's no specific method
 * configured for a route.
 *
 * @type {string}
 *
 * @private
 */

const defaultMethod = 'GET';
/**
 * The list of valid HTTP methods associated with requests that could be routed.
 *
 * @type {Array<string>}
 *
 * @private
 */

const validMethods = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT'];

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * @param {function()|Object} handler Either a function, or an object with a
 * 'handle' method.
 * @return {Object} An object with a handle method.
 *
 * @private
 */

const normalizeHandler = handler => {
  if (handler && typeof handler === 'object') {
    {
      finalAssertExports.hasMethod(handler, 'handle', {
        moduleName: 'workbox-routing',
        className: 'Route',
        funcName: 'constructor',
        paramName: 'handler'
      });
    }

    return handler;
  } else {
    {
      finalAssertExports.isType(handler, 'function', {
        moduleName: 'workbox-routing',
        className: 'Route',
        funcName: 'constructor',
        paramName: 'handler'
      });
    }

    return {
      handle: handler
    };
  }
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * A `Route` consists of a pair of callback functions, "match" and "handler".
 * The "match" callback determine if a route should be used to "handle" a
 * request by returning a non-falsy value if it can. The "handler" callback
 * is called when there is a match and should return a Promise that resolves
 * to a `Response`.
 *
 * @memberof workbox.routing
 */

class Route {
  /**
   * Constructor for Route class.
   *
   * @param {workbox.routing.Route~matchCallback} match
   * A callback function that determines whether the route matches a given
   * `fetch` event by returning a non-falsy value.
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resolving to a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(match, handler, method = defaultMethod) {
    {
      finalAssertExports.isType(match, 'function', {
        moduleName: 'workbox-routing',
        className: 'Route',
        funcName: 'constructor',
        paramName: 'match'
      });

      if (method) {
        finalAssertExports.isOneOf(method, validMethods, {
          paramName: 'method'
        });
      }
    } // These values are referenced directly by Router so cannot be
    // altered by minifification.


    this.handler = normalizeHandler(handler);
    this.match = match;
    this.method = method;
  }

}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * RegExpRoute makes it easy to create a regular expression based
 * [Route]{@link workbox.routing.Route}.
 *
 * For same-origin requests the RegExp only needs to match part of the URL. For
 * requests against third-party servers, you must define a RegExp that matches
 * the start of the URL.
 *
 * [See the module docs for info.]{@link https://developers.google.com/web/tools/workbox/modules/workbox-routing}
 *
 * @memberof workbox.routing
 * @extends workbox.routing.Route
 */

class RegExpRoute extends Route {
  /**
   * If the regulard expression contains
   * [capture groups]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp#grouping-back-references},
   * th ecaptured values will be passed to the
   * [handler's]{@link workbox.routing.Route~handlerCallback} `params`
   * argument.
   *
   * @param {RegExp} regExp The regular expression to match against URLs.
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {string} [method='GET'] The HTTP method to match the Route
   * against.
   */
  constructor(regExp, handler, method) {
    {
      finalAssertExports.isInstance(regExp, RegExp, {
        moduleName: 'workbox-routing',
        className: 'RegExpRoute',
        funcName: 'constructor',
        paramName: 'pattern'
      });
    }

    const match = ({
      url
    }) => {
      const result = regExp.exec(url.href); // Return immediately if there's no match.

      if (!result) {
        return;
      } // Require that the match start at the first character in the URL string
      // if it's a cross-origin request.
      // See https://github.com/GoogleChrome/workbox/issues/281 for the context
      // behind this behavior.


      if (url.origin !== location.origin && result.index !== 0) {
        {
          logger.debug(`The regular expression '${regExp}' only partially matched ` + `against the cross-origin URL '${url}'. RegExpRoute's will only ` + `handle cross-origin requests if they match the entire URL.`);
        }

        return;
      } // If the route matches, but there aren't any capture groups defined, then
      // this will return [], which is truthy and therefore sufficient to
      // indicate a match.
      // If there are capture groups, then it will return their values.


      return result.slice(1);
    };

    super(match, handler, method);
  }

}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

const getFriendlyURL = url => {
  const urlObj = new URL(String(url), location.href);

  if (urlObj.origin === location.origin) {
    return urlObj.pathname;
  }

  return urlObj.href;
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * The Router can be used to process a FetchEvent through one or more
 * [Routes]{@link workbox.routing.Route} responding  with a Request if
 * a matching route exists.
 *
 * If no route matches a given a request, the Router will use a "default"
 * handler if one is defined.
 *
 * Should the matching Route throw an error, the Router will use a "catch"
 * handler if one is defined to gracefully deal with issues and respond with a
 * Request.
 *
 * If a request matches multiple routes, the **earliest** registered route will
 * be used to respond to the request.
 *
 * @memberof workbox.routing
 */

class Router {
  /**
   * Initializes a new Router.
   */
  constructor() {
    this._routes = new Map();
  }
  /**
   * @return {Map<string, Array<workbox.routing.Route>>} routes A `Map` of HTTP
   * method name ('GET', etc.) to an array of all the corresponding `Route`
   * instances that are registered.
   */


  get routes() {
    return this._routes;
  }
  /**
   * Adds a fetch event listener to respond to events when a route matches
   * the event's request.
   */


  addFetchListener() {
    self.addEventListener('fetch', event => {
      const {
        request
      } = event;
      const responsePromise = this.handleRequest({
        request,
        event
      });

      if (responsePromise) {
        event.respondWith(responsePromise);
      }
    });
  }
  /**
   * Adds a message event listener for URLs to cache from the window.
   * This is useful to cache resources loaded on the page prior to when the
   * service worker started controlling it.
   *
   * The format of the message data sent from the window should be as follows.
   * Where the `urlsToCache` array may consist of URL strings or an array of
   * URL string + `requestInit` object (the same as you'd pass to `fetch()`).
   *
   * ```
   * {
   *   type: 'CACHE_URLS',
   *   payload: {
   *     urlsToCache: [
   *       './script1.js',
   *       './script2.js',
   *       ['./script3.js', {mode: 'no-cors'}],
   *     ],
   *   },
   * }
   * ```
   */


  addCacheListener() {
    self.addEventListener('message', async event => {
      if (event.data && event.data.type === 'CACHE_URLS') {
        const {
          payload
        } = event.data;

        {
          logger.debug(`Caching URLs from the window`, payload.urlsToCache);
        }

        const requestPromises = Promise.all(payload.urlsToCache.map(entry => {
          if (typeof entry === 'string') {
            entry = [entry];
          }

          const request = new Request(...entry);
          return this.handleRequest({
            request
          }); // TODO(philipwalton): TypeScript errors without this typecast for
          // some reason (probably a bug). The real type here should work but
          // doesn't: `Array<Promise<Response> | undefined>`.
        })); // TypeScript

        event.waitUntil(requestPromises); // If a MessageChannel was used, reply to the message on success.

        if (event.ports && event.ports[0]) {
          await requestPromises;
          event.ports[0].postMessage(true);
        }
      }
    });
  }
  /**
   * Apply the routing rules to a FetchEvent object to get a Response from an
   * appropriate Route's handler.
   *
   * @param {Object} options
   * @param {Request} options.request The request to handle (this is usually
   *     from a fetch event, but it does not have to be).
   * @param {FetchEvent} [options.event] The event that triggered the request,
   *     if applicable.
   * @return {Promise<Response>|undefined} A promise is returned if a
   *     registered route can handle the request. If there is no matching
   *     route and there's no `defaultHandler`, `undefined` is returned.
   */


  handleRequest({
    request,
    event
  }) {
    {
      finalAssertExports.isInstance(request, Request, {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'handleRequest',
        paramName: 'options.request'
      });
    }

    const url = new URL(request.url, location.href);

    if (!url.protocol.startsWith('http')) {
      {
        logger.debug(`Workbox Router only supports URLs that start with 'http'.`);
      }

      return;
    }

    let {
      params,
      route
    } = this.findMatchingRoute({
      url,
      request,
      event
    });
    let handler = route && route.handler;
    let debugMessages = [];

    {
      if (handler) {
        debugMessages.push([`Found a route to handle this request:`, route]);

        if (params) {
          debugMessages.push([`Passing the following params to the route's handler:`, params]);
        }
      }
    } // If we don't have a handler because there was no matching route, then
    // fall back to defaultHandler if that's defined.


    if (!handler && this._defaultHandler) {
      {
        debugMessages.push(`Failed to find a matching route. Falling ` + `back to the default handler.`);
      }

      handler = this._defaultHandler;
    }

    if (!handler) {
      {
        // No handler so Workbox will do nothing. If logs is set of debug
        // i.e. verbose, we should print out this information.
        logger.debug(`No route found for: ${getFriendlyURL(url)}`);
      }

      return;
    }

    {
      // We have a handler, meaning Workbox is going to handle the route.
      // print the routing details to the console.
      logger.groupCollapsed(`Router is responding to: ${getFriendlyURL(url)}`);
      debugMessages.forEach(msg => {
        if (Array.isArray(msg)) {
          logger.log(...msg);
        } else {
          logger.log(msg);
        }
      }); // The Request and Response objects contains a great deal of information,
      // hide it under a group in case developers want to see it.

      logger.groupCollapsed(`View request details here.`);
      logger.log(request);
      logger.groupEnd();
      logger.groupEnd();
    } // Wrap in try and catch in case the handle method throws a synchronous
    // error. It should still callback to the catch handler.


    let responsePromise;

    try {
      responsePromise = handler.handle({
        url,
        request,
        event,
        params
      });
    } catch (err) {
      responsePromise = Promise.reject(err);
    }

    if (responsePromise && this._catchHandler) {
      responsePromise = responsePromise.catch(err => {
        {
          // Still include URL here as it will be async from the console group
          // and may not make sense without the URL
          logger.groupCollapsed(`Error thrown when responding to: ` + ` ${getFriendlyURL(url)}. Falling back to Catch Handler.`);
          logger.error(`Error thrown by:`, route);
          logger.error(err);
          logger.groupEnd();
        }

        return this._catchHandler.handle({
          url,
          request,
          event
        });
      });
    }

    return responsePromise;
  }
  /**
   * Checks a request and URL (and optionally an event) against the list of
   * registered routes, and if there's a match, returns the corresponding
   * route along with any params generated by the match.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {Request} options.request The request to match.
   * @param {Event} [options.event] The corresponding event (unless N/A).
   * @return {Object} An object with `route` and `params` properties.
   *     They are populated if a matching route was found or `undefined`
   *     otherwise.
   */


  findMatchingRoute({
    url,
    request,
    event
  }) {
    {
      finalAssertExports.isInstance(url, URL, {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'findMatchingRoute',
        paramName: 'options.url'
      });
      finalAssertExports.isInstance(request, Request, {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'findMatchingRoute',
        paramName: 'options.request'
      });
    }

    const routes = this._routes.get(request.method) || [];

    for (const route of routes) {
      let params;
      let matchResult = route.match({
        url,
        request,
        event
      });

      if (matchResult) {
        // See https://github.com/GoogleChrome/workbox/issues/2079
        params = matchResult;

        if (Array.isArray(matchResult) && matchResult.length === 0) {
          // Instead of passing an empty array in as params, use undefined.
          params = undefined;
        } else if (matchResult.constructor === Object && Object.keys(matchResult).length === 0) {
          // Instead of passing an empty object in as params, use undefined.
          params = undefined;
        } else if (typeof matchResult === 'boolean') {
          // For the boolean value true (rather than just something truth-y),
          // don't set params.
          // See https://github.com/GoogleChrome/workbox/pull/2134#issuecomment-513924353
          params = undefined;
        } // Return early if have a match.


        return {
          route,
          params
        };
      }
    } // If no match was found above, return and empty object.


    return {};
  }
  /**
   * Define a default `handler` that's called when no routes explicitly
   * match the incoming request.
   *
   * Without a default handler, unmatched requests will go against the
   * network as if there were no service worker present.
   *
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */


  setDefaultHandler(handler) {
    this._defaultHandler = normalizeHandler(handler);
  }
  /**
   * If a Route throws an error while handling a request, this `handler`
   * will be called and given a chance to provide a response.
   *
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   */


  setCatchHandler(handler) {
    this._catchHandler = normalizeHandler(handler);
  }
  /**
   * Registers a route with the router.
   *
   * @param {workbox.routing.Route} route The route to register.
   */


  registerRoute(route) {
    {
      finalAssertExports.isType(route, 'object', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route'
      });
      finalAssertExports.hasMethod(route, 'match', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route'
      });
      finalAssertExports.isType(route.handler, 'object', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route'
      });
      finalAssertExports.hasMethod(route.handler, 'handle', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route.handler'
      });
      finalAssertExports.isType(route.method, 'string', {
        moduleName: 'workbox-routing',
        className: 'Router',
        funcName: 'registerRoute',
        paramName: 'route.method'
      });
    }

    if (!this._routes.has(route.method)) {
      this._routes.set(route.method, []);
    } // Give precedence to all of the earlier routes by adding this additional
    // route to the end of the array.


    this._routes.get(route.method).push(route);
  }
  /**
   * Unregisters a route with the router.
   *
   * @param {workbox.routing.Route} route The route to unregister.
   */


  unregisterRoute(route) {
    if (!this._routes.has(route.method)) {
      throw new WorkboxError('unregister-route-but-not-found-with-method', {
        method: route.method
      });
    }

    const routeIndex = this._routes.get(route.method).indexOf(route);

    if (routeIndex > -1) {
      this._routes.get(route.method).splice(routeIndex, 1);
    } else {
      throw new WorkboxError('unregister-route-route-not-registered');
    }
  }

}

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
let defaultRouter;
/**
 * Creates a new, singleton Router instance if one does not exist. If one
 * does already exist, that instance is returned.
 *
 * @private
 * @return {Router}
 */

const getOrCreateDefaultRouter = () => {
  if (!defaultRouter) {
    defaultRouter = new Router(); // The helpers that use the default Router assume these listeners exist.

    defaultRouter.addFetchListener();
    defaultRouter.addCacheListener();
  }

  return defaultRouter;
};

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Easily register a RegExp, string, or function with a caching
 * strategy to a singleton Router instance.
 *
 * This method will generate a Route for you if needed and
 * call [Router.registerRoute()]{@link
 * workbox.routing.Router#registerRoute}.
 *
 * @param {
 * RegExp|
 * string|
 * workbox.routing.Route~matchCallback|
 * workbox.routing.Route
 * } capture
 * If the capture param is a `Route`, all other arguments will be ignored.
 * @param {workbox.routing.Route~handlerCallback} [handler] A callback
 * function that returns a Promise resulting in a Response. This parameter
 * is required if `capture` is not a `Route` object.
 * @param {string} [method='GET'] The HTTP method to match the Route
 * against.
 * @return {workbox.routing.Route} The generated `Route`(Useful for
 * unregistering).
 *
 * @alias workbox.routing.registerRoute
 */

const registerRoute = (capture, handler, method) => {
  let route;

  if (typeof capture === 'string') {
    const captureUrl = new URL(capture, location.href);

    {
      if (!(capture.startsWith('/') || capture.startsWith('http'))) {
        throw new WorkboxError('invalid-string', {
          moduleName: 'workbox-routing',
          funcName: 'registerRoute',
          paramName: 'capture'
        });
      } // We want to check if Express-style wildcards are in the pathname only.
      // TODO: Remove this log message in v4.


      const valueToCheck = capture.startsWith('http') ? captureUrl.pathname : capture; // See https://github.com/pillarjs/path-to-regexp#parameters

      const wildcards = '[*:?+]';

      if (valueToCheck.match(new RegExp(`${wildcards}`))) {
        logger.debug(`The '$capture' parameter contains an Express-style wildcard ` + `character (${wildcards}). Strings are now always interpreted as ` + `exact matches; use a RegExp for partial or wildcard matches.`);
      }
    }

    const matchCallback = ({
      url
    }) => {
      {
        if (url.pathname === captureUrl.pathname && url.origin !== captureUrl.origin) {
          logger.debug(`${capture} only partially matches the cross-origin URL ` + `${url}. This route will only handle cross-origin requests ` + `if they match the entire URL.`);
        }
      }

      return url.href === captureUrl.href;
    }; // If `capture` is a string then `handler` and `method` must be present.


    route = new Route(matchCallback, handler, method);
  } else if (capture instanceof RegExp) {
    // If `capture` is a `RegExp` then `handler` and `method` must be present.
    route = new RegExpRoute(capture, handler, method);
  } else if (typeof capture === 'function') {
    // If `capture` is a function then `handler` and `method` must be present.
    route = new Route(capture, handler, method);
  } else if (capture instanceof Route) {
    route = capture;
  } else {
    throw new WorkboxError('unsupported-route-type', {
      moduleName: 'workbox-routing',
      funcName: 'registerRoute',
      paramName: 'capture'
    });
  }

  const defaultRouter = getOrCreateDefaultRouter();
  defaultRouter.registerRoute(route);
  return route;
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const _cacheNameDetails = {
  googleAnalytics: 'googleAnalytics',
  precache: 'precache-v2',
  prefix: 'workbox',
  runtime: 'runtime',
  suffix: registration.scope
};

const _createCacheName = cacheName => {
  return [_cacheNameDetails.prefix, cacheName, _cacheNameDetails.suffix].filter(value => value && value.length > 0).join('-');
};

const eachCacheNameDetail = fn => {
  for (const key of Object.keys(_cacheNameDetails)) {
    fn(key);
  }
};

const cacheNames = {
  updateDetails: details => {
    eachCacheNameDetail(key => {
      if (typeof details[key] === 'string') {
        _cacheNameDetails[key] = details[key];
      }
    });
  },
  getGoogleAnalyticsName: userCacheName => {
    return userCacheName || _createCacheName(_cacheNameDetails.googleAnalytics);
  },
  getPrecacheName: userCacheName => {
    return userCacheName || _createCacheName(_cacheNameDetails.precache);
  },
  getPrefix: () => {
    return _cacheNameDetails.prefix;
  },
  getRuntimeName: userCacheName => {
    return userCacheName || _createCacheName(_cacheNameDetails.runtime);
  },
  getSuffix: () => {
    return _cacheNameDetails.suffix;
  }
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

const quotaErrorCallbacks = new Set();

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Adds a function to the set of quotaErrorCallbacks that will be executed if
 * there's a quota error.
 *
 * @param {Function} callback
 * @memberof workbox.core
 */

function registerQuotaErrorCallback(callback) {
  {
    finalAssertExports.isType(callback, 'function', {
      moduleName: 'workbox-core',
      funcName: 'register',
      paramName: 'callback'
    });
  }

  quotaErrorCallbacks.add(callback);

  {
    logger.log('Registered a callback to respond to quota errors.', callback);
  }
}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * A class that wraps common IndexedDB functionality in a promise-based API.
 * It exposes all the underlying power and functionality of IndexedDB, but
 * wraps the most commonly used features in a way that's much simpler to use.
 *
 * @private
 */

class DBWrapper {
  /**
   * @param {string} name
   * @param {number} version
   * @param {Object=} [callback]
   * @param {!Function} [callbacks.onupgradeneeded]
   * @param {!Function} [callbacks.onversionchange] Defaults to
   *     DBWrapper.prototype._onversionchange when not specified.
   * @private
   */
  constructor(name, version, {
    onupgradeneeded,
    onversionchange
  } = {}) {
    this._db = null;
    this._name = name;
    this._version = version;
    this._onupgradeneeded = onupgradeneeded;

    this._onversionchange = onversionchange || (() => this.close());
  }
  /**
   * Returns the IDBDatabase instance (not normally needed).
   * @return {IDBDatabase|undefined}
   *
   * @private
   */


  get db() {
    return this._db;
  }
  /**
   * Opens a connected to an IDBDatabase, invokes any onupgradedneeded
   * callback, and added an onversionchange callback to the database.
   *
   * @return {IDBDatabase}
   * @private
   */


  async open() {
    if (this._db) return;
    this._db = await new Promise((resolve, reject) => {
      // This flag is flipped to true if the timeout callback runs prior
      // to the request failing or succeeding. Note: we use a timeout instead
      // of an onblocked handler since there are cases where onblocked will
      // never never run. A timeout better handles all possible scenarios:
      // https://github.com/w3c/IndexedDB/issues/223
      let openRequestTimedOut = false;
      setTimeout(() => {
        openRequestTimedOut = true;
        reject(new Error('The open request was blocked and timed out'));
      }, this.OPEN_TIMEOUT);
      const openRequest = indexedDB.open(this._name, this._version);

      openRequest.onerror = () => reject(openRequest.error);

      openRequest.onupgradeneeded = evt => {
        if (openRequestTimedOut) {
          openRequest.transaction.abort();
          openRequest.result.close();
        } else if (typeof this._onupgradeneeded === 'function') {
          this._onupgradeneeded(evt);
        }
      };

      openRequest.onsuccess = () => {
        const db = openRequest.result;

        if (openRequestTimedOut) {
          db.close();
        } else {
          db.onversionchange = this._onversionchange.bind(this);
          resolve(db);
        }
      };
    });
    return this;
  }
  /**
   * Polyfills the native `getKey()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @return {Array}
   * @private
   */


  async getKey(storeName, query) {
    return (await this.getAllKeys(storeName, query, 1))[0];
  }
  /**
   * Polyfills the native `getAll()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @param {number} count
   * @return {Array}
   * @private
   */


  async getAll(storeName, query, count) {
    return await this.getAllMatching(storeName, {
      query,
      count
    });
  }
  /**
   * Polyfills the native `getAllKeys()` method. Note, this is overridden at
   * runtime if the browser supports the native method.
   *
   * @param {string} storeName
   * @param {*} query
   * @param {number} count
   * @return {Array}
   * @private
   */


  async getAllKeys(storeName, query, count) {
    const entries = await this.getAllMatching(storeName, {
      query,
      count,
      includeKeys: true
    });
    return entries.map(entry => entry.key);
  }
  /**
   * Supports flexible lookup in an object store by specifying an index,
   * query, direction, and count. This method returns an array of objects
   * with the signature .
   *
   * @param {string} storeName
   * @param {Object} [opts]
   * @param {string} [opts.index] The index to use (if specified).
   * @param {*} [opts.query]
   * @param {IDBCursorDirection} [opts.direction]
   * @param {number} [opts.count] The max number of results to return.
   * @param {boolean} [opts.includeKeys] When true, the structure of the
   *     returned objects is changed from an array of values to an array of
   *     objects in the form {key, primaryKey, value}.
   * @return {Array}
   * @private
   */


  async getAllMatching(storeName, {
    index,
    query = null,
    // IE/Edge errors if query === `undefined`.
    direction = 'next',
    count,
    includeKeys = false
  } = {}) {
    return await this.transaction([storeName], 'readonly', (txn, done) => {
      const store = txn.objectStore(storeName);
      const target = index ? store.index(index) : store;
      const results = [];
      const request = target.openCursor(query, direction);

      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          results.push(includeKeys ? cursor : cursor.value);

          if (count && results.length >= count) {
            done(results);
          } else {
            cursor.continue();
          }
        } else {
          done(results);
        }
      };
    });
  }
  /**
   * Accepts a list of stores, a transaction type, and a callback and
   * performs a transaction. A promise is returned that resolves to whatever
   * value the callback chooses. The callback holds all the transaction logic
   * and is invoked with two arguments:
   *   1. The IDBTransaction object
   *   2. A `done` function, that's used to resolve the promise when
   *      when the transaction is done, if passed a value, the promise is
   *      resolved to that value.
   *
   * @param {Array<string>} storeNames An array of object store names
   *     involved in the transaction.
   * @param {string} type Can be `readonly` or `readwrite`.
   * @param {!Function} callback
   * @return {*} The result of the transaction ran by the callback.
   * @private
   */


  async transaction(storeNames, type, callback) {
    await this.open();
    return await new Promise((resolve, reject) => {
      const txn = this._db.transaction(storeNames, type);

      txn.onabort = () => reject(txn.error);

      txn.oncomplete = () => resolve();

      callback(txn, value => resolve(value));
    });
  }
  /**
   * Delegates async to a native IDBObjectStore method.
   *
   * @param {string} method The method name.
   * @param {string} storeName The object store name.
   * @param {string} type Can be `readonly` or `readwrite`.
   * @param {...*} args The list of args to pass to the native method.
   * @return {*} The result of the transaction.
   * @private
   */


  async _call(method, storeName, type, ...args) {
    const callback = (txn, done) => {
      const objStore = txn.objectStore(storeName);
      const request = objStore[method].apply(objStore, args);

      request.onsuccess = () => done(request.result);
    };

    return await this.transaction([storeName], type, callback);
  }
  /**
   * Closes the connection opened by `DBWrapper.open()`. Generally this method
   * doesn't need to be called since:
   *   1. It's usually better to keep a connection open since opening
   *      a new connection is somewhat slow.
   *   2. Connections are automatically closed when the reference is
   *      garbage collected.
   * The primary use case for needing to close a connection is when another
   * reference (typically in another tab) needs to upgrade it and would be
   * blocked by the current, open connection.
   *
   * @private
   */


  close() {
    if (this._db) {
      this._db.close();

      this._db = null;
    }
  }

} // Exposed on the prototype to let users modify the default timeout on a
// per-instance or global basis.

DBWrapper.prototype.OPEN_TIMEOUT = 2000; // Wrap native IDBObjectStore methods according to their mode.

const methodsToWrap = {
  readonly: ['get', 'count', 'getKey', 'getAll', 'getAllKeys'],
  readwrite: ['add', 'put', 'clear', 'delete']
};

for (const [mode, methods] of Object.entries(methodsToWrap)) {
  for (const method of methods) {
    if (method in IDBObjectStore.prototype) {
      // Don't use arrow functions here since we're outside of the class.
      DBWrapper.prototype[method] = async function (storeName, ...args) {
        return await this._call(method, storeName, mode, ...args);
      };
    }
  }
}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Deletes the database.
 * Note: this is exported separately from the DBWrapper module because most
 * usages of IndexedDB in workbox dont need deleting, and this way it can be
 * reused in tests to delete databases without creating DBWrapper instances.
 *
 * @param {string} name The database name.
 * @private
 */

const deleteDatabase = async name => {
  await new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(name);

    request.onerror = () => {
      reject(request.error);
    };

    request.onblocked = () => {
      reject(new Error('Delete blocked'));
    };

    request.onsuccess = () => {
      resolve();
    };
  });
};

// @ts-ignore
try {
  self['workbox:expiration:5.0.0-beta.0'] && _();
} catch (e) {}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const DB_NAME = 'workbox-expiration';
const OBJECT_STORE_NAME = 'cache-entries';

const normalizeURL = unNormalizedUrl => {
  const url = new URL(unNormalizedUrl, location.href);
  url.hash = '';
  return url.href;
};
/**
 * Returns the timestamp model.
 *
 * @private
 */


class CacheTimestampsModel {
  /**
   *
   * @param {string} cacheName
   *
   * @private
   */
  constructor(cacheName) {
    this._cacheName = cacheName;
    this._db = new DBWrapper(DB_NAME, 1, {
      onupgradeneeded: event => this._handleUpgrade(event)
    });
  }
  /**
   * Should perform an upgrade of indexedDB.
   *
   * @param {Event} event
   *
   * @private
   */


  _handleUpgrade(event) {
    const db = event.target.result; // TODO(philipwalton): EdgeHTML doesn't support arrays as a keyPath, so we
    // have to use the `id` keyPath here and create our own values (a
    // concatenation of `url + cacheName`) instead of simply using
    // `keyPath: ['url', 'cacheName']`, which is supported in other browsers.

    const objStore = db.createObjectStore(OBJECT_STORE_NAME, {
      keyPath: 'id'
    }); // TODO(philipwalton): once we don't have to support EdgeHTML, we can
    // create a single index with the keyPath `['cacheName', 'timestamp']`
    // instead of doing both these indexes.

    objStore.createIndex('cacheName', 'cacheName', {
      unique: false
    });
    objStore.createIndex('timestamp', 'timestamp', {
      unique: false
    }); // Previous versions of `workbox-expiration` used `this._cacheName`
    // as the IDBDatabase name.

    deleteDatabase(this._cacheName);
  }
  /**
   * @param {string} url
   * @param {number} timestamp
   *
   * @private
   */


  async setTimestamp(url, timestamp) {
    url = normalizeURL(url);
    const entry = {
      url,
      timestamp,
      cacheName: this._cacheName,
      // Creating an ID from the URL and cache name won't be necessary once
      // Edge switches to Chromium and all browsers we support work with
      // array keyPaths.
      id: this._getId(url)
    };
    await this._db.put(OBJECT_STORE_NAME, entry);
  }
  /**
   * Returns the timestamp stored for a given URL.
   *
   * @param {string} url
   * @return {number}
   *
   * @private
   */


  async getTimestamp(url) {
    const entry = await this._db.get(OBJECT_STORE_NAME, this._getId(url));
    return entry.timestamp;
  }
  /**
   * Iterates through all the entries in the object store (from newest to
   * oldest) and removes entries once either `maxCount` is reached or the
   * entry's timestamp is less than `minTimestamp`.
   *
   * @param {number} minTimestamp
   * @param {number} maxCount
   * @return {Array<string>}
   *
   * @private
   */


  async expireEntries(minTimestamp, maxCount) {
    const entriesToDelete = await this._db.transaction(OBJECT_STORE_NAME, 'readwrite', (txn, done) => {
      const store = txn.objectStore(OBJECT_STORE_NAME);
      const request = store.index('timestamp').openCursor(null, 'prev');
      const entriesToDelete = [];
      let entriesNotDeletedCount = 0;

      request.onsuccess = () => {
        const cursor = request.result;

        if (cursor) {
          const result = cursor.value; // TODO(philipwalton): once we can use a multi-key index, we
          // won't have to check `cacheName` here.

          if (result.cacheName === this._cacheName) {
            // Delete an entry if it's older than the max age or
            // if we already have the max number allowed.
            if (minTimestamp && result.timestamp < minTimestamp || maxCount && entriesNotDeletedCount >= maxCount) {
              // TODO(philipwalton): we should be able to delete the
              // entry right here, but doing so causes an iteration
              // bug in Safari stable (fixed in TP). Instead we can
              // store the keys of the entries to delete, and then
              // delete the separate transactions.
              // https://github.com/GoogleChrome/workbox/issues/1978
              // cursor.delete();
              // We only need to return the URL, not the whole entry.
              entriesToDelete.push(cursor.value);
            } else {
              entriesNotDeletedCount++;
            }
          }

          cursor.continue();
        } else {
          done(entriesToDelete);
        }
      };
    }); // TODO(philipwalton): once the Safari bug in the following issue is fixed,
    // we should be able to remove this loop and do the entry deletion in the
    // cursor loop above:
    // https://github.com/GoogleChrome/workbox/issues/1978

    const urlsDeleted = [];

    for (const entry of entriesToDelete) {
      await this._db.delete(OBJECT_STORE_NAME, entry.id);
      urlsDeleted.push(entry.url);
    }

    return urlsDeleted;
  }
  /**
   * Takes a URL and returns an ID that will be unique in the object store.
   *
   * @param {string} url
   * @return {string}
   *
   * @private
   */


  _getId(url) {
    // Creating an ID from the URL and cache name won't be necessary once
    // Edge switches to Chromium and all browsers we support work with
    // array keyPaths.
    return this._cacheName + '|' + normalizeURL(url);
  }

}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * The `CacheExpiration` class allows you define an expiration and / or
 * limit on the number of responses stored in a
 * [`Cache`](https://developer.mozilla.org/en-US/docs/Web/API/Cache).
 *
 * @memberof workbox.expiration
 */

class CacheExpiration {
  /**
   * To construct a new CacheExpiration instance you must provide at least
   * one of the `config` properties.
   *
   * @param {string} cacheName Name of the cache to apply restrictions to.
   * @param {Object} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   */
  constructor(cacheName, config = {}) {
    this._isRunning = false;
    this._rerunRequested = false;

    {
      finalAssertExports.isType(cacheName, 'string', {
        moduleName: 'workbox-expiration',
        className: 'CacheExpiration',
        funcName: 'constructor',
        paramName: 'cacheName'
      });

      if (!(config.maxEntries || config.maxAgeSeconds)) {
        throw new WorkboxError('max-entries-or-age-required', {
          moduleName: 'workbox-expiration',
          className: 'CacheExpiration',
          funcName: 'constructor'
        });
      }

      if (config.maxEntries) {
        finalAssertExports.isType(config.maxEntries, 'number', {
          moduleName: 'workbox-expiration',
          className: 'CacheExpiration',
          funcName: 'constructor',
          paramName: 'config.maxEntries'
        }); // TODO: Assert is positive
      }

      if (config.maxAgeSeconds) {
        finalAssertExports.isType(config.maxAgeSeconds, 'number', {
          moduleName: 'workbox-expiration',
          className: 'CacheExpiration',
          funcName: 'constructor',
          paramName: 'config.maxAgeSeconds'
        }); // TODO: Assert is positive
      }
    }

    this._maxEntries = config.maxEntries;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._cacheName = cacheName;
    this._timestampModel = new CacheTimestampsModel(cacheName);
  }
  /**
   * Expires entries for the given cache and given criteria.
   */


  async expireEntries() {
    if (this._isRunning) {
      this._rerunRequested = true;
      return;
    }

    this._isRunning = true;
    const minTimestamp = this._maxAgeSeconds ? Date.now() - this._maxAgeSeconds * 1000 : 0;
    const urlsExpired = await this._timestampModel.expireEntries(minTimestamp, this._maxEntries); // Delete URLs from the cache

    const cache = await caches.open(this._cacheName);

    for (const url of urlsExpired) {
      await cache.delete(url);
    }

    {
      if (urlsExpired.length > 0) {
        logger.groupCollapsed(`Expired ${urlsExpired.length} ` + `${urlsExpired.length === 1 ? 'entry' : 'entries'} and removed ` + `${urlsExpired.length === 1 ? 'it' : 'them'} from the ` + `'${this._cacheName}' cache.`);
        logger.log(`Expired the following ${urlsExpired.length === 1 ? 'URL' : 'URLs'}:`);
        urlsExpired.forEach(url => logger.log(`    ${url}`));
        logger.groupEnd();
      } else {
        logger.debug(`Cache expiration ran and found no entries to remove.`);
      }
    }

    this._isRunning = false;

    if (this._rerunRequested) {
      this._rerunRequested = false;
      this.expireEntries();
    }
  }
  /**
   * Update the timestamp for the given URL. This ensures the when
   * removing entries based on maximum entries, most recently used
   * is accurate or when expiring, the timestamp is up-to-date.
   *
   * @param {string} url
   */


  async updateTimestamp(url) {
    {
      finalAssertExports.isType(url, 'string', {
        moduleName: 'workbox-expiration',
        className: 'CacheExpiration',
        funcName: 'updateTimestamp',
        paramName: 'url'
      });
    }

    await this._timestampModel.setTimestamp(url, Date.now());
  }
  /**
   * Can be used to check if a URL has expired or not before it's used.
   *
   * This requires a look up from IndexedDB, so can be slow.
   *
   * Note: This method will not remove the cached entry, call
   * `expireEntries()` to remove indexedDB and Cache entries.
   *
   * @param {string} url
   * @return {boolean}
   */


  async isURLExpired(url) {
    if (!this._maxAgeSeconds) {
      {
        throw new WorkboxError(`expired-test-without-max-age`, {
          methodName: 'isURLExpired',
          paramName: 'maxAgeSeconds'
        });
      }

      return false;
    } else {
      const timestamp = await this._timestampModel.getTimestamp(url);
      const expireOlderThan = Date.now() - this._maxAgeSeconds * 1000;
      return timestamp < expireOlderThan;
    }
  }
  /**
   * Removes the IndexedDB object store used to keep track of cache expiration
   * metadata.
   */


  async delete() {
    // Make sure we don't attempt another rerun if we're called in the middle of
    // a cache expiration.
    this._rerunRequested = false;
    await this._timestampModel.expireEntries(Infinity); // Expires all.
  }

}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * This plugin can be used in the Workbox APIs to regularly enforce a
 * limit on the age and / or the number of cached requests.
 *
 * Whenever a cached request is used or updated, this plugin will look
 * at the used Cache and remove any old or extra requests.
 *
 * When using `maxAgeSeconds`, requests may be used *once* after expiring
 * because the expiration clean up will not have occurred until *after* the
 * cached request has been used. If the request has a "Date" header, then
 * a light weight expiration check is performed and the request will not be
 * used immediately.
 *
 * When using `maxEntries`, the entry least-recently requested will be removed
 * from the cache first.
 *
 * @memberof workbox.expiration
 */

class ExpirationPlugin {
  /**
   * @param {Object} config
   * @param {number} [config.maxEntries] The maximum number of entries to cache.
   * Entries used the least will be removed as the maximum is reached.
   * @param {number} [config.maxAgeSeconds] The maximum age of an entry before
   * it's treated as stale and removed.
   * @param {boolean} [config.purgeOnQuotaError] Whether to opt this cache in to
   * automatic deletion if the available storage quota has been exceeded.
   */
  constructor(config = {}) {
    /**
     * A "lifecycle" callback that will be triggered automatically by the
     * `workbox.strategies` handlers when a `Response` is about to be returned
     * from a [Cache](https://developer.mozilla.org/en-US/docs/Web/API/Cache) to
     * the handler. It allows the `Response` to be inspected for freshness and
     * prevents it from being used if the `Response`'s `Date` header value is
     * older than the configured `maxAgeSeconds`.
     *
     * @param {Object} options
     * @param {string} options.cacheName Name of the cache the response is in.
     * @param {Response} options.cachedResponse The `Response` object that's been
     *     read from a cache and whose freshness should be checked.
     * @return {Response} Either the `cachedResponse`, if it's
     *     fresh, or `null` if the `Response` is older than `maxAgeSeconds`.
     *
     * @private
     */
    this.cachedResponseWillBeUsed = async ({
      event,
      request,
      cacheName,
      cachedResponse
    }) => {
      if (!cachedResponse) {
        return null;
      }

      let isFresh = this._isResponseDateFresh(cachedResponse); // Expire entries to ensure that even if the expiration date has
      // expired, it'll only be used once.


      const cacheExpiration = this._getCacheExpiration(cacheName);

      cacheExpiration.expireEntries(); // Update the metadata for the request URL to the current timestamp,
      // but don't `await` it as we don't want to block the response.

      const updateTimestampDone = cacheExpiration.updateTimestamp(request.url);

      if (event) {
        try {
          event.waitUntil(updateTimestampDone);
        } catch (error) {
          {
            // The event may not be a fetch event; only log the URL if it is.
            if ('request' in event) {
              logger.warn(`Unable to ensure service worker stays alive when ` + `updating cache entry for ` + `'${getFriendlyURL(event.request.url)}'.`);
            }
          }
        }
      }

      return isFresh ? cachedResponse : null;
    };
    /**
     * A "lifecycle" callback that will be triggered automatically by the
     * `workbox.strategies` handlers when an entry is added to a cache.
     *
     * @param {Object} options
     * @param {string} options.cacheName Name of the cache that was updated.
     * @param {string} options.request The Request for the cached entry.
     *
     * @private
     */


    this.cacheDidUpdate = async ({
      cacheName,
      request
    }) => {
      {
        finalAssertExports.isType(cacheName, 'string', {
          moduleName: 'workbox-expiration',
          className: 'Plugin',
          funcName: 'cacheDidUpdate',
          paramName: 'cacheName'
        });
        finalAssertExports.isInstance(request, Request, {
          moduleName: 'workbox-expiration',
          className: 'Plugin',
          funcName: 'cacheDidUpdate',
          paramName: 'request'
        });
      }

      const cacheExpiration = this._getCacheExpiration(cacheName);

      await cacheExpiration.updateTimestamp(request.url);
      await cacheExpiration.expireEntries();
    };

    {
      if (!(config.maxEntries || config.maxAgeSeconds)) {
        throw new WorkboxError('max-entries-or-age-required', {
          moduleName: 'workbox-expiration',
          className: 'Plugin',
          funcName: 'constructor'
        });
      }

      if (config.maxEntries) {
        finalAssertExports.isType(config.maxEntries, 'number', {
          moduleName: 'workbox-expiration',
          className: 'Plugin',
          funcName: 'constructor',
          paramName: 'config.maxEntries'
        });
      }

      if (config.maxAgeSeconds) {
        finalAssertExports.isType(config.maxAgeSeconds, 'number', {
          moduleName: 'workbox-expiration',
          className: 'Plugin',
          funcName: 'constructor',
          paramName: 'config.maxAgeSeconds'
        });
      }
    }

    this._config = config;
    this._maxAgeSeconds = config.maxAgeSeconds;
    this._cacheExpirations = new Map();

    if (config.purgeOnQuotaError) {
      registerQuotaErrorCallback(() => this.deleteCacheAndMetadata());
    }
  }
  /**
   * A simple helper method to return a CacheExpiration instance for a given
   * cache name.
   *
   * @param {string} cacheName
   * @return {CacheExpiration}
   *
   * @private
   */


  _getCacheExpiration(cacheName) {
    if (cacheName === cacheNames.getRuntimeName()) {
      throw new WorkboxError('expire-custom-caches-only');
    }

    let cacheExpiration = this._cacheExpirations.get(cacheName);

    if (!cacheExpiration) {
      cacheExpiration = new CacheExpiration(cacheName, this._config);

      this._cacheExpirations.set(cacheName, cacheExpiration);
    }

    return cacheExpiration;
  }
  /**
   * @param {Response} cachedResponse
   * @return {boolean}
   *
   * @private
   */


  _isResponseDateFresh(cachedResponse) {
    if (!this._maxAgeSeconds) {
      // We aren't expiring by age, so return true, it's fresh
      return true;
    } // Check if the 'date' header will suffice a quick expiration check.
    // See https://github.com/GoogleChromeLabs/sw-toolbox/issues/164 for
    // discussion.


    const dateHeaderTimestamp = this._getDateHeaderTimestamp(cachedResponse);

    if (dateHeaderTimestamp === null) {
      // Unable to parse date, so assume it's fresh.
      return true;
    } // If we have a valid headerTime, then our response is fresh iff the
    // headerTime plus maxAgeSeconds is greater than the current time.


    const now = Date.now();
    return dateHeaderTimestamp >= now - this._maxAgeSeconds * 1000;
  }
  /**
   * This method will extract the data header and parse it into a useful
   * value.
   *
   * @param {Response} cachedResponse
   * @return {number|null}
   *
   * @private
   */


  _getDateHeaderTimestamp(cachedResponse) {
    if (!cachedResponse.headers.has('date')) {
      return null;
    }

    const dateHeader = cachedResponse.headers.get('date');
    const parsedDate = new Date(dateHeader);
    const headerTime = parsedDate.getTime(); // If the Date header was invalid for some reason, parsedDate.getTime()
    // will return NaN.

    if (isNaN(headerTime)) {
      return null;
    }

    return headerTime;
  }
  /**
   * This is a helper method that performs two operations:
   *
   * - Deletes *all* the underlying Cache instances associated with this plugin
   * instance, by calling caches.delete() on your behalf.
   * - Deletes the metadata from IndexedDB used to keep track of expiration
   * details for each Cache instance.
   *
   * When using cache expiration, calling this method is preferable to calling
   * `caches.delete()` directly, since this will ensure that the IndexedDB
   * metadata is also cleanly removed and open IndexedDB instances are deleted.
   *
   * Note that if you're *not* using cache expiration for a given cache, calling
   * `caches.delete()` and passing in the cache's name should be sufficient.
   * There is no Workbox-specific method needed for cleanup in that case.
   */


  async deleteCacheAndMetadata() {
    // Do this one at a time instead of all at once via `Promise.all()` to
    // reduce the chance of inconsistency if a promise rejects.
    for (const [cacheName, cacheExpiration] of this._cacheExpirations) {
      await caches.delete(cacheName);
      await cacheExpiration.delete();
    } // Reset this._cacheExpirations to its initial state.


    this._cacheExpirations = new Map();
  }

}

// @ts-ignore
try {
  self['workbox:cacheable-response:5.0.0-beta.0'] && _();
} catch (e) {}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * This class allows you to set up rules determining what
 * status codes and/or headers need to be present in order for a
 * [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 * to be considered cacheable.
 *
 * @memberof workbox.cacheableResponse
 */

class CacheableResponse {
  /**
   * To construct a new CacheableResponse instance you must provide at least
   * one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param {Object} config
   * @param {Array<number>} [config.statuses] One or more status codes that a
   * `Response` can have and be considered cacheable.
   * @param {Object<string,string>} [config.headers] A mapping of header names
   * and expected values that a `Response` can have and be considered cacheable.
   * If multiple headers are provided, only one needs to be present.
   */
  constructor(config = {}) {
    {
      if (!(config.statuses || config.headers)) {
        throw new WorkboxError('statuses-or-headers-required', {
          moduleName: 'workbox-cacheable-response',
          className: 'CacheableResponse',
          funcName: 'constructor'
        });
      }

      if (config.statuses) {
        finalAssertExports.isArray(config.statuses, {
          moduleName: 'workbox-cacheable-response',
          className: 'CacheableResponse',
          funcName: 'constructor',
          paramName: 'config.statuses'
        });
      }

      if (config.headers) {
        finalAssertExports.isType(config.headers, 'object', {
          moduleName: 'workbox-cacheable-response',
          className: 'CacheableResponse',
          funcName: 'constructor',
          paramName: 'config.headers'
        });
      }
    }

    this._statuses = config.statuses;
    this._headers = config.headers;
  }
  /**
   * Checks a response to see whether it's cacheable or not, based on this
   * object's configuration.
   *
   * @param {Response} response The response whose cacheability is being
   * checked.
   * @return {boolean} `true` if the `Response` is cacheable, and `false`
   * otherwise.
   */


  isResponseCacheable(response) {
    {
      finalAssertExports.isInstance(response, Response, {
        moduleName: 'workbox-cacheable-response',
        className: 'CacheableResponse',
        funcName: 'isResponseCacheable',
        paramName: 'response'
      });
    }

    let cacheable = true;

    if (this._statuses) {
      cacheable = this._statuses.includes(response.status);
    }

    if (this._headers && cacheable) {
      cacheable = Object.keys(this._headers).some(headerName => {
        return response.headers.get(headerName) === this._headers[headerName];
      });
    }

    {
      if (!cacheable) {
        logger.groupCollapsed(`The request for ` + `'${getFriendlyURL(response.url)}' returned a response that does ` + `not meet the criteria for being cached.`);
        logger.groupCollapsed(`View cacheability criteria here.`);
        logger.log(`Cacheable statuses: ` + JSON.stringify(this._statuses));
        logger.log(`Cacheable headers: ` + JSON.stringify(this._headers, null, 2));
        logger.groupEnd();
        const logFriendlyHeaders = {};
        response.headers.forEach((value, key) => {
          logFriendlyHeaders[key] = value;
        });
        logger.groupCollapsed(`View response status and headers here.`);
        logger.log(`Response status: ` + response.status);
        logger.log(`Response headers: ` + JSON.stringify(logFriendlyHeaders, null, 2));
        logger.groupEnd();
        logger.groupCollapsed(`View full response details here.`);
        logger.log(response.headers);
        logger.log(response);
        logger.groupEnd();
        logger.groupEnd();
      }
    }

    return cacheable;
  }

}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * A class implementing the `cacheWillUpdate` lifecycle callback. This makes it
 * easier to add in cacheability checks to requests made via Workbox's built-in
 * strategies.
 *
 * @memberof workbox.cacheableResponse
 */

class CacheableResponsePlugin {
  /**
   * To construct a new CacheableResponsePlugin instance you must provide at
   * least one of the `config` properties.
   *
   * If both `statuses` and `headers` are specified, then both conditions must
   * be met for the `Response` to be considered cacheable.
   *
   * @param {Object} config
   * @param {Array<number>} [config.statuses] One or more status codes that a
   * `Response` can have and be considered cacheable.
   * @param {Object<string,string>} [config.headers] A mapping of header names
   * and expected values that a `Response` can have and be considered cacheable.
   * If multiple headers are provided, only one needs to be present.
   */
  constructor(config) {
    /**
     * @param {Object} options
     * @param {Response} options.response
     * @return {Response|null}
     * @private
     */
    this.cacheWillUpdate = async ({
      response
    }) => {
      if (this._cacheableResponse.isResponseCacheable(response)) {
        return response;
      }

      return null;
    };

    this._cacheableResponse = new CacheableResponse(config);
  }

}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Runs all of the callback functions, one at a time sequentially, in the order
 * in which they were registered.
 *
 * @memberof workbox.core
 * @private
 */

async function executeQuotaErrorCallbacks() {
  {
    logger.log(`About to run ${quotaErrorCallbacks.size} ` + `callbacks to clean up caches.`);
  }

  for (const callback of quotaErrorCallbacks) {
    await callback();

    {
      logger.log(callback, 'is complete.');
    }
  }

  {
    logger.log('Finished running callbacks.');
  }
}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const pluginUtils = {
  filter: (plugins, callbackName) => {
    return plugins.filter(plugin => callbackName in plugin);
  }
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Wrapper around cache.put().
 *
 * Will call `cacheDidUpdate` on plugins if the cache was updated, using
 * `matchOptions` when determining what the old entry is.
 *
 * @param {Object} options
 * @param {string} options.cacheName
 * @param {Request} options.request
 * @param {Response} options.response
 * @param {Event} [options.event]
 * @param {Array<Object>} [options.plugins=[]]
 * @param {Object} [options.matchOptions]
 *
 * @private
 * @memberof module:workbox-core
 */

const putWrapper = async ({
  cacheName,
  request,
  response,
  event,
  plugins = [],
  matchOptions
}) => {
  {
    if (request.method && request.method !== 'GET') {
      throw new WorkboxError('attempt-to-cache-non-get-request', {
        url: getFriendlyURL(request.url),
        method: request.method
      });
    }
  }

  const effectiveRequest = await _getEffectiveRequest({
    plugins,
    request,
    mode: 'write'
  });

  if (!response) {
    {
      logger.error(`Cannot cache non-existent response for ` + `'${getFriendlyURL(effectiveRequest.url)}'.`);
    }

    throw new WorkboxError('cache-put-with-no-response', {
      url: getFriendlyURL(effectiveRequest.url)
    });
  }

  let responseToCache = await _isResponseSafeToCache({
    event,
    plugins,
    response,
    request: effectiveRequest
  });

  if (!responseToCache) {
    {
      logger.debug(`Response '${getFriendlyURL(effectiveRequest.url)}' will ` + `not be cached.`, responseToCache);
    }

    return;
  }

  const cache = await caches.open(cacheName);
  const updatePlugins = pluginUtils.filter(plugins, "cacheDidUpdate"
  /* CACHE_DID_UPDATE */
  );
  let oldResponse = updatePlugins.length > 0 ? await matchWrapper({
    cacheName,
    matchOptions,
    request: effectiveRequest
  }) : null;

  {
    logger.debug(`Updating the '${cacheName}' cache with a new Response for ` + `${getFriendlyURL(effectiveRequest.url)}.`);
  }

  try {
    await cache.put(effectiveRequest, responseToCache);
  } catch (error) {
    // See https://developer.mozilla.org/en-US/docs/Web/API/DOMException#exception-QuotaExceededError
    if (error.name === 'QuotaExceededError') {
      await executeQuotaErrorCallbacks();
    }

    throw error;
  }

  for (let plugin of updatePlugins) {
    await plugin["cacheDidUpdate"
    /* CACHE_DID_UPDATE */
    ].call(plugin, {
      cacheName,
      event,
      oldResponse,
      newResponse: responseToCache,
      request: effectiveRequest
    });
  }
};
/**
 * This is a wrapper around cache.match().
 *
 * @param {Object} options
 * @param {string} options.cacheName Name of the cache to match against.
 * @param {Request} options.request The Request that will be used to look up
 *     cache entries.
 * @param {Event} [options.event] The event that propted the action.
 * @param {Object} [options.matchOptions] Options passed to cache.match().
 * @param {Array<Object>} [options.plugins=[]] Array of plugins.
 * @return {Response} A cached response if available.
 *
 * @private
 * @memberof module:workbox-core
 */


const matchWrapper = async ({
  cacheName,
  request,
  event,
  matchOptions,
  plugins = []
}) => {
  const cache = await caches.open(cacheName);
  const effectiveRequest = await _getEffectiveRequest({
    plugins,
    request,
    mode: 'read'
  });
  let cachedResponse = await cache.match(effectiveRequest, matchOptions);

  {
    if (cachedResponse) {
      logger.debug(`Found a cached response in '${cacheName}'.`);
    } else {
      logger.debug(`No cached response found in '${cacheName}'.`);
    }
  }

  for (const plugin of plugins) {
    if ("cachedResponseWillBeUsed"
    /* CACHED_RESPONSE_WILL_BE_USED */
    in plugin) {
      const pluginMethod = plugin["cachedResponseWillBeUsed"
      /* CACHED_RESPONSE_WILL_BE_USED */
      ];
      cachedResponse = await pluginMethod.call(plugin, {
        cacheName,
        event,
        matchOptions,
        cachedResponse,
        request: effectiveRequest
      });

      {
        if (cachedResponse) {
          finalAssertExports.isInstance(cachedResponse, Response, {
            moduleName: 'Plugin',
            funcName: "cachedResponseWillBeUsed"
            /* CACHED_RESPONSE_WILL_BE_USED */
            ,
            isReturnValueProblem: true
          });
        }
      }
    }
  }

  return cachedResponse;
};
/**
 * This method will call cacheWillUpdate on the available plugins (or use
 * status === 200) to determine if the Response is safe and valid to cache.
 *
 * @param {Object} options
 * @param {Request} options.request
 * @param {Response} options.response
 * @param {Event} [options.event]
 * @param {Array<Object>} [options.plugins=[]]
 * @return {Promise<Response>}
 *
 * @private
 * @memberof module:workbox-core
 */


const _isResponseSafeToCache = async ({
  request,
  response,
  event,
  plugins = []
}) => {
  let responseToCache = response;
  let pluginsUsed = false;

  for (let plugin of plugins) {
    if ("cacheWillUpdate"
    /* CACHE_WILL_UPDATE */
    in plugin) {
      pluginsUsed = true;
      const pluginMethod = plugin["cacheWillUpdate"
      /* CACHE_WILL_UPDATE */
      ];
      responseToCache = await pluginMethod.call(plugin, {
        request,
        response: responseToCache,
        event
      });

      {
        if (responseToCache) {
          finalAssertExports.isInstance(responseToCache, Response, {
            moduleName: 'Plugin',
            funcName: "cacheWillUpdate"
            /* CACHE_WILL_UPDATE */
            ,
            isReturnValueProblem: true
          });
        }
      }

      if (!responseToCache) {
        break;
      }
    }
  }

  if (!pluginsUsed) {
    {
      if (responseToCache) {
        if (responseToCache.status !== 200) {
          if (responseToCache.status === 0) {
            logger.warn(`The response for '${request.url}' is an opaque ` + `response. The caching strategy that you're using will not ` + `cache opaque responses by default.`);
          } else {
            logger.debug(`The response for '${request.url}' returned ` + `a status code of '${response.status}' and won't be cached as a ` + `result.`);
          }
        }
      }
    }

    responseToCache = responseToCache && responseToCache.status === 200 ? responseToCache : undefined;
  }

  return responseToCache ? responseToCache : null;
};
/**
 * Checks the list of plugins for the cacheKeyWillBeUsed callback, and
 * executes any of those callbacks found in sequence. The final `Request` object
 * returned by the last plugin is treated as the cache key for cache reads
 * and/or writes.
 *
 * @param {Object} options
 * @param {Request} options.request
 * @param {string} options.mode
 * @param {Array<Object>} [options.plugins=[]]
 * @return {Promise<Request>}
 *
 * @private
 * @memberof module:workbox-core
 */


const _getEffectiveRequest = async ({
  request,
  mode,
  plugins = []
}) => {
  const cacheKeyWillBeUsedPlugins = pluginUtils.filter(plugins, "cacheKeyWillBeUsed"
  /* CACHE_KEY_WILL_BE_USED */
  );
  let effectiveRequest = request;

  for (const plugin of cacheKeyWillBeUsedPlugins) {
    effectiveRequest = await plugin["cacheKeyWillBeUsed"
    /* CACHE_KEY_WILL_BE_USED */
    ].call(plugin, {
      mode,
      request: effectiveRequest
    });

    if (typeof effectiveRequest === 'string') {
      effectiveRequest = new Request(effectiveRequest);
    }

    {
      finalAssertExports.isInstance(effectiveRequest, Request, {
        moduleName: 'Plugin',
        funcName: "cacheKeyWillBeUsed"
        /* CACHE_KEY_WILL_BE_USED */
        ,
        isReturnValueProblem: true
      });
    }
  }

  return effectiveRequest;
};

const cacheWrapper = {
  put: putWrapper,
  match: matchWrapper
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Wrapper around the fetch API.
 *
 * Will call requestWillFetch on available plugins.
 *
 * @param {Object} options
 * @param {Request|string} options.request
 * @param {Object} [options.fetchOptions]
 * @param {Event} [options.event]
 * @param {Array<Object>} [options.plugins=[]]
 * @return {Promise<Response>}
 *
 * @private
 * @memberof module:workbox-core
 */

const wrappedFetch = async ({
  request,
  fetchOptions,
  event,
  plugins = []
}) => {
  if (typeof request === 'string') {
    request = new Request(request);
  } // We *should* be able to call `await event.preloadResponse` even if it's
  // undefined, but for some reason, doing so leads to errors in our Node unit
  // tests. To work around that, explicitly check preloadResponse's value first.


  if (event instanceof FetchEvent && event.preloadResponse) {
    const possiblePreloadResponse = await event.preloadResponse;

    if (possiblePreloadResponse) {
      {
        logger.log(`Using a preloaded navigation response for ` + `'${getFriendlyURL(request.url)}'`);
      }

      return possiblePreloadResponse;
    }
  }

  {
    finalAssertExports.isInstance(request, Request, {
      paramName: 'request',
      expectedClass: Request,
      moduleName: 'workbox-core',
      className: 'fetchWrapper',
      funcName: 'wrappedFetch'
    });
  }

  const failedFetchPlugins = pluginUtils.filter(plugins, "fetchDidFail"
  /* FETCH_DID_FAIL */
  ); // If there is a fetchDidFail plugin, we need to save a clone of the
  // original request before it's either modified by a requestWillFetch
  // plugin or before the original request's body is consumed via fetch().

  const originalRequest = failedFetchPlugins.length > 0 ? request.clone() : null;

  try {
    for (let plugin of plugins) {
      if ("requestWillFetch"
      /* REQUEST_WILL_FETCH */
      in plugin) {
        const pluginMethod = plugin["requestWillFetch"
        /* REQUEST_WILL_FETCH */
        ];
        const requestClone = request.clone();
        request = await pluginMethod.call(plugin, {
          request: requestClone,
          event
        });

        if ("development" !== 'production') {
          if (request) {
            finalAssertExports.isInstance(request, Request, {
              moduleName: 'Plugin',
              funcName: "cachedResponseWillBeUsed"
              /* CACHED_RESPONSE_WILL_BE_USED */
              ,
              isReturnValueProblem: true
            });
          }
        }
      }
    }
  } catch (err) {
    throw new WorkboxError('plugin-error-request-will-fetch', {
      thrownError: err
    });
  } // The request can be altered by plugins with `requestWillFetch` making
  // the original request (Most likely from a `fetch` event) to be different
  // to the Request we make. Pass both to `fetchDidFail` to aid debugging.


  let pluginFilteredRequest = request.clone();

  try {
    let fetchResponse; // See https://github.com/GoogleChrome/workbox/issues/1796

    if (request.mode === 'navigate') {
      fetchResponse = await fetch(request);
    } else {
      fetchResponse = await fetch(request, fetchOptions);
    }

    if ("development" !== 'production') {
      logger.debug(`Network request for ` + `'${getFriendlyURL(request.url)}' returned a response with ` + `status '${fetchResponse.status}'.`);
    }

    for (const plugin of plugins) {
      if ("fetchDidSucceed"
      /* FETCH_DID_SUCCEED */
      in plugin) {
        fetchResponse = await plugin["fetchDidSucceed"
        /* FETCH_DID_SUCCEED */
        ].call(plugin, {
          event,
          request: pluginFilteredRequest,
          response: fetchResponse
        });

        if ("development" !== 'production') {
          if (fetchResponse) {
            finalAssertExports.isInstance(fetchResponse, Response, {
              moduleName: 'Plugin',
              funcName: "fetchDidSucceed"
              /* FETCH_DID_SUCCEED */
              ,
              isReturnValueProblem: true
            });
          }
        }
      }
    }

    return fetchResponse;
  } catch (error) {
    {
      logger.error(`Network request for ` + `'${getFriendlyURL(request.url)}' threw an error.`, error);
    }

    for (const plugin of failedFetchPlugins) {
      await plugin["fetchDidFail"
      /* FETCH_DID_FAIL */
      ].call(plugin, {
        error,
        event,
        originalRequest: originalRequest.clone(),
        request: pluginFilteredRequest.clone()
      });
    }

    throw error;
  }
};

const fetchWrapper = {
  fetch: wrappedFetch
};

// @ts-ignore
try {
  self['workbox:strategies:5.0.0-beta.0'] && _();
} catch (e) {}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const messages$1 = {
  strategyStart: (strategyName, request) => `Using ${strategyName} to respond to '${getFriendlyURL(request.url)}'`,
  printFinalResponse: response => {
    if (response) {
      logger.groupCollapsed(`View the final response here.`);
      logger.log(response || '[No response returned]');
      logger.groupEnd();
    }
  }
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * An implementation of a [cache-first]{@link https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook/#cache-falling-back-to-network}
 * request strategy.
 *
 * A cache first strategy is useful for assets that have been revisioned,
 * such as URLs like `/styles/example.a8f5f1.css`, since they
 * can be cached for long periods of time.
 *
 * If the network request fails, and there is no cache match, this will throw
 * a `WorkboxError` exception.
 *
 * @memberof workbox.strategies
 */

class CacheFirst {
  /**
   * @param {Object} options
   * @param {string} options.cacheName Cache name to store and retrieve
   * requests. Defaults to cache names provided by
   * [workbox-core]{@link workbox.core.cacheNames}.
   * @param {Array<Object>} options.plugins [Plugins]{@link https://developers.google.com/web/tools/workbox/guides/using-plugins}
   * to use in conjunction with this caching strategy.
   * @param {Object} options.fetchOptions Values passed along to the
   * [`init`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch#Parameters)
   * of all fetch() requests made by this strategy.
   * @param {Object} options.matchOptions [`CacheQueryOptions`](https://w3c.github.io/ServiceWorker/#dictdef-cachequeryoptions)
   */
  constructor(options = {}) {
    this._cacheName = cacheNames.getRuntimeName(options.cacheName);
    this._plugins = options.plugins || [];
    this._fetchOptions = options.fetchOptions;
    this._matchOptions = options.matchOptions;
  }
  /**
   * This method will perform a request strategy and follows an API that
   * will work with the
   * [Workbox Router]{@link workbox.routing.Router}.
   *
   * @param {Object} options
   * @param {Request} options.request The request to run this strategy for.
   * @param {Event} [options.event] The event that triggered the request.
   * @return {Promise<Response>}
   */


  async handle({
    event,
    request
  }) {
    const logs = [];

    {
      finalAssertExports.isInstance(request, Request, {
        moduleName: 'workbox-strategies',
        className: 'CacheFirst',
        funcName: 'makeRequest',
        paramName: 'request'
      });
    }

    let response = await cacheWrapper.match({
      cacheName: this._cacheName,
      request,
      event,
      matchOptions: this._matchOptions,
      plugins: this._plugins
    });
    let error;

    if (!response) {
      {
        logs.push(`No response found in the '${this._cacheName}' cache. ` + `Will respond with a network request.`);
      }

      try {
        response = await this._getFromNetwork(request, event);
      } catch (err) {
        error = err;
      }

      {
        if (response) {
          logs.push(`Got response from network.`);
        } else {
          logs.push(`Unable to get a response from the network.`);
        }
      }
    } else {
      {
        logs.push(`Found a cached response in the '${this._cacheName}' cache.`);
      }
    }

    {
      logger.groupCollapsed(messages$1.strategyStart('CacheFirst', request));

      for (let log of logs) {
        logger.log(log);
      }

      messages$1.printFinalResponse(response);
      logger.groupEnd();
    }

    if (!response) {
      throw new WorkboxError('no-response', {
        url: request.url,
        error
      });
    }

    return response;
  }
  /**
   * Handles the network and cache part of CacheFirst.
   *
   * @param {Request} request
   * @param {Event} [event]
   * @return {Promise<Response>}
   *
   * @private
   */


  async _getFromNetwork(request, event) {
    const response = await fetchWrapper.fetch({
      request,
      event,
      fetchOptions: this._fetchOptions,
      plugins: this._plugins
    }); // Keep the service worker while we put the request to the cache

    const responseClone = response.clone();
    const cachePutPromise = cacheWrapper.put({
      cacheName: this._cacheName,
      request,
      response: responseClone,
      event,
      plugins: this._plugins
    });

    if (event) {
      try {
        event.waitUntil(cachePutPromise);
      } catch (error) {
        {
          logger.warn(`Unable to ensure service worker stays alive when ` + `updating cache for '${getFriendlyURL(request.url)}'.`);
        }
      }
    }

    return response;
  }

}

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
let supportStatus;
/**
 * A utility function that determines whether the current browser supports
 * constructing a new `Response` from a `response.body` stream.
 *
 * @return {boolean} `true`, if the current browser can successfully
 *     construct a `Response` from a `response.body` stream, `false` otherwise.
 *
 * @private
 */

function canConstructResponseFromBodyStream() {
  if (supportStatus === undefined) {
    const testResponse = new Response('');

    if ('body' in testResponse) {
      try {
        new Response(testResponse.body);
        supportStatus = true;
      } catch (error) {
        supportStatus = false;
      }
    }

    supportStatus = false;
  }

  return supportStatus;
}

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Allows developers to copy a response and modify its `headers`, `status`,
 * or `statusText` values (the values settable via a
 * [`ResponseInit`]{@link https://developer.mozilla.org/en-US/docs/Web/API/Response/Response#Syntax}
 * object in the constructor).
 * To modify these values, pass a function as the second argument. That
 * function will be invoked with a single object with the response properties
 * `{headers, status, statusText}`. The return value of this function will
 * be used as the `ResponseInit` for the new `Response`. To change the values
 * either modify the passed parameter(s) and return it, or return a totally
 * new object.
 *
 * @param {Response} response
 * @param {Function} modifier
 * @alias workbox.core.copyResponse
 */

async function copyResponse(response, modifier) {
  const clonedResponse = response.clone(); // Create a fresh `ResponseInit` object by cloning the headers.

  const responseInit = {
    headers: new Headers(clonedResponse.headers),
    status: clonedResponse.status,
    statusText: clonedResponse.statusText
  }; // Apply any user modifications.

  const modifiedResponseInit = modifier ? modifier(responseInit) : responseInit; // Create the new response from the body stream and `ResponseInit`
  // modifications. Note: not all browsers support the Response.body stream,
  // so fall back to reading the entire body into memory as a blob.

  const body = canConstructResponseFromBodyStream() ? clonedResponse.body : await clonedResponse.blob();
  return new Response(body, modifiedResponseInit);
}

// @ts-ignore
try {
  self['workbox:precaching:5.0.0-beta.0'] && _();
} catch (e) {}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

const REVISION_SEARCH_PARAM = '__WB_REVISION__';
/**
 * Converts a manifest entry into a versioned URL suitable for precaching.
 *
 * @param {Object|string} entry
 * @return {string} A URL with versioning info.
 *
 * @private
 * @memberof module:workbox-precaching
 */

function createCacheKey(entry) {
  if (!entry) {
    throw new WorkboxError('add-to-cache-list-unexpected-type', {
      entry
    });
  } // If a precache manifest entry is a string, it's assumed to be a versioned
  // URL, like '/app.abcd1234.js'. Return as-is.


  if (typeof entry === 'string') {
    const urlObject = new URL(entry, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href
    };
  }

  const {
    revision,
    url
  } = entry;

  if (!url) {
    throw new WorkboxError('add-to-cache-list-unexpected-type', {
      entry
    });
  } // If there's just a URL and no revision, then it's also assumed to be a
  // versioned URL.


  if (!revision) {
    const urlObject = new URL(url, location.href);
    return {
      cacheKey: urlObject.href,
      url: urlObject.href
    };
  } // Otherwise, construct a properly versioned URL using the custom Workbox
  // search parameter along with the revision info.


  const cacheKeyURL = new URL(url, location.href);
  const originalURL = new URL(url, location.href);
  cacheKeyURL.searchParams.set(REVISION_SEARCH_PARAM, revision);
  return {
    cacheKey: cacheKeyURL.href,
    url: originalURL.href
  };
}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * @param {string} groupTitle
 * @param {Array<string>} deletedURLs
 *
 * @private
 */

const logGroup = (groupTitle, deletedURLs) => {
  logger.groupCollapsed(groupTitle);

  for (const url of deletedURLs) {
    logger.log(url);
  }

  logger.groupEnd();
};
/**
 * @param {Array<string>} deletedURLs
 *
 * @private
 * @memberof module:workbox-precaching
 */


function printCleanupDetails(deletedURLs) {
  const deletionCount = deletedURLs.length;

  if (deletionCount > 0) {
    logger.groupCollapsed(`During precaching cleanup, ` + `${deletionCount} cached ` + `request${deletionCount === 1 ? ' was' : 's were'} deleted.`);
    logGroup('Deleted Cache Requests', deletedURLs);
    logger.groupEnd();
  }
}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * @param {string} groupTitle
 * @param {Array<string>} urls
 *
 * @private
 */

function _nestedGroup(groupTitle, urls) {
  if (urls.length === 0) {
    return;
  }

  logger.groupCollapsed(groupTitle);

  for (const url of urls) {
    logger.log(url);
  }

  logger.groupEnd();
}
/**
 * @param {Array<string>} urlsToPrecache
 * @param {Array<string>} urlsAlreadyPrecached
 *
 * @private
 * @memberof module:workbox-precaching
 */


function printInstallDetails(urlsToPrecache, urlsAlreadyPrecached) {
  const precachedCount = urlsToPrecache.length;
  const alreadyPrecachedCount = urlsAlreadyPrecached.length;

  if (precachedCount || alreadyPrecachedCount) {
    let message = `Precaching ${precachedCount} file${precachedCount === 1 ? '' : 's'}.`;

    if (alreadyPrecachedCount > 0) {
      message += ` ${alreadyPrecachedCount} ` + `file${alreadyPrecachedCount === 1 ? ' is' : 's are'} already cached.`;
    }

    logger.groupCollapsed(message);

    _nestedGroup(`View newly precached URLs.`, urlsToPrecache);

    _nestedGroup(`View previously precached URLs.`, urlsAlreadyPrecached);

    logger.groupEnd();
  }
}

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Performs efficient precaching of assets.
 *
 * @memberof module:workbox-precaching
 */

class PrecacheController {
  /**
   * Create a new PrecacheController.
   *
   * @param {string} [cacheName] An optional name for the cache, to override
   * the default precache name.
   */
  constructor(cacheName) {
    this._cacheName = cacheNames.getPrecacheName(cacheName);
    this._urlsToCacheKeys = new Map();
    this._cacheKeysToIntegrities = new Map();
  }
  /**
   * This method will add items to the precache list, removing duplicates
   * and ensuring the information is valid.
   *
   * @param {
   * Array<module:workbox-precaching.PrecacheController.PrecacheEntry|string>
   * } entries Array of entries to precache.
   */


  addToCacheList(entries) {
    {
      finalAssertExports.isArray(entries, {
        moduleName: 'workbox-precaching',
        className: 'PrecacheController',
        funcName: 'addToCacheList',
        paramName: 'entries'
      });
    }

    for (const entry of entries) {
      const {
        cacheKey,
        url
      } = createCacheKey(entry);

      if (this._urlsToCacheKeys.has(url) && this._urlsToCacheKeys.get(url) !== cacheKey) {
        throw new WorkboxError('add-to-cache-list-conflicting-entries', {
          firstEntry: this._urlsToCacheKeys.get(url),
          secondEntry: cacheKey
        });
      }

      if (typeof entry !== 'string' && entry.integrity) {
        if (this._cacheKeysToIntegrities.has(cacheKey) && this._cacheKeysToIntegrities.get(cacheKey) !== entry.integrity) {
          throw new WorkboxError('add-to-cache-list-conflicting-integrities', {
            url
          });
        }

        this._cacheKeysToIntegrities.set(cacheKey, entry.integrity);
      }

      this._urlsToCacheKeys.set(url, cacheKey);
    }
  }
  /**
   * Precaches new and updated assets. Call this method from the service worker
   * install event.
   *
   * @param {Object} options
   * @param {Event} [options.event] The install event (if needed).
   * @param {Array<Object>} [options.plugins] Plugins to be used for fetching
   * and caching during install.
   * @return {Promise<workbox.precaching.InstallResult>}
   */


  async install({
    event,
    plugins
  } = {}) {
    {
      if (plugins) {
        finalAssertExports.isArray(plugins, {
          moduleName: 'workbox-precaching',
          className: 'PrecacheController',
          funcName: 'install',
          paramName: 'plugins'
        });
      }
    }

    const toBePrecached = [];
    const alreadyPrecached = [];
    const cache = await caches.open(this._cacheName);
    const alreadyCachedRequests = await cache.keys();
    const existingCacheKeys = new Set(alreadyCachedRequests.map(request => request.url));

    for (const [url, cacheKey] of this._urlsToCacheKeys) {
      if (existingCacheKeys.has(cacheKey)) {
        alreadyPrecached.push(url);
      } else {
        toBePrecached.push({
          cacheKey,
          url
        });
      }
    }

    const precacheRequests = toBePrecached.map(({
      cacheKey,
      url
    }) => {
      const integrity = this._cacheKeysToIntegrities.get(cacheKey);

      return this._addURLToCache({
        cacheKey,
        event,
        plugins,
        url,
        integrity
      });
    });
    await Promise.all(precacheRequests);
    const updatedURLs = toBePrecached.map(item => item.url);

    {
      printInstallDetails(updatedURLs, alreadyPrecached);
    }

    return {
      updatedURLs,
      notUpdatedURLs: alreadyPrecached
    };
  }
  /**
   * Deletes assets that are no longer present in the current precache manifest.
   * Call this method from the service worker activate event.
   *
   * @return {Promise<workbox.precaching.CleanupResult>}
   */


  async activate() {
    const cache = await caches.open(this._cacheName);
    const currentlyCachedRequests = await cache.keys();
    const expectedCacheKeys = new Set(this._urlsToCacheKeys.values());
    const deletedURLs = [];

    for (const request of currentlyCachedRequests) {
      if (!expectedCacheKeys.has(request.url)) {
        await cache.delete(request);
        deletedURLs.push(request.url);
      }
    }

    {
      printCleanupDetails(deletedURLs);
    }

    return {
      deletedURLs
    };
  }
  /**
   * Requests the entry and saves it to the cache if the response is valid.
   * By default, any response with a status code of less than 400 (including
   * opaque responses) is considered valid.
   *
   * If you need to use custom criteria to determine what's valid and what
   * isn't, then pass in an item in `options.plugins` that implements the
   * `cacheWillUpdate()` lifecycle event.
   *
   * @private
   * @param {Object} options
   * @param {string} options.cacheKey The string to use a cache key.
   * @param {string} options.url The URL to fetch and cache.
   * @param {Event} [options.event] The install event (if passed).
   * @param {Array<Object>} [options.plugins] An array of plugins to apply to
   * fetch and caching.
   * @param {string} [options.integrity] The value to use for the `integrity`
   * field when making the request.
   */


  async _addURLToCache({
    cacheKey,
    url,
    event,
    plugins,
    integrity
  }) {
    const request = new Request(url, {
      integrity,
      cache: 'reload',
      credentials: 'same-origin'
    });
    let response = await fetchWrapper.fetch({
      event,
      plugins,
      request
    }); // Allow developers to override the default logic about what is and isn't
    // valid by passing in a plugin implementing cacheWillUpdate(), e.g.
    // a workbox.cacheableResponse.CacheableResponsePlugin instance.

    let cacheWillUpdatePlugin;

    for (const plugin of plugins || []) {
      if ('cacheWillUpdate' in plugin) {
        cacheWillUpdatePlugin = plugin;
      }
    }

    const isValidResponse = cacheWillUpdatePlugin ? // Use a callback if provided. It returns a truthy value if valid.
    // NOTE: invoke the method on the plugin instance so the `this` context
    // is correct.
    cacheWillUpdatePlugin.cacheWillUpdate({
      event,
      request,
      response
    }) : // Otherwise, default to considering any response status under 400 valid.
    // This includes, by default, considering opaque responses valid.
    response.status < 400; // Consider this a failure, leading to the `install` handler failing, if
    // we get back an invalid response.

    if (!isValidResponse) {
      throw new WorkboxError('bad-precaching-response', {
        url,
        status: response.status
      });
    } // Redirected responses cannot be used to satisfy a navigation request, so
    // any redirected response must be "copied" rather than cloned, so the new
    // response doesn't contain the `redirected` flag. See:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=669363&desc=2#c1


    if (response.redirected) {
      response = await copyResponse(response);
    }

    await cacheWrapper.put({
      event,
      plugins,
      response,
      // `request` already uses `url`. We may be able to reuse it.
      request: cacheKey === url ? request : new Request(cacheKey),
      cacheName: this._cacheName,
      matchOptions: {
        ignoreSearch: true
      }
    });
  }
  /**
   * Returns a mapping of a precached URL to the corresponding cache key, taking
   * into account the revision information for the URL.
   *
   * @return {Map<string, string>} A URL to cache key mapping.
   */


  getURLsToCacheKeys() {
    return this._urlsToCacheKeys;
  }
  /**
   * Returns a list of all the URLs that have been precached by the current
   * service worker.
   *
   * @return {Array<string>} The precached URLs.
   */


  getCachedURLs() {
    return [...this._urlsToCacheKeys.keys()];
  }
  /**
   * Returns the cache key used for storing a given URL. If that URL is
   * unversioned, like `/index.html', then the cache key will be the original
   * URL with a search parameter appended to it.
   *
   * @param {string} url A URL whose cache key you want to look up.
   * @return {string} The versioned URL that corresponds to a cache key
   * for the original URL, or undefined if that URL isn't precached.
   */


  getCacheKeyForURL(url) {
    const urlObject = new URL(url, location.href);
    return this._urlsToCacheKeys.get(urlObject.href);
  }
  /**
   * Returns a function that looks up `url` in the precache (taking into
   * account revision information), and returns the corresponding `Response`.
   *
   * If for an unexpected reason there is a cache miss when looking up `url`,
   * this will fall back to retrieving the `Response` via `fetch()`.
   *
   * @param {string} url The precached URL which will be used to lookup the
   * `Response`.
   * @return {workbox.routing.Route~handlerCallback}
   */


  createHandlerForURL(url) {
    {
      finalAssertExports.isType(url, 'string', {
        moduleName: 'workbox-precaching',
        funcName: 'createHandlerForURL',
        paramName: 'url'
      });
    }

    const cacheKey = this.getCacheKeyForURL(url);

    if (!cacheKey) {
      throw new WorkboxError('non-precached-url', {
        url
      });
    }

    return async () => {
      try {
        const cache = await caches.open(this._cacheName);
        const response = await cache.match(cacheKey);

        if (response) {
          return response;
        } // This shouldn't normally happen, but there are edge cases:
        // https://github.com/GoogleChrome/workbox/issues/1441


        throw new Error(`The cache ${this._cacheName} did not have an entry ` + `for ${cacheKey}.`);
      } catch (error) {
        // If there's either a cache miss, or the caches.match() call threw
        // an exception, then attempt to fulfill the navigation request with
        // a response from the network rather than leaving the user with a
        // failed navigation.
        {
          logger.debug(`Unable to respond to navigation request with ` + `cached response. Falling back to network.`, error);
        } // This might still fail if the browser is offline...


        return fetch(cacheKey);
      }
    };
  }

}

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
let precacheController;
/**
 * @return {PrecacheController}
 * @private
 */

const getOrCreatePrecacheController = () => {
  if (!precacheController) {
    precacheController = new PrecacheController();
  }

  return precacheController;
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Removes any URL search parameters that should be ignored.
 *
 * @param {URL} urlObject The original URL.
 * @param {Array<RegExp>} ignoreURLParametersMatching RegExps to test against
 * each search parameter name. Matches mean that the search parameter should be
 * ignored.
 * @return {URL} The URL with any ignored search parameters removed.
 *
 * @private
 * @memberof module:workbox-precaching
 */

function removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching = []) {
  // Convert the iterable into an array at the start of the loop to make sure
  // deletion doesn't mess up iteration.
  for (const paramName of [...urlObject.searchParams.keys()]) {
    if (ignoreURLParametersMatching.some(regExp => regExp.test(paramName))) {
      urlObject.searchParams.delete(paramName);
    }
  }

  return urlObject;
}

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Generator function that yields possible variations on the original URL to
 * check, one at a time.
 *
 * @param {string} url
 * @param {Object} options
 *
 * @private
 * @memberof module:workbox-precaching
 */

function* generateURLVariations(url, {
  ignoreURLParametersMatching,
  directoryIndex,
  cleanURLs,
  urlManipulation
} = {}) {
  const urlObject = new URL(url, location.href);
  urlObject.hash = '';
  yield urlObject.href;
  const urlWithoutIgnoredParams = removeIgnoredSearchParams(urlObject, ignoreURLParametersMatching);
  yield urlWithoutIgnoredParams.href;

  if (directoryIndex && urlWithoutIgnoredParams.pathname.endsWith('/')) {
    const directoryURL = new URL(urlWithoutIgnoredParams.href);
    directoryURL.pathname += directoryIndex;
    yield directoryURL.href;
  }

  if (cleanURLs) {
    const cleanURL = new URL(urlWithoutIgnoredParams.href);
    cleanURL.pathname += '.html';
    yield cleanURL.href;
  }

  if (urlManipulation) {
    const additionalURLs = urlManipulation({
      url: urlObject
    });

    for (const urlToAttempt of additionalURLs) {
      yield urlToAttempt.href;
    }
  }
}

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * This function will take the request URL and manipulate it based on the
 * configuration options.
 *
 * @param {string} url
 * @param {Object} options
 * @return {string} Returns the URL in the cache that matches the request,
 * if possible.
 *
 * @private
 */

const getCacheKeyForURL = (url, options) => {
  const precacheController = getOrCreatePrecacheController();
  const urlsToCacheKeys = precacheController.getURLsToCacheKeys();

  for (const possibleURL of generateURLVariations(url, options)) {
    const possibleCacheKey = urlsToCacheKeys.get(possibleURL);

    if (possibleCacheKey) {
      return possibleCacheKey;
    }
  }
};

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Adds a `fetch` listener to the service worker that will
 * respond to
 * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
 * with precached assets.
 *
 * Requests for assets that aren't precached, the `FetchEvent` will not be
 * responded to, allowing the event to fall through to other `fetch` event
 * listeners.
 *
 * NOTE: when called more than once this method will replace the previously set
 * configuration options. Calling it more than once is not recommended outside
 * of tests.
 *
 * @private
 * @param {Object} [options]
 * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
 * check cache entries for a URLs ending with '/' to see if there is a hit when
 * appending the `directoryIndex` value.
 * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/]] An
 * array of regex's to remove search params when looking for a cache match.
 * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
 * check the cache for the URL with a `.html` added to the end of the end.
 * @param {workbox.precaching~urlManipulation} [options.urlManipulation]
 * This is a function that should take a URL and return an array of
 * alternative URLs that should be checked for precache matches.
 */

const addFetchListener = ({
  ignoreURLParametersMatching = [/^utm_/],
  directoryIndex = 'index.html',
  cleanURLs = true,
  urlManipulation
} = {}) => {
  const cacheName = cacheNames.getPrecacheName();
  addEventListener('fetch', event => {
    const precachedURL = getCacheKeyForURL(event.request.url, {
      cleanURLs,
      directoryIndex,
      ignoreURLParametersMatching,
      urlManipulation
    });

    if (!precachedURL) {
      {
        logger.debug(`Precaching did not find a match for ` + getFriendlyURL(event.request.url));
      }

      return;
    }

    let responsePromise = caches.open(cacheName).then(cache => {
      return cache.match(precachedURL);
    }).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      } // Fall back to the network if we don't have a cached response
      // (perhaps due to manual cache cleanup).


      {
        logger.warn(`The precached response for ` + `${getFriendlyURL(precachedURL)} in ${cacheName} was not found. ` + `Falling back to the network instead.`);
      }

      return fetch(precachedURL);
    });

    {
      responsePromise = responsePromise.then(response => {
        // Workbox is going to handle the route.
        // print the routing details to the console.
        logger.groupCollapsed(`Precaching is responding to: ` + getFriendlyURL(event.request.url));
        logger.log(`Serving the precached url: ${precachedURL}`);
        logger.groupCollapsed(`View request details here.`);
        logger.log(event.request);
        logger.groupEnd();
        logger.groupCollapsed(`View response details here.`);
        logger.log(response);
        logger.groupEnd();
        logger.groupEnd();
        return response;
      });
    }

    event.respondWith(responsePromise);
  });
};

/*
  Copyright 2019 Google LLC
  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
let listenerAdded = false;
/**
 * Add a `fetch` listener to the service worker that will
 * respond to
 * [network requests]{@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers#Custom_responses_to_requests}
 * with precached assets.
 *
 * Requests for assets that aren't precached, the `FetchEvent` will not be
 * responded to, allowing the event to fall through to other `fetch` event
 * listeners.
 *
 * @param {Object} [options]
 * @param {string} [options.directoryIndex=index.html] The `directoryIndex` will
 * check cache entries for a URLs ending with '/' to see if there is a hit when
 * appending the `directoryIndex` value.
 * @param {Array<RegExp>} [options.ignoreURLParametersMatching=[/^utm_/]] An
 * array of regex's to remove search params when looking for a cache match.
 * @param {boolean} [options.cleanURLs=true] The `cleanURLs` option will
 * check the cache for the URL with a `.html` added to the end of the end.
 * @param {workbox.precaching~urlManipulation} [options.urlManipulation]
 * This is a function that should take a URL and return an array of
 * alternative URLs that should be checked for precache matches.
 *
 * @alias workbox.precaching.addRoute
 */

const addRoute = options => {
  if (!listenerAdded) {
    addFetchListener(options);
    listenerAdded = true;
  }
};

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
const plugins = [];
const precachePlugins = {
  /*
   * @return {Array}
   * @private
   */
  get() {
    return plugins;
  },

  /*
   * @param {Array} newPlugins
   * @private
   */
  add(newPlugins) {
    plugins.push(...newPlugins);
  }

};

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/

const installListener = event => {
  const precacheController = getOrCreatePrecacheController();
  const plugins = precachePlugins.get();
  debugger;
  let X = precacheController.install({
    event,
    plugins
  });

  event.waitUntil(X.catch(error => {
    {
      console.log("SW Error from hell is:", error);
      debugger;
      logger.error(`Service worker installation failed. It will ` + `be retried automatically during the next navigation.`);
    } // Re-throw the error to ensure installation fails.


    throw error;
  }));
};

const activateListener = event => {
  const precacheController = getOrCreatePrecacheController();
  event.waitUntil(precacheController.activate());
};
/**
 * Adds items to the precache list, removing any duplicates and
 * stores the files in the
 * ["precache cache"]{@link module:workbox-core.cacheNames} when the service
 * worker installs.
 *
 * This method can be called multiple times.
 *
 * Please note: This method **will not** serve any of the cached files for you.
 * It only precaches files. To respond to a network request you call
 * [addRoute()]{@link module:workbox-precaching.addRoute}.
 *
 * If you have a single array of files to precache, you can just call
 * [precacheAndRoute()]{@link module:workbox-precaching.precacheAndRoute}.
 *
 * @param {Array<Object|string>} [entries=[]] Array of entries to precache.
 *
 * @alias workbox.precaching.precache
 */


const precache = entries => {
  const precacheController = getOrCreatePrecacheController();
  precacheController.addToCacheList(entries);

  if (entries.length > 0) {
    // NOTE: these listeners will only be added once (even if the `precache()`
    // method is called multiple times) because event listeners are implemented
    // as a set, where each listener must be unique.
    addEventListener('install', installListener);
    addEventListener('activate', activateListener);
  }
};

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * This method will add entries to the precache list and add a route to
 * respond to fetch events.
 *
 * This is a convenience method that will call
 * [precache()]{@link module:workbox-precaching.precache} and
 * [addRoute()]{@link module:workbox-precaching.addRoute} in a single call.
 *
 * @param {Array<Object|string>} entries Array of entries to precache.
 * @param {Object} [options] See
 * [addRoute() options]{@link module:workbox-precaching.addRoute}.
 *
 * @alias workbox.precaching.precacheAndRoute
 */

const precacheAndRoute = (entries, options) => {
  precache(entries);
  addRoute(options);
};

/*
  Copyright 2018 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * NavigationRoute makes it easy to create a [Route]{@link
 * workbox.routing.Route} that matches for browser
 * [navigation requests]{@link https://developers.google.com/web/fundamentals/primers/service-workers/high-performance-loading#first_what_are_navigation_requests}.
 *
 * It will only match incoming Requests whose
 * [`mode`]{@link https://fetch.spec.whatwg.org/#concept-request-mode}
 * is set to `navigate`.
 *
 * You can optionally only apply this route to a subset of navigation requests
 * by using one or both of the `blacklist` and `whitelist` parameters.
 *
 * @memberof workbox.routing
 * @extends workbox.routing.Route
 */

class NavigationRoute extends Route {
  /**
   * If both `blacklist` and `whiltelist` are provided, the `blacklist` will
   * take precedence and the request will not match this route.
   *
   * The regular expressions in `whitelist` and `blacklist`
   * are matched against the concatenated
   * [`pathname`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/pathname}
   * and [`search`]{@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/search}
   * portions of the requested URL.
   *
   * @param {workbox.routing.Route~handlerCallback} handler A callback
   * function that returns a Promise resulting in a Response.
   * @param {Object} options
   * @param {Array<RegExp>} [options.blacklist] If any of these patterns match,
   * the route will not handle the request (even if a whitelist RegExp matches).
   * @param {Array<RegExp>} [options.whitelist=[/./]] If any of these patterns
   * match the URL's pathname and search parameter, the route will handle the
   * request (assuming the blacklist doesn't match).
   */
  constructor(handler, {
    whitelist = [/./],
    blacklist = []
  } = {}) {
    {
      finalAssertExports.isArrayOfClass(whitelist, RegExp, {
        moduleName: 'workbox-routing',
        className: 'NavigationRoute',
        funcName: 'constructor',
        paramName: 'options.whitelist'
      });
      finalAssertExports.isArrayOfClass(blacklist, RegExp, {
        moduleName: 'workbox-routing',
        className: 'NavigationRoute',
        funcName: 'constructor',
        paramName: 'options.blacklist'
      });
    }

    super(options => this._match(options), handler);
    this._whitelist = whitelist;
    this._blacklist = blacklist;
  }
  /**
   * Routes match handler.
   *
   * @param {Object} options
   * @param {URL} options.url
   * @param {Request} options.request
   * @return {boolean}
   *
   * @private
   */


  _match({
    url,
    request
  }) {
    if (request && request.mode !== 'navigate') {
      return false;
    }

    const pathnameAndSearch = url.pathname + url.search;

    for (const regExp of this._blacklist) {
      if (regExp.test(pathnameAndSearch)) {
        {
          logger.log(`The navigation route ${pathnameAndSearch} is not ` + `being used, since the URL matches this blacklist pattern: ` + `${regExp}`);
        }

        return false;
      }
    }

    if (this._whitelist.some(regExp => regExp.test(pathnameAndSearch))) {
      {
        logger.debug(`The navigation route ${pathnameAndSearch} ` + `is being used.`);
      }

      return true;
    }

    {
      logger.log(`The navigation route ${pathnameAndSearch} is not ` + `being used, since the URL being navigated to doesn't ` + `match the whitelist.`);
    }

    return false;
  }

}

/*
  Copyright 2019 Google LLC

  Use of this source code is governed by an MIT-style
  license that can be found in the LICENSE file or at
  https://opensource.org/licenses/MIT.
*/
/**
 * Helper function that calls
 * {@link PrecacheController#createHandlerForURL} on the default
 * {@link PrecacheController} instance.
 *
 * If you are creating your own {@link PrecacheController}, then call the
 * {@link PrecacheController#createHandlerForURL} on that instance,
 * instead of using this function.
 *
 * @param {string} url The precached URL which will be used to lookup the
 * `Response`.
 * @return {workbox.routing.Route~handlerCallback}
 *
 * @alias workbox.precaching.createHandlerForURL
 */

const createHandlerForURL = url => {
  const precacheController = getOrCreatePrecacheController();
  return precacheController.createHandlerForURL(url);
};

/**
* Welcome to your Workbox-powered service worker!
*
* You'll need to register this file in your web app.
* See https://goo.gl/nhQhGp
*
* The rest of the code is auto-generated. Please don't update this file
* directly; instead, make changes to your Workbox build configuration
* and re-run your build process.
* See https://goo.gl/2aRDsh
*/

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
/**
 * The precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */

precacheAndRoute([{
  "url": "/react/dist/0950f9f61f5a493c0f5d8e3df26cfbf2.woff2",
  "revision": "0950f9f61f5a493c0f5d8e3df26cfbf2"
}, {
  "url": "/react/dist/0ea9a391ff82aa917f003c3ae87bc03e.woff2",
  "revision": "0ea9a391ff82aa917f003c3ae87bc03e"
}, {
  "url": "/react/dist/17-1831f06aaa70a7ccd7d5.css",
  "revision": "863216d26665c836ddfddd790fcd166c"
}, {
  "url": "/react/dist/17-chunk-61b8430c82a96cd7bd07.js",
  "revision": "0f37eb7e689916b10ab138ef7ee571f4"
}, {
  "url": "/react/dist/18-1831f06aaa70a7ccd7d5.css",
  "revision": "863216d26665c836ddfddd790fcd166c"
}, {
  "url": "/react/dist/18-chunk-86bef2738ffd715b8fb8.js",
  "revision": "b62f3aedb7deb98f278d28f38e7f96a7"
}, {
  "url": "/react/dist/548f2ded83a195a98ac3651bdf9a6f2e.woff2",
  "revision": "548f2ded83a195a98ac3651bdf9a6f2e"
}, {
  "url": "/react/dist/6897be186b147b75c308c29eb0782f14.woff2",
  "revision": "6897be186b147b75c308c29eb0782f14"
}, {
  "url": "/react/dist/admin-modules-chunk-79173b63b3b4adaf2fa5.js",
  "revision": "092e1b7a09d3d6d4d2fab48274baeaee"
}, {
  "url": "/react/dist/admin-modules-eb9ce6c551a2c97e3e0b.css",
  "revision": "2ab86bf8c19d180ac25170b0d2a0d80a"
}, {
  "url": "/react/dist/basic-view-list-8e8eff49a5dde83c3b65.css",
  "revision": "b1e643e9080fe0e5f13fec7fe0d12006"
}, {
  "url": "/react/dist/basic-view-list-chunk-a8fa862d31c8a1977045.js",
  "revision": "3b982400a4b84bc490bd1c5c1de6ac95"
}, {
  "url": "/react/dist/basic-view-list~manual-book-entry-modal-chunk-23fb3aabfd43b44d2d62.js",
  "revision": "f9f4de2c34893b8307784eca195a16b0"
}, {
  "url": "/react/dist/basic-view-list~manual-book-entry-modal-d0139b6cee174bb4aa0c.css",
  "revision": "c2cf9b5caf51920acb656c59c6a0f5b8"
}, {
  "url": "/react/dist/book-list-modals-chunk-6461255a9565bcfd6723.js",
  "revision": "70fce23694a032453f288a2cd8040dbc"
}, {
  "url": "/react/dist/book-list-modals-ef56108feebe17b7af5b.css",
  "revision": "d72de7bcd22fb2e99105d46aa5fadbf5"
}, {
  "url": "/react/dist/book-list-modals~subject-module-406e131ae3e864ec19b6.css",
  "revision": "95c143341a47594906945684c01399ad"
}, {
  "url": "/react/dist/book-list-modals~subject-module-chunk-5e3aa1222512fb22a78b.js",
  "revision": "dc96cf328cf1d5bc5ff54adaa2b84f06"
}, {
  "url": "/react/dist/books-module-chunk-84388f4210b1c40f4a45.js",
  "revision": "81227cb35b1e48cf2096c01d203906f3"
}, {
  "url": "/react/dist/books-module-d38596eaaa9cec7c8343.css",
  "revision": "0e4e94c2c7a0b42d9ae29b7f010c1561"
}, {
  "url": "/react/dist/home-module-9b965c448ad0c8ae00dd.css",
  "revision": "80c09e3d26922943d1f54b1a6cf40cfe"
}, {
  "url": "/react/dist/home-module-chunk-c76e781d54cb19f07b3a.js",
  "revision": "e034256b5c4b32b0a19b81392a36e291"
}, {
  "url": "/react/dist/index.html",
  "revision": "cb183d40f434cbb34611b75b6f39790b"
}, {
  "url": "/react/dist/main-70aa8dcf9eca1c3a3224.css",
  "revision": "231b40754a2931f4c70c6545451c56e5"
}, {
  "url": "/react/dist/main-bundle-a3115c9843cd29807399.js",
  "revision": "3f65b6a6cac70a4093a969d038d3b3c1"
}, {
  "url": "/react/dist/manual-book-entry-modal-chunk-c95d82c88782bf7b9a6e.js",
  "revision": "b1b8b2755e124772d8848cef4e9955c8"
}, {
  "url": "/react/dist/scan-module-chunk-cb948bd5254bfe641d54.js",
  "revision": "4f4b3adbc0a8eaf36c964228f8391332"
}, {
  "url": "/react/dist/small-modules-chunk-9217b004755a3a47cf1f.js",
  "revision": "c88d452d0bfe1606cf3a3564195712b9"
}, {
  "url": "/react/dist/small-modules-fd5515d24637df088662.css",
  "revision": "cbd96f091bb84c082d62a3b46544687a"
}, {
  "url": "/react/dist/subject-module-1ac6ef3f15c88493c26d.css",
  "revision": "586a8ec337bb35c98b616cc880eef520"
}, {
  "url": "/react/dist/subject-module-chunk-55799369b83310508521.js",
  "revision": "304b56a57817411e3261301d7dd744ce"
}, {
  "url": "/react/dist/vendors~basic-view-list~book-list-modals~home-module~manual-book-entry-modal-chunk-b3ba05aba7677f36d57d.js",
  "revision": "e16f4a120b55ce431244c7285cc3e26b"
}, {
  "url": "/react/dist/vendors~book-list-modals~home-module-chunk-02edef54b21eb953193c.js",
  "revision": "788c4379e5946f6adb83f582cd2ef917"
}, {
  "url": "/react/dist/vendors~home-module-chunk-9cc54ef2cd052aaf8a1c.js",
  "revision": "b9b16d6fce5c5a4df962ac1c05123c63"
}, {
  "url": "/react/dist/vendors~home-module~scan-module-chunk-3e5c503ea0a9bd44cd31.js",
  "revision": "40459b1f22a85c644041dbd55267af15"
}, {
  "url": "/react/dist/vendors~subject-module-chunk-1d50c5bacd21b57cc8ac.js",
  "revision": "827b4660bff737eb95914684f2bb0338"
}], {
  "ignoreURLParametersMatching": [/./]
});
registerRoute(new NavigationRoute(createHandlerForURL("react/dist/index.html"), {
  blacklist: [/\/activate\b/]
}));
registerRoute(/^https:\/\/mylibrary\.io\/graphql\?.+cache%22:1/, new CacheFirst({
  "cacheName": "short-cache",
  "matchOptions": {
    "ignoreVary": true
  },
  plugins: [new ExpirationPlugin({
    maxEntries: 500,
    maxAgeSeconds: 300,
    purgeOnQuotaError: true
  }), new CacheableResponsePlugin({
    statuses: [0, 200]
  })]
}), 'GET');
registerRoute(/^https:\/\/mylibrary\.io\/graphql\?.+cache%22:5/, new CacheFirst({
  "cacheName": "medium-cache",
  "matchOptions": {
    "ignoreVary": true
  },
  plugins: [new ExpirationPlugin({
    maxEntries: 500,
    maxAgeSeconds: 86400,
    purgeOnQuotaError: true
  }), new CacheableResponsePlugin({
    statuses: [0, 200]
  })]
}), 'GET');
registerRoute(/^https:\/\/mylibrary\.io\/graphql\?.+cache%22:9/, new CacheFirst({
  "cacheName": "max-cache",
  "matchOptions": {
    "ignoreVary": true
  },
  plugins: [new ExpirationPlugin({
    maxEntries: 500,
    maxAgeSeconds: 63072000,
    purgeOnQuotaError: true
  }), new CacheableResponsePlugin({
    statuses: [0, 200]
  })]
}), 'GET');
registerRoute(/^https:\/\/s3.amazonaws.com\/my-library-cover-uploads/, new CacheFirst({
  "cacheName": "local-images1",
  "matchOptions": {
    "ignoreVary": true
  },
  plugins: [new ExpirationPlugin({
    maxEntries: 500,
    maxAgeSeconds: 63072000,
    purgeOnQuotaError: true
  }), new CacheableResponsePlugin({
    statuses: [0, 200]
  })]
}), 'GET');
registerRoute(/^https:\/\/my-library-cover-uploads.s3.amazonaws.com/, new CacheFirst({
  "cacheName": "local-images2",
  "matchOptions": {
    "ignoreVary": true
  },
  plugins: [new ExpirationPlugin({
    maxEntries: 500,
    maxAgeSeconds: 63072000,
    purgeOnQuotaError: true
  }), new CacheableResponsePlugin({
    statuses: [0, 200]
  })]
}), 'GET');
