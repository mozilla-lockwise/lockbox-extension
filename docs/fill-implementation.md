# Implementing Form Fill

The following is a work-in-progress document discussing the open questions we have for implementing form fill in the desktop extension. See [issue #495][issue-495] for details on the interactinon design.

## How do we detect forms?

Previously, we've discussed "borrowing" the code from mozilla-central to do the form-detection logic. However, I haven't delved especially deep into this, so I can't yet say if this will be easy or hard. Some things in particular that I think we should investigate:

* Would it be feasible in the short term to just use XPCOM to talk to the code as it is in mozilla-central? Is it even flexible enough to do this?
* How hard would it be to copy/paste the code into our repo and adapt it to our purposes? Would we be able to easily run it in a WebExtension context, or do we need to hoist it into our XPCOM wrapper?
* How much does the existing code rely on being synchronous? Many of the XPCOM APIs are *very* synchronous, which may pose a problem for us.
* What stuff can we get rid of? We probably don't need everything that the existing code does, especially as it relates to storage (we have our own).

## How do we safely inject HTML into arbitrary sites?

This is an area I don't have much experience (most of the extensions I've written are entirely in chrome, not content), and we'll need to be careful. Here are some questions I have:

* If we inject HTML into a site, can the site tell that we did that, and if so, can it do anything about it? (For example, could a website walk into our DOM and steal users' passwords that way?)
* How can we ensure that only our CSS is applied while still "working with" the site's CSS? It may be difficult to inject a little icon into form fields if those fields have a strange DOM layout.
* What capabilities do we have to make it hard to imitate our UI? The only thing I can think of at the moment is to do something to our toolbar button whenever the in-content dropdown is open. That could act as a signal that the dropdown is legitimate, but it may be too subtle.

## The Easy Part

Adding the dot to the toolbar button when we have an entry for the site should be pretty straightforward actually, and it's something I'd recommend we do first. Even if we don't get Fill finished, the dot would still be helpful to users, since it would tell them that we have entries available for them. If we wanted to be fancy, we could even list how *many* matches there are for the current site.

[issue-495]: https://github.com/mozilla-lockbox/lockbox-extension/issues/495
