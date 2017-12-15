import Book from "./Book/resolver";

export default {
  Query: {
    async allBooks(root, args, context, ast) {
      let db = await root.db;
      return await db
        .collection("books")
        .find({})
        .toArray();
    }
  }
};
