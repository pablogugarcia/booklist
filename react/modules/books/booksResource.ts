import { graphqlClient } from "util/graphql";
import GetBooksQuery from "graphQL/books/getBooks.graphql";
import GetBooksCountQuery from "graphQL/books/getBooksCount.graphql";
import { bookSearchVariablesFromCurrentUrl } from "./preloadHelpers";

export default function preload() {
  let variables = bookSearchVariablesFromCurrentUrl();
  graphqlClient.preload(GetBooksQuery, variables);
  graphqlClient.preload(GetBooksCountQuery, variables);
}
