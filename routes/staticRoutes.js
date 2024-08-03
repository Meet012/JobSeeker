const express = require('express');
const Job = require('../models/job');
const router = express.Router();
const { createCustomError } = require('../error/customError');

router.get('/', (req, res) => {
    try {
        res.render('home', { user: req.user });
    } catch (error) {
        next(error);
    }
});

router.get('/login', (req, res) => {
    try {
        res.render('login', { user: req.user });
    } catch (error) {
        next(error);
    }
});

router.get('/signUp', (req, res) => {
    try {
        res.render('signup', { user: req.user });
    } catch (error) {
        next(error);
    }
});

router.get('/all-jobs', async (req, res, next) => {
    try {
        const jobs = await Job.find({});
        res.render('allJobs', { jobs, user: req.user });
    } catch (error) {
        next(error);
    }
});

router.get('/all-jobs/:id', async (req, res, next) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return next(createCustomError('Job not found', 404));
        }
        res.render('spicficJob', { job, user: req.user });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
