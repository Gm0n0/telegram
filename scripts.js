// Показываем контент после загрузки
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').style.display = 'none';
  }, 1000);
});

// Баланс и задержка звёзд
let balance = 0;
let lastClaim = 0;

// Пользователь
const username = "gifts_user"; // Здесь можно подгрузить из Telegram Web App API

// Подарки, кейсы и история
let giftHistory = [];
const promoCodes = { 'FREE100': 100 };

const cases = [
  {
    name: "Золотой кейс",
    price: 300,
    image: "images/gold_case.jpg",
    rewards: [
      { name: "iPhone", image: "images/iphone.jpg", chance: 5 },
      { name: "Часы", image: "images/watch.jpg", chance: 20 },
      { name: "Стикеры", image: "images/stickers.jpg", chance: 75 }
    ]
  }
];

// Страница переключения
function switchPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  document.querySelectorAll('.menu-button').forEach(btn => btn.classList.remove('active'));
  document.getElementById('btn-' + id).classList.add('active');
}

// Обновить баланс
function updateBalance() {
  document.getElementById('star-balance').textContent = `⭐ ${balance}`;
}

// Получить звёзды
document.getElementById('claim-stars').addEventListener('click', () => {
  const now = Date.now();
  if (now - lastClaim >= 60000) {
    balance += 100;
    lastClaim = now;
    updateBalance();
  } else {
    alert("Попробуй снова через минуту ⏳");
  }
});

// Показать кейсы
function renderCases() {
  const container = document.getElementById('case-list');
  container.innerHTML = '';
  cases.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'case';
    el.innerHTML = `<img src="${c.image}" alt="${c.name}"><p>${c.name}</p>`;
    el.onclick = () => openCase(i);
    container.appendChild(el);
  });
}

// Открытие кейса
function openCase(index) {
  const c = cases[index];
  if (balance < c.price) {
    alert("Недостаточно звёзд 💫");
    return;
  }
  balance -= c.price;
  updateBalance();

  const roll = Math.random() * 100;
  let sum = 0;
  let won = null;

  for (const item of c.rewards) {
    sum += item.chance;
    if (roll <= sum) {
      won = item;
      break;
    }
  }

  alert(`Ты получил: ${won.name}! 🎉`);
  giftHistory.push(won);
  renderGifts();
}

// Промокод
function applyPromo() {
  const input = document.getElementById('promo-input').value.trim().toUpperCase();
  if (promoCodes[input]) {
    balance += promoCodes[input];
    document.getElementById('promo-result').textContent = `Получено ${promoCodes[input]} ⭐!`;
    delete promoCodes[input]; // одноразовый
    updateBalance();
  } else {
    document.getElementById('promo-result').textContent = "Неверный или использованный промокод.";
  }
}

// Подарки
function renderGifts() {
  const container = document.getElementById('gift-history');
  container.innerHTML = '';
  if (giftHistory.length === 0) {
    container.innerHTML = '<p>Нет подарков</p>';
    return;
  }

  giftHistory.forEach(gift => {
    const el = document.createElement('div');
    el.innerHTML = `<img src="${gift.image}" alt="${gift.name}"><p>${gift.name}</p>`;
    container.appendChild(el);
  });
}

// Начальная инициализация
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('username').textContent = username;
  updateBalance();
  renderCases();
  renderGifts();
});
