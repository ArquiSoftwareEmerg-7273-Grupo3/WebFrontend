# Simulación de Pago para Testing

## Problema
Las tarjetas de prueba de Mercado Pago no siempre funcionan correctamente en modo TEST, especialmente con ciertos flujos de pago.

## Solución Temporal
He creado un endpoint de testing que simula un pago exitoso y activa la suscripción directamente.

## Cómo Usar

### Opción 1: Desde Postman o cURL

```bash
POST http://localhost:8085/api/test/payments/simulate-success
Content-Type: application/json

{
  "userId": "1",
  "userEmail": "test@example.com",
  "userType": "ILUSTRADOR"
}
```

### Opción 2: Desde la consola del navegador

1. Abre tu aplicación en `http://localhost:4200`
2. Abre la consola del navegador (F12)
3. Ejecuta este código:

```javascript
fetch('http://localhost:8085/api/test/payments/simulate-success', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: '1',  // Cambia por tu userId real
    userEmail: 'test@example.com',
    userType: 'ILUSTRADOR'  // o 'ESCRITOR'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Respuesta:', data);
  alert('Suscripción activada: ' + JSON.stringify(data));
})
.catch(error => console.error('Error:', error));
```

### Opción 3: Crear un botón temporal en tu componente

Agrega esto temporalmente en `payment-gateway.component.html`:

```html
<!-- BOTÓN DE PRUEBA - ELIMINAR EN PRODUCCIÓN -->
<button 
  class="test-button" 
  (click)="simulatePayment()" 
  style="background: orange; margin-top: 20px;">
  🧪 SIMULAR PAGO EXITOSO (SOLO TESTING)
</button>
```

Y en `payment-gateway.component.ts`:

```typescript
simulatePayment(): void {
  const userId = '1'; // Obtén el userId real del usuario logueado
  const userType = 'ILUSTRADOR'; // o 'ESCRITOR'
  
  this.loading = true;
  
  fetch('http://localhost:8085/api/test/payments/simulate-success', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: userId,
      userEmail: this.email,
      userType: userType
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Pago simulado:', data);
    this.loading = false;
    this.successMessage = 'Suscripción activada exitosamente!';
    
    // Redirigir a página de éxito
    setTimeout(() => {
      this.router.navigate(['/suscriptions/success']);
    }, 2000);
  })
  .catch(error => {
    console.error('Error:', error);
    this.loading = false;
    this.errorMessage = 'Error al simular pago';
  });
}
```

## Verificar que funcionó

### 1. Verificar en monetization-service:
```bash
GET http://localhost:8085/api/test/payments/subscription/1
```

Debería retornar:
```json
{
  "userId": "1",
  "hasActiveSubscription": true,
  "status": "active",
  "userType": "ILUSTRADOR"
}
```

### 2. Verificar en auth-service:
```bash
GET http://localhost:8083/api/profiles/subscription/check/1?userType=ILUSTRADOR
```

Debería retornar:
```json
{
  "userId": 1,
  "userType": "ILUSTRADOR",
  "subscription": true,
  "hasActiveSubscription": true
}
```

## Flujo Completo de Testing

1. **Simular pago** usando cualquiera de las opciones anteriores
2. **Verificar en monetization-service** que la suscripción está activa
3. **Verificar en auth-service** que el campo `subscripcion` cambió a `true`
4. **Verificar en la base de datos:**
   ```sql
   -- En monetization_db
   SELECT * FROM user_subscription WHERE user_id = '1';
   
   -- En auth_db
   SELECT id, user_id, subscripcion FROM ilustrador WHERE user_id = 1;
   ```

## Ventajas de este Enfoque

✅ **Evita problemas con tarjetas de prueba** de Mercado Pago
✅ **Prueba el flujo completo** de activación de suscripciones
✅ **Verifica la sincronización** entre monetization-service y auth-service
✅ **Rápido y confiable** para desarrollo

## Importante

⚠️ **ELIMINAR EN PRODUCCIÓN**

Este endpoint es SOLO para testing. Antes de ir a producción:

1. Elimina `TestPaymentController.java`
2. Elimina cualquier botón de simulación del frontend
3. Implementa el flujo real con Mercado Pago o usa webhooks

## Próximos Pasos

Una vez que verifiques que el flujo de activación funciona correctamente con la simulación:

1. **Para producción:** Usa credenciales reales de Mercado Pago
2. **Implementa webhooks:** Para recibir notificaciones de pagos reales
3. **Maneja estados:** pending, approved, rejected, etc.

## Alternativa: Usar Webhooks

Si quieres probar con Mercado Pago real pero sin depender del checkout:

1. Configura un webhook en tu cuenta de Mercado Pago
2. Usa ngrok para exponer tu localhost
3. Mercado Pago enviará notificaciones de pagos a tu webhook
4. Procesa las notificaciones y activa suscripciones automáticamente
