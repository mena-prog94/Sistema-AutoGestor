# Sistema AutoGestor 📱🚘

Bienvenido al repositorio oficial de **Sistema AutoGestor**, una solución móvil híbrida nativa desarrollada para optimizar de punta a punta el control de inventarios, auditoría y flujos operativos en los patios de exhibición automotriz. 

Este proyecto sustituye de forma definitiva los procesos tradicionales basados en registros físicos de papel, erradicando ineficiencias de transcripción y duplicidad de tareas mediante el uso de tecnología móvil en el terreno.

---

## 🛠️ Stack Tecnológico Utilizado

Conforme al análisis de distribución de código de este repositorio, el ecosistema técnico está compuesto por:
* **Framework Principal:** Ionic Framework v7+ (Componentes Standalone)
* **Arquitectura del Frontend:** Angular & TypeScript (40.6% del proyecto)
* **Estilos y Maquetación:** SCSS Avanzado (35.1%) y hojas HTML nativas de Ionic (22.7%)
* **Runtime Nativo:** Capacitor Native Config (`capacitor.config.ts`)
* **Lógica del Servidor (API):** PHP 8 orientado a objetos con conexión PDO segura.
* **Base de Datos:** MySQL Server Remoto.

---

## 📐 Patrón de Arquitectura (MVVM)

El software sigue estrictamente el patrón arquitectónico **Model-View-ViewModel (MVVM)** para garantizar un desacoplamiento óptimo y modularidad:

* **Model (`src/app/models`):** Define las interfaces de datos estructuradas e inmutables en TypeScript para Vehículos, Usuarios y Repuestos.
* **ViewModel (`src/app/services`):** Servicios reactivos e inyectables en Angular que encapsulan la lógica de negocio, controlan los estados de la aplicación e interactúan de forma asíncrona mediante peticiones HTTP con la API RESTful.
* **View (`src/app/views`):** Componentes visuales independientes de Ionic encargados de renderizar la interfaz de usuario con validaciones en tiempo real y componentes interactivos como `ion-searchbar` para búsquedas predictivas.

---

## ⚙️ Instrucciones de Instalación y Despliegue Local

### Requisitos Mínimos
* Node.js (Versión LTS estable)
* Servidor Local Apache/MySQL (XAMPP o Laragon para la API en PHP)
* CLI de Ionic instalado de forma global:
  ```bash
  npm install -g @ionic/cli
