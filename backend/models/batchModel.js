const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A batch must have a name"],
    unique: true,
  },
  startDate: {
    type: Date,
    required: [true, "A batch must have a start date"],
  },
  endDate: {
    type: Date,
    required: [true, "A batch must have an end date"],
  },
});

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
