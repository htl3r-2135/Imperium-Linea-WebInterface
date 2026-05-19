## Getting Started

First, run the development server:

- Create a self-signed certificate:
```bash
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/certs/privkey.pem -out ./nginx/certs/fullchain.pem -subj "/C=AT/ST=Vienna/L=Vienna/O=Imperium Linea Interface/CN=imperiumlineainterface.com"
```

- Make the .env
```dotenv
POSTGRES_USER=appuser
POSTGRES_PASSWORD=changeme_use_a_strong_password
POSTGRES_DB=appdb
LEADERBOARD_SECRET=d504b6c8b58cc6519f30143bbf0497c08a72a2ceb5f1054aedd295feba525aa2
```

- Run docker 
```bash
docker compose up -d --build                # PROD
```

- Rebuild APP
```bash
docker compose up -d --build app 
```