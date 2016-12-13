# Portion Control

## How to deploy to Web Store via API

1. Generate API code from website

```bash
https://accounts.google.com/o/oauth2/auth?response_type=code&scope=https://www.googleapis.com/auth/chromewebstore&client_id=$CLIENT_ID&redirect_uri=urn:ietf:wg:oauth:2.0:oob
```

2. Take code and generate token

```bash
curl "https://accounts.google.com/o/oauth2/token" -d \
"client_id=$CLIENT_ID&client_secret=$CLIENT_SECRET&code=$CODE&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob"
```
Which will return something like

```bash 
ya29.Ci-zA9UHTTqM3xZtLOHkxTtFAKEiYuf4Dlhg8qhHqTo3abHxZ2m3wfBPoU8xdJjk6g
```

3. Take token and upload zip

```bash
curl \
-H "Authorization: Bearer $TOKEN"  \
-H "x-goog-api-version: 2" \
-X PUT \
-T $FILE_NAME \
-v \
https://www.googleapis.com/upload/chromewebstore/v1.1/items/$APP_ID
```
