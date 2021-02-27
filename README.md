This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Kyber Community Staking Protocol

## Developer

#### Installation

```bash
nvm use
yarn
yarn start
```

#### Build

```bash
yarn build
```

## Content Management

#### Update FAQ's

You can add/remove entries - the frontend will render as many entries there are in this JSON
* Open file `./src/config/content/faq.js` and change/add/remove the content

#### Update blockexplorer and backend APIs

* Open file `./src/config/content/knc.js`
  * `DAO_API_URL` - data is used to build pie graphs and show total burned, rewarded, and rebate
  * `DAO_API_USER_REWARDS_URL` - used to fetch the rewards data for a users/kcsp participation in the knc staking
  * `DAO_API_USER_ACTIVITY_URL` - used to fetch activity data for the user to detail their interactions with the knc staking contract (ie: adding/removing knc tokens)
  * `BLOCK_EXPLORER` - used to build a link to transactions to a third party site

#### Update Supporters logo

You can add/remove entries - the frontend will render as many entries there are in this JSON
* Open file `./src/config/content/supporter.js` and change/add/remove the content
  * Upload the supporter graphic to `./static/supporters` and import like is in the file

#### Update how-it-works points

You can add/remove entries - the frontend will render as many entries there are in this JSON
* Open file `./src/config/content/works.js` and change/add/remove the content
  * Upload the icon graphic to `./static/` and import like is in the file

#### Update social links

You can add/remove entries - the frontend will render as many entries there are in this JSON
* Open file `./src/config/socials/index.js` and change/add/remove the content
  * Upload the icon graphic to `./static/social` and import like is in the file

#### Update Infura ID

* Go into your Heroku settings for the [node-proxy](https://github.com/kyber-community-staking-protocol/node-proxy)
* Change the node-proxy endpoint in `./src/config/web3/index.js`

#### Update Delegation Address (KCSP contract) (& other contract addresses)

* Open file `./src/config/web3/contracts/config.json` and change the value with key `KCSP_ADDRESS` for the relevant network