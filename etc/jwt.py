import requests

# 서버 URL
BASE_URL = "http://localhost:3000"
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
    print(f"Access Token: {access_token}")
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

if users_response.status_code == 200:
    users = users_response.json()
    print("Users List:")
    print(users)
else:
    print("Failed to fetch users")
    print(users_response.text)
