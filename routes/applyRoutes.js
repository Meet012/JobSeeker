const express = require('express');
const Job = require('../models/job');
const Application = require('../models/application');
const { createCustomError } = require('../error/customError');

const router = express.Router();


// GET /apply/:id - View job application form
router.get('/:id',async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return next(createCustomError('Job not found', 404));
        }
        res.render('application', { job, user: req.user });
    } catch (error) {
        next(error);
    }
});

// POST /apply/:id - Apply to a job
router.post('/:id', async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return next(createCustomError('Job not found', 404));
        }

        const { name, phoneNo, age, gender, email } = req.body;
        const application = new Application({
            name,
            phoneNo,
            age,
            gender,
            email,
            job: req.params.id,
            appliedBy: req.user._id
        });

        await application.save();
        console.log("Application submitted");

        res.redirect(`/all-jobs/${req.params.id}`);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
