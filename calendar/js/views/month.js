function updateMonth(date) {
  var container = document.getElementById("month-view-grid");
  var selectOverlay = document.getElementById("month-view-grid-select");
  var header = document.getElementById("current-time-header");

  // If no parameter is passed use the current date.
  if (date == null) {
    date = new Date();
  }

  container.innerHTML = "";

  function selectMonthItem(element) {
    var x = element.getBoundingClientRect().x;
    var y = element.getBoundingClientRect().y - container.getBoundingClientRect().y;
    var width = element.getBoundingClientRect().width;
    var height = element.getBoundingClientRect().height;

    selectOverlay.style.setProperty('--x-pos', x + 'px');
    selectOverlay.style.setProperty('--y-pos', y + 'px');
    selectOverlay.style.setProperty('--width', width + 'px');
    selectOverlay.style.setProperty('--height', height + 'px');
    selectOverlay.textContent = element.textContent;

    window.onresize = update;
    container.onscroll = update;
    function update() {
      x = element.getBoundingClientRect().x;
      y = element.getBoundingClientRect().y - container.getBoundingClientRect().y;
      width = element.getBoundingClientRect().width;
      height = element.getBoundingClientRect().height;

      selectOverlay.style.setProperty('--x-pos', x + 'px');
      selectOverlay.style.setProperty('--y-pos', y + 'px');
      selectOverlay.style.setProperty('--width', width + 'px');
      selectOverlay.style.setProperty('--height', height + 'px');
    }
  }

  var rowIndex = 0;
  var row = document.createElement("ol");
  container.appendChild(row);

  function createMonthItem(dateString, day, { today, past } = { today: false, past: false }) {
    if (rowIndex >= 7) {
      row = document.createElement("ol");
      container.appendChild(row);
      rowIndex = 1;
    } else {
      rowIndex++;
    }

    var item = document.createElement('li');
    if (past) {
      item.classList.add("past");
    }
    if (today) {
      item.classList.add("today");
      selectMonthItem(item);
    }
    row.appendChild(item);

    var number = document.createElement('span');
    number.textContent = day;
    item.appendChild(number);

    item.addEventListener('click', () => {
      selectMonthItem(item);
    });
  }

  day = date.getDate();
  month = date.getMonth();
  year = date.getFullYear();

  months = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );

  last_month = new Date(year, month - 1, 1);
  this_month = new Date(year, month, 1);
  next_month = new Date(year, month + 1, 1);
  post_next_month = new Date(year, month + 2, 1);

  // Find out when this month starts and ends.
  first_week_day = this_month.getDay();
  days_in_last_month = Math.round(
    (this_month.getTime() - last_month.getTime()) / (1000 * 60 * 60 * 24)
  );
  days_in_this_month = Math.round(
    (next_month.getTime() - this_month.getTime()) / (1000 * 60 * 60 * 24)
  );
  days_in_next_month = Math.round(
    (post_next_month.getTime() - next_month.getTime()) / (1000 * 60 * 60 * 24)
  );

  header.textContent = months[month] + ", " + EnglishToArabicNumerals(year);

  // Fill the first week of the month with the appropriate number of blanks.
  for (week_day = 0; week_day < first_week_day; week_day++) {
    createMonthItem(year + '-' + month + '-' + (days_in_last_month - ((week_day - (week_day * 2)) + 1)), (days_in_last_month - ((week_day - (week_day * 2)) + 1)), { past: true });
  }

  week_day = first_week_day;
  for (day_counter = 1; day_counter <= days_in_this_month; day_counter++) {
    week_day %= 7;
    if (week_day == 0) container.innerHTML += "</tr><tr>";

    // Do something different for the current day.
    if (day == day_counter) {
      createMonthItem(year + '-' + month + '-' + day_counter, day_counter, { today: true });
    } else {
      createMonthItem(year + '-' + month + '-' + day_counter, day_counter);
    }

    week_day++;
  }

  for (week_day = 0; week_day < ((7 * 6) - first_week_day - days_in_this_month); week_day++) {
    createMonthItem(year + '-' + month + '-' + week_day, week_day, { past: true });
  }
}

updateMonth(new Date());
