# 🚀 Deploy em Produção - LaraFit

Guia completo para deploy do LaraFit em servidor Ubuntu com **Nuxt Server + Apache Reverse Proxy + PostgreSQL (Docker)**.

## 📋 Pré-requisitos

### Servidor
- Ubuntu 20.04+ ou Debian 11+
- Mínimo 2GB RAM (recomendado 4GB)
- Node.js 20.x LTS
- Apache 2.4+
- Docker + Docker Compose
- Git

### Domínio
- Domínio configurado apontando para o IP do servidor
- (Opcional) Certificado SSL via Let's Encrypt

---

## 🛠️ Passo a Passo

### 1. Instalar Dependências do Sistema

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verificar instalação
node --version  # deve ser v20.x
npm --version

# Instalar Apache e módulos
sudo apt install -y apache2
sudo a2enmod proxy proxy_http headers rewrite ssl

# Instalar Docker e Docker Compose
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

# Permitir usuário executar docker (opcional)
sudo usermod -aG docker $USER
```

---

### 2. Clonar e Preparar o Projeto

```bash
# Criar diretório do projeto
sudo mkdir -p /var/www/html/larafit-v2
cd /var/www/html/larafit-v2

# Clonar repositório
git clone https://github.com/seu-usuario/larafit-v2.git .

# Ajustar permissões
sudo chown -R www-data:www-data /var/www/html/larafit-v2
```

---

### 3. Configurar Banco de Dados (PostgreSQL com Docker)

```bash
cd /var/www/html/larafit-v2

# Iniciar PostgreSQL
docker compose up -d postgres

# Verificar se está rodando
docker compose ps

# Logs (caso necessário)
docker compose logs postgres -f
```

O banco estará disponível em `localhost:5432` com:
- **Usuário**: `postgres`
- **Senha**: `postgres`
- **Database**: `larafit`

---

### 4. Configurar Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:

```bash
sudo nano /var/www/html/larafit-v2/.env
```

Adicione as seguintes variáveis:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/larafit"

# JWT Secret (IMPORTANTE: gerar uma chave forte em produção)
JWT_SECRET="sua-chave-secreta-super-segura-aqui-32-caracteres"

# Nuxt Server
NUXT_HOST=127.0.0.1
NUXT_PORT=3000
NODE_ENV=production
```

**⚠️ IMPORTANTE**: Gerar JWT_SECRET seguro:
```bash
openssl rand -base64 32
```

---

### 5. Instalar Dependências e Build

```bash
cd /var/www/html/larafit-v2

# Instalar dependências
npm install --production=false

# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate deploy

# Popular banco de dados (seed)
npx prisma db seed

# Build para produção
npm run build
```

O build criará a pasta `.output/` com o servidor Node.js otimizado.

---

### 6. Criar Serviço Systemd

Crie o arquivo de serviço:

```bash
sudo nano /etc/systemd/system/larafit.service
```

Cole o seguinte conteúdo:

```ini
[Unit]
Description=LaraFit Nuxt Server
After=network.target docker.service
Wants=docker.service

[Service]
Type=simple
WorkingDirectory=/var/www/html/larafit-v2
EnvironmentFile=/var/www/html/larafit-v2/.env
ExecStart=/usr/bin/node /var/www/html/larafit-v2/.output/server/index.mjs
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=larafit

# Security
User=www-data
Group=www-data
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**Ativar e iniciar o serviço:**

```bash
# Recarregar systemd
sudo systemctl daemon-reload

# Habilitar inicialização automática
sudo systemctl enable larafit

# Iniciar serviço
sudo systemctl start larafit

# Verificar status
sudo systemctl status larafit

# Ver logs
sudo journalctl -u larafit -f
```

---

### 7. Configurar Apache como Reverse Proxy

#### Sem SSL (HTTP)

Crie o VirtualHost:

```bash
sudo nano /etc/apache2/sites-available/larafit.conf
```

```apache
<VirtualHost *:80>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/larafit-error.log
    CustomLog ${APACHE_LOG_DIR}/larafit-access.log combined

    # Proxy para Nuxt Server
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Headers de segurança
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
</VirtualHost>
```

Ativar o site:

```bash
sudo a2ensite larafit.conf
sudo systemctl restart apache2
```

#### Com SSL (HTTPS) - Recomendado

```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-apache

# Obter certificado SSL
sudo certbot --apache -d seu-dominio.com -d www.seu-dominio.com

# Escolher opção 2 para redirecionar HTTP -> HTTPS
```

O Certbot criará automaticamente o VirtualHost na porta 443 e configurará renovação automática.

O arquivo final ficará assim:

```apache
<VirtualHost *:443>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com

    # SSL
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/seu-dominio.com/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/seu-dominio.com/privkey.pem

    # Logs
    ErrorLog ${APACHE_LOG_DIR}/larafit-error.log
    CustomLog ${APACHE_LOG_DIR}/larafit-access.log combined

    # Proxy para Nuxt Server
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # Headers de segurança
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</VirtualHost>

# Redirecionar HTTP para HTTPS
<VirtualHost *:80>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com
    Redirect permanent / https://seu-dominio.com/
</VirtualHost>
```

---

## 🔧 Comandos Úteis

### Gerenciar Serviço LaraFit

```bash
# Ver status
sudo systemctl status larafit

# Iniciar
sudo systemctl start larafit

# Parar
sudo systemctl stop larafit

# Reiniciar
sudo systemctl restart larafit

# Ver logs em tempo real
sudo journalctl -u larafit -f

# Ver últimos 100 logs
sudo journalctl -u larafit -n 100
```

### Gerenciar Banco de Dados

```bash
# Parar banco
docker compose stop postgres

# Iniciar banco
docker compose start postgres

# Ver logs do banco
docker compose logs postgres -f

# Acessar shell do PostgreSQL
docker exec -it larafit-postgres psql -U postgres -d larafit

# Backup do banco
docker exec larafit-postgres pg_dump -U postgres larafit > backup_$(date +%Y%m%d).sql

# Restaurar backup
docker exec -i larafit-postgres psql -U postgres larafit < backup_20260212.sql
```

### Gerenciar Apache

```bash
# Verificar configuração
sudo apache2ctl configtest

# Reiniciar
sudo systemctl restart apache2

# Ver logs de erro
sudo tail -f /var/log/apache2/larafit-error.log

# Ver logs de acesso
sudo tail -f /var/log/apache2/larafit-access.log
```

---

## 🚀 Atualizar Aplicação (Deploy de Nova Versão)

```bash
cd /var/www/html/larafit-v2

# Baixar alterações
git pull origin main

# Instalar novas dependências (se houver)
npm install

# Executar migrations (se houver)
npx prisma migrate deploy
npx prisma generate

# Rebuild
npm run build

# Reiniciar serviço
sudo systemctl restart larafit
```

---

## 🐛 Troubleshooting

### Serviço não inicia

```bash
# Ver logs detalhados
sudo journalctl -u larafit -xe

# Verificar sintaxe do arquivo .env
cat /var/www/html/larafit-v2/.env

# Testar build manualmente
cd /var/www/html/larafit-v2
node .output/server/index.mjs
```

### Erro de conexão com banco

```bash
# Verificar se PostgreSQL está rodando
docker compose ps

# Testar conexão
docker exec -it larafit-postgres psql -U postgres -l

# Verificar DATABASE_URL no .env
grep DATABASE_URL /var/www/html/larafit-v2/.env
```

### Apache não conecta ao Nuxt

```bash
# Verificar se Nuxt está rodando
sudo systemctl status larafit

# Testar conexão local
curl http://127.0.0.1:3000

# Verificar logs do Apache
sudo tail -f /var/log/apache2/error.log
```

### Erro 502 Bad Gateway

- Verificar se o serviço LaraFit está rodando: `sudo systemctl status larafit`
- Verificar se a porta 3000 está sendo usada: `sudo netstat -tulpn | grep 3000`
- Verificar logs: `sudo journalctl -u larafit -n 50`

### Site muito lento

```bash
# Verificar uso de recursos
top
htop

# Verificar espaço em disco
df -h

# Adicionar swap se necessário (2GB)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 🔐 Credenciais Padrão (Seed)

Após executar `npx prisma db seed`, as seguintes contas estarão disponíveis:

| Papel      | Email                     | Senha        |
|------------|---------------------------|--------------|
| Admin      | admin@larafit.com         | admin123     |
| Professor  | joao.silva@larafit.com    | professor123 |
| Aluno      | carlos@email.com          | aluno123     |

**⚠️ IMPORTANTE**: Altere essas senhas em produção!

---

## 📊 Monitoramento

### Verificar saúde dos serviços

```bash
# Criar script de monitoramento
sudo nano /usr/local/bin/larafit-health.sh
```

```bash
#!/bin/bash
echo "=== LaraFit Health Check ==="
echo ""
echo "Nuxt Server:"
systemctl is-active larafit
echo ""
echo "PostgreSQL:"
docker compose ps postgres
echo ""
echo "Apache:"
systemctl is-active apache2
echo ""
echo "Disco:"
df -h /var/www
```

```bash
sudo chmod +x /usr/local/bin/larafit-health.sh
/usr/local/bin/larafit-health.sh
```

---

## 🔄 Renovação Automática SSL

O Certbot configura renovação automática. Para testar:

```bash
# Teste de renovação (dry-run)
sudo certbot renew --dry-run

# Ver timer de renovação automática
sudo systemctl list-timers | grep certbot
```

---

## 📦 Backup Automatizado

Crie um cron job para backup diário:

```bash
sudo nano /usr/local/bin/larafit-backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/larafit"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup do banco
docker exec larafit-postgres pg_dump -U postgres larafit > $BACKUP_DIR/db_$DATE.sql

# Backup do .env
cp /var/www/html/larafit-v2/.env $BACKUP_DIR/env_$DATE

# Manter apenas últimos 7 backups
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup concluído: $DATE"
```

```bash
sudo chmod +x /usr/local/bin/larafit-backup.sh

# Adicionar ao crontab (executar todo dia às 3h)
sudo crontab -e
```

Adicione a linha:
```
0 3 * * * /usr/local/bin/larafit-backup.sh >> /var/log/larafit-backup.log 2>&1
```

---

## ✅ Checklist Final

- [ ] PostgreSQL rodando no Docker
- [ ] Variáveis de ambiente configuradas (.env)
- [ ] Migrations executadas
- [ ] Seed executado (dados de teste)
- [ ] Build de produção criado
- [ ] Serviço systemd ativo e habilitado
- [ ] Apache configurado como proxy
- [ ] SSL configurado (se aplicável)
- [ ] Firewall configurado (portas 80, 443)
- [ ] Senhas padrão alteradas
- [ ] Backup automatizado configurado
- [ ] Logs funcionando corretamente

---

## 🎉 Tudo Pronto!

Seu LaraFit está rodando em produção com:
- ✅ Auto-start no boot do servidor
- ✅ Auto-restart em caso de falha
- ✅ Proxy reverso Apache
- ✅ SSL/HTTPS (opcional)
- ✅ Logs centralizados
- ✅ Backup automatizado

**Acesse**: https://seu-dominio.com

---

**Desenvolvido com ❤️ usando Nuxt 3 + Prisma + PostgreSQL**
