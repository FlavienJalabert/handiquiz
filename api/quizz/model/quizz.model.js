const mongoose = require('mongoose');

const { Schema } = mongoose;

const Image = new Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
  },
  title: {
    type: String,
  },
});

const Question = new Schema({
  question: {
    type: [Image],
    required: true,
  },
  response1: {
    type: [Image],
    required: true,
  },
  response2: {
    type: [Image],
    required: true,
  },
  response3: {
    type: [Image],
  },
  response4: {
    type: [Image],
  },
  correctAnswer: {
    type: Number,
    required: true,
  },
  answerDescription: {
    type: [Image],
  },
}, {
  collection: 'question',
});

// Define collection and schema for Post
const Quiz = new Schema({
  quiz: {
    type: [Question],
  },
  tagList: {
    type: [String],
  },
  createDate: {
    type: Date,
  },
  updateDate: {
    type: Date,
  },
}, {
  collection: 'quiz',
});

Quiz.pre('save', (next) => {
  this.createDate = new Date();

  next();
});

module.exports = mongoose.model('Quiz', Quiz);
