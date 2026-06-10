const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const target = document.querySelector(anchor.getAttribute('href'));

    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const meters = document.querySelectorAll('.meter-fill');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.3 });

meters.forEach((meter) => {
  meter.style.animationPlayState = 'paused';
  observer.observe(meter);
});

const readings = {
  temp: { el: null, base: 28.4, range: 1.2, unit: ' °C' },
  umid: { el: null, base: 61, range: 4, unit: ' %' },
  lux: { el: null, base: 82400, range: 2000, unit: '' }
};

const slides = [
  {
    src: 'img/campo.jpg',
    alt: 'Campo agrícola monitorado por solução AgroSat',
    caption: 'Campo monitorado por estação embarcada.'
  },
  {
    src: 'img/plantas.jpg',
    alt: 'Plantação saudável acompanhada por sensores de campo',
    caption: 'Sensores locais acompanham sinais de estresse.'
  },
  {
    src: 'img/luz.jpg',
    alt: 'Luminosidade solar medida para análise agrícola',
    caption: 'Luminosidade ajuda a estimar vigor vegetativo.'
  }
];

const quizQuestions = [
  {
    question: 'Qual sensor mede temperatura e umidade no AgroSat?',
    answers: ['DHT22', 'Buzzer', 'LED RGB'],
    correct: 0
  },
  {
    question: 'Qual componente capta luminosidade solar?',
    answers: ['LDR', 'LCD', 'Resistor fixo'],
    correct: 0
  },
  {
    question: 'Qual índice satelital inspira a leitura de vigor vegetal?',
    answers: ['NDVI', 'IPCA', 'HTML'],
    correct: 0
  },
  {
    question: 'Qual satélite é citado na proposta?',
    answers: ['Sentinel-2', 'Voyager 1', 'Hubble'],
    correct: 0
  },
  {
    question: 'Qual risco aparece quando a temperatura fica muito baixa?',
    answers: ['Geada', 'Excesso de luz', 'Sinal de rede'],
    correct: 0
  },
  {
    question: 'Qual público é priorizado pelo AgroSat?',
    answers: ['Pequenos agricultores', 'Pilotos de foguete', 'Astronautas'],
    correct: 0
  },
  {
    question: 'Qual componente mostra leituras no campo?',
    answers: ['Display LCD 16x2', 'Cabo USB', 'Protoboard vazia'],
    correct: 0
  },
  {
    question: 'Qual alerta sonoro é usado no circuito?',
    answers: ['Buzzer', 'Sensor PIR', 'Servo motor'],
    correct: 0
  },
  {
    question: 'Qual ODS conversa diretamente com agricultura sustentável?',
    answers: ['ODS 2', 'ODS 4', 'ODS 16'],
    correct: 0
  },
  {
    question: 'Qual prática o projeto quer reduzir?',
    answers: ['Irrigação por intuição', 'Uso de dados locais', 'Monitoramento climático'],
    correct: 0
  }
];

let currentSlide = 0;

function updateSlide() {
  const image = document.getElementById('slideImage');
  const caption = document.getElementById('slideCaption');
  const slide = slides[currentSlide];

  if (!image || !caption) return;

  image.src = slide.src;
  image.alt = slide.alt;
  caption.textContent = slide.caption;
}

function setupThemes() {
  const buttons = document.querySelectorAll('.theme-btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const theme = button.dataset.theme;
      document.body.classList.remove('theme-ceu', 'theme-solar');

      if (theme === 'ceu') document.body.classList.add('theme-ceu');
      if (theme === 'solar') document.body.classList.add('theme-solar');

      buttons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
    });
  });
}

function setupSlideshow() {
  document.getElementById('prevSlide')?.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlide();
  });

  document.getElementById('nextSlide')?.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlide();
  }, 5000);
}

function classifyRisk(temp, humidity, lux) {
  const alerts = [];

  if (temp <= 4) alerts.push('risco de geada');
  if (temp >= 35) alerts.push('excesso de calor');
  if (humidity <= 35 || lux >= 90000) alerts.push('risco de seca');
  if (humidity >= 85) alerts.push('umidade crítica');

  return alerts.length ? alerts.join(', ') : 'condição estável';
}

function setupForm() {
  const form = document.getElementById('alertForm');
  const result = document.getElementById('formResult');

  if (!form || !result) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('fieldName').value.trim();
    const temp = Number(document.getElementById('fieldTemp').value);
    const humidity = Number(document.getElementById('fieldHumidity').value);
    const lux = Number(document.getElementById('fieldLux').value);

    if (!name || Number.isNaN(temp) || Number.isNaN(humidity) || Number.isNaN(lux)) {
      result.textContent = 'Preencha todos os campos antes de enviar.';
      return;
    }

    if (humidity < 0 || humidity > 100 || lux < 0) {
      result.textContent = 'Use umidade entre 0 e 100% e luminosidade positiva.';
      return;
    }

    result.textContent = `${name}: ${classifyRisk(temp, humidity, lux)}.`;
  });
}

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;

  container.innerHTML = quizQuestions.map((item, index) => {
    const options = item.answers.map((answer, answerIndex) => `
      <label class="quiz-option">
        <input type="radio" name="q${index}" value="${answerIndex}" />
        ${answer}
      </label>
    `).join('');

    return `
      <fieldset class="quiz-question">
        <legend>${index + 1}. ${item.question}</legend>
        ${options}
      </fieldset>
    `;
  }).join('');
}

function setupQuiz() {
  const button = document.getElementById('submitQuiz');
  const result = document.getElementById('quizResult');

  if (!button || !result) return;

  button.addEventListener('click', () => {
    let score = 0;
    let answered = 0;

    quizQuestions.forEach((item, index) => {
      const checked = document.querySelector(`input[name="q${index}"]:checked`);
      if (!checked) return;

      answered += 1;
      if (Number(checked.value) === item.correct) score += 1;
    });

    if (answered < quizQuestions.length) {
      result.textContent = `Você respondeu ${answered} de ${quizQuestions.length} perguntas.`;
      return;
    }

    result.textContent = `Resultado final: ${score}/${quizQuestions.length} acertos.`;
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const vals = document.querySelectorAll('.reading-val');

  if (vals.length >= 3) {
    readings.temp.el = vals[0];
    readings.umid.el = vals[1];
    readings.lux.el = vals[2];

    setInterval(() => {
      Object.keys(readings).forEach((key) => {
        const reading = readings[key];
        const delta = (Math.random() - 0.5) * reading.range * 0.4;
        const value = reading.base + delta;

        reading.el.textContent = key === 'lux'
          ? Math.round(value).toLocaleString('pt-BR')
          : value.toFixed(1) + reading.unit;
      });
    }, 2000);
  }

  setupThemes();
  setupSlideshow();
  setupForm();
  renderQuiz();
  setupQuiz();
});
