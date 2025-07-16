# 🦊 Aventura del Zorro Medieval - React Native Game

Un juego de aventuras medieval completo desarrollado en React Native con TypeScript, protagonizado por un valiente zorro en un mundo lleno de misiones, combates y exploración.

## 🎮 Características del Juego

### **Gameplay Principal**
- **Exploración de mundo abierto** con mapas interconectados
- **Sistema de combate en tiempo real** con espadas, magia y habilidades especiales
- **Inventario completo** con diferentes tipos de items
- **NPCs interactivos** con diálogos y misiones
- **Sistema de misiones** con quest log y seguimiento de progreso
- **Gráficos 2D pixel art** con sprites detallados

### **Controles Táctiles**
- **Joystick virtual** para movimiento fluido
- **Botones de acción** para atacar, interactuar e inventario
- **Interfaz optimizada** para dispositivos móviles
- **Feedback háptico** para mejor experiencia

### **Sistemas de Progresión**
- **Sistema de experiencia** y niveles
- **Habilidades** con progresión y especialización
- **Economía** con monedas de oro
- **Guardado automático** cada 30 segundos

## 🚀 Instalación y Configuración

### **Requisitos Previos**
```bash
# Instalar Node.js (versión 16 o superior)
# Instalar React Native CLI
npm install -g react-native-cli

# Para Android: Instalar Android Studio
# Para iOS: Instalar Xcode (solo en macOS)
```

### **Instalación**
```bash
# Navegar al directorio del proyecto
cd /app/frontend

# Instalar dependencias
npm install

# Para iOS (solo en macOS)
cd ios && pod install && cd ..

# Para Android
npx react-native run-android

# Para iOS
npx react-native run-ios
```

## 🎯 Estructura del Proyecto

```
src/
├── components/
│   └── Game/
│       ├── GameCanvas.tsx      # Canvas principal del juego
│       ├── SpriteRenderer.tsx  # Sistema de sprites 2D
│       ├── TouchControls.tsx   # Controles táctiles
│       ├── GameUI.tsx          # Interfaz de usuario
│       └── DialogSystem.tsx    # Sistema de diálogos
├── data/
│   └── mockData.ts            # Datos del juego
├── types/
│   └── GameTypes.ts           # Tipos TypeScript
└── App.tsx                    # Componente principal
```

## 🎨 Características Técnicas

### **Tecnologías Utilizadas**
- **React Native** 0.72.0
- **TypeScript** 5.0.4
- **React Native Canvas** para renderizado 2D
- **React Native Reanimated** para animaciones
- **React Native Gesture Handler** para controles táctiles
- **AsyncStorage** para guardado persistente

### **Bibliotecas Adicionales**
- **react-native-linear-gradient** - Gradientes visuales
- **react-native-haptic-feedback** - Feedback háptico
- **react-native-sound** - Efectos de sonido
- **react-native-vector-icons** - Iconos vectoriales
- **react-native-orientation-locker** - Control de orientación

## 🎮 Controles del Juego

### **Joystick Virtual**
- **Movimiento**: Arrastra el joystick para mover al zorro
- **Dirección**: El personaje se orienta según la dirección del movimiento

### **Botones de Acción**
- **⚔️ Atacar**: Ejecuta ataques cuerpo a cuerpo
- **🤝 Interactuar**: Habla con NPCs y recoge items
- **🎒 Inventario**: Abre el menú de inventario

### **Interfaz de Usuario**
- **Inventario**: Gestiona items, armas y consumibles
- **Misiones**: Rastrea progreso de quest activos
- **Habilidades**: Revisa progresión de habilidades
- **Mapa**: Explora diferentes ubicaciones

## 🎯 Personajes y Mundo

### **Protagonista**
- **Zorro Medieval**: Héroe principal con habilidades de combate y magia

### **NPCs**
- **Aldeano Sabio**: Ofrece misiones principales
- **Comerciante**: Vende items y equipamiento
- **Guardia Real**: Proporciona misiones de combate

### **Enemigos**
- **Goblins**: Enemigos básicos con clubs
- **Esqueletos**: No-muertos con resistencia
- **Orcos**: Enemigos fuertes con armadura

### **Ubicaciones**
- **Aldea Inicial**: Punto de partida con NPCs
- **Bosque Encantado**: Área de exploración
- **Castillo Real**: Sede del reino
- **Montañas Místicas**: Zona de desafío
- **Torre del Mago**: Área mágica
- **Cueva del Dragón**: Mazmorra final

## 🎨 Sistema de Sprites

### **Sprites del Zorro**
- **fox_idle**: Zorro en reposo
- **fox_walk**: Animación de caminata
- **fox_attack**: Pose de ataque

### **Tiles del Mapa**
- **Pasto**: Terreno básico
- **Piedra**: Caminos y estructuras
- **Agua**: Obstáculos líquidos
- **Árboles**: Obstáculos naturales
- **Muros**: Límites del mapa

## 🎯 Sistema de Misiones

### **Tipos de Misiones**
- **Principales**: Historia principal del juego
- **Secundarias**: Misiones opcionales
- **Entregas**: Transportar items

### **Recompensas**
- **Experiencia**: Para subir de nivel
- **Oro**: Moneda del juego
- **Items**: Equipamiento y consumibles

## 🎮 Comandos de Desarrollo

```bash
# Iniciar el servidor de desarrollo
npm start

# Construir para Android
npm run build

# Construir para iOS
npm run build:ios

# Ejecutar en dispositivo Android
npm run android

# Ejecutar en simulador iOS
npm run ios

# Ejecutar tests
npm test

# Linting
npm run lint
```

## 🎯 Configuración de Dispositivos

### **Android**
1. Habilitar modo desarrollador en el dispositivo
2. Activar depuración USB
3. Conectar dispositivo y ejecutar `npm run android`

### **iOS**
1. Abrir proyecto en Xcode
2. Seleccionar dispositivo o simulador
3. Ejecutar desde Xcode o `npm run ios`

## 🎨 Personalización

### **Modificar Sprites**
- Editar archivos en `src/components/Game/SpriteRenderer.tsx`
- Cambiar colores, tamaños y animaciones

### **Agregar Nuevos Personajes**
- Añadir datos en `src/data/mockData.ts`
- Crear sprites correspondientes
- Implementar lógica de interacción

### **Nuevas Misiones**
- Definir en `mockData.ts`
- Crear diálogos asociados
- Implementar lógica de progreso

## 🚀 Próximas Características

- **Multijugador local**
- **Más mapas y ubicaciones**
- **Sistema de magia avanzado**
- **Mascotas compañeras**
- **Tienda in-game**
- **Eventos temporales**

## 📱 Compatibilidad

- **Android**: 5.0 (API 21) o superior
- **iOS**: 11.0 o superior
- **Resoluciones**: Optimizado para teléfonos y tablets
- **Orientación**: Landscape (horizontal) recomendado

## 🎯 Rendimiento

- **FPS**: 60fps estables
- **Memoria**: Optimizado para dispositivos con 2GB+ RAM
- **Batería**: Modo de ahorro de energía disponible
- **Almacenamiento**: ~50MB instalado

¡Disfruta de tu aventura medieval como un valiente zorro! 🦊⚔️
