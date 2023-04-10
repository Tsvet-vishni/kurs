const form = document.getElementById('form');
const startInput = form.querySelector('.start-date');
const endInput = form.querySelector('.end-date');
const buttons = form.querySelectorAll('.options__button');
const [weekBtn, monthBtn] = form.querySelectorAll('.options__preset');
const resultsBlock = document.getElementById('results')

const results = JSON.parse(localStorage.calculations || "[]")
const dict = {
  day:"Дні",
  hour: "Години",
  minute: "Хвилини",
  second: "Секунди",
  all: "Всі",
  workdays: "Робочі",
  weekend: "Вихідні",
}

startInput.addEventListener('change', toggleInput);
startInput.addEventListener('change', toggleButtons);
startInput.addEventListener('change', handleStartChange);
endInput.addEventListener('change', toggleButtons);
endInput.addEventListener('change', handleEndChange);
weekBtn.addEventListener('click', selectWeek);
monthBtn.addEventListener('click', selectMonth);
form.addEventListener('submit', calcTime);

showResults();

function toggleButtons() {
  buttons.forEach(btn => btn.disabled = !startInput.value || !endInput.value);
}

function toggleInput() {
  weekBtn.disabled = monthBtn.disabled = endInput.disabled = !startInput.value;
}

function handleStartChange() {
  endInput.min = startInput.value;
}

function handleEndChange() {
  startInput.max = endInput.value;
}

function selectWeek() {
  endInput.valueAsNumber = startInput.valueAsDate.setDate(startInput.valueAsDate.getDate()+7);
  toggleButtons()
}

function selectMonth() {
  endInput.valueAsNumber = startInput.valueAsDate.setMonth(startInput.valueAsDate.getMonth()+1);
  toggleButtons()
}

function countTime() {
  const choice = form.days.value;
  
  if (choice === "all"){
    return endInput.valueAsNumber-startInput.valueAsNumber;
  } 

  const date = startInput.valueAsDate;
  let ms = 0;

  do {
    const workday = date.getDay() % 6;

    if (choice === 'workdays' && workday || choice === 'weekend' && !workday) {
      ms += -date + date.setDate(date.getDate()+1);
    } else {
      date.setDate(date.getDate()+1)
    }
  } while (date < endInput.valueAsDate);

  return ms;
}

function calcTime(e) {
  results.unshift({
    start: startInput.value,
    end: endInput.value,
    days: form.days.value,
    units: e.submitter.name,
    amount: countTime() / e.submitter.value,
  });
  results.length = 10;
  localStorage.calculations = JSON.stringify(results);
  showResults()
}

function showResults() {
  resultsBlock.innerHTML = results.map(result => {
    const {start, end, days, units, amount} = result;

    return `
      <tr>
        <td>${start}</td>
        <td>${end}</td>
        <td>${dict[days]}</td>
        <td>${dict[units]}</td>
        <td>${amount}</td>
      </tr>
    `
  }).join('')
}

