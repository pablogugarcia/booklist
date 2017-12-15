import { query as BookQuery, mutation as BookMutation, type as BookType } from "./Book/schema";

export default `

type Book {
  _id: String
  isbn: String
  title: String
  userId: String
  publisher: String
  pages: String
  authors: [String]
}

type Query {
  allBooks: [Book]
}

`;
