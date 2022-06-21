// Creo un istanza per ckEditor
const ckEditor = {
  editorInstance: {}
};

$(document).ready(function () {
  console.log("JQuery OK");

  //global daysjs locale it and utc plugin
  dayjs.locale('it');
  dayjs.extend(window.dayjs_plugin_utc);

  getAllNotes();

  // Cambia la nota attiva al click di un altra nota
  $(document).on('click', '.notes-menu__list__item', function () {

    // Se esiste un istanza per quell'id viene distrutta 
    // e riportato a oggetto vuoto CKEDITOR
    if (ckEditor.editorInstance.id) {
      ckEditor.editorInstance.destroy();
      ckEditor.editorInstance = {};
    }

    // Tolgo l'active alle altre note e lo metto a quella premuta
    $(this).addClass('active').sibilings().removeClass('active');

    // Chiamata API per l'id della nota che ho cliccato
    getNote($(this).data('id'));
  });
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

  firstNote();
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

// Prendo la nota e la attivo
function firstNote(note) {
  const firstNote = $('.notes-menu__year:first-child .notes-menu__list__item:first-child ')
  firstNote.addClass('active');

  // Faccio una chiamata Ajax per id
  getNote(firstNote.data('id'));
}

// Chiamata Ajax per ID singola nota
function getNote(id) {
  const endPoint = 'https://62b1dd0920cad3685c84c611.mockapi.io/notes/' + id;
  $.ajax({
    method: "GET",
    url: endPoint,
    success: function (data) {
      // Formatto la data
      const updatedAt = dayjs(data.updatedAt).format('DD MMMM YYYY hh:mm:ss');
      const dateContainer = $('.note-editor__header-bottom .date');

      // Inserisco nell'html la data
      dateContainer.html(updatedAt);

      // Prendo il titolo
      const titleContainer = $('.note-editor__title');
      titleContainer.val(data.title);

      // Prendo l'editor dal DOM
      const editor = $('#editor');
      editor.data('id', data.id);
      editor.html(data.text);

      // Creo un iistanza CKEDITOR
      ClassicEditor
        .create(editor[0])
        .catch(error => {
          console.log(error);
        })
        .then(function () {
          ckEditor.editorInstance = editor;
        });
    },
    error: function (err) {
      console.log(err);
    }
  });
}