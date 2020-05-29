# svelte-events-example

Table of Contents
- [svelte-events-example](#svelte-events-example)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
    - [Example](#example)
  - [Building and running in production mode](#building-and-running-in-production-mode)
  - [License](#license)

** SharePoint Calendar events with svelte, robot3, and SPServices for legacy recurrence data; pnp.js is used on more modern SharePoint instances
*
- jscc allows for builds that target different environments 

## Installation

### Prerequisites

Requires [Node.js](https://nodejs.org/)
It's very helpful if you have access to SharePoint, since this is a SharePoint development starter kit template.
The generated project will work with SharePoint 2013, SharePoint 2016, SharePoint 2019, and SharePoint Online. 

## Getting started
* Clone
```
git clone https://github.com/SharePoint-Repo/svelte-events-example.git
```


* Install the dependencies...

```bash
npm install
```

* Configure sp-rest-proxy 
````
npm run proxy
```` 
then answer the interactive questions to configure the proxy connection to your SharePoint site. Recommend selecting On-Demand Credentials for the authentication strategy. 
Ctrl-c to end task.

* Start development 
````
npm run dev 
````
(uses concurrently), to start the proxy and dev server simultaneously
* Develop interactively, with real SharePoint data. Enjoy!

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

### Example
![](https://github.com/SharePoint-Repo/svelte-events-example/blob/master/Events%20example.png)


## Building and running in production mode

To create an optimized version of the app:

```bash
npm run build
```


## License

**[MIT](https://opensource.org/licenses/MIT)**
