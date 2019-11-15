import { graphqlClient } from "util/graphql";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import GetBooksCountQuery from "graphQL/books/getBooksCount.graphql";
import { useCurrentSearch } from "./booksSearchState";
import { useMemo, useContext, createContext } from "react";
import { SubjectsContext } from "app/renderUI";
import { useQuery, useSuspenseQuery, buildQuery } from "micro-graphql-react";
import { syncResults, clearCache, syncDeletes } from "util/graphqlHelpers";

import delve from "dlv";
import { TagsContext } from "app/tagsState";
import { QueryOf, Queries } from "graphql-typings";
import { getCurrentHistoryState } from "reactStartup";
import { computeBookSearchVariables } from "./preloadHelpers";

interface IEditorialReview {
  content: string;
  source: string;
}

interface IBookSummary {
  title: string;
  asin: string;
  authors: string[];
  smallImage: string;
}

export interface IBookRaw {
  _id: string;
  dateAdded: number;
  ean: string;
  editorialReviews: IEditorialReview[];
  similarBooks: IBookSummary[];
  isRead: boolean;
  readChanging?: boolean;
  isbn: string;
  smallImage: string;
  mediumImage: string;
  pages: any;
  publicationDate: any;
  publisher: string;
  authors: string[];
  subjects: string[];
  tags: string[];
  title: string;
  titleLower: string;
  userId: string;
  deleting?: boolean;
  pendingDelete?: boolean;
  expanded: boolean;
  detailsLoaded: boolean;
  detailsLoading: boolean;
}

export interface IBookDisplay extends IBookRaw {
  subjectObjects: any[];
  tagObjects: any[];
  dateAddedDisplay: string;
}

graphqlClient.subscribeMutation({
  when: /createBook/,
  run: () => clearCache(GetBooksQuery)
});

window.addEventListener("book-scanned", () => {
  graphqlClient.getCache(GetBooksQuery).clearCache()
  graphqlClient.getCache(GetBooksCountQuery).clearCache()
});

export const useBooks = () => {
  const searchState = useCurrentSearch();
  const variables = useMemo(() => computeBookSearchVariables(searchState), [searchState]);
  const onBooksMutation = [
    {
      when: /updateBooks?/,
      run: ({ currentResults, softReset }, resp) => {
        syncResults(currentResults.allBooks, "Books", resp.updateBooks ? resp.updateBooks.Books : [resp.updateBook.Book]);
        softReset(currentResults);
      }
    }
  ];
  const { data, loading, loaded, currentQuery } = useSuspenseQuery<QueryOf<Queries["allBooks"]>>(
    buildQuery(GetBooksQuery, variables, { onMutation: onBooksMutation })
  );

  const booksRaw = data ? data.allBooks.Books : null;
  const books = adjustBooks(booksRaw);
  const booksCount = loaded ? delve(data, "allBooks.Meta.count") : "";

  const resultsCount = booksCount != null ? booksCount : -1;
  const totalPages = useMemo(() => (resultsCount && resultsCount > 0 ? Math.ceil(resultsCount / searchState.pageSize) : 0), [resultsCount]);

  return {
    currentQuery,
    books,
    resultsCount,
    totalPages,
    booksLoading: loading,
    booksLoaded: loaded
  };
};

//temp just for the blog post
export const useBooksCount = () => {
  const searchState = useCurrentSearch();
  const variables = useMemo(() => computeBookSearchVariables(searchState), [searchState]);
  const onBooksMutation = [
    {
      when: /deleteBook/,
      run: ({ refresh }, res, req) => {
        syncDeletes(GetBooksCountQuery, [req._id], "allBooks", "Books", {
          onDelete: ({ count, resultSet }) => {
            let meta = delve(resultSet, "allBooks.Meta");
            meta && (meta.count -= count);
          }
        });
        refresh();
      }
    }
  ];
  const { data, loading, loaded, currentQuery } = useSuspenseQuery<QueryOf<Queries["allBooks"]>>(
    buildQuery(GetBooksCountQuery, variables, { onMutation: onBooksMutation })
  );

  const booksCount = loaded ? delve(data, "allBooks.Meta.count") : "";

  const resultsCount = booksCount != null ? booksCount : -1;
  const totalPages = useMemo(() => (resultsCount && resultsCount > 0 ? Math.ceil(resultsCount / searchState.pageSize) : 0), [resultsCount]);

  return {
    currentQuery,
    resultsCount,
    totalPages,
    loading,
    loaded
  };
};

export const BooksContext = createContext<ReturnType<typeof useBooks>>(null);

const adjustBooks = books => {
  let { subjectHash, subjectsLoaded } = useContext(SubjectsContext);
  let { tagHash, tagsLoaded } = useContext(TagsContext);

  return useMemo(() => {
    if (!subjectsLoaded || !tagsLoaded || !books) return [];

    return books.map((bookRaw: IBookDisplay) => {
      let result = { ...bookRaw };
      result.subjectObjects = (result.subjects || []).map(s => subjectHash[s]).filter(s => s);
      result.tagObjects = (result.tags || []).map(s => tagHash[s]).filter(s => s);
      result.authors = result.authors || [];

      let d = new Date(+result.dateAdded);
      result.dateAddedDisplay = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
      return result;
    });
  }, [books, subjectHash, tagHash, subjectsLoaded, tagsLoaded]);
};
