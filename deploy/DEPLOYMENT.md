# JW Website Production Deployment

## Project structure

```text
JW Website/
├── assets/
├── index.html
├── add-user.html
├── excommunicado.html
├── location.html
├── *.css / *.js
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/jwplatform/registry/...
│       └── resources/application.properties
└── deploy/
    ├── DEPLOYMENT.md
    ├── mysql/bootstrap.sql
    ├── nginx/jw-frontend.conf
    └── systemd/
        ├── jw-registry.service
        └── jw-registry.env.example
```

## 1. Database layer

1. Provision a MySQL database or RDS MySQL instance in a private subnet.
2. Connect as an admin user and run:

```sql
SOURCE /path/to/bootstrap.sql;
```

3. Make sure the database security group allows inbound `3306` only from the backend EC2 security group.
4. If you want Hibernate to create or evolve the table automatically, keep `JPA_DDL_AUTO=update`.
5. If you want stricter schema control later, create the table once and set `JPA_DDL_AUTO=validate`.

## 2. Backend layer

1. Install Java 21 and Maven on the backend EC2 instance.

```bash
sudo dnf install -y java-21-amazon-corretto java-21-amazon-corretto-devel maven
```

2. Copy the `backend/` directory to the backend EC2 instance.
3. Build the application:

```bash
cd /opt/jw-registry/source/backend
mvn clean package
```

4. Copy the built JAR to the runtime directory:

```bash
sudo mkdir -p /opt/jw-registry
sudo cp target/app.jar /opt/jw-registry/app.jar
sudo chown -R ec2-user:ec2-user /opt/jw-registry
```

5. Create the environment file:

```bash
sudo mkdir -p /etc/jw-registry
sudo cp /opt/jw-registry/source/deploy/systemd/jw-registry.env.example /etc/jw-registry/jw-registry.env
sudo chmod 600 /etc/jw-registry/jw-registry.env
```

6. Edit `/etc/jw-registry/jw-registry.env` and set the real database values:

```bash
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/jw_registry?useSSL=true&serverTimezone=UTC
SPRING_DATASOURCE_USERNAME=jw_registry_user
SPRING_DATASOURCE_PASSWORD=your-strong-password
JPA_DDL_AUTO=update
APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.example
```

7. Install the systemd service:

```bash
sudo cp /opt/jw-registry/source/deploy/systemd/jw-registry.service /etc/systemd/system/jw-registry.service
sudo systemctl daemon-reload
sudo systemctl enable jw-registry
sudo systemctl start jw-registry
```

8. Verify the backend:

```bash
curl http://localhost:8080/health
curl http://localhost:8080/api/users
sudo systemctl status jw-registry
sudo journalctl -u jw-registry -f
```

9. Register the backend EC2 instances in a private ALB target group that forwards to port `8080`.

## 3. Frontend layer

1. Install NGINX on the frontend EC2 instance:

```bash
sudo dnf install -y nginx
```

2. Copy the static site files to `/var/www/html`:

```bash
sudo mkdir -p /var/www/html
sudo cp /path/to/JW\ Website/index.html /var/www/html/
sudo cp /path/to/JW\ Website/add-user.html /var/www/html/
sudo cp /path/to/JW\ Website/excommunicado.html /var/www/html/
sudo cp /path/to/JW\ Website/location.html /var/www/html/
sudo cp /path/to/JW\ Website/*.css /var/www/html/
sudo cp /path/to/JW\ Website/*.js /var/www/html/
sudo cp -R /path/to/JW\ Website/assets /var/www/html/
```

3. Install the NGINX site config:

```bash
sudo cp /path/to/JW\ Website/deploy/nginx/jw-frontend.conf /etc/nginx/conf.d/jw-frontend.conf
```

4. Replace `<PRIVATE_ALB_DNS>` in the config with the actual private ALB DNS name.
5. Test and reload NGINX:

```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

6. Register the frontend EC2 instances in a public ALB target group that forwards to port `80`.

## 4. End-to-end flow

1. Browser hits the public ALB.
2. Public ALB forwards traffic to the frontend EC2 instances running NGINX.
3. NGINX serves static assets locally.
4. Frontend calls `fetch("/api/users")`.
5. NGINX proxies `/api/` requests to the private ALB.
6. Private ALB forwards to backend EC2 instances running the Spring Boot JAR.
7. Spring Boot reads and writes user data in MySQL.

## 5. Local backend commands

From the `backend/` directory:

```bash
mvn clean package
java -jar target/app.jar
```

## 6. Security notes

1. Do not hardcode database credentials in `application.properties`.
2. Keep the database in private subnets and restrict security groups tightly.
3. Terminate public TLS at the public ALB and private TLS at the backend side if your policy requires it.
4. Use a secrets manager or at minimum a locked-down environment file on EC2.
5. Keep CORS empty unless the frontend and backend are on different origins.
