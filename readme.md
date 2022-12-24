# rr-apilib

<p>
  <a href="https://github.com/cesi-pedoncule/RR-Lib/actions"><img src="https://github.com/cesi-pedoncule/RR-Lib/actions/workflows/codeql.yml/badge.svg" alt="CodeQL" /></a>
  <a href="https://www.npmjs.com/package/rr-apilib"><img src="https://img.shields.io/npm/v/rr-apilib.svg?maxAge=3600" alt="NPM Version" /></a>
</p>

Install: `npm install rr-apilib`

### Infos

This Library makes much easier the interactions with the project's API.
Declare your Client, log in your user and browse the hidden data or make queries by browsing the classes!

## Usage Example

Login and upload a new comment on an existing Resource
```javascript
const { Client, CommentBuilder } = require("rr-apilib");

(async () => {

    // Declare the client and login the user
    const client = new Client();
    await client.auth.login("me@mail.com", "password");

    // Get an existing ressource in cache with id
    const resource = client.resources.cache.get("uuid");
    console.log(resource);

    // Create new Comment
    const newComment = new CommentBuilder()
        .setComment(":D");
    
    // POST the new comment in API
    await ressource.addComment(newComment);

    // Log ressource comments
    console.log(ressource.comments);
})();
```

## Documentation
Documentation available soon...

## Contact
- Discord [Horziox#0007](https://discord.com/users/340212760870649866)