const UNCOMPLETED_BOOK_ID = "unread";
const COMPLETED_BOOK_ID ="read";
const BOOK_ITEMID = "itemId";

const addBook = () => {
  const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_ID);
  const inputTitle = document.getElementById('title').value;
  const inputAuthor = document.getElementById('author').value;
  const inputYear = document.getElementById('year').value;
  
  const book = makeBook(inputTitle, inputAuthor, inputYear, false)
  const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, false)
  
  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);
  
  uncompletedBook.append(book)
  updateDataToStorage();
}

const makeBook = (title, author, year, isCompleted) => {
  const image = document.createElement('img');
  
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;
  
  const authorName = document.createElement('p');
  authorName.innerText = author;
  
  const bookYear = document.createElement('small');
  bookYear.innerText = `${year}`;
  
  const detail = document.createElement('div');
  detail.classList.add('detail-book')
  detail.append(bookTitle, authorName, bookYear)
  
  const container = document.createElement('div');
  container.classList.add('my-container');
  container.append(detail)
 
  if(isCompleted){
        container.append(
            createUnreadButton(),
            createTrashButton()
        );
    } else {
        container.append(
          createReadButton(),
          createTrashButton()
        );
    }
  return container;
}
const createButton = (buttonTypeClass, eventListener) => {
    const button  = document.createElement('button');
    button.classList.add(buttonTypeClass);
    
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}
const createReadButton = () => {
    return createButton("check-button", function (event) {
        addBookToCompleted(event.target.parentElement);
    });
}
const addBookToCompleted = (bookElement) => {
  const bookCompleted = document.getElementById(COMPLETED_BOOK_ID);
  const bookTitle = bookElement.querySelector(".detail-book > h3").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;
 
  const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;
  
  bookCompleted.append(newBook);
  bookElement.remove();
    
  updateDataToStorage();
} 

const removeBookFromCompleted = (bookElement)  => {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage();
}

const createTrashButton = () => {
    return createButton("trash-button", function(event){
        removeBookFromCompleted(event.target.parentElement);
    });
}

const undoBookFromCompleted = (bookElement) => {
  const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);
    
  const bookTitle = bookElement.querySelector(".detail-book > h3").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;
 
  const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;
  
  listUncompleted.append(newBook);
  bookElement.remove();
  updateDataToStorage();
}

const createUnreadButton = () => {
  return createButton("undo-button", function(event){
    undoBookFromCompleted(event.target.parentElement);
  });
}

const booksLength = () => {
  const jumlahBuku = document.getElementById('jumlahBuku');
  jumlahBuku.innerText = books.length;
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if(checkStorage()){
    loadDatafromStorage();
  }
});

document.addEventListener("ondatasaved", () => {
  console.log("Data berhasil disimpan.");
  booksLength();
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
  booksLength();
});

if(localStorage.getItem('theme') == 'tDark')
  setDarkMode()

function setDarkMode() {
  let iconDarkMode = '';
  let isdark = document.body.classList.toggle('dark');
  if (isdark) {
    iconDarkMode = '<h1><i class="fas fa-sun"></i></h1>';
    localStorage.setItem('theme', 'tDark');

  }else {
    iconDarkMode = '<h1><i class="fas fa-moon"></i></h1>';
    localStorage.removeItem('theme');

  }
  document.getElementById('darkBtn').innerHTML = iconDarkMode;
}