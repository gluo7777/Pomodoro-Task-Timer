# Backgrounds
I use apps like timer-tab.com, Google Tasks (and iOS apps) a lot and would like to integrate these functionalities, mainly for my own use cases and learning.

# Goal
While design is important, I want to focus on the functionality and therefore will try to make the app very responsive and durable. I will start off with Javascript, but will explore AngularJS and ReactJS, etc.

# Approach
While I'm not completely new to front end concepts, I want to break down the development process into small research spikes that will produce demo components. Once I feel that I have enough components to address the minimum requirements I set out to create, I will integrate these components and make my first implementation.

# Technology
- Native JS
    - DOM, Storage APIs
    - EMCA6 Modules
- node.js
- frameworks
    - rewire
    - Jest
- OAuth2.0

# Action Items
- [X] Do some research
- [x] Determine minimum requirements
- [x] Create a mock up of minimum UI
- [x] Create components for each requirement
 - [X] Time
- [x] Define a set of consistent terminology for UI components
- [ ] [Web worker example](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers)
- [ ] Dive more into [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- [ ] move examples dir to FrontEndCollection repo

# Features
- [x] Timer hh:mm:ss
- [x] Time cards
- [x] Buttons: Add new card, Select cards, Delete cards
- [x] Import tasks using Google Task API and Oauth2.0
- [x] Delete Import tasks; Add imported tasks to timer list
- [ ] Sort Tasks - Can re-import on sorting
- [x] Buttons to reposition instead of dragging
- [ ] Add [snackbar](https://www.w3schools.com/howto/howto_js_snackbar.asp)
- [ ] Set up [desktop notifications](https://developer.mozilla.org/en-US/docs/Web/API/notification) for when timer ends
- [x] Save certain info in cookies
    - youtube video
    - previous timers
- [x] Add horizontal tabs to config panel for different settings (e.g. video player, google tasks sync)
    - Above tabs should hide/open their respective panels
- [x] Convert to use modules
- [ ] Create Settings page
- [x] Suggest refactoring html and css
    - move all dom related logic and references into one page and rename main page to controller
- [ ] Option to close a timer and add remaining time to next timer
- [x] Move top and bottom arrows
- [x] Set up node.js server
- [ ] Add templating to customize error page
- [ ] Play YouTube video or audio in background
    - [Web Worker/Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API#Audio_Workers)
- [ ] sophisticated client side storage
    - IndexDB
- [ ] Convert to Spring Boot
- [ ] Set up Postgresql DB
- [ ] Set up Google OAuth 2.0 for login authentication
- [ ] Save timer time whenever it's set
- [ ] More settings
    - New task appears at top
    - Presets: breaks, exercise
    - default time

## Settings
- Add Presets (e.g. break~20min, exerciser~15min) - save these settings to cookies
- Default time
- add to cookies

# Defects
- [x] `isAuthorized` is not set
- [x] title not reset to default when timer stopped or deleted
- [x] convert all var to const -> let

# Tutorials

## Google OAuth 2.0 Set Up
[OAuth2.0 Guide](https://developers.google.com/identity/protocols/OAuth2UserAgent?hl=en_US)
- implicit grant flow: only authorized while using app. does not store info.
- requirements
 - API key: for identification
 - OAuth Client id: for authorization
- flow
 - user clicks `authorize` button in web app
 - redirected to google url (request includes authentication parameters: client id, name, etc.)
 - google redirects back to webapp and includes access token in response
 - app verifies access token
 - app requests user info
 - use Google's OAuth client libraries instead of writing own
- identify access scopes:
 - read tasks
 - write completed tasks
- authorized JS origins and redirects
- consent screen
 - identity of data requester
 - scopes requested
- exposing client id and api key
 - unavoidable but must restrict referer/origin urls (So that other ppl won't be able to use my exposed info to make requests)

## Modules
### Client-side
> Lot's of ways to modularize client-side code
- https://www.sitepoint.com/understanding-es6-modules/
- multiple `<script>` tags
    - cons: separate HTTP GET request for each script
- script concatenation
    - cons: manual build process
- loading scripts at run time (e.g. AJAX)
    - RequireJS, SystemJS
    - cons: not as scalable or poor backwards compatibility
- Preprocessors and Transpilers
    - Babel, Browserify, Webpack
    - pros: automated build process, allows usage of TypeScript, etc.
- ES6 modules
    - cons: not well supported
    - pros: will be de facto standard moving forward

#### ES6 Modules
- runs in strict mode by default
- modules are parsed once
- modules are deferred by default e.g. `<script defer>`

## Lessons Learned
 - setting nowrap in flex-container and width:100% in flex-children produces stretching