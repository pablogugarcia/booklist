import { queryUtilities, processHook } from "mongo-graphql-starter";
import hooksObj from "../hooks";
const { decontructGraphqlQuery, parseRequestedFields, getMongoProjection, newObjectFromArgs, getUpdateObject } = queryUtilities;
import { ObjectId } from "mongodb";
import Book from "./Book";

export async function loadBooks(db, queryPacket) {
  let { $match, $project, $sort, $limit, $skip } = queryPacket;

  let aggregateItems = [
    { $match },
    { $project },
    $sort ? { $sort } : null,
    $skip != null ? { $skip } : null,
    $limit != null ? { $limit } : null
  ].filter(item => item);

  let Books = await db
    .collection("books")
    .aggregate(aggregateItems)
    .toArray();

  await processHook(hooksObj, "Book", "adjustResults", Books);
  return Books;
}

export default {
  Query: {
    async allBooks(root, args, context, ast) {
      console.log("XXXXXXXXXXXXXXXX");
      return [{ title: "S" }];
      let db = await root.db;
      return result;
    }
  }
};
