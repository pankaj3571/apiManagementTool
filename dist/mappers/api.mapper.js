"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toIApi = toIApi;
function toIApi(doc) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return {
        id: doc._id.toString(),
        name: doc.name,
        endpoint: doc.endpoint,
        method: doc.method,
        description: doc.description || undefined,
        version: doc.version || 'v1',
        status: doc.status || 'active',
        baseUrl: doc.baseUrl || undefined,
        tags: (_a = doc.tags) !== null && _a !== void 0 ? _a : [],
        projectId: (_b = doc.projectId) === null || _b === void 0 ? void 0 : _b.toString(),
        clientId: (_c = doc.clientId) === null || _c === void 0 ? void 0 : _c.toString(),
        bodyType: doc.bodyType || 'json',
        pathParams: ((_d = doc.pathParams) !== null && _d !== void 0 ? _d : []),
        queryParams: ((_e = doc.queryParams) !== null && _e !== void 0 ? _e : []),
        bearerToken: doc.bearerToken || undefined,
        fields: ((_f = doc.fields) !== null && _f !== void 0 ? _f : []),
        fileFields: ((_g = doc.fileFields) !== null && _g !== void 0 ? _g : []),
        lastTestResponse: doc.lastTestResponse
            ? {
                success: (_h = doc.lastTestResponse.success) !== null && _h !== void 0 ? _h : false,
                statusCode: (_j = doc.lastTestResponse.statusCode) !== null && _j !== void 0 ? _j : undefined,
                statusText: doc.lastTestResponse.statusText || undefined,
                responseBody: doc.lastTestResponse.responseBody || undefined,
                responseHeaders: doc.lastTestResponse.responseHeaders || undefined,
                durationMs: (_k = doc.lastTestResponse.durationMs) !== null && _k !== void 0 ? _k : 0,
                testedAt: doc.lastTestResponse.testedAt || new Date(),
                requestUrl: doc.lastTestResponse.requestUrl || '',
                errorMessage: doc.lastTestResponse.errorMessage || undefined,
            }
            : undefined,
        createdAt: doc.createdAt || new Date(),
        updatedAt: doc.updatedAt || new Date(),
    };
}
