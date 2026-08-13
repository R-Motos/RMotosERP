warning: in the working copy of 'frontend/src/services/httpClient.ts', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/frontend/src/services/httpClient.ts b/frontend/src/services/httpClient.ts[m
[1mindex a0c60d7..67129dd 100644[m
[1m--- a/frontend/src/services/httpClient.ts[m
[1m+++ b/frontend/src/services/httpClient.ts[m
[36m@@ -149,9 +149,14 @@[m [mclass HttpClient {[m
   }[m
 [m
   async post<T>(endpoint: string, data?: unknown, optionsOrSignal?: RequestInit | AbortSignal): Promise<T> {[m
[31m-    const options: RequestInit = typeof optionsOrSignal === 'undefined' || optionsOrSignal instanceof AbortSignal[m
[31m-      ? { method: 'POST', body: data ? JSON.stringify(data) : undefined, signal: optionsOrSignal }[m
[31m-      : { method: 'POST', body: data instanceof FormData ? data : JSON.stringify(data), ...optionsOrSignal }[m
[32m+[m[32m    const isFormData = data instanceof FormData[m
[32m+[m[32m    const options: RequestInit = {[m
[32m+[m[32m      method: 'POST',[m
[32m+[m[32m      body: isFormData ? data : (data ? JSON.stringify(data) : undefined),[m
[32m+[m[32m      ...(typeof optionsOrSignal === 'undefined' || optionsOrSignal instanceof AbortSignal[m
[32m+[m[32m        ? { signal: optionsOrSignal }[m
[32m+[m[32m        : optionsOrSignal),[m
[32m+[m[32m    }[m
     return this.request<T>(endpoint, options)[m
   }[m
 [m
