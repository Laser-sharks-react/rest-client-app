## 📝 In short
- [ ] 
- [ ]
- [x]

## 📸 Screenshots (if UI)

## 📝 Evaluation criteria

### Main route - max 50 points
 - [x] The Main page should contain general information about the developers, project, and course. - 10 points

 -[x] In the upper right corner there are 2 buttons: Sign In and Sign Up. - 10 points
 -[x] If the user is authorized, there should be a Main Page button instead of Sign In and Sign Up buttons in the upper right corner. - 10 points
 -[x] If the token is expired/invalid - the user should be redirected from the private routes to the Main page (it might happen either automatically, on page refresh or on route change). - 10 points
 -[x]  Pressing the Sign In / Sign up button redirects a user to the route with the Sign In / Sign up form. - 10 points
### Sign In / Sign Up - max 50 points
 -[x]  Buttons for Sign In / Sign Up / Sign Out are everywhere where they should be. - 10 points
 -[x]  Client-side validation is implemented. - 20 points
 -[x]  Upon successful login, the user is redirected to the Main page. - 10 points
 -[x]  If the user is already logged in and tries to reach these routes, they should be redirected to the Main page. - 10 points
### RESTful client - max 150 points
 -[x] Functional editor enabling query editing and prettifying, request body provided in the URL as base64-encoded on request submit. - 35 points
 -[x] Functional read-only response section, with information about HTTP status and the code. - 30 points
 -[x] Method selector, shows all the valid HTTP verbs, value is provided in the URL on request submit. - 15 points
 -[x] Input for the URL, entered value is provided in base64-encoded way on request submit. - 20 points
 -[x] Headers section, value is provided in the URL on request submit. - 20 points
 -[x] Code generation section. - 30 points
### History and analytics route - max 100 points
 -[x] History and analytics is server-side generated and shows informational message with links to the clients when there are no requests in the database. - 20 points
 -[x] User can navigate to the previously executed HTTP request to the RESTful client, HTTP method, URL, body, headers are restored. - 30 points
 -[x] The following analytics are recorded to the database from the application server side and displayed to the user: request duration, response status code, request timestamp, request method, request size, response size, error details, endpoint/URL. - 50 points
### Variables route - max 50 points
 -[x]  Variables show all the added variables, restores them from the local storage on load. - 15 points
 -[x]  User can add new, or delete an existing variable, variables in the local storage are updated on change. - 15 points
 -[x]  Variables are used in the request before the request execution. - 20 points
### General requirements - max 50 points
 -[x]  Multiple (at lest 2) languages support / i18n. - 30 points
 -[x]  Sticky header. - 10 points
 -[x]  Errors are displayed in the user friendly format. - 10 points
### Youtube video - max 50 points
### Penalties
0. Framework Choice
  -[] Using any framework option other than the mandatory list (React Router 7 (Framework mode), Next.js (App Router), Tanstack Start, Waku) is strictly forbidden and will result in -200 points
1. TypeScript & Code Quality

 -[]  @ts-ignore or any usage (search through GitHub repo) -20 points for each
 -[]  The presence of code-smells (God-object, chunks of duplicate code), commented code sections -10 points per each
2. Test Coverage

 -[]  Statement coverage below 80% (≥70%): -50 points
 -[]  Statement coverage below 70% (≥50%): -100 points
 -[]  All coverage metrics below 50%: -150 points
 -[]  Absence of tests -250 points
3. React Best Practices

 -[]  One of the required lazy-loaded routes isn't lazy-loaded -50 per each
4. Console & Error Handling

 -[]  The presence of errors and warnings in the console -20 points for each
 -[]  The presence in the console of the results of the console.log execution -20 points for each
 -[]  HTTP 4xx and 5xx status codes displayed as errors not in the response section -50 points
5. Development Tools

 -[]  Absence of a linting tool -150 points
 -[]  Absence of a formatting tool -100 points
 -[]  Absence of husky git hooks -100 points
6. UI/UX

 -[]  Vite/NextJS default favicon -50 points
7. Project Management

 -[] Making commits after the deadline -100 points
 -[] Pull Request doesn't follow guideline (including checkboxes in Score) [PR example](https://rs.school/docs/en/pull-request-review-process#pull-request-description-must-contain-the-following) -10 points
 -[]  ⚠️ The administration reserves the right to apply penalties for the use of incorrect repository or branch names
