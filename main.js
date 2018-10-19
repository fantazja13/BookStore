var addForm = $("#add-form");
var booksC = $("#all-books-c");
var addBtn = $("#add-btn");
var pageBtn = $("#page-btn");

function valueCheck(value) {
    if (value.length > 0) {
        return true;
    }
}

function deleteDone() {
    startLoad();
}

function postDone() {
    alert("Dodano nową książkę.");
    startLoad();
}

function getAllDone(result) {
    for (var i = 0; i < result.length; i++) {
        var book = result[i];
        var divBookC = $("<div>");
        var divTitle = $("<div>");
        var divDetails = $("<div>");
        divDetails.addClass("div-details");
        divTitle.addClass("div-title").addClass("h4").text(book.title);
        divBookC.addClass("div-book container shadow p-3 mb-5 bg-white rounded border").data("id", book.id);
        divBookC.append(divTitle).append(divDetails);
        booksC.append(divBookC);
        divBookC.one("click", function () {
            var bookId = $(this).data("id");
            var divDetails = $(this).children().last();
            divDetails.slideUp(50);
            divDetails.addClass("text-info").attr("id", bookId);
            var url = "http://localhost:8282/books/" + bookId;
            var method = "GET";
            var data = "";
            ajax(method, url, data, getBookDone, fail);
        });
    }
    divBookC = $(".div-book");
    divBookC.on("click", function () {
        $(this).children().last().slideToggle();
    });
    booksC.slideDown(200);
}

function getBookDone(result) {
    var authorStr = "Autorzy: <strong>"+result.author+"</strong>";
    var typeStr = "Tematyka: <strong>"+result.type+"</strong>";
    var publishStr = "Wydawca: <strong>"+result.publisher+"</strong>";
    var isbnStr= "ISBN: <strong>"+result.isbn+"</strong>";
    var text = authorStr + "<br>" + typeStr + "<br>" + publishStr + "<br>" + isbnStr;
    var selector = "#"+result.id;
    var divDetails = $(selector);
    divDetails.html(text);
    var deleteBtn =  $("<button>Usuń książkę</button>");
    deleteBtn.addClass("btn btn-outline-danger btn-sm").data("id", result.id);
    divDetails.append($("<br>")).append(deleteBtn);
    deleteBtn.on("click", function (ev) {
        ev.stopPropagation();
        var element = $(this);
        deleteBook(element);
    });
    divDetails.slideDown();
}

function fail() {
    alert("Wystąpił błąd. Spróbuj ponownie później.")
}

function deleteBook(element) {
    var id = element.data("id");
    var confirmText = "Na pewno chesz usunąć tą książkę?";
    var method = "DELETE";
    var url = "http://localhost:8282/books/"+id;
    var data = "";
    if (confirm(confirmText)) {
        ajax(method,url,data, deleteDone, fail)
    }

}

function addBook() {
    var inTitle = $(".input-title").val();
    var inAuthor = $(".input-author").val();
    var inType = $(".input-type").val();
    var inPublish = $(".input-publisher").val();
    var inIsbn = $(".input-isbn").val();
    if (valueCheck(inTitle)&&valueCheck(inAuthor)&&valueCheck(inType)&&valueCheck(inPublish)&&valueCheck(inIsbn)) {
        var data = '{"title":"'+inTitle+'","author":"'+inAuthor+'","type":"'+inType+'","publisher":"'+
            inPublish+'","isbn":"'+inIsbn+'"}';
        var url = "http://localhost:8282/books/";
        var method = "POST";
        ajax(method, url, data, postDone, fail);
    } else {
        alert("Wypełnij wszystkie pola.");
    }

}


function addLoad() {
    if (addForm.data("active")==0) {
        addForm.empty();
        addForm.slideUp(50);
        booksC.slideUp(400);
        var div = $("<div>").addClass("container p-1");
        var divBtn = $("<div>").addClass("container p-3");
        var inputText = $("<input>").attr("type", "text").attr("required","").addClass("form-control form-control-lg");
        var button = $("<button>");
        var titleIn = div.clone().append(inputText.clone().attr("placeholder", "Tytuł książki").addClass("input-title"));
        var authorIn = div.clone().append(inputText.clone().attr("placeholder", "Autorzy").addClass("input-author"));
        var typeIn = div.clone().append(inputText.clone().attr("placeholder", "Tematyka").addClass("input-type"));
        var publishIn = div.clone().append(inputText.clone().attr("placeholder", "Wydawca").addClass("input-publisher"));
        var isbnIn = div.clone().append(inputText.clone().attr("type", "number").attr("placeholder", "ISBN").addClass("input-isbn"));
        divBtn.append(button.addClass("btn btn-info btn-lg mt-3 mb-5").attr("id", "post-btn").text("Dodaj książkę"));
        addForm.append(titleIn).append(authorIn).append(typeIn).append(publishIn).append(isbnIn).append(button);
        addForm.data("active", 1).slideDown(600);
        var postBtn = $("#post-btn");
        postBtn.on("click", addBook);
    } else {
        addForm.slideDown(600);
    }
}

function startLoad() {
    addForm.data("active", 0).slideUp(100);
    booksC.empty();
    var method = "GET";
    var url = "http://localhost:8282/books/";
    var data = "";
    ajax(method,url,data, getAllDone, fail);
}

function ajax(method, url, data, done, fail) {
    $.ajax({
        url: url,
        headers: {'Content-Type':'application/json'},
        data: data,
        type: method,
        dataType: "json"
}).done(function(result) {
    done(result);
}).fail(function(xhr,status,err) {
    fail();
}).always(function(xhr,status) {
});
}

$(document).ready(function () {
    startLoad();
    pageBtn.on("click", startLoad);
    addBtn.on("click", addLoad);
});


// $.ajax({
//     url: "http://localhost:8282/books/",
//     data: {},
//     type: "GET",
//     dataType: "json"
// }).done(function(result) {
// }).fail(function(xhr,status,err) {
// }).always(function(xhr,status) {
// });