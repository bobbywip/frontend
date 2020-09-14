/**
 * Add more "supporters" stuff in here and it will auto-render on the site
 * ---
 * id: where to sort it on the page
 * text: some text to be the hover text on the graphic
 * image: a nice graphic to display of the supporter logo
 * ---
 * 
 * Put the images in ../static/supporters and reference like I have done here
 */

import EbayLogo from "./../../static/supporters/ebay.png"
import CnnLogo from "./../../static/supporters/cnn.png"
import GoogleLogo from "./../../static/supporters/google.png"
import CiscoLogo from "./../../static/supporters/cisco.png"
import AirbnbLogo from "./../../static/supporters/airbnb.png"
import UberLogo from "./../../static/supporters/uber.png"

const SUPPORTERS_CONTENT = [
    {
      id: 1,
      text: "Ebay",
      image: EbayLogo
    },
    {
      id: 2,
      text: "CNN",
      image: CnnLogo
    },
    {
      id: 3,
      text: "Google",
      image: GoogleLogo
    },
    {
      id: 4,
      text: "Cisco",
      image: CiscoLogo
    },
    {
      id: 5,
      text: "Airbnb",
      image: AirbnbLogo
    },
    {
      id: 6,
      text: "Uber",
      image: UberLogo
    }
]

export { SUPPORTERS_CONTENT } 