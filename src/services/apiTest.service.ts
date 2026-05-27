import {
  ApiBodyType,
  ApiMethod,
  IApiField,
  IApiFileField,
  IApiParam,
  IApiTestResponse,
} from '../interfaces/api.interface';

const TEST_TIMEOUT_MS = 15000;

type TestInput = {
  method: ApiMethod;
  endpoint: string;
  baseUrl?: string;
  bodyType?: ApiBodyType;
  pathParams?: IApiParam[];
  queryParams?: IApiParam[];
  bearerToken?: string;
  fields?: IApiField[];
  fileFields?: IApiFileField[];
};

function applyPathParams(endpoint: string, pathParams: IApiParam[]): string {
  let path = endpoint;
  for (const param of pathParams) {
    if (!param.name?.trim()) continue;
    const name = param.name.trim();
    const value = encodeURIComponent(param.value ?? '');
    path = path.replace(new RegExp(`:${name}\\b`, 'g'), value);
    path = path.replace(new RegExp(`\\{${name}\\}`, 'g'), value);
  }
  return path;
}

function appendQueryParams(url: string, queryParams: IApiParam[]): string {
  const params = queryParams.filter((p) => p.name?.trim());
  if (params.length === 0) return url;

  const search = new URLSearchParams();
  for (const param of params) {
    search.set(param.name.trim(), param.value ?? '');
  }

  const qs = search.toString();
  if (!qs) return url;
  return `${url}${url.includes('?') ? '&' : '?'}${qs}`;
}

function buildRequestUrl(baseUrl: string | undefined, endpoint: string): string {
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (!baseUrl?.trim()) {
    return path;
  }
  const base = baseUrl.trim().replace(/\/$/, '');
  return `${base}${path}`;
}

function coerceFieldValue(field: IApiField): string | number | boolean {
  const raw = field.defaultValue ?? '';
  switch (field.type) {
    case 'number':
      return raw === '' ? 0 : Number(raw);
    case 'boolean':
      return raw === 'true' || raw === '1';
    default:
      return raw;
  }
}

function buildJsonBody(fields: IApiField[]): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const field of fields) {
    if (!field.name?.trim()) continue;
    body[field.name.trim()] = coerceFieldValue(field);
  }
  return body;
}

function truncateBody(text: string, max = 8000): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}\n…[truncated]`;
}

function headersToRecord(headers: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  headers.forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

export async function testApiDefinition(input: TestInput): Promise<IApiTestResponse> {
  const started = Date.now();
  const pathParams = input.pathParams?.filter((p) => p.name?.trim()) ?? [];
  const queryParams = input.queryParams?.filter((p) => p.name?.trim()) ?? [];
  const resolvedEndpoint = applyPathParams(input.endpoint, pathParams);
  let requestUrl = buildRequestUrl(input.baseUrl, resolvedEndpoint);
  requestUrl = appendQueryParams(requestUrl, queryParams);

  const fields = input.fields?.filter((f) => f.name?.trim()) ?? [];
  const method = input.method;
  const bodyType = input.bodyType ?? 'json';

  if (!input.baseUrl?.trim()) {
    return {
      success: false,
      durationMs: Date.now() - started,
      testedAt: new Date(),
      requestUrl,
      errorMessage: 'Base URL is required to test the API',
    };
  }

  try {
    const headers: Record<string, string> = {};

    if (input.bearerToken?.trim()) {
      const token = input.bearerToken.trim();
      headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    let url = requestUrl;
    let body: string | FormData | undefined;

    const hasBody = method !== 'GET' && method !== 'DELETE' && bodyType !== 'none';

    if (hasBody && bodyType === 'json') {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(buildJsonBody(fields));
    } else if (hasBody && (bodyType === 'form-data' || bodyType === 'multipart')) {
      const form = new FormData();
      for (const field of fields) {
        form.append(field.name.trim(), String(coerceFieldValue(field)));
      }
      for (const fileField of input.fileFields?.filter((f) => f.name?.trim()) ?? []) {
        const placeholder = new Blob(['test'], { type: 'text/plain' });
        form.append(fileField.name.trim(), placeholder, 'test.txt');
      }
      body = form;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TEST_TIMEOUT_MS);

    const response = await fetch(url, {
      method,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
      body: hasBody ? body : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const responseText = truncateBody(await response.text());
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
  } catch (error) {
    const message =
      error instanceof Error
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
}
