const Tours = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');
const appErrore = require('../utils/appErrore');
const User = require('.././models/user`sModel');

exports.overview = catchAsync(async (req, res) => {
  const tours = await Tours.find();

  tours.forEach((tour) => {
    tour.startDatesFormatted = tour.startDates.map((date) =>
      moment(date).format('MMMM YYYY')
    );
  });

  res.render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.Tour = (req, res) => {
  res.render('tour', {
    title: 'The Forest Hiker',
  });
};

exports.getTour = catchAsync(async (req, res, next) => {
  try {
    const tour = await Tours.findOne({ slug: req.params.slug });
    if (!tour) {
      return next(new appErrore('There is no tour with that name', 404));
    }

    tour.startDatesFormatted = tour.startDates.map((date) =>
      moment(date).format('MMMM YYYY')
    );

    res.status(200).render('tour', {
      title: `${tour.name} Tour`,
      tour,
    });
  } catch (error) {
    next(err);
  }
});

exports.getLoginForm = catchAsync((req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getSingupForm = catchAsync((req, res) => {
  res.status(200).render('signup', {
    title: 'Create an account',
  });
});

exports.getAcountSettings = (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user || null,
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const udateduser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  console.log(udateduser);
  res.status(200).render('account', {
    title: 'Your account',
    user: udateduser,
  });
});
