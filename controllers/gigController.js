const Gig = require("../models/gigModel");
const Job = require("../models/jobModel");
const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create a new gig (Admin)
exports.createGig = catchAsyncErrors(async (req, res, next) => {
  const gig = await Gig.create(req.body);

  res.status(201).json({
    success: true,
    gig,
  });
});

// Update gig (Admin)
exports.updateGig = catchAsyncErrors(async (req, res, next) => {
  let gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    gig,
  });
});

// Delete gig (Admin)
exports.deleteGig = catchAsyncErrors(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  await gig.deleteOne();

  res.status(200).json({
    success: true,
    message: "Gig deleted successfully",
  });
});


// Function to get all gigs
exports.getAllGigs = async (req, res) => {
  try {
      // Populate the selectedJobs field
      const getGigs = async (req, res) => {
        try {
            const gigs = await Gig.find().populate('selectedJobs'); // Populate selectedJobs
            console.log("Fetched gigs:", gigs);
            res.status(200).json(gigs);
        } catch (error) {
            console.error("Error fetching gigs:", error);
            res.status(500).json({ message: "Error fetching gigs" });
        }
    };
  } catch (error) {
      console.error("Error fetching gigs:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};


// Get single gig
exports.getSingleGig = catchAsyncErrors(async (req, res, next) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    return next(new ErrorHander("Gig not found", 404));
  }

  res.status(200).json({
    success: true,
    gig,
  });
});


// Add Gig
exports.addGig = async (req, res) => {
  try {
    const { title, jobs, deadline, budget, pdf } = req.body;

    const gig = await Gig.create({
      title,
      description,
      jobs,
      deadline,
      budget,
      pdf,
    });

    res.status(201).json({
      success: true,
      gig,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Filter Jobs by Country
exports.getJobsByLocation = async (req, res) => {
  const { country } = req.query;

  try {
    const jobs = await Job.find({ location }); // Assuming the Job model has a country field

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};