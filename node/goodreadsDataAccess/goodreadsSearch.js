import request from "request";
import flatMap from "lodash.flatmap";
import { downloadBookCover, resizeIfNeeded, saveCoverToS3, getOpenLibraryCoverUri, removeFile } from "../util/bookCovers/bookCoverHelpers";

var parseString = require("xml2js").parseString;

const grKey = process.env.GOODREADS_KEY;

export default class AmazonSearch {
  constructor() {}
  lookupBook(isbn, userId) {
    return new Promise((resolve, reject) => {
      request(`https://www.goodreads.com/book/isbn/${isbn}?format=xml&key=${grKey}`, {}, (err, res, body) => {
        err && resolve({ failure: true });

        parseString(body, async (err, result) => {
          err && resolve({ failure: true });

          let book = result.GoodreadsResponse && result.GoodreadsResponse.book && result.GoodreadsResponse.book[0];
          if (!book) {
            resolve({ failure: true });
          }

          let authorsRaw = book.authors;
          let authors = [];
          if (Array.isArray(authorsRaw)) {
            try {
              authors = flatMap(authorsRaw, a => flatMap(a.author || [], a => a.name));
            } catch (er) {
              authors = [];
            }
          }

          let editorialReviews = [];
          if (book.description && book.description[0]) {
            editorialReviews.push({
              source: "Description",
              content: book.description[0]
            });
          }

          let pubYear = safeItem(book, "publication_year");
          let pubMonth = ("" + safeItem(book, "publication_month")).padStart(2, "0");
          let pubDay = ("" + safeItem(book, "publication_day")).padStart(2, "0");

          let bookResult = {
            title: safeItem(book, "title"),
            isbn: safeItem(book, "isbn"),
            ean: "",
            pages: +safeItem(book, "num_pages", null),
            smallImage: safeItem(book, "small_image_url"),
            mediumImage: safeItem(book, "image_url"),
            publicationDate: pubDay && pubMonth && pubYear ? `${pubYear}-${pubMonth}-${pubDay}` : "",
            publisher: safeItem(book, "publisher"),
            authors,
            editorialReviews
          };

          try {
            if (/nophoto/.test(bookResult.smallImage)) {
              let res = await downloadBookCover(getOpenLibraryCoverUri(isbn), 1000); // < 1000 bytes on a small cover
              bookResult.smallImage = "";
              if (res) {
                let { fileName, fullName } = res;
                let newPath = await resizeIfNeeded(fileName);

                if (newPath) {
                  let s3Key = await saveCoverToS3(newPath, `bookCovers/${userId || "generic"}/converted-cover-${fileName}`);
                  if (s3Key) {
                    bookResult.smallImage = s3Key;
                  }
                }
                removeFile(fullName);
                removeFile(newPath);
              }
            } else if (bookResult.smallImage) {
              let res = await downloadBookCover(bookResult.smallImage, 1000); // < 1000 bytes on a small cover
              bookResult.smallImage = "";
              if (res) {
                let { fileName, fullName } = res;
                let newPath = await resizeIfNeeded(fileName);

                if (newPath) {
                  let s3Key = await saveCoverToS3(newPath, `bookCovers/${userId || "generic"}/converted-cover-${fileName}`);
                  if (s3Key) {
                    bookResult.smallImage = s3Key;
                  }
                }
                removeFile(fullName);
                removeFile(newPath);
              }
            }
          } catch (er) {}

          try {
            if (/nophoto/.test(bookResult.mediumImage)) {
              let res = await downloadBookCover(getOpenLibraryCoverUri(isbn), 1200); // < 1200 bytes on a medium cover
              bookResult.mediumImage = "";
              if (res) {
                let { fileName, fullName } = res;
                let newPath = await resizeIfNeeded(fileName, 106);

                if (newPath) {
                  let s3Key = await saveCoverToS3(newPath, `bookCovers/${userId || "generic"}/converted-cover-${fileName}`);
                  if (s3Key) {
                    bookResult.mediumImage = s3Key;
                  }
                }
                removeFile(fullName);
                removeFile(newPath);
              }
            } else if (bookResult.mediumImage) {
              let res = await downloadBookCover(bookResult.mediumImage, 1200); // < 1000 bytes on a medium cover
              bookResult.mediumImage = "";
              if (res) {
                let { fileName, fullName } = res;
                let newPath = await resizeIfNeeded(fileName, 106);

                if (newPath) {
                  let s3Key = await saveCoverToS3(newPath, `bookCovers/${userId || "generic"}/converted-cover-${fileName}`);
                  if (s3Key) {
                    bookResult.mediumImage = s3Key;
                  }
                }
                removeFile(fullName);
                removeFile(newPath);
              }
            }
          } catch (er) {}

          if (typeof bookResult.pages == null) {
            delete bookResult.pages;
          }

          if (/^http:\/\//.test(bookResult.smallImage)) {
            try {
              let newImage = await saveImageToS3(bookResult.smallImage, userId);
              bookResult.smallImage = newImage;
            } catch (e) {}
          }

          resolve(bookResult);
        });
      });
    });
  }
}

function safeItem(obj, path, fallback = "") {
  let val = obj[path] && obj[path][0];
  return val == null ? fallback : val;
}
