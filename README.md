
# 🌐 Warm Backend

**Warm Backend** — это серверное приложение на основе **Node.js** с использованием **Express.js**, предоставляющее **RESTful API** для управления пользователями, заказами и ролями в системе онлайн-покупок.  
Оно интегрировано с **MongoDB** для хранения данных и поддерживает **аутентификацию**, **авторизацию** и **валидацию**.

---

## 📑 Оглавление

- [🚀 Установка](#-установка)  
- [📖 Использование](#-использование)  
- [👥 Роли в системе](#-роли-в-системе)  
  - [🛒 Покупатель](#-покупатель)  
  - [💰 Кассир](#-кассир)  
  - [📦 Сборщик заказов](#-сборщик-заказов)  
  - [👔 Менеджер](#-менеджер)  
  - [🔧 Администратор](#-администратор)  
- [✨ Особенности](#-особенности)  
- [🛠️ Технологии](#-технологии)  
- [🤝 Контрибьютинг](#-контрибьютинг)  
- [📫 Контакты](#-контакты)

---

## 🚀 Установка

```bash
git clone https://github.com/bakiir/warm-backend.git
cd warm-backend
npm install
````

Скопируйте `.env.example` в `.env` и укажите ваши параметры:

```env
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
...
```

Запуск сервера:

```bash
npm start
```

### Требования:

* Node.js (v16+)
* MongoDB

---

## 📖 Использование

После запуска сервера API доступно через эндпоинты, зависящие от роли пользователя.

Примеры:

* `GET /api/users` — менеджеры и администраторы
* `POST /api/orders` — покупатели

👉 См. [API Docs](#) для подробностей.

---

## 👥 Роли в системе

### 🛒 Покупатель

**Описание:** Покупает товары онлайн.

**Обязанности:**

* Просмотр каталога
* Добавление товаров в корзину
* Оформление и отслеживание заказов
* Обновление профиля

**Доступ:**

* `GET /api/products`
* `POST /api/orders`
* `GET /api/orders?userId={id}`

**Пример запроса:**

```json
POST /api/orders
{
  "userId": "12345",
  "items": [{"productId": "1", "quantity": 2}],
  "total": 200,
  "address": "ул. Примерная, д. 1"
}
```

**Особенности:** JWT-аутентификация, доступ только к своим данным.

---

### 💰 Кассир

**Описание:** Отвечает за оплату заказов.

**Обязанности:**

* Подтверждение оплат
* Обработка возвратов
* Просмотр неоплаченных заказов

**Доступ:**

* `GET /api/orders?status=pending`
* `PUT /api/orders/:id/payment`

**Пример запроса:**

```json
PUT /api/orders/67890/payment
{
  "status": "paid",
  "paymentMethod": "card",
  "timestamp": "2023-10-10T12:00:00Z"
}
```

**Особенности:** Нет доступа к управлению пользователями.

---

### 📦 Сборщик заказов

**Описание:** Физически собирает заказы.

**Обязанности:**

* Просмотр активных заказов
* Обновление статуса заказа
* Сообщение о проблемах

**Доступ:**

* `GET /api/orders?status=active`
* `PUT /api/orders/:id/status`

**Пример запроса:**

```json
PUT /api/orders/67890/status
{
  "status": "assembled",
  "notes": "Все товары собраны"
}
```

**Особенности:** Доступ только к процессу сборки.

---

### 👔 Менеджер

**Описание:** Контролирует персонал и операции.

**Обязанности:**

* Управление пользователями (кроме админов)
* Просмотр отчетов
* Разрешение споров
* Прием прихода товара
* Управление товарами

**Доступ:**

* `GET /api/users`
* `GET /api/reports/sales`
* `PUT /api/products/:id`

**Пример запроса:**

```http
GET /api/reports/sales?dateRange=2023-10-01..2023-10-31
```

**Особенности:** Широкие права, кроме системных настроек.

---

### 🔧 Администратор

**Описание:** Полный контроль над системой.

**Обязанности:**

* Управление пользователями и ролями
* Системные настройки
* Работа с логами

**Доступ:**

* `POST /api/users`
* `DELETE /api/orders/:id`
* `GET /api/logs`

**Пример запроса:**

```json
POST /api/users
{
  "name": "Иван Иванов",
  "role": "manager",
  "email": "ivan@example.com"
}
```

**Особенности:** Полный административный доступ.

---

## ✨ Особенности

* Аутентификация через JWT
* Ролевая авторизация
* Интеграция с MongoDB
* Валидация данных

---

## 🛠️ Технологии

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT

---

## 🤝 Контрибьютинг

1. Сделайте форк
2. Создайте ветку (`git checkout -b feature/ваша-фича`)
3. Внесите изменения
4. Отправьте Pull Request

Подробности см. в [CONTRIBUTING.md](./CONTRIBUTING.md)

---

## 📫 Контакты

Пишите или открывайте issue на [GitHub](https://github.com/bakiir/warm-backend/issues)

---

**Спасибо всем за поддержку проекта!**


