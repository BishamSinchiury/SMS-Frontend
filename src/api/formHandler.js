/**
 * FORM HANDLER — FORM SUBMISSION HELPERS
 * ========================================
 * What is this?
 *   When you submit a form, the data can be sent in three different
 *   formats depending on what the server expects:
 *
 *   1. JSON          → { email: "a@b.com", password: "123" }
 *   2. URL-encoded   → email=a%40b.com&password=123
 *   3. Multipart     → used when the form has file uploads
 *
 *   client.js defaults to JSON (Content-Type: application/json).
 *   These helpers override that when needed.
 *
 * Why not just call api.post() directly in components?
 *   Because the Content-Type setup, FormData building, and progress
 *   tracking would be repeated in every component. These helpers
 *   centralise that logic once.
 *
 * How client.js interceptors still apply:
 *   All three helpers use the same `api` instance from client.js.
 *   That means JWT token, CSRF token, timeout, baseURL — everything
 *   configured in client.js still runs automatically. These helpers
 *   only change the Content-Type and body shape, nothing else.
 *
 * Django side:
 *   JSON body      → request.data          (DRF)
 *   URL-encoded    → request.POST          (Django)
 *   Multipart      → request.data + request.FILES  (DRF with parsers)
 */

import api from './client'

// ─────────────────────────────────────────────────────────────────────────────
// TYPE 1 — JSON SUBMIT (default, most common)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * submitJson
 * ----------
 * Use for: login, register, settings, any structured data form.
 * Django reads it via: request.data (DRF) or json.loads(request.body)
 *
 * This is what client.js already does by default, but having it named
 * here makes your service files consistent — all form submissions go
 * through formHandler regardless of type.
 *
 * @param {string} url     - API endpoint e.g. '/auth/login/'
 * @param {object} data    - plain JS object { email, password }
 * @param {object} config  - optional extra axios config
 */
export function submitJson(url, data, config = {}) {
  return api.post(url, data, {
    headers: {
      'Content-Type': 'application/json',  // already the default, explicit for clarity
    },
    ...config,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPE 2 — URL-ENCODED FORM SUBMIT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * submitUrlEncoded
 * ----------------
 * Use for: legacy forms, OAuth token endpoints, any server that expects
 *          application/x-www-form-urlencoded (like Django's built-in
 *          auth views, or some third-party OAuth2 providers).
 *
 * Django reads it via: request.POST['fieldname']
 *
 * What happens internally:
 *   URLSearchParams converts { email: 'a@b.com' }
 *   into the string  'email=a%40b.com'
 *   Axios sees a URLSearchParams body and sets Content-Type automatically.
 *
 * @param {string} url     - API endpoint
 * @param {object} data    - plain JS object, gets converted to URLSearchParams
 * @param {object} config  - optional extra axios config
 */
export function submitUrlEncoded(url, data, config = {}) {
  const params = new URLSearchParams(data)

  return api.post(url, params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    ...config,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPE 3 — MULTIPART FORM SUBMIT (with file uploads)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * submitMultipart
 * ---------------
 * Use for: any form that includes file uploads (avatar, documents,
 *          images, CSV imports, etc.) alongside regular text fields.
 *
 * Django reads it via:
 *   request.data['fieldname']   ← text fields  (DRF)
 *   request.FILES['fieldname']  ← file fields  (DRF + Django)
 *
 * Django settings required for DRF:
 *   REST_FRAMEWORK = {
 *     'DEFAULT_PARSER_CLASSES': [
 *       'rest_framework.parsers.MultiPartParser',
 *       'rest_framework.parsers.JSONParser',
 *     ]
 *   }
 *
 * IMPORTANT: Never set Content-Type manually for multipart.
 *   Axios must set it automatically because it needs to include the
 *   multipart boundary string:
 *   Content-Type: multipart/form-data; boundary=----WebKitFormBoundary...
 *   If you set it manually, the boundary is missing and Django can't
 *   parse the request body.
 *
 * @param {string}   url        - API endpoint
 * @param {object}   fields     - plain text fields { username: 'john' }
 * @param {object}   files      - file fields { avatar: File, resume: File }
 * @param {function} onProgress - optional callback(percentage: 0-100)
 * @param {object}   config     - optional extra axios config
 */
export function submitMultipart(url, fields = {}, files = {}, onProgress = null, config = {}) {
  const formData = new FormData()

  // Append all text fields
  Object.entries(fields).forEach(([key, value]) => {
    // Handle arrays (e.g. multi-select checkboxes)
    if (Array.isArray(value)) {
      value.forEach(v => formData.append(key, v))
    } else if (value !== null && value !== undefined) {
      formData.append(key, value)
    }
  })

  // Append all files
  Object.entries(files).forEach(([key, file]) => {
    if (Array.isArray(file)) {
      // Multiple files under the same field name
      file.forEach(f => formData.append(key, f))
    } else if (file instanceof File || file instanceof Blob) {
      formData.append(key, file)
    }
  })

  return api.post(url, formData, {
    // Do NOT set Content-Type here — Axios sets it with the boundary
    onUploadProgress: onProgress
      ? (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          )
          onProgress(percentage)
        }
      : undefined,
    ...config,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPE 4 — MULTIPART UPDATE (PUT/PATCH with files)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * updateMultipart
 * ---------------
 * Same as submitMultipart but uses PATCH instead of POST.
 * Use for: updating a user profile that includes a new avatar upload,
 *          editing a post that may have an updated image, etc.
 *
 * Use PATCH (not PUT) when you only want to update some fields.
 * Use PUT when you are replacing the entire resource.
 *
 * @param {string}   url        - API endpoint e.g. '/users/42/'
 * @param {object}   fields     - text fields to update
 * @param {object}   files      - file fields to update (can be empty {})
 * @param {function} onProgress - optional progress callback
 * @param {object}   config     - optional extra axios config
 */
export function updateMultipart(url, fields = {}, files = {}, onProgress = null, config = {}) {
  const formData = new FormData()

  Object.entries(fields).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => formData.append(key, v))
    } else if (value !== null && value !== undefined) {
      formData.append(key, value)
    }
  })

  Object.entries(files).forEach(([key, file]) => {
    if (Array.isArray(file)) {
      file.forEach(f => formData.append(key, f))
    } else if (file instanceof File || file instanceof Blob) {
      formData.append(key, file)
    }
  })

  return api.patch(url, formData, {
    onUploadProgress: onProgress
      ? (progressEvent) => {
          const percentage = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100
          )
          onProgress(percentage)
        }
      : undefined,
    ...config,
  })
}