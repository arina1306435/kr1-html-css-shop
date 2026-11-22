// ==========================================
// ПРАКТИКА 15: Данные магазина и товара
// ==========================================

// Строка
const shopName = "Зеленый дом";

// Число
const taxRate = 0.2; // НДС 20%

// Логическое значение
const isHolidaySale = true;

// Объект товара
const product = {
  id: 1,
  title: "Монстера деликатесная",
  category: "Комнатные цветы",
  price: 1500,
  discountPercent: 15,
  isAvailable: true,
  stockCount: 5,
  description: "Шикарное растение с большими резными листьями. Идеально для гостиной или офиса."
};
const products = [
  { id: 1, title: "Монстера", category: "flowers", price: 1500, isAvailable: true, image: "images/монстера2.webp", desc: "Крупное тропическое растение." },
  { id: 2, title: "Фикус Бенджамина", category: "flowers", price: 1200, isAvailable: true, image: "images/фикусбендж.webp", desc: "Неприхотливое дерево для дома." },
  { id: 3, title: "Пальма Арека", category: "palms", price: 2500, isAvailable: true, image: "images/пальмаарекка.webp", desc: "Создает тропический уголок." },
  { id: 4, title: "Суккулент", category: "succulents", price: 400, isAvailable: true, image: "images/суккулент.jpg", desc: "Маленький, не требует полива." },
  { id: 5, title: "Кактус", category: "succulents", price: 300, isAvailable: true, image: "images/кактус.webp", desc: "Колючий, но очень милый." },
  { id: 6, title: "Сансевиерия", category: "succulents", price: 900, isAvailable: true, image: "images/сансевиерия.webp", desc: "Щучий хвост. Очищает воздух." },
  { id: 7, title: "Фикус Лирата", category: "palms", price: 3500, isAvailable: false, image: "images/фикуслирата.jpg", desc: "Эффектное дерево с крупными листьями." },
  { id: 8, title: "Юкка слоновая", category: "palms", price: 4200, isAvailable: true, image: "images/юкка.jpg", desc: "Стильное растение для офиса." },
  { id: 9, title: "Драцена", category: "palms", price: 1800, isAvailable: true, image: "images/драцена.jpg", desc: "Дерево счастья. Неприхотлива." }
];