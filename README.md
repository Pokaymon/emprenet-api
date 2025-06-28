# Emprenet API

**Emprenet API** es el backend del proyecto **SynkUp**, una red social institucional creada para fomentar el emprendimiento estudiantil en las Unidades Tecnológicas de Santander (UTS).

Este servicio expone una API RESTful desarrollada en **Node.js** y **Express**, diseñada para gestionar usuarios, perfiles, publicaciones, conexiones, y funcionalidades clave de la plataforma SynkUp.

---

## 🚀 Características principales

- API RESTful organizada por módulos
- Gestión de usuarios y sesiones
- Registro y consulta de emprendimientos
- Publicaciones, comentarios y reacciones
- Escalabilidad y despliegue en AWS EC2
- Subdominio personalizado: `api.emprenet.work`

---

## 📦 Tecnologías utilizadas

- **Node.js** + **Express**
- **MongoDB** (futuro o actual si ya integrado)
- **PM2** para gestión de procesos (en servidor)
- **Apache2** como reverse proxy
- **HTTPS con Let's Encrypt**
- **Cloudflare** para gestión de dominio y DNS

---

## 🌐 Acceso a producción

La API está desplegada en AWS EC2 y accesible públicamente en:

- https://api.emprenet.work

> ⚠️ Algunas rutas pueden requerir autenticación.
