// AI client for the server: any OpenAI-compatible chat completions API (OpenRouter by default,
// or e.g. RevidAPI via AI_BASE_URL). Exposes `ai.models.generateContent(...)` so the endpoints in server.ts keep their call shape.

// JSON-schema type names, used to describe the structured response of each endpoint.
export const Type = {
  OBJECT: 'object',
  ARRAY: 'array',
  STRING: 'string',
  INTEGER: 'integer',
  NUMBER: 'number',
} as const;

export const DEFAULT_AI_MODEL = 'anthropic/claude-sonnet-5.5';

// Env is read at call time: server.ts runs dotenv.config() after its imports are evaluated.
const apiKey = () => process.env.AI_API_KEY || process.env.OPENROUTER_API_KEY;
const baseUrl = () =>
  (process.env.AI_BASE_URL || process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1').replace(/\/$/, '');

export function hasAiKey(): boolean {
  return Boolean(apiKey());
}

// 'native': send the schema as response_format (OpenRouter honours it).
// 'prompt': put the schema in the prompt (providers that ignore response_format, e.g. RevidAPI).
// Override with AI_SCHEMA_MODE; otherwise native only for openrouter.ai.
function schemaMode(): 'native' | 'prompt' {
  const forced = process.env.AI_SCHEMA_MODE;
  if (forced === 'native' || forced === 'prompt') return forced;
  return baseUrl().includes('openrouter.ai') ? 'native' : 'prompt';
}

interface GenerateParams {
  model: string;
  contents: string;
  config?: { responseMimeType?: string; responseSchema?: any };
  timeoutMs?: number;
}

// Anthropic structured outputs require every object schema to forbid extra properties.
function withNoExtraProps(schema: any): any {
  if (Array.isArray(schema)) return schema.map(withNoExtraProps);
  if (!schema || typeof schema !== 'object') return schema;
  const out: any = {};
  for (const [k, v] of Object.entries(schema)) out[k] = withNoExtraProps(v);
  if (out.type === 'object' && out.additionalProperties === undefined) out.additionalProperties = false;
  return out;
}

async function callAi(body: any, timeoutMs: number): Promise<{ ok: boolean; status: number; data: any }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(`${baseUrl()}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey()}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'https://workflow-dang-tin-bds.vercel.app',
        'X-Title': 'Workflow Dang Tin BDS',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await resp.json().catch(() => ({}));
    return { ok: resp.ok, status: resp.status, data };
  } catch (err: any) {
    if (err?.name === 'AbortError') throw new Error(`AI timeout sau ${Math.round(timeoutMs / 1000)}s`);
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function stripJsonFence(text: string): string {
  return text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
}

async function generateContent({ model, contents, config, timeoutMs = 100_000 }: GenerateParams): Promise<{ text: string }> {
  if (!hasAiKey()) throw new Error('AI_API_KEY (hoặc OPENROUTER_API_KEY) chưa được cấu hình.');

  const schema = config?.responseSchema ? withNoExtraProps(config.responseSchema) : null;
  const base = { model, max_tokens: 8000, temperature: 0.7 };

  const attempt = (useSchema: boolean) =>
    callAi(
      {
        ...base,
        messages: [
          {
            role: 'user',
            content: useSchema || !schema
              ? contents
              : `${contents}\n\nChỉ trả về MỘT đối tượng JSON hợp lệ theo schema sau, không kèm giải thích:\n${JSON.stringify(schema)}`,
          },
        ],
        ...(useSchema && schema
          ? { response_format: { type: 'json_schema', json_schema: { name: 'response', schema } } }
          : {}),
      },
      timeoutMs
    );

  let res = await attempt(schemaMode() === 'native');
  // Provider rejected the schema (unsupported keyword etc.): retry with the schema in the prompt.
  if (!res.ok && res.status === 400 && schema && schemaMode() === 'native') res = await attempt(false);

  if (!res.ok) {
    const msg = res.data?.error?.message || `AI lỗi ${res.status}`;
    throw new Error(`AI ${res.status}: ${msg}`);
  }
  const content = res.data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string' || !content.trim()) throw new Error('AI trả về nội dung rỗng.');
  return { text: stripJsonFence(content) };
}

export const ai = { models: { generateContent } };
