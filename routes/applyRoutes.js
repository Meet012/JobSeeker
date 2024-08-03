const express = require('express');
const Job = require('../models/job');
const Application = require('../models/application');
const router = express.Router();
const { createCustomError } = require('../error/customError');

// GET /portal/:id
router.get('/portal/:id', async (req, res, next) => {
    try {
        const jobs = await Job.find({ createdBy: req.params.id });
        res.render('adminPortal', { user: req.user, jobs });
    } catch (error) {
        next(error);
    }
});

// GET /create-job
router.get('/create-job', (req, res) => {
    res.render('createjob', { user: req.user });
});

// POST /create-job
router.post('/create-job', async (req, res, next) => {
    try {
        const { company, position, minSalary, role, opening, description } = req.body;
        const job = await Job.create({ company, position, minSalary, role, opening, description, createdBy: req.user._id });
        res.redirect(`/job/portal/${req.user._id}`);
    } catch (error) {
        next(error);
    }
});

// GET /delete/:id
router.get('/delete/:id', async (req, res, next) => {
    try {
        const jobId = req.params.id;
        await Job.deleteOne({ _id: jobId, createdBy: req.user._id });
        await Application.deleteMany({ job: jobId });
        res.redirect(`/job/portal/${req.user._id}`);
    } catch (error) {
        next(error);
    }
});

// DELETE /delete/:id
router.delete('/delete/:id', async (req, res, next) => {
    try {
        const jobId = req.params.id;
        await Job.deleteOne({ _id: jobId, createdBy: req.user._id });
        await Application.deleteMany({ job: jobId });
        res.redirect(`/job/portal/${req.user._id}`);
    } catch (error) {
        next(error);
    }
});

// GET /edit/:id
router.get('/edit/:id', async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findOne({ _id: jobId, createdBy: req.user._id });
        res.render('edit', { job, user: req.user });
    } catch (error) {
        next(error);
    }
});

// GET /applicants/:id
router.get('/applicants/:id', async (req, res, next) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if (req.user._id.toString() !== job.createdBy.toString()) {
            return next(createCustomError('Unauthorized', 401));
        }
        const applicants = await Application.find({ job: jobId });
        res.render('applicants', { applicants, user: req.user });
    } catch (error) {
        next(error);
    }
});

// GET /deleteApplicant/:id
router.get('/deleteApplicant/:id', async (req, res, next) => {
    try {
        const applicationId = req.params.id;
        const application = await Application.findById(applicationId);
        if (!application) {
            return next(createCustomError('Application not found', 404));
        }
        await Application.deleteOne({ _id: applicationId });
        res.redirect(`/job/applicants/${application.job}`);
    } catch (error) {
        next(error);
    }
});

// POST /edit/:id
router.post('/edit/:id', async (req, res, next) => {
    try {
        const jobId = req.params.id;
        await Job.findByIdAndUpdate(jobId, req.body, { new: true });
        res.redirect(`/job/portal/${req.user._id}`);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
