import { combineReducers } from 'redux';
import { booksReducer as books, booksSelector } from './books/reducer';
import { subjectsReducer as subjects, subjectsSelector } from './subjects/reducer';
import { bookSearchReducer as bookSearch, bookSearchSelector } from './bookSearch/reducer';
import { bookSubjectManagerReducer as booksSubjectsModifier, booksSubjectsModifierSelector } from './booksSubjectModification/reducer';
import bookEdit from './editBook/reducer';
import ui from './ui/reducer';

export const reducer = combineReducers({
    books,
    subjects,
    bookSearch,
    booksSubjectsModifier,
    bookEdit,
    ui
});

export const selector = state => {
    let booksSelected = booksSelector(state.books),
        subjectsSelected = subjectsSelector(state.books),
        bookEdit = state.books.bookEdit,
        ui = state.books.ui;

    return {
        subjects: subjectsSelected.list,
        subjectsLoaded: subjectsSelected.loaded,
        books: booksSelected.list,
        selectedBooks: booksSelected.selectedBooks,
        booksLoading: booksSelected.loading,
        bookSearch: bookSearchSelector(state.books),
        booksSubjectsModifier: booksSubjectsModifierSelector(state.books),
        isEditingBook: bookEdit.isEditing,
        editingBook: bookEdit.editingBook,
        editingBookSaving: bookEdit.editingBookSaving,
        editingBookSaved: bookEdit.editingBookSaved,
        isDesktop: ui.isDesktop,
        isMobile: ui.isMobile
    }
};
