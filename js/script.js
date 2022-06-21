$(document).ready(function () {
  console.log("JQuery OK");

  //global daysjs locale it and utc plugin
  dayjs.locale('it');
  dayjs.extend(window.dayjs_plugin_utc);

  getAllNotes();
});

function getAllNotes() {
  // Ajax endpoint + api Ajax call
  const endPoint = 'https://62b1dd0920cad3685c84c611.mockapi.io/notes?sortBy=updatedAt&order=desc';
  $.ajax({
    method: "GET",
    url: endPoint,
    success: function (data) {
      if (data.length > 0) {
        printListNotes(data);
      }
    },
    error: function (err) {
      console.log(err);
    }
  });
}

// Stampo i risultati della chiamata Ajax
function printListNotes(data) {
  // Uso il template di handlebars
  const listYearsContainer = $('.notes-menu .notes-menu__main .notes__container');
  const src = $('#note-year').html();
  const template = Handlebars.compile(src);

  // Prendo gli anni dalle note
  const years = [];

  data.forEach((note) => {
    const year = dayjs(note.updatedAt).format('YYYY');

    // Se non c'è già l'anno trovato lo pusho nell'array
    if (!years.includes(year)) {
      years.push(year);
    }
  });
  // console.log(years, data);

  // Stampo gli anni dalle note
  years.forEach((year) => {
    const html = template({ year });
    listYearsContainer.append(html);

    const notesFiltered = data.filter(function (note) {
      return dayjs(note.updatedAt).format('YYYY') === year;
    });

    printNotes(notesFiltered, year);
  });
}

// Stampo le note
function printNotes(data, year) {
  const listNotesContainer = $('.year' + year + ' .notes-menu__list');

  const src = $('#note-list-template').html();
  const template = Handlebars.compile(src);

  data.forEach((note) => {
    const fakeDiv = $('<div></div>').append(note.text);
    const text = fakeDiv.text().slice(0, 30) + '...';

    // console.log(text);

    // Creo un oggetto per il template
    const context = {
      id: note.id,
      title: note.title,
      text: text,
      updatedAt: dayjs(note.updatedAt).format('DD MMMM YYYY'),
    };

    // Infine lo mostro in pagine
    const html = template(context);
    listNotesContainer.append(html);
  });
}