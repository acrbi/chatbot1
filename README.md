# 🤖 ChatBot FAQ — Asistente Virtual Multicanal

![Docker](https://img.shields.io/badge/Docker-20.10%2B-2496ED?style=flat-square&logo=docker&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20%20LTS-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19-000000?style=flat-square&logo=express&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-Cloud%20API-25D366?style=flat-square&logo=whatsapp&logoColor=white)
![nginx](https://img.shields.io/badge/nginx-alpine-009639?style=flat-square&logo=nginx&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

Chatbot de atención al cliente deployable con un solo comando. Responde preguntas frecuentes (FAQs) tanto desde un **widget web embebible** como desde **WhatsApp Business**, con toda la infraestructura contenerizada en **Docker** y los patrones de respuesta configurables desde un archivo JSON sin tocar código.

---

## 📋 Tabla de contenidos

- [Características](#-características)
- [Demo](#-demo)
- [Arquitectura](#-arquitectura)
- [Requisitos](#-requisitos)
- [Instalación rápida](#-instalación-rápida)
- [Configuración](#-configuración)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Personalizar las respuestas](#-personalizar-las-respuestas)
- [API Reference](#-api-reference)
- [Integración con WhatsApp](#-integración-con-whatsapp)
- [Acceso desde otros equipos](#-acceso-desde-otros-equipos)
- [Despliegue en producción](#-despliegue-en-producción)
- [Roadmap](#-roadmap)
- [Licencia](#-licencia)

---

## ✨ Características

- 💬 **Widget web embebible** — se integra en cualquier sitio con una línea de código
- 📱 **WhatsApp Business** — recibe y responde mensajes vía Meta Cloud API (gratuita)
- 🧠 **FAQs editables en JSON** — personaliza preguntas y respuestas sin tocar código
- 🐳 **100% Dockerizado** — frontend (nginx) + backend (Node.js) en contenedores aislados
- 🌐 **Multicanal unificado** — un mismo motor de respuestas atiende web y WhatsApp
- 🔀 **Proxy reverso con nginx** — un solo puerto expuesto al usuario, sin problemas de CORS
- 📡 **API REST** — endpoints documentados para integrarse con otros sistemas
- 🩺 **Health check** — endpoint `/health` para monitoreo del servicio

---

## 🖼️ Demo

```
┌─────────────────────────┐
│  🤖 Asistente Virtual   │
├─────────────────────────┤
│                          │
│  Bot: ¡Hola! ¿En qué    │
│  puedo ayudarte?         │
│                          │
│      Usuario: horarios ▶ │
│                          │
│  Bot: Nuestro horario    │
│  es de 9am a 6pm, de    │
│  lunes a viernes.        │
│                          │
├─────────────────────────┤
│ [Escribe un mensaje...] ▶│
└─────────────────────────┘
```

El widget flota en la esquina inferior derecha de cualquier página web y es completamente responsive.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                      DOCKER HOST                          │
│                                                           │
│  ┌──────────────────────┐     ┌─────────────────────┐   │
│  │  CONTAINER: frontend  │     │  CONTAINER: backend  │   │
│  │  ─────────────────── │     │  ──────────────────  │   │
│  │  nginx:alpine         │     │  node:20-alpine       │   │
│  │  Puerto: 80 → 8080    │────▶│  Puerto: 3000         │   │
│  │  Sirve: HTML/CSS/JS   │HTTP │  Express REST API     │   │
│  │  Proxy /api → backend │     │  Motor de FAQs (JSON) │   │
│  └──────────────────────┘     └──────────┬────────────┘  │
│                                           │               │
│           Red interna: chatbot-network    │               │
└───────────────────────────────────────────┼───────────────┘
                                            │ HTTPS
                    ┌───────────────────────┘
                    ▼
        Meta WhatsApp Cloud API
                    │
           [Usuario en WhatsApp]

[Navegador del usuario]
   http://IP-servidor:8080
```

**Stack tecnológico:**

| Capa | Tecnología | Versión |
|------|------------|---------|
| Servidor web / proxy | nginx | alpine |
| Runtime backend | Node.js | 20 LTS |
| Framework API | Express | 4.19 |
| Mensajería | Meta WhatsApp Cloud API | v19 |
| Contenedores | Docker + Docker Compose | v2 |
| OS recomendado | Ubuntu | 24.04 / 26.04 LTS |

---

## 📦 Requisitos

- **Docker** 20.10 o superior
- **Docker Compose v2** (incluido en Docker Desktop y Docker Engine moderno)
- Cuenta en **Meta for Developers** _(solo para la integración con WhatsApp)_

Verificar instalación:

```bash
docker --version
docker compose version
```

---

## 🚀 Instalación rápida

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/chatbot-faq.git
cd chatbot-faq
```

### 2. Configurar variables de entorno

```bash
cp backend/.env.example backend/.env
```

Editar `backend/.env` con tus valores (ver sección [Configuración](#-configuración)).

### 3. Levantar todos los servicios

```bash
docker compose up --build -d
```

### 4. Verificar que todo está corriendo

```bash
docker compose ps
curl http://localhost:3000/health
```

### 5. Abrir el widget

Navegar a **`http://localhost:8080`**

---

## ⚙️ Configuración

Editar `backend/.env`:

```env
# Servidor
PORT=3000

# WhatsApp Cloud API (Meta)
WHATSAPP_TOKEN=tu_access_token_de_meta
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
WHATSAPP_VERIFY_TOKEN=string_secreto_que_tu_eliges
```

> ⚠️ El archivo `.env` está en `.gitignore` por defecto. Nunca lo subas al repositorio.

---

## 📁 Estructura del proyecto

```
chatbot-faq/
│
├── docker-compose.yml          # Orquestación de los contenedores
│
├── frontend/
│   ├── Dockerfile              # Imagen nginx:alpine
│   ├── nginx.conf              # Proxy reverso hacia el backend
│   ├── index.html              # Página de demo con el widget
│   ├── style.css               # Estilos del widget de chat
│   └── chat.js                 # Lógica del cliente (fetch + detección de IP)
│
├── backend/
│   ├── Dockerfile              # Imagen node:20-alpine
│   ├── server.js               # Entry point: rutas Express
│   ├── whatsapp.js             # Webhook y envío de mensajes via Meta API
│   ├── intents.json            # FAQs: patrones de entrada y respuestas
│   ├── package.json
│   ├── .env                    # Variables de entorno (NO subir al repo)
│   ├── .env.example            # Template de variables
│   └── .dockerignore
│
└── README.md
```

---

## 🧠 Personalizar las respuestas

Todas las respuestas del bot se configuran en `backend/intents.json`. Cada intent tiene un array de `patterns` (palabras clave que el usuario puede escribir) y una `response` (lo que responde el bot).

```json
[
  {
    "patterns": ["hola", "buenas", "hey"],
    "response": "¡Hola! ¿En qué puedo ayudarte hoy?"
  },
  {
    "patterns": ["horario", "hora", "abren"],
    "response": "Nuestro horario es de 9am a 6pm, de lunes a viernes."
  },
  {
    "patterns": ["precio", "costo", "cuanto cuesta"],
    "response": "Los precios varían según el servicio. ¿Podrías indicarme cuál te interesa?"
  },
  {
    "patterns": ["contacto", "telefono", "email"],
    "response": "Puedes contactarnos al +51 999 999 999 o info@empresa.com"
  },
  {
    "patterns": ["ubicacion", "direccion", "donde estan"],
    "response": "Estamos ubicados en Av. Principal 123, Lima."
  }
]
```

Después de editar el archivo, reconstruir el contenedor backend:

```bash
docker compose restart backend
```

---

## 📡 API Reference

### Chat web

**`POST /api/chat`**

Envía un mensaje y recibe la respuesta del bot.

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "hola"}'
```

**Respuesta:**
```json
{
  "reply": "¡Hola! ¿En qué puedo ayudarte hoy?"
}
```

**Parámetros del body:**

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| message | string | ✅ | Texto enviado por el usuario |

**Códigos de respuesta:**

| Código | Significado |
|--------|-------------|
| 200 | Respuesta generada correctamente |
| 400 | El campo `message` está vacío o ausente |
| 500 | Error interno del servidor |

### Sistema

**`GET /health`**

Verifica que el servidor está funcionando.

```bash
curl http://localhost:3000/health
```

```json
{ "status": "ok" }
```

### WhatsApp Webhook

**`GET /webhook`** — Verificación del webhook por Meta _(automático al configurar)_

**`POST /webhook`** — Recepción de mensajes entrantes desde WhatsApp

---

## 📱 Integración con WhatsApp

### Paso 1 — Crear la app en Meta

1. Ir a [Meta for Developers](https://developers.facebook.com/) y crear una App tipo **Business**
2. Agregar el producto **WhatsApp** a la app
3. Obtener desde el panel:
   - **Access Token** (temporal 24h para pruebas, permanente en producción)
   - **Phone Number ID**

### Paso 2 — Exponer el webhook (pruebas locales)

Meta requiere HTTPS público. Para desarrollo, usar **ngrok**:

```bash
# Instalar ngrok
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
  | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
  | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update && sudo apt install ngrok

# Autenticar (token gratuito en ngrok.com)
ngrok config add-authtoken TU_NGROK_TOKEN

# Crear túnel al backend
ngrok http 3000
# → https://abc123.ngrok-free.app
```

### Paso 3 — Configurar el webhook en Meta

En **WhatsApp → Configuration** del panel de Meta:

| Campo | Valor |
|-------|-------|
| Callback URL | `https://abc123.ngrok-free.app/webhook` |
| Verify Token | el valor de `WHATSAPP_VERIFY_TOKEN` en tu `.env` |

Click en **"Verify and Save"** y suscribirse al campo **messages**.

### Paso 4 — Probar

Enviar un mensaje desde un número autorizado (agregado en "To" de la lista de testers). El bot responderá en segundos.

> ℹ️ En modo desarrollo Meta solo permite responder a hasta 5 números pre-autorizados. Para uso en producción el cliente debe verificar su cuenta Meta Business.

---

## 🌐 Acceso desde otros equipos

`localhost` solo funciona en la misma máquina donde corre Docker. Para acceder desde otro equipo en la red:

### 1. Obtener la IP del servidor

```bash
hostname -I
# Ejemplo: 192.168.1.50
```

### 2. Abrir puertos en el firewall

```bash
sudo ufw allow 8080/tcp
sudo ufw allow 3000/tcp
```

### 3. El frontend detecta la IP automáticamente

`chat.js` usa `window.location.hostname` para construir la URL del backend, por lo que funciona desde cualquier equipo sin necesidad de editar código:

```javascript
const API_URL = `http://${window.location.hostname}:3000/api/chat`;
```

Abrir desde el otro equipo: `http://192.168.1.50:8080`

---

## 🌍 Despliegue en producción

### Buenas prácticas

En producción se recomienda no exponer el puerto 3000 directamente. Descomentar la sección en `docker-compose.yml` para que nginx sea el único punto de entrada:

```yaml
backend:
  # ports:           # comentar en producción
  #   - "3000:3000"
  expose:
    - "3000"         # solo accesible entre contenedores
```

### Comandos de operación

```bash
# Levantar en background
docker compose up -d --build

# Ver logs en tiempo real
docker compose logs -f backend

# Reiniciar solo el backend (tras actualizar intents.json)
docker compose restart backend

# Ver estado de los contenedores
docker compose ps

# Detener todos los servicios
docker compose down
```

### Token permanente de WhatsApp

Para producción, reemplazar el access token temporal por uno permanente generado con un **System User** en Meta Business Settings → Users → System Users.

---

## 🗺️ Roadmap

- [x] Widget de chat web embebible
- [x] Motor de FAQs configurable en JSON
- [x] Normalización de texto (tildes, mayúsculas)
- [x] Integración con WhatsApp Cloud API
- [x] Arquitectura 100% Dockerizada con nginx proxy
- [x] Detección automática de IP para acceso en red local
- [ ] Panel admin web para gestionar FAQs sin editar JSON
- [ ] Persistencia de conversaciones en base de datos (PostgreSQL)
- [ ] Fallback a IA (Claude / OpenAI) para preguntas no cubiertas
- [ ] Soporte para mensajes multimedia en WhatsApp
- [ ] Métricas y dashboard de conversaciones
- [ ] Integración con Instagram Messaging (misma Meta API)
- [ ] Autenticación JWT para el panel admin

---

## 📄 Licencia

Este proyecto está bajo la licencia **MIT**. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

Desarrollado con ❤️ · Publicado en [Workana](https://www.workana.com)

</div>
