/**
 * @module api
 * @description API client for the fence estimator backend with JWT auth, retries,
 * request state tracking, caching, and normalized error handling.
 */
(function apiModule(global) {
    'use strict';

    // Configuration and shared state
    var DEFAULT_BASE_URL = "/api";
    var DEFAULT_TIMEOUT = 15000;
    var MAX_RETRIES = 3;
    var RETRY_STATUSES = {
        408: true,
        425: true,
        429: true,
        500: true,
        502: true,
        503: true,
        504: true,
    };
    var METHODS_WITH_BODY = { POST: true, PUT: true, PATCH: true };
    var CACHEABLE_METHODS = { GET: true };
    var ENDPOINTS = {
        projects: "/projects",
        estimates: "/estimates",
        contracts: "/contracts",
        inventory: "/inventory",
        products: "/inventory/search",
        pdf: "/documents/pdf",
        email: "/notifications/email"
    };

    var state = {
        baseUrl: DEFAULT_BASE_URL,
        token: null,
        timeout: DEFAULT_TIMEOUT,
        retryCount: MAX_RETRIES,
        defaultHeaders: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        loadingCount: 0,
        loadingSubscribers: [],
        cache: {},
        pendingRequests: {},
        lastError: null
    };
    function ApiError(message, details) {
        this.name = "ApiError";
        this.message = message || "API request failed";
        this.status = details && details.status ? details.status : 0;
        this.code = details && details.code ? details.code : "API_ERROR";
        this.payload = details && details.payload ? details.payload : null;
        this.requestId = details && details.requestId ? details.requestId : null;
        this.url = details && details.url ? details.url : "";
        this.method = details && details.method ? details.method : "GET";
        this.retriable = Boolean(details && details.retriable);
        this.timestamp = new Date().toISOString();
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApiError);
        } else {
            this.stack = new Error(this.message).stack;
        }
    }
    ApiError.prototype = Object.create(Error.prototype);
    ApiError.prototype.constructor = ApiError;
    function isPlainObject(value) {
        if (!value || Object.prototype.toString.call(value) !== "[object Object]") {
            return false;
        }
        var prototype = Object.getPrototypeOf(value);
        return prototype === Object.prototype || prototype === null;
    }
    function clone(value) {
        if (Array.isArray(value)) {
            return value.map(clone);
        }
        if (isPlainObject(value)) {
            return Object.keys(value).reduce(function reducer(result, key) {
                result[key] = clone(value[key]);
                return result;
            }, {});
        }
        return value;
    }
    function mergeObjects(target, source) {
        var output = clone(target || {});
        Object.keys(source || {}).forEach(function eachKey(key) {
            var existing = output[key];
            var incoming = source[key];
            if (isPlainObject(existing) && isPlainObject(incoming)) {
                output[key] = mergeObjects(existing, incoming);
            } else {
                output[key] = clone(incoming);
            }
        });
        return output;
    }
    function toQueryValue(value) {
        if (value === null || typeof value === "undefined") {
            return "";
        }
        if (value instanceof Date) {
            return value.toISOString();
        }
        if (Array.isArray(value)) {
            return value.join(",");
        }
        return String(value);
    }
    function buildQueryString(params) {
        if (!params || typeof params !== "object") {
            return "";
        }
        var keys = Object.keys(params).filter(function filterKey(key) {
            return typeof params[key] !== "undefined" && params[key] !== null && params[key] !== "";
        });
        if (!keys.length) {
            return "";
        }
        return "?" + keys.map(function mapKey(key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(toQueryValue(params[key]));
        }).join("&");
    }
    function buildUrl(path, query) {
        var normalizedBase = state.baseUrl.replace(/\/$/, "");
        var normalizedPath = String(path || "").replace(/^\//, "");
        return normalizedBase + "/" + normalizedPath + buildQueryString(query);
    }
    function delay(ms) {
        return new Promise(function executor(resolve) {
            global.setTimeout(resolve, ms);
        });
    }

    function getBackoffDelay(attempt) {
        var jitter = Math.floor(Math.random() * 120);
        return Math.min(250 * Math.pow(2, attempt), 2000) + jitter;
    }

    function incrementLoading() {
        state.loadingCount += 1;
        notifyLoadingSubscribers();
    }

    function decrementLoading() {
        state.loadingCount = Math.max(0, state.loadingCount - 1);
        notifyLoadingSubscribers();
    }

    function notifyLoadingSubscribers() {
        state.loadingSubscribers.slice().forEach(function notify(subscriber) {
            try {
                subscriber({
                    isLoading: state.loadingCount > 0,
                    loadingCount: state.loadingCount
                });
            } catch (subscriberError) {
                console.error("Loading subscriber failed", subscriberError);
            }
        });
    }

    function getStorageToken() {
        try {
            if (global.localStorage) {
                return global.localStorage.getItem("fenceEstimator.jwt");
            }
        } catch (error) {
            console.warn("Unable to read JWT token from localStorage", error);
        }
        return null;
    }

    function persistToken(token) {
        try {
            if (!global.localStorage) {
                return;
            }
            if (token) {
                global.localStorage.setItem("fenceEstimator.jwt", token);
            } else {
                global.localStorage.removeItem("fenceEstimator.jwt");
            }
        } catch (error) {
            console.warn("Unable to persist JWT token", error);
        }
    }

    function getToken() {
        if (state.token) {
            return state.token;
        }
        state.token = getStorageToken();
        return state.token;
    }

    function setToken(token) {
        state.token = token || null;
        persistToken(state.token);
        return state.token;
    }

    function clearToken() {
        state.token = null;
        persistToken(null);
    }

    function buildHeaders(headers, includeAuth) {
        var merged = mergeObjects(state.defaultHeaders, headers || {});
        if (includeAuth !== false) {
            var token = getToken();
            if (token) {
                merged.Authorization = "Bearer " + token;
            }
        }
        return merged;
    }

    function createRequestKey(method, url, body) {
        return [method, url, body ? JSON.stringify(body) : ""].join("::");
    }

    function createAbortSignal(timeout, externalSignal) {
        var controller = new AbortController();
        var timerId = global.setTimeout(function onTimeout() {
            controller.abort(new Error("Request timeout"));
        }, timeout);
        if (externalSignal) {
            if (externalSignal.aborted) {
                controller.abort(externalSignal.reason || new Error("Request aborted"));
            } else {
                externalSignal.addEventListener("abort", function onAbort() {
                    controller.abort(externalSignal.reason || new Error("Request aborted"));
                }, { once: true });
            }
        }
        return {
            signal: controller.signal,
            cleanup: function cleanup() {
                global.clearTimeout(timerId);
            }
        };
    }

    function parseJsonSafely(response) {
        return response.text().then(function onText(text) {
            if (!text) {
                return null;
            }
            try {
                return JSON.parse(text);
            } catch (error) {
                return { raw: text };
            }
        });
    }

    function normalizeApiError(error, context) {
        if (error instanceof ApiError) {
            state.lastError = error;
            return error;
        }
        var message = error && error.message ? error.message : "Unknown API error";
        var normalized = new ApiError(message, {
            status: context && context.status ? context.status : 0,
            code: context && context.code ? context.code : "NETWORK_ERROR",
            payload: context && context.payload ? context.payload : null,
            url: context && context.url ? context.url : "",
            method: context && context.method ? context.method : "GET",
            retriable: context && typeof context.retriable !== "undefined" ? context.retriable : true
        });
        state.lastError = normalized;
        return normalized;
    }

    function shouldRetry(error, attempt, limit) {
        if (attempt >= limit) {
            return false;
        }
        if (error && error.name === "AbortError") {
            return false;
        }
        if (error instanceof ApiError) {
            return Boolean(error.retriable);
        }
        return true;
    }

    function cacheResponse(key, payload) {
        state.cache[key] = {
            payload: clone(payload),
            timestamp: Date.now()
        };
        return payload;
    }

    function getCachedResponse(key, ttl) {
        var entry = state.cache[key];
        if (!entry) {
            return null;
        }
        if (ttl && Date.now() - entry.timestamp > ttl) {
            delete state.cache[key];
            return null;
        }
        return clone(entry.payload);
    }

    function invalidateCache(prefix) {
        Object.keys(state.cache).forEach(function clearEntry(key) {
            if (!prefix || key.indexOf(prefix) === 0) {
                delete state.cache[key];
            }
        });
    }

    function normalizeListPayload(payload, key) {
        if (Array.isArray(payload)) {
            return payload;
        }
        if (payload && Array.isArray(payload[key])) {
            return payload[key];
        }
        return [];
    }

    function sanitizeBody(body) {
        if (!body) {
            return null;
        }
        return JSON.parse(JSON.stringify(body));
    }

    function ensureIdentifier(value, label) {
        if (!value && value !== 0) {
            throw new ApiError(label + " is required", { code: "VALIDATION_ERROR", retriable: false });
        }
        return value;
    }

    function parseResponse(response, context) {
        return parseJsonSafely(response).then(function onPayload(payload) {
            if (response.ok) {
                return payload;
            }
            var errorMessage = payload && (payload.message || payload.error) ? (payload.message || payload.error) : response.statusText;
            throw new ApiError(errorMessage || "Request failed", {
                status: response.status,
                code: payload && payload.code ? payload.code : "HTTP_ERROR",
                payload: payload,
                requestId: response.headers.get("x-request-id"),
                url: context.url,
                method: context.method,
                retriable: Boolean(RETRY_STATUSES[response.status])
            });
        });
    }

    function request(path, options) {
        var opts = mergeObjects({
            method: "GET",
            query: null,
            body: null,
            headers: null,
            timeout: state.timeout,
            retries: state.retryCount,
            cacheTtl: 0,
            includeAuth: true,
            signal: null
        }, options || {});
        var method = String(opts.method || "GET").toUpperCase();
        var url = buildUrl(path, opts.query);
        var requestKey = createRequestKey(method, url, opts.body);
        var cached = CACHEABLE_METHODS[method] ? getCachedResponse(requestKey, opts.cacheTtl) : null;
        if (cached) {
            return Promise.resolve(cached);
        }
        if (state.pendingRequests[requestKey]) {
            return state.pendingRequests[requestKey];
        }
        incrementLoading();
        var control = createAbortSignal(opts.timeout, opts.signal);
        var fetchOptions = {
            method: method,
            headers: buildHeaders(opts.headers, opts.includeAuth),
            signal: control.signal,
            credentials: "same-origin"
        };
        if (METHODS_WITH_BODY[method] && opts.body !== null) {
            fetchOptions.body = JSON.stringify(sanitizeBody(opts.body));
        }
        var attemptRequest = function attemptRequest(attempt) {
            return global.fetch(url, fetchOptions)
                .then(function onResponse(response) {
                    return parseResponse(response, { url: url, method: method });
                })
                .catch(function onError(error) {
                    var normalized = normalizeApiError(error, {
                        url: url,
                        method: method,
                        retriable: !error.status || Boolean(RETRY_STATUSES[error.status])
                    });
                    if (!shouldRetry(normalized, attempt, opts.retries)) {
                        throw normalized;
                    }
                    return delay(getBackoffDelay(attempt)).then(function retryAfterDelay() {
                        return attemptRequest(attempt + 1);
                    });
                });
        };
        state.pendingRequests[requestKey] = attemptRequest(0)
            .then(function onSuccess(payload) {
                if (CACHEABLE_METHODS[method] && opts.cacheTtl) {
                    cacheResponse(requestKey, payload);
                }
                return payload;
            })
            .finally(function onFinally() {
                control.cleanup();
                delete state.pendingRequests[requestKey];
                decrementLoading();
            });
        return state.pendingRequests[requestKey];
    }

    // Resource-specific operations
    /**
     * Return a list of projects.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function fetchProjects(filters) {
        return request(ENDPOINTS.projects, { query: filters || null, cacheTtl: 15000 })
            .then(function onFetchProjectsSuccess(payload) {
                return normalizeListPayload(payload, "projects");
            });
    }

    /**
     * Create a new project.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function createProject(project) {
        if (!project) {
            return Promise.reject(new ApiError("Project payload is required", { code: "VALIDATION_ERROR", retriable: false }));
        }
        return request(ENDPOINTS.projects, { method: "POST", body: project })
            .then(function onMutationSuccess(payload) {
                invalidateCache("GET::/api/projects");
                return payload;
            });
    }

    /**
     * Update an existing project.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function updateProject(projectId, project) {
        return request(ENDPOINTS.projects + "/" + encodeURIComponent(ensureIdentifier(projectId, "Project ID")), { method: "PUT", body: project })
            .then(function onMutationSuccess(payload) {
                invalidateCache("GET::/api/projects");
                return payload;
            });
    }

    /**
     * Delete a project.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function deleteProject(projectId) {
        return request(ENDPOINTS.projects + "/" + encodeURIComponent(ensureIdentifier(projectId, "Project ID")), { method: "DELETE" })
            .then(function onMutationSuccess(payload) {
                invalidateCache("GET::/api/projects");
                return payload;
            });
    }

    /**
     * Return a list of estimates.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function fetchEstimates(filters) {
        return request(ENDPOINTS.estimates, { query: filters || null, cacheTtl: 15000 })
            .then(function onFetchEstimatesSuccess(payload) {
                return normalizeListPayload(payload, "estimates");
            });
    }

    /**
     * Create a new estimate.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function createEstimate(estimate) {
        if (!estimate) {
            return Promise.reject(new ApiError("Estimate payload is required", { code: "VALIDATION_ERROR", retriable: false }));
        }
        return request(ENDPOINTS.estimates, { method: "POST", body: estimate })
            .then(function onMutationSuccess(payload) {
                invalidateCache("GET::/api/estimates");
                return payload;
            });
    }

    /**
     * Update an estimate.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function updateEstimate(estimateId, estimate) {
        return request(ENDPOINTS.estimates + "/" + encodeURIComponent(ensureIdentifier(estimateId, "Estimate ID")), { method: "PUT", body: estimate })
            .then(function onMutationSuccess(payload) {
                invalidateCache("GET::/api/estimates");
                return payload;
            });
    }

    /**
     * Delete an estimate.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function deleteEstimate(estimateId) {
        return request(ENDPOINTS.estimates + "/" + encodeURIComponent(ensureIdentifier(estimateId, "Estimate ID")), { method: "DELETE" })
            .then(function onMutationSuccess(payload) {
                invalidateCache("GET::/api/estimates");
                return payload;
            });
    }

    /**
     * Return a list of contracts.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function fetchContracts(filters) {
        return request(ENDPOINTS.contracts, { query: filters || null, cacheTtl: 15000 })
            .then(function onFetchContractsSuccess(payload) {
                return normalizeListPayload(payload, "contracts");
            });
    }

    /**
     * Create a new contract.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function createContract(contract) {
        if (!contract) {
            return Promise.reject(new ApiError("Contract payload is required", { code: "VALIDATION_ERROR", retriable: false }));
        }
        return request(ENDPOINTS.contracts, { method: "POST", body: contract })
            .then(function onMutationSuccess(payload) {
                invalidateCache("GET::/api/contracts");
                return payload;
            });
    }

    /**
     * Generate a PDF document from estimate data.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function generatePDF(payload) {
        if (!payload || !isPlainObject(payload)) {
            return Promise.reject(new ApiError("A request payload object is required", { code: "VALIDATION_ERROR", retriable: false }));
        }
        return request(ENDPOINTS.pdf, { method: "POST", body: payload, headers: { Accept: "application/pdf, application/json" } })
            .then(function onMutationSuccess(payload) {
                return payload;
            });
    }

    /**
     * Send an email with estimate or contract details.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function sendEmail(payload) {
        if (!payload || !isPlainObject(payload)) {
            return Promise.reject(new ApiError("A request payload object is required", { code: "VALIDATION_ERROR", retriable: false }));
        }
        return request(ENDPOINTS.email, { method: "POST", body: payload })
            .then(function onMutationSuccess(payload) {
                return payload;
            });
    }

    /**
     * Fetch inventory levels and stock data.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function fetchInventory(filters) {
        return request(ENDPOINTS.inventory, { query: filters || null, cacheTtl: 60000 })
            .then(function onFetchInventorySuccess(payload) {
                return normalizeListPayload(payload, "inventory");
            });
    }

    /**
     * Search inventory products.
     * @returns {Promise<*>} A promise that resolves with the API payload.
     */
    function searchProducts(query, options) {
        if (!query || !String(query).trim()) {
            return Promise.resolve([]);
        }
        return request(ENDPOINTS.products, { query: { q: query, limit: options && options.limit ? options.limit : 25, type: options && options.type ? options.type : "" }, cacheTtl: 30000 })
            .then(function onSearchProductsSuccess(payload) {
                return normalizeListPayload(payload, "products");
            });
    }

    function configure(options) {
        var incoming = options || {};
        if (incoming.baseUrl) {
            state.baseUrl = String(incoming.baseUrl).replace(/\/$/, '');
        }
        if (incoming.timeout && Number(incoming.timeout) > 0) {
            state.timeout = Number(incoming.timeout);
        }
        if (typeof incoming.retryCount !== 'undefined') {
            state.retryCount = Math.max(0, Number(incoming.retryCount) || 0);
        }
        if (isPlainObject(incoming.defaultHeaders)) {
            state.defaultHeaders = mergeObjects(state.defaultHeaders, incoming.defaultHeaders);
        }
        if (typeof incoming.token !== 'undefined') {
            setToken(incoming.token);
        }
        return getState();
    }

    function getState() {
        return {
            baseUrl: state.baseUrl,
            timeout: state.timeout,
            retryCount: state.retryCount,
            hasToken: Boolean(getToken()),
            loadingCount: state.loadingCount,
            pendingRequestCount: Object.keys(state.pendingRequests).length,
            lastError: state.lastError ? {
                message: state.lastError.message,
                status: state.lastError.status,
                code: state.lastError.code,
                timestamp: state.lastError.timestamp
            } : null
        };
    }

    function subscribeLoading(subscriber) {
        if (typeof subscriber !== 'function') {
            throw new ApiError('Loading subscriber must be a function', { code: 'VALIDATION_ERROR', retriable: false });
        }
        state.loadingSubscribers.push(subscriber);
        notifyLoadingSubscribers();
        return function unsubscribe() {
            state.loadingSubscribers = state.loadingSubscribers.filter(function filterItem(item) {
                return item !== subscriber;
            });
        };
    }

    function healthCheck() {
        return request('/health', {
            method: 'GET',
            includeAuth: false,
            cacheTtl: 5000,
            retries: 1,
            timeout: 5000
        });
    }

    var exported = {
        ApiError: ApiError,
        configure: configure,
        healthCheck: healthCheck,
        request: request,
        setToken: setToken,
        getToken: getToken,
        clearToken: clearToken,
        subscribeLoading: subscribeLoading,
        getState: getState,
        fetchProjects: fetchProjects,
        createProject: createProject,
        updateProject: updateProject,
        deleteProject: deleteProject,
        fetchEstimates: fetchEstimates,
        createEstimate: createEstimate,
        updateEstimate: updateEstimate,
        deleteEstimate: deleteEstimate,
        fetchContracts: fetchContracts,
        createContract: createContract,
        generatePDF: generatePDF,
        sendEmail: sendEmail,
        fetchInventory: fetchInventory,
        searchProducts: searchProducts
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exported;
    }

    global.FenceEstimatorAPI = exported;
}(typeof window !== 'undefined' ? window : globalThis));
