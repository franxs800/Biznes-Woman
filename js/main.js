document.addEventListener('DOMContentLoaded', () => {
  // Мобильное меню
  const menu = document.querySelector('.menu');
  const nav = document.querySelector('nav');

  menu?.addEventListener('click', () => {
    nav.classList.toggle('open');
    menu.textContent = nav.classList.contains('open') ? '✕' : '☰';
  });

  // Поиск и фильтрация курсов
  const search = document.querySelector('#search');
  const level = document.querySelector('#level');
  const courses = [...document.querySelectorAll('.course')];
  const empty = document.querySelector('#no-courses');

  function filterCourses() {
    let count = 0;
    const query = (search?.value || '').toLowerCase();
    const selectedLevel = level?.value || 'all';

    courses.forEach(course => {
      const text = (
        course.dataset.key + ' ' + course.innerText
      ).toLowerCase();

      const matchesText = text.includes(query);
      const matchesLevel =
        selectedLevel === 'all' ||
        course.dataset.level === selectedLevel;

      const visible = matchesText && matchesLevel;
      course.hidden = !visible;

      if (visible) count++;
    });

    if (empty) {
      empty.hidden = count > 0;
    }
  }

  search?.addEventListener('input', filterCourses);
  level?.addEventListener('change', filterCourses);

  // Кнопки начала курса
  document.querySelectorAll('.start-course').forEach(button => {
    button.addEventListener('click', () => {
      alert(
        'Вы выбрали курс «' + button.dataset.title +
        '». Это демонстрационный сайт: используйте программу курса на карточке и выполняйте задания по порядку.'
      );
    });
  });

  // Переключение примеров бизнес-плана
  document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab === button);
      });

      document.querySelectorAll('.plan').forEach(plan => {
        plan.classList.toggle(
          'active',
          plan.id === 'plan-' + button.dataset.plan
        );
      });
    });
  });

  // Вспомогательные функции для калькуляторов
  const money = number =>
    Math.round(number).toLocaleString('ru-RU') + ' сум';

  const value = id =>
    Number(document.getElementById(id)?.value || 0);

  // 1. Калькулятор прибыли
  document.querySelector('#profit-form')?.addEventListener('submit', event => {
    event.preventDefault();

    const revenue = value('revenue');
    const variable = value('variable');
    const fixed = value('fixed');

    const profit = revenue - variable - fixed;
    const margin = revenue ? (profit / revenue) * 100 : 0;

    document.querySelector('#profit-result').innerHTML =
      'Ориентировочная прибыль' +
      '<strong>' + money(profit) + '</strong>' +
      '<small>Маржинальность: ' +
      margin.toLocaleString('ru-RU', {
        maximumFractionDigits: 1
      }) +
      '%</small>';
  });

  // 2. Калькулятор месячного бюджета
  document.querySelector('#budget-form')?.addEventListener('submit', event => {
    event.preventDefault();

    const income = value('income');
    const expenses =
      value('stock') +
      value('rent') +
      value('salary') +
      value('other');

    const balance = income - expenses;

    document.querySelector('#budget-result').innerHTML =
      'Остаток после расходов' +
      '<strong>' + money(balance) + '</strong>' +
      '<small>Расходы: ' + money(expenses) + '. ' +
      (
        balance < 0
          ? 'Расходы превышают доступные средства.'
          : 'Проверьте, учтены ли налоги и резерв.'
      ) +
      '</small>';
  });

  // 3. Калькулятор аннуитетного кредитного платежа
  document.querySelector('#loan-form')?.addEventListener('submit', event => {
    event.preventDefault();

    const principal = value('amount');
    const monthlyRate = value('rate') / 1200;
    const months = Math.floor(value('months'));

    if (principal <= 0 || months <= 0) {
      return;
    }

    let payment;

    if (monthlyRate === 0) {
      payment = principal / months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);

      payment =
        principal * monthlyRate * factor / (factor - 1);
    }

    const total = payment * months;
    const overpayment = total - principal;

    document.querySelector('#loan-result').innerHTML =
      'Платёж в месяц' +
      '<strong>' + money(payment) + '</strong>' +
      '<small>Всего: ' + money(total) +
      '. Переплата по модели: ' + money(overpayment) +
      '. Не включены комиссии и страхование.</small>';
  });

  // 4. Создание и скачивание бизнес-плана
  document.querySelector('#bp-form')?.addEventListener('submit', event => {
    event.preventDefault();

    const getValue = id =>
      document.getElementById(id)?.value.trim() || 'Не указано';

    const businessPlan = [
      'КРАТКИЙ БИЗНЕС-ПЛАН',
      '===================',
      'Название проекта: ' + getValue('bp-name'),
      'Город / район: ' + getValue('bp-place'),
      'Целевой клиент: ' + getValue('bp-customer'),
      'Товар / услуга: ' + getValue('bp-product'),
      'Стартовые вложения: ' + getValue('bp-invest') + ' сум',
      'Ожидаемая выручка в месяц: ' + getValue('bp-revenue') + ' сум',
      'Расходы и риски: ' + getValue('bp-costs'),
      'Продвижение и продажи: ' + getValue('bp-marketing'),
      '',
      'Следующие шаги:',
      '1. Проверить спрос у клиентов.',
      '2. Подтвердить цены, расходы и обязательные платежи.',
      '3. Подготовить финансовый прогноз и план управления рисками.',
      '',
      'Учебный шаблон: не является гарантией дохода или одобрения кредита.'
    ].join('\n');

    const blob = new Blob(
      [businessPlan],
      { type: 'text/plain;charset=utf-8' }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'moy-biznes-plan.txt';

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  });

  // 5. Создание текста обращения за консультацией
  document.querySelector('#consult-form')?.addEventListener('submit', event => {
    event.preventDefault();

    const getValue = id =>
      document.getElementById(id)?.value.trim() || 'Не указано';

    const message = [
      'Здравствуйте! Хотела бы получить консультацию.',
      'Имя: ' + getValue('c-name'),
      'Тема: ' + getValue('c-topic'),
      'Способ связи: ' + getValue('c-channel'),
      'Вопрос: ' + getValue('c-message'),
      '',
      'Пожалуйста, сообщите доступные варианты консультации.'
    ].join('\n');

    const output = document.querySelector('#c-result');
    output.hidden = false;
    output.textContent = message;

    const copyButton = document.createElement('button');
    copyButton.className = 'btn secondary';
    copyButton.type = 'button';
    copyButton.textContent = 'Скопировать обращение';

    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(message);
        copyButton.textContent = 'Скопировано ✓';
      } catch (error) {
        copyButton.textContent =
          'Выделите и скопируйте текст вручную';
      }
    });

    output.append(document.createElement('br'), copyButton);
  });

  // 6. Копирование шаблона публикации
  document.querySelector('.copy')?.addEventListener('click', async () => {
    const button = document.querySelector('.copy');
    const template = document.querySelector('#post-template');

    try {
      await navigator.clipboard.writeText(template.innerText);
      button.textContent = 'Скопировано ✓';
    } catch (error) {
      button.textContent = 'Скопируйте текст вручную';
    }
  });
});