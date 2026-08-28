const express = require('express');
const { sendEmail } = require('../../utils/email');

const router = express.Router();

// Password Reset Email
router.post('/api/email/reset-password', async (req, res) => {
    const { email } = req.body;
    try {
        const info = await sendEmail({
            to: email,
            subject: 'Password Reset Request',
            text: 'Click here to reset your password: [INSERT_LINK]',
            html: '<p>Click here to reset your password: <a href="[INSERT_LINK]">Reset Password</a></p>'
        });
        res.status(200).json({ message: 'Password reset email sent', info });
    } catch (error) {
        res.status(500).json({ error: 'Error sending password reset email' });
    }
});

// Email Verification
router.post('/api/email/verification', async (req, res) => {
    const { email } = req.body;
    try {
        const info = await sendEmail({
            to: email,
            subject: 'Verify Your Email',
            text: 'Click here to verify your email: [INSERT_LINK]',
            html: '<p>Click here to verify your email: <a href="[INSERT_LINK]">Verify Email</a></p>'
        });
        res.status(200).json({ message: 'Verification email sent', info });
    } catch (error) {
        res.status(500).json({ error: 'Error sending verification email' });
    }
});

// Role Update Notification
router.post('/api/email/role-update', async (req, res) => {
    const { email, role } = req.body;
    try {
        const info = await sendEmail({
            to: email,
            subject: 'Role Update Notification',
            text: `Your role has been updated to: ${role}`,
            html: `<p>Your role has been updated to: <strong>${role}</strong></p>`
        });
        res.status(200).json({ message: 'Role update email sent', info });
    } catch (error) {
        res.status(500).json({ error: 'Error sending role update email' });
    }
});

// Verification Status Update
router.post('/api/email/verification-status', async (req, res) => {
    const { email, status } = req.body;
    try {
        const info = await sendEmail({
            to: email,
            subject: 'Verification Status Update',
            text: `Your verification status has been updated to: ${status}`,
            html: `<p>Your verification status has been updated to: <strong>${status}</strong></p>`
        });
        res.status(200).json({ message: 'Verification status email sent', info });
    } catch (error) {
        res.status(500).json({ error: 'Error sending verification status email' });
    }
});

module.exports = router;