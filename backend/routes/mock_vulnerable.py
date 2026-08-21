from fastapi import APIRouter, Header, HTTPException, Response, Request, Query
from typing import Optional
import json

router = APIRouter(prefix="/api/mock-vulnerable", tags=["Mock Vulnerable Target API"])

# In-memory mock databases for testing
USERS_DB = {
    1: {"id": 1, "username": "alice", "email": "alice@university.edu", "role": "student", "balance": 150.00, "ssn_last4": "1234"},
    2: {"id": 2, "username": "bob", "email": "bob@university.edu", "role": "student", "balance": 320.50, "ssn_last4": "5678"},
    3: {"id": 3, "username": "admin", "email": "sec-admin@university.edu", "role": "admin", "balance": 9999.00, "ssn_last4": "9999"}
}

ORDERS_DB = {
    101: {"id": 101, "user_id": 1, "item": "Campus Laptop", "price": 899.00, "status": "shipped"},
    102: {"id": 102, "user_id": 2, "item": "Textbooks", "price": 140.00, "status": "delivered"}
}

# 1. Missing Auth on sensitive endpoint (Authentication Flaw)
@router.get("/admin/users", summary="List All Users (Missing Auth Vulnerability)")
def get_all_users_unprotected(response: Response):
    # Vulnerability: Sensitive admin endpoint accessible without Authorization header
    # Also intentionally misses security headers
    response.headers["Server"] = "Apache/2.4.41 (Ubuntu) PHP/7.4.3"
    return list(USERS_DB.values())

# 2. Broken Object Level Authorization (BOLA / IDOR)
@router.get("/users/{user_id}", summary="Get User Details (BOLA/IDOR Vulnerability)")
def get_user_by_id(user_id: int, authorization: Optional[str] = Header(None)):
    # Vulnerability: Accepts any token (e.g., Alice) but lets her view Bob's or Admin's private SSN & data without authorization checks
    if user_id not in USERS_DB:
        raise HTTPException(status_code=404, detail="User not found")
    return USERS_DB[user_id]

# 3. Unsafe Input Validation & SQL / Type Error Disclosure
@router.post("/search", summary="Search Items (Unsafe Input Validation & Error Leak)")
def search_items(request_body: dict):
    # Vulnerability: Unhandled string query injection returning simulated stack trace / DB syntax error
    query = request_body.get("query", "")
    if "'" in query or "--" in query or ";" in query:
        raise HTTPException(
            status_code=500,
            detail="Internal Server Error: Syntax error in SQL statement 'SELECT * FROM products WHERE name LIKE '%" + str(query) + "%'' at line 1. Traceback: /app/db/postgres.py line 42 in execute_query()"
        )
    return {"results": [{"id": 1, "name": "Standard Meal Plan", "matched": query}]}

# 4. Missing Rate Limiting
@router.post("/auth/login", summary="User Login (Missing Rate Limiting & Auth Leak)")
def mock_login(credentials: dict):
    # Vulnerability: No rate limit headers, allows rapid brute force
    username = credentials.get("username", "")
    password = credentials.get("password", "")
    if username == "admin" and password == "admin123":
        return {"token": "mock-jwt-admin-token-xyz789", "role": "admin"}
    elif username in ["alice", "bob"]:
        return {"error": "Invalid password for user " + username + ". Hint: default password active."}
    else:
        return {"error": "User does not exist in LDAP directory /var/ldap/users.db"}

# 5. Missing Security Headers and Sensitive Server Banner
@router.get("/health", summary="Mock API Health")
def mock_health(response: Response):
    # Intentionally missing HSTS, CSP, X-Frame-Options, X-Content-Type-Options
    response.headers["Server"] = "Uvicorn/0.28.0 (DEBUG-MODE-ON)"
    response.headers["X-Powered-By"] = "Python/3.11.9 FastAPI"
    return {"status": "ok", "mock_target": True}

# OpenAPI Specification for Mock Target to enable instant spec discovery
@router.get("/openapi.json", summary="Mock Target OpenAPI Schema")
def get_mock_openapi():
    return {
        "openapi": "3.0.0",
        "info": {
            "title": "Campus Dining & Service API (Intentionally Vulnerable Mock Target)",
            "version": "1.0.0",
            "description": "Safe simulated API target with pre-configured OWASP API Top 10 vulnerabilities for testing."
        },
        "paths": {
            "/admin/users": {
                "get": {
                    "summary": "List all administrative users",
                    "responses": {"200": {"description": "OK"}}
                }
            },
            "/users/{user_id}": {
                "get": {
                    "summary": "Fetch user profile by ID",
                    "parameters": [{"name": "user_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                    "responses": {"200": {"description": "OK"}}
                }
            },
            "/search": {
                "post": {
                    "summary": "Search catalog items",
                    "requestBody": {"content": {"application/json": {"schema": {"type": "object", "properties": {"query": {"type": "string"}}}}}},
                    "responses": {"200": {"description": "OK"}}
                }
            },
            "/auth/login": {
                "post": {
                    "summary": "Authenticate user",
                    "requestBody": {"content": {"application/json": {"schema": {"type": "object", "properties": {"username": {"type": "string"}, "password": {"type": "string"}}}}}},
                    "responses": {"200": {"description": "OK"}}
                }
            },
            "/health": {
                "get": {
                    "summary": "Health check",
                    "responses": {"200": {"description": "OK"}}
                }
            }
        }
    }
