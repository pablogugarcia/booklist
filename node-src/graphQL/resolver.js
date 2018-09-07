import GraphQLJSON from 'graphql-type-json';

import Book, { Book as BookRest } from './Book/resolver';
import BookSummary, { BookSummary as BookSummaryRest } from './BookSummary/resolver';
import Subject, { Subject as SubjectRest } from './Subject/resolver';
import LabelColor, { LabelColor as LabelColorRest } from './LabelColor/resolver';
import User, { User as UserRest } from './User/resolver';
import PublicUser, { PublicUser as PublicUserRest } from './PublicUser/resolver';
import Tag, { Tag as TagRest } from './Tag/resolver';

const { Query: BookQuery, Mutation: BookMutation } = Book;
const { Query: BookSummaryQuery, Mutation: BookSummaryMutation } = BookSummary;
const { Query: SubjectQuery, Mutation: SubjectMutation } = Subject;
const { Query: LabelColorQuery, Mutation: LabelColorMutation } = LabelColor;
const { Query: UserQuery, Mutation: UserMutation } = User;
const { Query: PublicUserQuery, Mutation: PublicUserMutation } = PublicUser;
const { Query: TagQuery, Mutation: TagMutation } = Tag;

export default {
  JSON: GraphQLJSON,
  Query: Object.assign(
    {},
    BookQuery,
    BookSummaryQuery,
    SubjectQuery,
    LabelColorQuery,
    UserQuery,
    PublicUserQuery,
    TagQuery
  ),
  Mutation: Object.assign({},
    BookMutation,
    BookSummaryMutation,
    SubjectMutation,
    LabelColorMutation,
    UserMutation,
    PublicUserMutation,
    TagMutation
  ),
  Book: {
    ...BookRest
  },
  BookSummary: {
    ...BookSummaryRest
  },
  Subject: {
    ...SubjectRest
  },
  LabelColor: {
    ...LabelColorRest
  },
  User: {
    ...UserRest
  },
  PublicUser: {
    ...PublicUserRest
  },
  Tag: {
    ...TagRest
  }
};

