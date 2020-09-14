/**
 * Add more social stuff into this object - these will be shown in the footer!
 * ---
 * link: the http link to the social profile
 * title: what the social profile is called
 * image: the path to the social icon
 * ---
 * 
 * Put the images in ~/static/social and reference like I have done here
 */

import TwitterLogo from "./../../static/social/twitter.png"
import LinkedinLogo from "./../../static/social/linkedin.png"

const Socials = [
    {
        link: "https://twitter.com/KyberCP",
        title: "Twitter",
        image: TwitterLogo
    },
    {
        link: "https://linkedin.com",
        title: "Linkedin",
        image: LinkedinLogo
    }
]
  
export { Socials }