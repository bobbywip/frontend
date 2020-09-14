/**
 * Add more "how it works" stuff in here and it will auto-render on the site
 * ---
 * key: where to sort it on the page
 * image: a nice graphic to display next to the text
 * header: what to call this segment
 * body: an explainer
 * ---
 * 
 * Put the images in ~/static/ and reference like I have done here
 */

import TrustlessLogo from "./../../static/trustless.png"
import EffortlessLogo from "./../../static/effortless.png"
import RewardingLogo from "./../../static/rewarding.png"

const HOW_IT_WORKS_CONTENT = [
    {
      key: 1,
      image: TrustlessLogo,
      header: "Trustless",
      body: "By using Kyber Community Pool, you never have to sacrifice trust to make sure your funds are safe. Your funds are managed by smart contracts that have been audited by Kyber Network & ChainSecurity"
    },
    {
      key: 2,
      image: EffortlessLogo,
      header: "Effortless",
      body: "With Kyber Community Pool, we put your KNC to work governing the protocol without any effort from you - the only catch is that you get all the benefits!"
    },
    {
      key: 3,
      image: RewardingLogo,
      header: "Rewarding",
      body: "When using Kyber Community Pool, you're earning a share of fees generated on Kyber Network in the form of ETH. On top of that, you're also rewarded with knowning that our pool takes pride in prioritizing the community's mindset when it comes to governing the protocol."
    }
]

export { HOW_IT_WORKS_CONTENT }