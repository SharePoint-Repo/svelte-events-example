# svelte-events-example

Table of Contents

- [svelte-events-example](#svelte-events-example)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
  - [Getting started](#getting-started)
    - [Clone](#clone)
    - [Install dependencies](#install-dependencies)
    - [Configure sp-rest-proxy](#configure-sp-rest-proxy)
    - [Start development](#start-development)
    - [Example](#example)
  - [Building and running in production mode](#building-and-running-in-production-mode)
  - [Design](#design)
    - [jscc](#jscc)
      - [jscc example](#jscc-example)
    - [pnp vs spservices](#pnp-vs-spservices)
      - [getData.js](#getdatajs)
    - [robot3](#robot3)
      - [eventMachine.js](#eventmachinejs)
    - [svelte](#svelte)
      - [App.svelte](#appsvelte)
  - [License](#license)

SharePoint Calendar events with svelte, robot3, and SPServices for legacy recurrence data; pnp.js is used on more modern SharePoint instances

- jscc allows for builds that target different environments 

## Installation

### Prerequisites

Requires [Node.js](https://nodejs.org/)
It's very helpful if you have access to SharePoint, since this is a SharePoint development starter kit template.
The generated project will work with SharePoint 2013, SharePoint 2016, SharePoint 2019, and SharePoint Online. 

## Getting started

### Clone
  
```bash
git clone https://github.com/SharePoint-Repo/svelte-events-example.git
```

### Install dependencies

```bash
npm install
```

### Configure sp-rest-proxy

```bash
npm run proxy
````

then answer the interactive questions to configure the proxy connection to your SharePoint site. Recommend selecting On-Demand Credentials for the authentication strategy. 
Ctrl-c to end task.

### Start development

```bash
npm run dev
````

(uses concurrently), to start the proxy and dev server simultaneously
Develop interactively, with real SharePoint data. Enjoy!

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

### Example

![](https://github.com/SharePoint-Repo/svelte-events-example/blob/master/Events%20example.png)

## Building and running in production mode

To create an optimized version of the app:

```bash
npm run build
````

## Design

### [jscc](https://github.com/aMarCruz/rollup-plugin-jscc)

rollup-plugin-jscc provides conditional compilation and compile-time variable replacement which allows for builds targeting different SharePoint environments. 

- pnpconfig: specifies the .js file to be imported into the project; ../src/config.js is default (no pnpconfig variable is specified).
    - The various config files contain a JSON object which specify
        - baseUrl: [string] The url of the site containing the rest end point
        - lists: [object] contains properties representative of the lists (calendars) containing the events to display
            - name: [string] name of the list to get
            - tabStatus: [string] initial css sub class of the tab which displays the associated lists data 
        - replaceText: Regular expression to match (allows for the removal a common pattern in the list names)
- spver: SharePoint version to target
    - o365 || 2019 (Office 365 or SharePoint 2019): Use [pnp.js](https://github.com/pnp/pnpjs/) to get SharePoint calendar data via rest
    - default (no spver specified): use [SPServices](https://sympmarc.github.io/SPServices/) to get SharePoint calendar data 


#### jscc example

- pnpconfig 
    1. Create a .js file in the projects 'config' directory
    ```bash
    touch ../config/testConfig.js
    ````
    2. Use ../src/config.js as an example of how to target a specific SharePoint site and set of lists (calendars)
        - Note that config.js sets
        ```javascript
        baseUrl: "http://localhost:8080",
        ````
        This is because localhost:8080 is default host and port of the sp-rest-proxy. When developing interactively, your rest requests should be sent to the sp-rest-proxy which then proxies the request to the configured SharePoint host and port for processing. See sp-rest-proxy config for details
    3. Update this tomorrow


### pnp vs spservices

#### getData.js

### [robot3](https://thisrobot.life)

#### eventMachine.js

### svelte

#### App.svelte

## License

**[MIT](https://opensource.org/licenses/MIT)**
