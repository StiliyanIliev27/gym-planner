# 🔒 Session Timeout & Security Guide

## 📋 Преглед

GymPlanner включва разширена система за управление на сесии която осигурява сигурност чрез автоматично излизане при неактивност. Системата е оптимизирана за фитнес приложения и следва най-добрите практики в индустрията.

## ⚙️ Конфигурация

### Supabase Настройки

В `supabase/config.toml`:

```toml
[auth.sessions]
# Максимална продължителност на сесия (24 часа)
timebox = "24h"
# Автоматично излизане при неактивност (30 минути)
inactivity_timeout = "30m"

[auth]
# JWT token валидност (1 час)
jwt_expiry = 3600
# Refresh token rotation (препоръчително)
enable_refresh_token_rotation = true
```

### Frontend Настройки

В `AuthProvider.jsx`:

```javascript
const {
  isWarningActive,
  timeRemaining,
  extendSession
} = useSessionTimeout({
  inactivityTimeout: 30, // 30 минути
  warningTime: 5,        // 5 минути предупреждение
  enabled: true          // Активирано за всички потребители
});
```

## 🎯 Времеви Лимити

### Препоръки по Тип Приложение

| Тип Приложение | Неактивност | Предупреждение | Максимум |
|---------------|-------------|----------------|----------|
| **Банкови** | 5-15 мин | 2 мин | 2 часа |
| **Фитнес** | 30 мин | 5 мин | 24 часа |
| **Социални** | Няма | - | 30 дни |
| **Бизнес** | 8 часа | 30 мин | 24 часа |
| **E-commerce** | 30-60 мин | 5 мин | 4 часа |

### GymPlanner Конфигурация

✅ **Оптимална за фитнес приложения:**

- **Неактивност**: 30 минути (потребителят може да е в спортната зала)
- **Предупреждение**: 5 минути преди излизане
- **Максимум**: 24 часа (ежедневно ползване)
- **Refresh**: Автоматично на всеки час

## 🔧 Компоненти

### 1. useSessionTimeout Hook

**Основни функции:**
```javascript
const {
  isWarningActive,     // Показва ли се предупреждение
  timeRemaining,       // Секунди до излизане
  extendSession,       // Удължаване на сесията
  getSessionInfo,      // Детайлна информация
  resetTimers         // Reset на таймерите
} = useSessionTimeout(options);
```

**Опции:**
```javascript
{
  inactivityTimeout: 30,  // Минути до излизане
  warningTime: 5,         // Минути преди предупреждение
  enabled: true           // Активиране/деактивиране
}
```

### 2. SessionWarningDialog

**Функции:**
- Countdown timer с MM:SS формат
- Progress bar с цветово кодиране
- Urgent/Critical режими за последните минути
- Бутони за удължаване или излизане

**Използване:**
```jsx
<SessionWarningDialog
  isOpen={isWarningActive}
  timeRemaining={timeRemaining}
  onExtendSession={extendSession}
  onLogoutNow={handleLogout}
/>
```

### 3. SessionStatusIndicator

**Варианти:**
- `minimal` - Малка точка с tooltip
- `badge` - Badge с статус
- `full` - Детайлен popover с управление

**Използване:**
```jsx
// В sidebar
<SessionStatusIndicator variant="minimal" />

// В настройки
<SessionStatusIndicator variant="full" showDetails={true} />
```

## 🔍 Activity Tracking

### Проследявани Събития

```javascript
const events = [
  'mousedown',   // Кликване
  'mousemove',   // Движение на мишката
  'keypress',    // Натискане на клавиш
  'scroll',      // Скролиране
  'touchstart',  // Touch взаимодействие
  'click'        // Кликване
];
```

### Оптимизация

- **Throttling**: Само на всеки 60 секунди reset
- **Event delegation**: Използва capturing фаза
- **Memory cleanup**: Премахва listeners при unmount

## 🚨 Предупредителна Система

### Фази на Предупреждение

1. **Normal (25+ минути остават)**
   - Зелен статус
   - Никакво предупреждение

2. **Warning (10 минути остават)**
   - Жълт статус
   - Toast notification

3. **Urgent (5 минути остават)**
   - Оранжев статус
   - Modal dialog
   - Countdown timer

4. **Critical (последна минута)**
   - Червен статус
   - Urgent warning
   - Пулсиращ ефект

### Toast Notifications

```javascript
toast.warning(
  "Сесията ти ще изтече след 5 минути поради неактивност.",
  {
    duration: 5 * 60 * 1000, // 5 минути
    action: {
      label: "Остани логнат",
      onClick: () => extendSession()
    }
  }
);
```

## 🔐 Сигурност

### Защита срещу Атаки

1. **Session Fixation**: Refresh token rotation
2. **CSRF**: SameSite cookies
3. **XSS**: Secure token storage
4. **Replay Attacks**: Time-based validation

### Валидация на Сесии

```javascript
// Проверка на валидност на всеки 5 минути
const checkSessionValidity = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    await handleAutoLogout();
  }
};
```

## 📊 Мониторинг

### Log Events

```javascript
// Development режим
console.log('Auth event:', event, session?.user?.id);

// Production - изпращане към analytics
analytics.track('session_extended', {
  userId: user.id,
  timeRemaining: timeRemaining,
  timestamp: Date.now()
});
```

### Метрики за Проследяване

- **Session duration**: Средно време на сесия
- **Extension rate**: % потребители които удължават
- **Auto logout rate**: % автоматични излизания
- **Warning response time**: Време за реакция на предупреждение

## 🛠️ Персонализация

### За Различни Потребителски Роли

```javascript
// VIP потребители - по-дълга сесия
const vipSettings = {
  inactivityTimeout: 60,  // 1 час
  warningTime: 10,        // 10 минути предупреждение
};

// Guest потребители - по-кратка сесия
const guestSettings = {
  inactivityTimeout: 15,  // 15 минути
  warningTime: 3,         // 3 минути предупреждение
};
```

### По Устройство

```javascript
// Mobile устройства - по-кратка сесия
const mobileSettings = {
  inactivityTimeout: 20,  // 20 минути
  warningTime: 3,         // 3 минути
};

// Desktop - стандартна сесия
const desktopSettings = {
  inactivityTimeout: 30,  // 30 минути
  warningTime: 5,         // 5 минути
};
```

## 🧪 Тестване

### Локално Тестване

1. **Намаляване на timeout за тестване:**
```javascript
const testSettings = {
  inactivityTimeout: 2,   // 2 минути
  warningTime: 0.5,       // 30 секунди
};
```

2. **Manual trigger на предупреждение:**
```javascript
// В browser console
window.triggerSessionWarning();
```

3. **Check session info:**
```javascript
const info = getSessionInfo();
console.log('Session info:', info);
```

### E2E Тестове

```javascript
// Cypress тест
it('should show session warning before logout', () => {
  cy.login();
  cy.wait(25 * 60 * 1000); // Изчакване 25 минути
  cy.get('[data-testid="session-warning"]').should('be.visible');
  cy.get('[data-testid="extend-session"]').click();
  cy.get('[data-testid="session-warning"]').should('not.exist');
});
```

## 🐛 Troubleshooting

### Чести Проблеми

1. **Сесията изтича твърде бързо**
   ```javascript
   // Проверете конфигурацията в config.toml
   inactivity_timeout = "30m"  // Трябва да е правилно
   ```

2. **Предупреждението не се показва**
   ```javascript
   // Проверете дали е включено в AuthProvider
   enabled: true
   ```

3. **Activity tracking не работи**
   ```javascript
   // Проверете browser permissions
   console.log('Event listeners:', document.eventListeners);
   ```

### Debug Режим

```javascript
// Включване на debug logs
localStorage.setItem('debug-session', 'true');

// В useSessionTimeout hook
if (localStorage.getItem('debug-session')) {
  console.log('Session activity:', {
    lastActivity: lastActivity.current,
    timeUntilWarning: sessionInfo.timeUntilWarning,
    isWarningActive
  });
}
```

## 📈 Performance

### Оптимизации

1. **Event throttling**: 60 секунди minimum
2. **Memory cleanup**: Automatic timer clearing
3. **Lazy loading**: Компонентите се зареждат при нужда
4. **Debounced updates**: Минимизиране на re-renders

### Bundle Size Impact

```
useSessionTimeout: ~2KB
SessionWarningDialog: ~3KB
SessionStatusIndicator: ~4KB
Total: ~9KB gzipped
```

## 🚀 Production Deployment

### Environment Variables

```env
# Production настройки
NEXT_PUBLIC_SESSION_TIMEOUT=30
NEXT_PUBLIC_SESSION_WARNING=5
NEXT_PUBLIC_SESSION_DEBUG=false
```

### CDN Caching

```javascript
// Next.js config
module.exports = {
  headers: [
    {
      source: '/api/auth/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, max-age=0'
        }
      ]
    }
  ]
};
```

---

## 📞 Support

За въпроси или проблеми:
- GitHub Issues
- Email: support@gymplanner.dev
- Discord: #session-timeout

**Последно обновление:** Януари 2025 