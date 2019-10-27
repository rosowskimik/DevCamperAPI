class APIFeatures {
  constructor(Model, reqQuery, query) {
    const {
      fields,
      sort = '-createdAt',
      page,
      limit,
      ...conditions
    } = reqQuery;

    this.model = Model;
    this.query = query || Model.find();
    this.fields = fields;
    this.sort = sort;
    this.page = page;
    this.limit = limit;
    this.conditions = conditions;
    this.pagination = {};
  }

  filter() {
    const queryString = JSON.stringify(this.conditions);
    this.conditions = JSON.parse(
      queryString.replace(/\b(gt|gte|lt|lte|ne|in)\b/g, match => `$${match}`)
    );

    this.query = this.query.find(this.conditions);

    return this;
  }

  selectFields() {
    this.fields = this.fields && this.fields.replace(/,/g, ' ');

    this.query = this.query.select(this.fields);

    return this;
  }

  sortBy() {
    this.sort = this.sort.replace(/,/g, ' ');

    this.query = this.query.sort(this.sort);

    return this;
  }

  async paginate() {
    const page = parseInt(this.page, 10) || 1;
    const limit = parseInt(this.limit, 10) || 25;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await this.model.find(this.conditions).countDocuments();

    if (skip > 0) {
      this.pagination.prev = {
        page: page - 1,
        limit
      };
    }
    if (endIndex < total) {
      this.pagination.next = {
        page: page + 1,
        limit
      };
    }

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
