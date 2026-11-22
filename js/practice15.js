// ==========================================
// ПРАКТИКА 15: Базовые типы данных и функции
// ==========================================

console.log("--- СТАРТ ПРАКТИКИ 15 ---");

// 1. ИСПОЛЬЗОВАНИЕ БАЗОВЫХ ТИПОВ ДАННЫХ
// Строка (String) - название магазина
const storeName = "Зеленый дом"; 
// Число (Number) - ставка налога
const taxRate = 0.2; 
// Логическое значение (Boolean) - идет ли распродажа
const isHolidaySale = true; 
// Объект (Object) - данные конкретного товара
const product = {
  name: "Монстера деликатесная",
  price: 1500,
  discountPercent: 15,
  inStock: true,
  stockCount: 5,
  description: "Шикарное растение с большими резными листьями. Идеально для гостиной или офиса."
};

console.log(`Магазин: ${storeName}`);
console.log("Исходные данные товара:", product);
console.log("-----------------------------------------");


// 2. АРИФМЕТИЧЕСКИЕ ОПЕРАТОРЫ
let finalPrice = product.price;
let discountAmount = 0;

if (isHolidaySale) {
  // Вычисляем размер скидки в рублях (умножение и деление)
  discountAmount = (product.price * product.discountPercent) / 100;
  // Вычитаем скидку из цены (вычитание)
  finalPrice = product.price - discountAmount;
}

console.log(`Скидка составляет: ${discountAmount} руб.`);
console.log(`Цена со скидкой: ${finalPrice} руб.`);
console.log("-----------------------------------------");


// 3. ФУНКЦИИ

// А) Функция форматирования цены (добавляет пробелы и знак рубля)
function formatPrice(amount) {
  // Используем встроенный метод toLocaleString для формата 1 500 ₽
  return amount.toLocaleString('ru-RU') + ' ₽';
}

// Б) Функция расчета скидки (возвращает объект с деталями)
function calculateDiscount(price, discountPercent) {
  const discount = (price * discountPercent) / 100;
  const result = price - discount;
  return {
    original: formatPrice(price),
    discount: formatPrice(discount),
    final: formatPrice(result)
  };
}

// В) Функция определения статуса товара (используем логические операторы)
function getProductStatus(inStock, stockCount) {
  // Оператор И (&&) и ИЛИ (||)
  if (inStock && stockCount > 3) {
    return "В наличии (много)";
  } else if (inStock && stockCount > 0) {
    return "В наличии (мало)";
  } else if (!inStock || stockCount === 0) {
    return "Нет в наличии";
  } else {
    return "Уточняйте у менеджера";
  }
}

// Г) Функция формирования краткого описания (обрезка строки)
function getShortDescription(text, maxLength) {
  // Операторы сравнения
  if (text.length <= maxLength) {
    return text;
  }
  // Обрезаем строку и добавляем многоточие
  return text.substring(0, maxLength) + "...";
}


// 4. ВЫВОД РЕЗУЛЬТАТОВ РАБОТЫ ФУНКЦИЙ В КОНСОЛЬ

console.log("--- РЕЗУЛЬТАТЫ РАБОТЫ ФУНКЦИЙ ---");

// Форматирование цены
console.log(`1. Форматирование цены: ${formatPrice(product.price)}`);

// Расчет скидки (вызываем функцию и получаем объект)
const discountInfo = calculateDiscount(product.price, product.discountPercent);
console.log(`2. Расчет скидки:`);
console.log(`   Старая цена: ${discountInfo.original}`);
console.log(`   Скидка: ${discountInfo.discount}`);
console.log(`   Итоговая цена: ${discountInfo.final}`);

// Определение статуса
console.log(`3. Статус товара: ${getProductStatus(product.inStock, product.stockCount)}`);

// Краткое описание (обрезаем до 40 символов)
console.log(`4. Краткое описание: ${getShortDescription(product.description, 40)}`);

console.log("--- КОНЕЦ ПРАКТИКИ 15 ---");