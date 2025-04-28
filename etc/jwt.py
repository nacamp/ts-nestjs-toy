import requests

# 서버 URL
BASE_URL = "http://localhost:3000"
refresh_url = f"{BASE_URL}/auth/refresh"
login_url = f"{BASE_URL}/auth/login"
users_url = f"{BASE_URL}/users"

#0. 회원가입해서 유저 생성
print("Create User Response:")
data = { "email": "test@example.com", "name" : "tester", "password":"password"}
response = requests.post(users_url, json=data)
print("Create User Response:", response.json())


# 1. 로그인해서 토큰 받기
print("Login  Response:")
login_payload = {
    "email": "test@example.com",  # 로그인 이메일
    "password": "password"        # 로그인 비밀번호
}
login_response = requests.post(login_url, json=login_payload)
print("Login Response:", login_response.json())
print("Login Response:", login_response.status_code)
if 200 <= login_response.status_code < 300:
    print('Login successful')
    access_token = login_response.json().get("access_token")
    refresh_token = login_response.json().get("refresh_token")
    user_id = login_response.json().get("id")
    print(f"Access Token: {access_token}")
    print(f"Refresh Token: {refresh_token}")
else:
    print("Login failed")
    print(login_response.text)
    exit()

# 2. 토큰으로 /users API 호출
print("Users  Response:")
headers = {
    "Authorization": f"Bearer {access_token}"
}

# Find all users
users_response = requests.get(users_url, headers=headers)

if 200 <= users_response.status_code < 300:
    users = users_response.json()
    print("Users List:")
    print(users)
else:
    print("Failed to fetch users")
    print(users_response.text)

# 3. refresh token
print("Users  Response:")
headers = {
    "Authorization": f"Bearer {access_token}"
}

print(refresh_token)
print(user_id)
data = { "userId": user_id, "refreshToken": refresh_token }
refresh_response = requests.post(refresh_url, json=data, headers=headers)
# { userId: string; refreshToken: string }
if 200 <= refresh_response.status_code < 300:
    tokens = refresh_response.json()
    print("Tokens:")
    print(tokens)
else:
    print("Failed to fetch refresh token")
    print(refresh_response.text)