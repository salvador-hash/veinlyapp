

## Plan: Asegurar que todas las funcionalidades solicitadas funcionen correctamente

Este plan revisa y corrige todos los flujos solicitados para garantizar su correcto funcionamiento de extremo a extremo.

### Funcionalidades a verificar y corregir

**1. "Voy a donar" + Historial de comprometidos**
- El flujo actual ya existe en `EmergencyDetail.tsx` con el boton "Voy a donar" y la seccion "Donantes Comprometidos"
- Correccion necesaria: el boton "Contactar Solicitante" debe estar visible tambien para el rol `hospital` (solicitante), no solo para donantes. Actualmente la condicion `user?.role !== 'donor'` deberia funcionar pero hay que verificar que los usuarios con rol `hospital` (que son los solicitantes) puedan ver los donantes comprometidos y contactarlos

**2. Contacto bidireccional donante-solicitante**
- Ya implementado: el donante puede contactar al solicitante desde EmergencyDetail via `/messages?to={requester.id}`
- Ya implementado: el solicitante puede contactar al donante comprometido via `/messages?to={donor.id}`
- Correccion necesaria en `Messages.tsx`: la logica de `contactableUsers` filtra por rol (`hospital` vs `donor`), pero los "solicitantes" tienen rol `hospital`. Hay que asegurar que cualquier usuario pueda escribir a cualquier otro con quien tenga una conversacion existente o al que llegue por parametro `?to=`

**3. Filtros del mapa por urgencia**
- Ya implementado en `EmergencyMap.tsx` con filtros para Critical, Urgent y Normal
- Sin cambios necesarios

**4. Todas las emergencias visibles en el mapa**
- Ya implementado en `DonorDashboard.tsx` y `HospitalDashboard.tsx` mostrando todas las emergencias activas
- Sin cambios necesarios

**5. Notificaciones push en mensajeria**
- Ya implementado en `Messages.tsx` con toasts y `Notification` API del navegador
- Ya implementado badge de no leidos en `Navbar.tsx`
- Sin cambios necesarios

**6. Direcciones reales con coordenadas precisas en el mapa**
- Ya implementado: `AddressAutocomplete` usa Nominatim y pasa `lat`/`lon` al formulario
- Ya implementado: `EmergencyMap` prioriza `lat`/`lon` del emergency cuando existen
- Sin cambios necesarios

### Cambios tecnicos a realizar

**Archivo: `src/pages/Messages.tsx`**
- Actualizar la logica de `contactableUsers` para que NO filtre por rol cuando el usuario llega via parametro `?to=` o tiene conversaciones existentes. Esto asegura comunicacion bidireccional entre cualquier par de usuarios (donante-solicitante, solicitante-donante)

**Archivo: `src/pages/EmergencyDetail.tsx`**
- Cambiar la condicion del boton "Contactar Solicitante" para que tambien sea visible cuando `user?.role === 'hospital'` (el solicitante puede ver y contactar donantes)
- Asegurar que la seccion "Acciones de Donante" muestre correctamente el estado de compromiso

**Archivo: `src/components/EmergencyMap.tsx`**
- Verificar que los labels de filtros esten internacionalizados (actualmente estan hardcodeados en espanol)

**Archivo: `src/i18n/translations.ts`**
- Agregar cualquier clave de traduccion faltante para los filtros del mapa y acciones de donante

### Resumen de lo que funcionara despues de implementar

1. Un solicitante crea una emergencia buscando un hospital real - el marcador aparece en la ubicacion exacta del mapa
2. Un donante ve la emergencia, presiona "Voy a donar" y aparece en el historial de comprometidos
3. El donante puede contactar al solicitante directamente desde el detalle de la emergencia
4. El solicitante ve el historial de donantes comprometidos y puede contactar a cada uno
5. Ambos reciben notificaciones push cuando llega un mensaje nuevo
6. El mapa muestra todas las emergencias activas con filtros por urgencia (Critico, Urgente, Normal)

