import httpx
from typing import List, Dict, Any
from backend.models.schemas import DiscoveredEndpoint

COMMON_API_PATHS = [
    ("/", "GET", "API Root"),
    ("/health", "GET", "Health Check"),
    ("/api/health", "GET", "API Health"),
    ("/api/v1/health", "GET", "API v1 Health"),
    ("/users", "GET", "Users Collection"),
    ("/api/users", "GET", "API Users Collection"),
    ("/api/admin/users", "GET", "Admin Users"),
    ("/admin/users", "GET", "Admin Users"),
    ("/api/auth/login", "POST", "User Login"),
    ("/auth/login", "POST", "User Login"),
    ("/login", "POST", "User Login"),
    ("/search", "POST", "Search Endpoint"),
    ("/api/search", "POST", "API Search Endpoint"),
    ("/api/profile", "GET", "User Profile"),
    ("/profile", "GET", "User Profile"),
    ("/api/mock-vulnerable/admin/users", "GET", "Mock Admin Users"),
    ("/api/mock-vulnerable/users/1", "GET", "Mock User 1"),
    ("/api/mock-vulnerable/users/2", "GET", "Mock User 2"),
    ("/api/mock-vulnerable/search", "POST", "Mock Search"),
    ("/api/mock-vulnerable/auth/login", "POST", "Mock Login"),
    ("/api/mock-vulnerable/health", "GET", "Mock Health")
]

async def discover_endpoints(client: httpx.AsyncClient, target_url: str, openapi_spec: Dict[str, Any] = None) -> List[DiscoveredEndpoint]:
    discovered: List[DiscoveredEndpoint] = []
    seen_keys = set()
    
    # 1. Extract from provided OpenAPI spec if present
    if openapi_spec and "paths" in openapi_spec:
        for path, methods in openapi_spec["paths"].items():
            for method, details in methods.items():
                if method.lower() in ["get", "post", "put", "delete", "patch"]:
                    key = f"{method.upper()}:{path}"
                    if key not in seen_keys:
                        seen_keys.add(key)
                        discovered.append(DiscoveredEndpoint(
                            path=path,
                            method=method.upper(),
                            summary=details.get("summary") or details.get("description") or f"{method.upper()} {path}",
                            parameters=details.get("parameters", []),
                            requires_auth=bool(details.get("security"))
                        ))
        if discovered:
            return discovered

    # 2. Try fetching openapi.json or swagger.json from target
    for spec_path in ["/openapi.json", "/api/openapi.json", "/swagger.json", "/api/mock-vulnerable/openapi.json"]:
        try:
            url = target_url.rstrip("/") + spec_path
            resp = await client.get(url, timeout=3.0)
            if resp.status_code == 200:
                data = resp.json()
                if "paths" in data:
                    for path, methods in data["paths"].items():
                        for method, details in methods.items():
                            if method.lower() in ["get", "post", "put", "delete", "patch"]:
                                key = f"{method.upper()}:{path}"
                                if key not in seen_keys:
                                    seen_keys.add(key)
                                    discovered.append(DiscoveredEndpoint(
                                        path=path,
                                        method=method.upper(),
                                        summary=details.get("summary") or f"{method.upper()} {path}",
                                        parameters=details.get("parameters", []),
                                        requires_auth=bool(details.get("security"))
                                    ))
                    if discovered:
                        return discovered
        except Exception:
            pass

    # 3. Fallback: Probing known baseline paths
    for path, method, summary in COMMON_API_PATHS:
        try:
            url = target_url.rstrip("/") + path
            if method == "GET":
                resp = await client.get(url, timeout=2.0)
            else:
                resp = await client.post(url, json={}, timeout=2.0)
            
            # If endpoint exists (200, 401, 403, 400, 422, 500)
            if resp.status_code in [200, 201, 204, 400, 401, 403, 405, 422, 500]:
                key = f"{method}:{path}"
                if key not in seen_keys:
                    seen_keys.add(key)
                    discovered.append(DiscoveredEndpoint(
                        path=path,
                        method=method,
                        summary=summary,
                        requires_auth=(resp.status_code in [401, 403])
                    ))
        except Exception:
            continue
            
    return discovered
