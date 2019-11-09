import { graphqlClient } from "util/graphql";
import { getCurrentHistoryState } from "reactStartup";
import { defaultSearchValuesHash } from "./booksSearchState";
import { computeBookSearchVariables } from "./booksState";
import { getAppState } from "app/appState";
import { syncResults, syncDeletes } from "util/graphqlHelpers";
import GetBooksQuery from "graphQL/books/getBooks.graphql";
import delve from "dlv";
import { QueryManager, buildQuery } from "micro-graphql-react";

export function getCurrentBookVariables() {
  let app = getAppState();
  let filters = getCurrentHistoryState().searchState;
  const { subjects: subjectsHashValue, tags: tagsHashValue } = filters;
  const searchFilters = Object.assign({}, defaultSearchValuesHash, filters, {
    tagIds: tagsHashValue ? tagsHashValue.split("-") : [],
    subjectIds: subjectsHashValue ? subjectsHashValue.split("-") : []
  });

  return computeBookSearchVariables(searchFilters, app.publicUserId);
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
    let result;

    let cachedEntry = cache.getFromCache(
      graphqlQuery,
      promise => {
        throw promise;
      },
      entry => (result = entry),
      () => {
        throw "GraphQL Client mis-step - query should exist";
      }
    );
  }
}
