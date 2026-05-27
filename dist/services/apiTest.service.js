"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testApiDefinition = testApiDefinition;
const TEST_TIMEOUT_MS = 15000;
function applyPathParams(endpoint, pathParams) {
    var _a, _b;
    let path = endpoint;
    for (const param of pathParams) {
        if (!((_a = param.name) === null || _a === void 0 ? void 0 : _a.trim()))
            continue;
        const name = param.name.trim();
        const value = encodeURIComponent((_b = param.value) !== null && _b !== void 0 ? _b : '');
        path = path.replace(new RegExp(`:${name}\\b`, 'g'), value);
        path = path.replace(new RegExp(`\\{${name}\\}`, 'g'), value);
    }
    return path;
}
function appendQueryParams(url, queryParams) {
    var _a;
    const params = queryParams.filter((p) => { var _a; return (_a = p.name) === null || _a === void 0 ? void 0 : _a.trim(); });
    if (params.length === 0)
        return url;
    const search = new URLSearchParams();
    for (const param of params) {
        search.set(param.name.trim(), (_a = param.value) !== null && _a !== void 0 ? _a : '');
    }
    const qs = search.toString();
    if (!qs)
        return url;
    return `${url}${url.includes('?') ? '&' : '?'}${qs}`;
}
function buildRequestUrl(baseUrl, endpoint) {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    if (!(baseUrl === null || baseUrl === void 0 ? void 0 : baseUrl.trim())) {
        return path;
    }
    const base = baseUrl.trim().replace(/\/$/, '');
    return `${base}${path}`;
}
function coerceFieldValue(field) {
    var _a;
    const raw = (_a = field.defaultValue) !== null && _a !== void 0 ? _a : '';
    switch (field.type) {
        case 'number':
            return raw === '' ? 0 : Number(raw);
        case 'boolean':
            return raw === 'true' || raw === '1';
        default:
            return raw;
    }
}
function buildJsonBody(fields) {
    var _a;
    const body = {};
    for (const field of fields) {
        if (!((_a = field.name) === null || _a === void 0 ? void 0 : _a.trim()))
            continue;
        body[field.name.trim()] = coerceFieldValue(field);
    }
    return body;
}
function truncateBody(text, max = 8000) {
    if (text.length <= max)
        return text;
    return `${text.slice(0, max)}\n…[truncated]`;
}
function headersToRecord(headers) {
    const out = {};
    headers.forEach((value, key) => {
        out[key] = value;
    });
    return out;
}
function testApiDefinition(input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        const started = Date.now();
        const pathParams = (_b = (_a = input.pathParams) === null || _a === void 0 ? void 0 : _a.filter((p) => { var _a; return (_a = p.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _b !== void 0 ? _b : [];
        const queryParams = (_d = (_c = input.queryParams) === null || _c === void 0 ? void 0 : _c.filter((p) => { var _a; return (_a = p.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _d !== void 0 ? _d : [];
        const resolvedEndpoint = applyPathParams(input.endpoint, pathParams);
        let requestUrl = buildRequestUrl(input.baseUrl, resolvedEndpoint);
        requestUrl = appendQueryParams(requestUrl, queryParams);
        const fields = (_f = (_e = input.fields) === null || _e === void 0 ? void 0 : _e.filter((f) => { var _a; return (_a = f.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _f !== void 0 ? _f : [];
        const method = input.method;
        const bodyType = (_g = input.bodyType) !== null && _g !== void 0 ? _g : 'json';
        if (!((_h = input.baseUrl) === null || _h === void 0 ? void 0 : _h.trim())) {
            return {
                success: false,
                durationMs: Date.now() - started,
                testedAt: new Date(),
                requestUrl,
                errorMessage: 'Base URL is required to test the API',
            };
        }
        try {
            const headers = {};
            if ((_j = input.bearerToken) === null || _j === void 0 ? void 0 : _j.trim()) {
                const token = input.bearerToken.trim();
                headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
            }
            let url = requestUrl;
            let body;
            const hasBody = method !== 'GET' && method !== 'DELETE' && bodyType !== 'none';
            if (hasBody && bodyType === 'json') {
                headers['Content-Type'] = 'application/json';
                body = JSON.stringify(buildJsonBody(fields));
            }
            else if (hasBody && (bodyType === 'form-data' || bodyType === 'multipart')) {
                const form = new FormData();
                for (const field of fields) {
                    form.append(field.name.trim(), String(coerceFieldValue(field)));
                }
                for (const fileField of (_l = (_k = input.fileFields) === null || _k === void 0 ? void 0 : _k.filter((f) => { var _a; return (_a = f.name) === null || _a === void 0 ? void 0 : _a.trim(); })) !== null && _l !== void 0 ? _l : []) {
                    const placeholder = new Blob(['test'], { type: 'text/plain' });
                    form.append(fileField.name.trim(), placeholder, 'test.txt');
                }
                body = form;
            }
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), TEST_TIMEOUT_MS);
            const response = yield fetch(url, {
                method,
                headers: Object.keys(headers).length > 0 ? headers : undefined,
                body: hasBody ? body : undefined,
                signal: controller.signal,
            });
            clearTimeout(timeout);
            const responseText = truncateBody(yield response.text());
            const durationMs = Date.now() - started;
            return {
                success: response.ok,
                statusCode: response.status,
                statusText: response.statusText,
                responseBody: responseText,
                responseHeaders: headersToRecord(response.headers),
                durationMs,
                testedAt: new Date(),
                requestUrl: url,
                errorMessage: response.ok ? undefined : `HTTP ${response.status} ${response.statusText}`,
            };
        }
        catch (error) {
            const message = error instanceof Error
                ? error.name === 'AbortError'
                    ? `Request timed out after ${TEST_TIMEOUT_MS}ms`
                    : error.message
                : 'Request failed';
            return {
                success: false,
                durationMs: Date.now() - started,
                testedAt: new Date(),
                requestUrl,
                errorMessage: message,
            };
        }
    });
}
