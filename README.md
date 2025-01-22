# FULL COMPONENTS (Ubuntu tutorial) - Tất cả các command ở bước này đều cần chạy ở đường dẫn có source code

Bước 1: Cài đặt Docker và Docker compose

`bash install.sh`

Bước 2: Cài đặt toàn bộ các service liên quan (có thể mất vài phút)

`docker compose up -d --build`

Bước 3: Restart backend service (trong trường hợp lỗi)

`docker restart bkauto-be`

Các service sẽ có các port tương ứng:

- Backend: 6066
- Frontend: 5173
- Postgres DB: 5433

# SETUP WEBHOSTS (Nginx)

Bước 1: Setup Nginx (default config) & Certbot

https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04
https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04 (Dừng sau khi xong bước 3 của tutorial này)

Bước 2: Setup host cho BKAuto - Bước này giả định các config về tên miền và DNS đã phù hợp (domain bkauto.vn trỏ vào đúng IP server đang host)

- Tạo file bkauto.vn.conf ở đường dẫn /etc/nginx/conf, content như sau:

```
upstream frontend {
    server 127.0.0.1:5173;
}

upstream backend {
    server 127.0.0.1:6066;
}

server {
    listen 80;

    server_name bkauto.vn;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_set_header        Host $host:$server_port;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        return 301 https://bkauto.vn$request_uri;
    }
}
```

Chạy lệnh sau để reload config nginx

```
sudo nginx -s reload
```

Bước 3: Tạo certificate cho domain bkauto.vn bằng certbot

```
sudo certbot --nginx -d bkauto.vn
```

Output thông thường sẽ có đường dẫn đến 2 file:

- Congratulations! Your certificate and chain have been saved at:

  /etc/letsencrypt/live/bkauto.vn/fullchain.pem

  Your key file has been saved at:

  /etc/letsencrypt/live/bkauto.vn/privkey.pem

Bước 4: Sửa config bkauto.vn ở bước 2 với certificate mới - CHÚ Ý SỬA THAM SỐ ssl_certificate & ssl_certificate_key khớp với đường dẫn được tạo ra ở bước 3

```
upstream frontend {
    server 127.0.0.1:5173;
}

upstream backend {
    server 127.0.0.1:6066;
}

server {
    if ($host = bkauto.vn) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    listen 80;

    server_name bkauto.vn;
    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_set_header        Host $host:$server_port;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        return 301 https://bkauto.vn$request_uri;
    }


}

server {
    listen 443 ssl;
    server_name bkauto.vn;
    root /var/www/bkauto.vn/html;
    index index.html index.htm index.nginx-debian.html;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
  
    access_log /logs/bkauto-access-logs.log;
    error_log /logs/bkauto-error-logs.log;
    ssl_certificate /etc/letsencrypt/live/bkauto.vn/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/bkauto.vn/privkey.pem; # managed by Certbot

    ssl_session_timeout 5m;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers "EECDH+ECDSA+AESGCM EECDH+aRSA+AESGCM EECDH+ECDSA+SHA384 EECDH+ECDSA+SHA256 EECDH+aRSA+SHA384 EECDH+aRSA+SHA256 EECDH+aRSA+RC4 EECDH EDH+aRSA RC4 !aNULL !eNULL !LOW !3DES !MD5 !EXP !PSK !SRP !DSS !RC4";

    location / {
        proxy_set_header        Host $host:$server_port;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_redirect http:// https://;
        proxy_pass              http://frontend;
        # Required for new HTTP-based CLI
        proxy_http_version 1.1;
        proxy_request_buffering off;
        proxy_buffering off; # Required for HTTP-based CLI to work over SSL
    }

    location /api {
        proxy_set_header        Host $host:$server_port;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_redirect http:// https://;
        proxy_pass              http://backend/;
        # Required for new HTTP-based CLI
        proxy_http_version 1.1;
        proxy_request_buffering off;
        proxy_buffering off; # Required for HTTP-based CLI to work over SSL
    }

    location /base {
        proxy_set_header        Host $host:$server_port;
        proxy_set_header        X-Real-IP $remote_addr;
        proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header        X-Forwarded-Proto $scheme;
        proxy_redirect http:// https://;
        proxy_pass              http://backend;
        # Required for new HTTP-based CLI
        proxy_http_version 1.1;
        proxy_request_buffering off;
        proxy_buffering off; # Required for HTTP-based CLI to work over SSL
    }

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

}

```
