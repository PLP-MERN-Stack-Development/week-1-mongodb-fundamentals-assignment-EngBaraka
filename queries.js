//MongoDB queries

db.books.find({ in_stock: true, published_year: { $gt: 1950 } });

db.books.find({}, { _id: 0, title: 1, author: 1, price: 1 });

db.books.find().sort({ price: 1 });

db.books.find().sort({ price: -1 });

db.books.find().limit(5);

db.books.find().skip(5).limit(5);

//Aggregation pipeline

// 1. Average Price of Books by Genre
javascript
Copy
Edit

db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
]);

 // 2. Author with the Most Books
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { totalBooks: -1 }
  },
  {
    $limit: 1
  }
]);

// 3. Group Books by Decade and Count Them

db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $multiply: [{ $floor: { $divide: ["$published_year", 10] } }, 10] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      count: { $sum: 1 }
    }
  },
  {
    $sort: { _id: 1 }
  }
]);

//indexing

use("plp_bookstore");

// Create an index on the title field to speed up title searches
db.books.createIndex({ title: 1 });

// Create a compound index on author and published_year for optimized author-year queries
db.books.createIndex({ author: 1, published_year: -1 });

// Check performance of a query using the title index
db.books.find({ title: "1984" }).explain("executionStats");

// Check performance of a query using the compound author index
db.books.find({ author: "George Orwell" }).explain("executionStats");
use("plp_bookstore");
