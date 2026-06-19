/**
 * swifteta-sdk.js
 * SwiftETA B2B SDK — v2.5.0
 *
 * A lightweight (~8 KB) vanilla-JS library that lets any storefront
 * display real-time shipping estimates by calling the SwiftETA REST API.
 *
 * Usage (CDN):
 *   <script src="https://cdn.swifteta.in/sdk/v2/swifteta-b2b.min.js"></script>
 *   <script>
 *     SwiftETA.init({ apiKey: 'YOUR_KEY', origin: '560001' });
 *     SwiftETA.renderWidget('#shipping-box');
 *   </script>
 *
 * Usage (NPM / ES module):
 *   import SwiftETA from '@swifteta/b2b-sdk';
 *   SwiftETA.init({ apiKey: 'YOUR_KEY', origin: '560001' });
 */

(function (root, factory) {
  // UMD wrapper — works in browser globals, CommonJS (Node), and ES modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = factory();          // CommonJS / Node
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);                 // AMD (RequireJS)
  } else {
    root.SwiftETA = factory();           // Browser global
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // ── Internal state ──────────────────────────────────────────────────────────
  const BASE_URL = 'https://api.swifteta.in';
  let _config    = null;   // set by init()
  let _cache = {}; // key -> { data, ts } resolved values
  let _inflight = {}; // key -> Promise (in-flight coalescing)
  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
  const CACHE_MAX_SIZE = 200;

  // -- HTTP helper (C5 fixes: coalesce in-flight, TTL, max-size, no caching failures) --
  async function request(method, path, body) {
    assertReady();
    const cacheKey = method + path + JSON.stringify(body || '');

    // Return a valid cached result (within TTL)
    if (_config.cache && _cache[cacheKey] && (Date.now() - _cache[cacheKey].ts < CACHE_TTL_MS)) {
      return _cache[cacheKey].data;
    }

    // Return in-flight promise for identical concurrent requests
    if (_inflight[cacheKey]) return _inflight[cacheKey];

    const promise = (async () => {
      const res = await fetch(BASE_URL + path, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + _config.apiKey,
          'X-SDK-Version': '2.5.0',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw Object.assign(new Error(err.message || 'SwiftETA API error'), { code: err.code, status: res.status });
      }

      const data = await res.json();

      // Only cache successful responses; evict oldest entries if over max size
      if (_config.cache) {
        if (Object.keys(_cache).length >= CACHE_MAX_SIZE) {
          const oldest = Object.entries(_cache).sort((a, b) => a[1].ts - b[1].ts)[0][0];
          delete _cache[oldest];
        }
        _cache[cacheKey] = { data, ts: Date.now() };
      }
      return data;
    })();

    _inflight[cacheKey] = promise;
    try {
      return await promise;
    } finally {
      delete _inflight[cacheKey]; // clean up after resolution or rejection
    }
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  /**
   * Initialise the SDK.  Call once before any other method.
   *
   * @param {object} opts
   * @param {string}  opts.apiKey   - Your B2B API key from the SwiftETA portal
   * @param {string}  opts.origin   - Your warehouse pincode (e.g. '560001')
   * @param {string}  [opts.theme]  - 'light' | 'dark' | 'auto'  (default 'auto')
   * @param {string}  [opts.currency] - ISO currency code          (default 'INR')
   * @param {boolean} [opts.cache]  - Enable in-memory response cache (default true)
   * @param {Function}[opts.onReady]- Callback fired once init completes
   */
  function init(opts) {
    if (!opts || !opts.apiKey) throw new Error('[SwiftETA] opts.apiKey is required.');
    if (!opts.origin)          throw new Error('[SwiftETA] opts.origin (warehouse pincode) is required.');

    _config = {
      apiKey:   opts.apiKey,
      origin:   opts.origin,
      theme:    opts.theme    || 'auto',
      currency: opts.currency || 'INR',
      cache:    opts.cache    !== false,   // default true
      onReady:  opts.onReady  || null,
    };

  _cache = {}; _inflight = {}; // clear cache + in-flight on re-init
    if (typeof _config.onReady === 'function') _config.onReady();
  }

  /**
   * Estimate shipping ETA & rate for a single shipment.
   *
   * @param {object} params
   * @param {string}  params.destination - 6-digit destination pincode
   * @param {number}  params.weight_kg   - Package weight in kg
   * @param {boolean} [params.express]   - Request express shipping  (default false)
   * @param {boolean} [params.cod]       - Cash on delivery           (default false)
   * @returns {Promise<ETAResult>}
   *
   * @typedef  {object} ETAResult
   * @property {string}  status          - 'serviceable' | 'unserviceable'
   * @property {number}  days_min        - Minimum delivery days
   * @property {number}  days_max        - Maximum delivery days
   * @property {number}  rate_inr        - Shipping cost in INR
   * @property {string}  carrier         - Assigned courier partner
   * @property {string}  zone            - Delivery zone label
   * @property {number}  distance_km     - Haversine distance origin → dest
   * @property {boolean} cached          - Whether result was served from cache
   */
  async function estimate(params) {
    assertReady();
    assertPin(params.destination);
    return request('POST', '/api/b2b/v1/estimate', {
      origin:      _config.origin,
      destination: params.destination,
      weight_kg:   params.weight_kg   || 0.5,
      express:     params.express     || false,
      cod:         params.cod         || false,
    });
  }

  /**
   * Bulk estimate — up to 100 orders in a single API call.
   *
   * @param {Array<{id:string, destination:string, weight_kg:number}>} orders
   * @returns {Promise<BulkResult>}
   */
  async function bulkEstimate(orders) {
    assertReady();
    if (!Array.isArray(orders) || orders.length === 0)
      throw new Error('[SwiftETA] bulkEstimate expects a non-empty array of orders.');
    if (orders.length > 100)
      throw new Error('[SwiftETA] bulkEstimate supports at most 100 orders per call.');
    orders.forEach(o => assertPin(o.destination));
    return request('POST', '/api/b2b/v1/bulk-estimate', { origin: _config.origin, orders });
  }

  /**
   * Check whether a pincode is serviceable without a full estimate.
   *
   * @param {string} pincode - 6-digit pincode
   * @returns {Promise<ServiceableResult>}
   */
  async function checkServiceable(pincode) {
    assertReady();
    assertPin(pincode);
    return request('GET', '/api/b2b/v1/serviceable?pin=' + pincode);
  }

  /**
   * Fetch your current API usage stats.
   *
   * @returns {Promise<UsageResult>}
   */
  async function getUsage() {
    assertReady();
    return request('GET', '/api/b2b/v1/usage');
  }

  /**
   * Render a drop-in shipping estimator widget into a DOM container.
   *
   * @param {string|HTMLElement} container - CSS selector or DOM element
   * @param {object} [opts]
   * @param {boolean} [opts.showCarrier]   - Show carrier name  (default true)
   * @param {boolean} [opts.showBreakdown] - Show cost breakdown (default true)
   * @param {boolean} [opts.expressToggle] - Show express toggle (default true)
   */
  function renderWidget(container, opts) {
    assertReady();
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) throw new Error('[SwiftETA] renderWidget: container not found: ' + container);

    const cfg = Object.assign({ showCarrier: true, showBreakdown: true, expressToggle: true }, opts);
    const theme = _config.theme === 'auto'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : _config.theme;

    el.innerHTML = buildWidgetHTML(cfg, theme);
    attachWidgetListeners(el, cfg);
  }

  // ── Widget HTML builder (internal) ─────────────────────────────────────────
  function buildWidgetHTML(cfg, theme) {
    const bg  = theme === 'dark' ? '#0f1117' : '#ffffff';
    const bd  = theme === 'dark' ? '#2e3248' : '#e2e8f0';
    const fg  = theme === 'dark' ? '#e8eaf6' : '#1e293b';
    const sub = theme === 'dark' ? '#8892b0' : '#64748b';
    const acc = '#6c63ff';

    return `<div data-swifteta-widget style="font-family:system-ui,sans-serif;background:${bg};border:1px solid ${bd};border-radius:12px;padding:16px;max-width:360px;">
  <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:${sub};text-transform:uppercase;letter-spacing:.5px;">Delivery Estimate</p>
  <div style="display:flex;gap:8px;margin-bottom:8px;">
    <input data-swifteta-pin type="text" maxlength="6" placeholder="Enter 6-digit pincode"
      style="flex:1;background:transparent;border:1px solid ${bd};border-radius:8px;padding:8px 12px;font-size:13px;color:${fg};outline:none;" />
    <button data-swifteta-check
      style="background:${acc};color:#fff;border:none;border-radius:8px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer;">
      Check
    </button>
  </div>
  ${cfg.expressToggle ? `<label style="display:flex;align-items:center;gap:6px;font-size:11px;color:${sub};margin-bottom:8px;cursor:pointer;">
    <input data-swifteta-express type="checkbox" /> Express Shipping
  </label>` : ''}
  <div data-swifteta-result style="min-height:40px;font-size:12px;color:${fg};"></div>
</div>`;
  }

  // ── Widget event listeners (internal) ──────────────────────────────────────
  function attachWidgetListeners(el, cfg) {
    const btn     = el.querySelector('[data-swifteta-check]');
    const pinInput= el.querySelector('[data-swifteta-pin]');
    const expChk  = el.querySelector('[data-swifteta-express]');
    const result  = el.querySelector('[data-swifteta-result]');

    async function run() {
      const pin = pinInput.value.trim();
      if (!/^[1-9][0-9]{5}$/.test(pin)) {
        result.textContent = '⚠ Enter a valid 6-digit pincode.';
        return;
      }
      result.textContent = 'Calculating…';
      btn.disabled = true;
      try {
        const r = await estimate({
          destination: pin,
          weight_kg:   1,
          express:     expChk ? expChk.checked : false,
        });
        if (r.status === 'serviceable') {
          result.innerHTML =
            `<strong style="color:#22c55e">✓ Delivery in ${r.days_min}–${r.days_max} days</strong>` +
            (cfg.showCarrier   ? `<br><span style="opacity:.7">via ${r.carrier}</span>` : '') +
            (cfg.showBreakdown ? `<br><span style="opacity:.7">Shipping: ₹${r.rate_inr}</span>` : '');
        } else {
          result.innerHTML = '<span style="color:#f87171">✗ Not serviceable to this pincode.</span>';
        }
      } catch (e) {
        result.textContent = '✗ Error: ' + e.message;
      } finally {
        btn.disabled = false;
      }
    }

    btn.addEventListener('click', run);
    pinInput.addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
  }

  // ── Public surface ──────────────────────────────────────────────────────────
  return { init, estimate, bulkEstimate, checkServiceable, getUsage, renderWidget };
}));
