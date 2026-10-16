// "Forgot password?" on the login screen.
// Uses the email already typed in the login box and shows the result under it.
// Standalone on purpose: it only needs `auth` from firebase-config.js, so your
// existing auth.js and Firebase keys stay exactly as they are.
import { sendPasswordResetEmail } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from './firebase-config.js';

const COOLDOWN_MS = 30000;
let lastSent = { email: '', at: 0 };
let sending = false;

const $ = id => document.getElementById(id);

function say(error, notice) {
    const e = $('loginError'), n = $('loginNotice');
    if (e) e.textContent = error || '';
    if (n) n.textContent = notice || '';
}

function friendlyError(code) {
    switch (code) {
        case 'auth/invalid-email': return 'That email address does not look right.';
        case 'auth/too-many-requests': return 'Too many attempts. Please wait a few minutes and try again.';
        case 'auth/network-request-failed': return 'No connection. Check your internet and try again.';
        default: return 'Could not send the reset email. Please try again.';
    }
}

// Same wording whether or not an account exists, so this can't be used to find out who has one.
const SENT = 'If an account exists for that email, a reset link is on its way. Check your inbox and junk folder.';

window.handleForgotPassword = async function (event) {
    if (event) event.preventDefault();
    if (sending) return;

    const input = $('loginEmail');
    const email = (input?.value || '').trim();

    if (!email || (input && !input.checkValidity())) {
        say('Type your email in the box above, then press "Forgot password?".');
        input?.focus();
        return;
    }

    const waitMs = COOLDOWN_MS - (Date.now() - lastSent.at);
    if (lastSent.email === email && waitMs > 0) {
        say('', `Reset email already sent. You can send another in ${Math.ceil(waitMs / 1000)}s.`);
        return;
    }

    sending = true;
    say('', 'Sending…');
    try {
        await sendPasswordResetEmail(auth, email);
        lastSent = { email, at: Date.now() };
        say('', SENT);
    } catch (error) {
        console.error('Password reset error:', error);
        if (error.code === 'auth/user-not-found') {
            lastSent = { email, at: Date.now() };
            say('', SENT);
        } else {
            say(friendlyError(error.code));
        }
    } finally {
        sending = false;
    }
};

// clear the notice once they start typing a different email or password
document.addEventListener('input', e => {
    if (e.target.id === 'loginEmail' || e.target.id === 'loginPassword') {
        const n = $('loginNotice');
        if (n) n.textContent = '';
    }
});
