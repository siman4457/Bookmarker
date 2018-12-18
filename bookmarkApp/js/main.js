//Notes:

/*****************************
 *       Local Storage:      *
 *****************************/
/*local storage only stores strings. Need to parse JSON into a string, store it,
  and parse it back to JSON when needed*/
//-------------------------------------------------------------------------------------------------

//Listen for form submit
document.getElementById("myForm").addEventListener("submit", saveBookmark);

//Save bookmark
function saveBookmark(e) {
  //get form values
  var siteName = document.getElementById("siteName").value;
  var siteURL = document.getElementById("siteURL").value;

  //Error Checking
  if (!validateForm(siteName, siteURL)) {
    return false;
  }

  //Append http:// if it is missing
  var prefix = "http://";
  if (siteURL.substr(0, prefix.length) !== prefix) {
    siteURL = prefix + siteURL;
  }

  var bookmark = {
    name: siteName,
    url: siteURL
  };

  // Check to see if bookmarks array is empty
  if (localStorage.getItem("bookmarks") === null) {
    //Initialize bookmarks array
    var bookmarks = [];
    bookmarks.push(bookmark);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); //Takes our JSON array and turns it into a string for localstorage
  } else {
    //Get bookmarks from localStorage
    var bookmarks = JSON.parse(localStorage.getItem("bookmarks")); //JSON.parse() -> turns a string back into JSON
    bookmarks.push(bookmark);
    //Save it back into local storage
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks)); //Takes our JSON array and turns it into a string for localstorage
  }

  //Clear form after adding bookmark
  document.getElementById("myForm").reset();

  //Re-fetch bookmarks
  fetchBookmarks();

  //Prevent form from submitting (default form action)
  e.preventDefault(); //for debugging purposes
}

function deleteBookmark(url) {
  //Get bookmark from LocalStorage
  var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  //Loop through bookmarks
  for (var i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i].url == url) {
      //Remove from bookmark array
      bookmarks.splice(i, 1);
    }
  }
  //Reset LocalStorage
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  //Re-fetch bookmarks
  fetchBookmarks();
}

function fetchBookmarks() {
  var bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  //Get output ID
  var bookmarksResults = document.getElementById("bookmarksResults");

  //Build Output
  bookmarksResults.innerHTML = "";
  for (var i = 0; i < bookmarks.length; i++) {
    var name = bookmarks[i].name;
    var url = bookmarks[i].url;

    bookmarksResults.innerHTML +=
      '<div class="well">' +
      "<h3>" +
      name +
      ' <a class="btn btn-default" target="_blank" href="' +
      url +
      '">Visit</a> ' +
      " <a onclick=\"deleteBookmark('" +
      url +
      '\')" class="btn btn-danger" href="javascript:void();">Delete</a> ' +
      "</h3>" +
      "</div>";
  }
}

//Error Checking
function validateForm(siteName, siteURL) {
  //Check to see if user entered anything into the form
  if (!siteName || !siteURL) {
    alert("Please enter a site name and a URL");
    return false; //IMPORTANT
  }

  //Use Regular Expression to make sure user enters a URL with HTTP prefix
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);

  if (!siteURL.match(regex)) {
    alert("Please enter a valid URL with http:// in the beginning!");
    return false; //IMPORTANT
  }

  return true;
}
