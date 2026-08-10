# Privacy Policy for Spyboy CyberSuite

**Last Updated:** August 10, 2026

This Privacy Policy explains how **Spyboy CyberSuite** ("the Extension") handles user data and privacy. Our commitment to your privacy is absolute: the Extension is designed to run entirely client-side, and **we do not collect, store, transmit, or share any of your personal data, web history, or sensitive information.**

---

## 1. No Data Collection
Spyboy CyberSuite does not collect any personal or non-personal user data. 
- We do not run any external backend servers.
- We do not use any telemetry, analytics tracking, or remote logging.
- We do not gather, record, or transmit your IP address, location, search queries, browsing history, input parameters, or form data.

## 2. Local Processing & Permissions
All operations performed by the Extension are completed entirely on your local machine. The browser permissions requested by the Extension are used strictly for local operations:
- **`activeTab` & `scripting`**: Used to analyze the active website you are viewing (such as highlighting hidden fields or extracting HTML comments) and to check response headers locally. No page details or injected script data is transmitted off your computer.
- **`storage`**: Used to store your user preferences (specifically, your preferred UI theme—dark/light mode—and your last active dashboard tab). This data is saved locally on your device using Chrome's secure storage API and is never sent to us.
- **`cookies`**: Used exclusively to check the security flags (Secure, HttpOnly, SameSite) of active cookies on the current tab and display them to you.
- **`tabs`**: Used to inspect the URL of the active tab to safely disable scripting functions on restricted browser system pages (like `chrome://`).
- **`contextMenus`**: Used to register quick right-click actions (like entering page-edit mode or bypassing cookie dialogs).

## 3. Third-Party Links & Services
The Extension contains reference links and shortcut buttons to third-party web auditing and OSINT lookup services (such as VirusTotal, urlscan.io, Epieos, Truecaller, and others). 
- When you click these buttons, you are standardly navigating to a third-party website.
- These external services are governed by their own respective privacy policies. 
- Spyboy CyberSuite does not share any background data or tracking parameters with these sites.

## 4. Changes to This Policy
We may update this Privacy Policy from time to time. Any changes will be reflected by updating the "Last Updated" date at the top of this document.

## 5. Contact
If you have any questions or feedback regarding the privacy of this Extension, please contact us through our official channels.