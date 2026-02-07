---
agent: agent
description: This prompt is used to implement a contact form with two-factor authentication (2FA)
argument-hint: react, javascript, redis, vercel
model: Claude Opus 4.6 (copilot)
tools: ['vscode', 'execute', 'read', 'edit', 'search', 'web', 'agent', 'github/*', 'todo']
---

Feature request: Contact form with 2FA
As a user, I want to be able to submit a contact form on the website, but with an added layer of security through two-factor authentication (2FA). This will ensure that only authorized users can submit the form and help prevent spam or unauthorized access.

Previews integration old repo from a diferent project: /new_feature
old documentation: /new_feature/documentation/README.md

The contact form should include fields for the user's name, email address, subject, and message. Upon submission, the user should be prompted to enter a verification code sent to their registered email or phone number. Only after successfully entering the code should the form be submitted and the message sent to the website administrators.

The 2fa code use smtp credectials to send the code to the user email, and use redis to store the code for a limited time, and validate it when the user submit the form. The form should also include a captcha to prevent automated submissions.

the previews project was built using Flask and Redis, and the contact form with 2FA should be implemented to be compatible with the existing architecture and technology stack. The implementation should also follow best practices for security and user experience. keep in mind that i use vercel for deployment, so the solution should be compatible with that environment.

ask me for clarifications if needed, and then provide a detailed implementation plan for this feature, including any necessary changes to the existing codebase, database schema, and user interface.