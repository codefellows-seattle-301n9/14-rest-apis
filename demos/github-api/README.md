# Instructor Script for GitHub API Token Authentication Demo

(Start with a high-level discussion of APIs and the data they provide.)

---

### Show basic AJAX interaction with the API

- **For now, have students only WATCH what you are doing. Tell them NOT to follow along in their consoles.**

- Go to api.github.com... the JSON there tells us pretty much all we need to know about the possible API endpoints provided by GitHub's API

- Try the "user_url" and go to api.jquery.com to run it

```js
$.get('https://api.github.com/users/samhamm')
.then(console.log)

We get back an object with all of our GitHub data!

Show some alternate versions of .then() for review

.then(function(data) {
  console.log(data)
})
.then(data => console.log(data))
```

- Let's get this dialed in a little more specifically... and see what is at that repos_url

```js
$.get('https://api.github.com/users/samhamm')
.then(data => console.log(data.repos_url))
```

- We can click through this URL and see where it takes us... JSON!!! Or, why not make an AJAX request for it, since it is sending us JSON back?

```js
$.get('https://api.github.com/users/samhamm/repos')
.then(data => console.log(data))
```

- An array of objects! We know how to work with those!

---

### Class participation starts here

- **OK, now everybody try this! This will quickly lead to GitHub shutting down unauthorized requests...**

- Uh, oh, now what? How do we make authorized requests? Here is the API route we will need to hit:

```js
// This will return a 401
$.get('https://api.github.com/user/repos')
.then(data => console.log(data))
```

- We can get this to work... if we have the authorization. What is our authorization? A token!

---

### Get a Token

- Go to your GH page, upper right corner, pull down to Settings, then in the lower left, Developer Settings, then Personal Access Tokens

- Note that we can configure the level of access that we give the token by selecting the boxes. This token, in the wrong hands, could spell disaster upon your repo. DO NOT PUBLISH IT!

- Anyway, let's select the option box for public_repo, then generate the token and copy it.

- And then use it like this in your console... to pass that header 'Authorization' we need to use $.ajax

```js
$.ajax({
  url: 'https://api.github.com/user/repos',
  method: 'GET',
  headers: {
    Authorization: 'token 566d51369e5732ea9c7f9ab587d5d20ef3858ae2'
  }
})
.then(console.log)
```

- So, the token registers who you are and what you are allowed to do.

- (Are there other users showing up? Probably shared/org repos)
Now append a query string to the URL like this:

```js
$.ajax({
  url: 'https://api.github.com/user/repos?type=owner',
  method: 'GET',
  headers: {
    Authorization: 'token 566d51369e5732ea9c7f9ab587d5d20ef3858ae2'
  }
})
.then(console.log)
```

- Query string? What's that?

- Becomes a part of the request headers!!!

- **SHOW IN THE DEV CONSOLE NETWORK TAB**

- Let's now do this in code. Direct students to the repo at **[https://github.com/codefellows/301-14-github-api](https://github.com/codefellows/301-14-github-api)** to fork and clone.

---
### Now working in code, not just the console

- In the code, show this multiple ways:

1. With the token inside the string of the $.ajax request
2. With the token in a separate file, .gitignored
3. With the token in an environment variable... will that work? IT WON'T: CLIENT CANNOT SEE ENV VARS
4. So... do we want to deploy this with the token in our repo? How do we mask the token? We're gonna need a proxy so that we can store our token where the server can get to it! Our proxy is SuperAgent!!!

- (Quick look at SuperAgent docs)

- **EDIT SERVER.JS**

```js
// REVIEW: We've added a new package here to our requirements, as well as in the package.json

const superagent = require('superagent');


// REVIEW: This is a new route that will utilize our middle man proxy.
// REVIEW: This is a new proxy method which acts as a 'middle man' (middleware) for our request.

app.get('/github/*', (req, res) => {
  console.log('Routing a GitHub AJAX request for ', req.params[0]);
  const url = `https://api.github.com/${req.params[0]}`;
  superagent.get(url)
    .set(`Authorization`, `token ${process.env.GITHUB_TOKEN}`)
    .then(
      repos => res.send(repos.text),
      err => res.send(err)
    )
})
```

- EDIT REPO.JS or other AJAX request... note the change to $.get and also the different route

```js
$.get('/github/user/repos')
  .then(
    // success
    data => JSON.parse(data).forEach(repo =>
    $('#results').append(`<h3>${repo.name}</h3>
    					  <p>${repo.description}</p>
    					  <hr>`)),
    err => console.error(err.status, err.statusText, 'is how my stuff is broken'));
```
***DONE!!!***
