import { graphqlClient } from "util/graphql";
import { getCurrentHistoryState } from "reactStartup";
import { defaultSearchValuesHash, filtersFromUrl } from "./booksSearchState";
import { computeBookSearchVariables } from "./booksState";
import { syncResults, syncDeletes } from "util/graphqlHelpers";
import GetBooksQuery from "graphQL/books/getBooks.graphql";
import delve from "dlv";
import { QueryManager, buildQuery } from "micro-graphql-react";

export function getCurrentBookVariables() {
  let filters = filtersFromUrl(getCurrentHistoryState().searchState);
  return computeBookSearchVariables(filters);
}

export default function GetBooksResource() {
  return new BooksResource();
}

class BooksResource {
  queryManager: any = null;
  variables: any = null;
  constructor() {
    this.variables = getCurrentBookVariables();
    const onBooksMutation = [
      {
        when: /updateBooks?/,
        run: ({ currentResults, softReset }, resp) => {
          syncResults(currentResults.allBooks, "Books", resp.updateBooks ? resp.updateBooks.Books : [resp.updateBook.Book]);
          softReset(currentResults);
        }
      },
      {
        when: /deleteBook/,
        run: ({ refresh }, res, req) => {
          syncDeletes(GetBooksQuery, [req._id], "allBooks", "Books", {
            onDelete: ({ count, resultSet }) => {
              let meta = delve(resultSet, "allBooks.Meta");
              meta && (meta.count -= count);
            }
          });
          refresh();
        }
      }
    ];

    const packet = buildQuery(GetBooksQuery, this.variables, { onMutation: onBooksMutation });

    this.queryManager = new QueryManager(
      {
        client: graphqlClient,
        setState: () => {}
      },
      packet
    );

    this.queryManager.load(packet);
  }
  read() {
    let cache = this.queryManager.cache;

    let graphqlQuery = graphqlClient.getGraphqlQuery({ query: GetBooksQuery, variables: this.variables });
    let data;

    let cachedEntry = cache.getFromCache(
      graphqlQuery,
      promise => {
        throw promise;
      },
      entry => (data = entry),
      () => {
        // throw "GraphQL Client mis-step - query should exist";
      }
    );

    return data;
    /*
    const booksRaw = data ? data.allBooks.Books : null;
    const books = adjustBooks(booksRaw);
    const booksCount = delve(data, "allBooks.Meta.count");

    const resultsCount = booksCount != null ? booksCount : -1;
    const totalPages = useMemo(() => (resultsCount && resultsCount > 0 ? Math.ceil(resultsCount / searchState.pageSize) : 0), [resultsCount]);
    */
  }
}
/*
const adjustBooks = books => {
  let { subjectHash } = useContext(SubjectsContext);
  let { tagHash } = useContext(TagsContext);

  //return useMemo(() => {

  return books.map((bookRaw: IBookDisplay) => {
    let result = { ...bookRaw };
    result.subjectObjects = (result.subjects || []).map(s => subjectHash[s]).filter(s => s);
    result.tagObjects = (result.tags || []).map(s => tagHash[s]).filter(s => s);
    result.authors = result.authors || [];

    let d = new Date(+result.dateAdded);
    result.dateAddedDisplay = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    return result;
  });
  //}, [books, subjectHash, tagHash, subjectsLoaded, tagsLoaded]);
};
*/
