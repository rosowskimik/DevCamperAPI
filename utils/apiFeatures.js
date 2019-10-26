class APIFeatures {
  constructor(query, reqQuery) {
    const { fields, sort, limit, page, ...conditions } = reqQuery;

    this.query = query;
    this.fields = fields;
    this.sort = sort || '-createdAt';
    this.limit = limit;
    this.page = page;
    this.conditions = conditions;
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
}

module.exports = APIFeatures;
