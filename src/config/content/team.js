/**
 * Add more "team" stuff in here and it will auto-render on the site
 * ---
 * id: where to sort it on the page
 * text: some text to be the hover text on the graphic
 * image: a nice graphic to display of the supporter logo
 * ---
 * 
 * Put the images in ../static/team and reference like I have done here
 */

import ImageDefiDude from "./../../static/team/defidude.jpg"
import ImageSasha from "./../../static/team/sasha.jpg"
import ImageHarry from "./../../static/team/harry.jpg"

const TEAM_CONTENT = [
    {
      id: 1,
      name: "DefiDude",
      role: "Pool Admin",
      link: "https://twitter.com/defidude",
      image: ImageDefiDude
    },
    {
      id: 2,
      name: "Sasha",
      role: "UI Designer",
      link: "https://www.linkedin.com/in/sasha-tanase-b5190583/",
      image: ImageSasha
    },
    {
      id: 3,
      name: "Harry",
      role: "Frontend Developer",
      link: "https://twitter.com/sniko_",
      image: ImageHarry
    }
]

export { TEAM_CONTENT } 