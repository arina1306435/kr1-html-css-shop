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

// Каталог товаров (пути к картинкам — латиницей)
const products = [
  { id: 1, title: "Монстера",         category: "flowers",    price: 1500,   image: "images/monstera.webp",        alt: 'Монстера деликатесная в белом горшке с крупными резными листьями',        desc: "Крупное тропическое растение." },
  { id: 2, title: "Фикус Бенджамина", category: "flowers",    price: 1200,   image: "images/ficus-benjamina.webp", alt: 'Фикус Бенджамина с пышной зелёной кроной', desc: "Неприхотливое дерево для дома." },
  { id: 3, title: "Пальма Арека",     category: "palms",      price: 2500,   image: "images/areca.webp",  alt: 'Пальма арека с перистыми раскидистыми листьями ',        desc: "Создает тропический уголок." },
  { id: 4, title: "Суккулент",        category: "succulents", price: 400,    image: "images/succulent.jpg", alt: 'Суккулент эхеверия с мясистыми серо-зелёными листьями в миниатюрном горшке',       desc: "Маленький, не требует полива." },
  { id: 5, title: "Кактус",           category: "succulents", price: 300,    image: "images/cactus.webp",   alt: 'Декоративный кактус в маленьком керамическом горшке',       desc: "Колючий, но очень милый." },
  { id: 6, title: "Сансевиерия",      category: "succulents", price: 900,    image: "images/sansevieria.jpg",  alt: 'Сансевиерия, или щучий хвост, с высокими прямостоячими пёстрыми листьямий',   desc: "Щучий хвост. Очищает воздух." },
  { id: 7, title: "Фикус Лирата",     category: "palms",      price: 3500,  image: "images/ficus-lyrata.jpg",  alt: 'Фикус лирата с крупными листьями в форме скрипки ',   desc: "Эффектное дерево с крупными листьями." },
  { id: 8, title: "Юкка слоновая",    category: "palms",      price: 4200,   image: "images/yucca.jpg",       alt: 'Юкка слоновая с толстым одревесневшим стволом и розеткой жёстких листьев',     desc: "Стильное растение для офиса." },
  { id: 9, title: "Драцена",          category: "palms",      price: 1800,   image: "images/dracaena.jpg",    alt: 'Драцена с длинными узкими листьями на стройном стволе — популярное офисное растение',     desc: "Дерево счастья. Неприхотлива." }
];
