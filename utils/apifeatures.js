class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          $or: [
            {
              jobTitle: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
            {
              location: {
                $regex: this.queryStr.keyword,
                $options: "i",
              },
            },
          ],
        }
      : {};

    this.query = this.query.find({ ...keyword });

    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // Fields to filter by
    const fieldsToRemove = ["keyword", "page", "limit"];
    fieldsToRemove.forEach((field) => delete queryCopy[field]);

    // Implement location and jobTitle filters if specified
    if (queryCopy.jobTitle) {
      this.query = this.query.find({
        jobTitle: { $regex: queryCopy.jobTitle, $options: "i" },
      });
    }

    if (queryCopy.location) {
      this.query = this.query.find({
        location: { $regex: queryCopy.location, $options: "i" },
      });
    }

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
