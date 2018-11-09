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