$(document).ready(function () {
  console.log("JQuery OK");

  //global daysjs locale it and utc plugin
  dayjs.locale('it');
  dayjs.extend(window.dayjs_plugin_utc);

  getAllNotes();
});

function getAllNotes() {
  // Ajax endpoint + api Ajax call
  const endPoint = 'https://62b1dd0920cad3685c84c611.mockapi.io/:endpoint';
  $.ajax({
    type: "GET",
    url: endPoint,
    success: function (data) {
      printListNotes(data);
    },
    error: function (err) {
      console.log(err);
    }
  });
}

// Stampo i risultati della chiamata Ajax
function printListNotes(data) {
  console.log(data);
}