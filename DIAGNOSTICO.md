# 🔍 DIAGNÓSTICO COMPLETO - Pichincha AI Onboarding

**Fecha**: 2026-10-02  
**Status**: 🔴 **WebSocket + Insert Failures**

---

## 1. ESTADO ACTUAL ✅

### ✅ Funcionando
- **App carga correctamente** en producción (pichincha.vercel.app)
- **Variables de Ambiente** inyectadas correctamente (VITE_*)
- **Build en Vercel** completado exitosamente
- **Supabase** correctamente configurado (vhcapsgwemepzvlubtdy)
- **Base de datos** todas las tablas creadas:
  - prospects (RLS: ON)
  - onboarding_requests (RLS: ON)  
  - agent_traces (RLS: ON)
  - rag_documents (RLS: ON)
  - rag_cache (RLS: ON)

### ❌ NO Funcionando
1. **WebSocket de Realtime falla**: 
   - Error: `WebSocket connection to 'wss://db.vhcapsgwemepzvlubtdy.supabase.co/realtime/v1/websocket' failed`
   - Causa probable: Realtime no habilitado o políticas de canal

2. **Inserción de datos falla**:
   - Cuando usuario intenta hacer submit en formulario
   - Error: Las políticas de RLS rechazan la operación
   - Tabla `prospects` requiere política de INSERT para usuario anónimo

---

## 2. FLUJO DE ERROR

```
Usuario → OnboardingForm → apiService.startOnboarding()
  ↓
supabaseDb.createProspect()  ← FALLA AQUÍ
  ↓
insert into prospects ← Rechazado por RLS (sin política de INSERT)
```

---

## 3. PROBLEMA RAÍZ

Las **políticas de RLS** en la tabla `prospects` no permiten inserciones:

**Situación actual:**
```sql
-- NO HAY POLÍTICA DE INSERT
-- RLS está habilitado pero sin reglas = TODO RECHAZADO
```

**Lo que necesita:**
```sql
-- Crear política que permita INSERT a usuario anónimo
CREATE POLICY "Allow anonymous insert" 
ON prospects 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Crear política que permita SELECT
CREATE POLICY "Allow anonymous select" 
ON prospects 
FOR SELECT 
TO anon 
USING (true);
```

---

## 4. SOLUCIÓN

### Paso 1: Crear Políticas de RLS en Supabase

Para cada tabla (`prospects`, `onboarding_requests`, `agent_traces`):

```sql
-- Para prospects
CREATE POLICY "Allow insert" ON prospects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow select" ON prospects FOR SELECT TO anon USING (true);
CREATE POLICY "Allow update" ON prospects FOR UPDATE TO anon USING (true);

-- Para onboarding_requests
CREATE POLICY "Allow insert" ON onboarding_requests FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow select" ON onboarding_requests FOR SELECT TO anon USING (true);
CREATE POLICY "Allow update" ON onboarding_requests FOR UPDATE TO anon USING (true);

-- Para agent_traces
CREATE POLICY "Allow insert" ON agent_traces FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow select" ON agent_traces FOR SELECT TO anon USING (true);
CREATE POLICY "Allow update" ON agent_traces FOR UPDATE TO anon USING (true);
```

### Paso 2: Habilitar Realtime (opcional pero recomendado)

En Supabase Dashboard → Realtime → Habilitar para tabla `onboarding_requests`

### Paso 3: Validar

- Test local: `npm run dev`
- Test submit formulario
- Verificar en Supabase que datos fueron insertados

### Paso 4: Deploy

- Hacer commit de cualquier cambio
- Vercel redesplegará automáticamente

---

## 5. CHECKLIST

- [ ] Ejecutar SQL de políticas RLS en Supabase
- [ ] Verificar que las políticas fueron creadas
- [ ] Probar local: `npm run dev`
- [ ] Probar submit en formulario
- [ ] Verificar datos en Supabase
- [ ] Hacer commit en Git
- [ ] Verificar deploy en Vercel
- [ ] Probar en producción (pichincha.vercel.app)

---

## 6. NOTAS IMPORTANTES

- ⚠️ **NO hacer más commits sin probar local primero**
- ✅ El problema NO es con variables de ambiente
- ✅ El problema NO es con build/deployment
- 🎯 El problema ES: Políticas de RLS en Supabase
- 🚀 Una vez configuradas las políticas, TODO debería funcionar

---
