const apiKey = 'qk4wms73dv6nf7fjzb3q927k'
const api_secret = 'kTgPsNNpw8b2VM95BsHpEMhPzuTfJW6y5jywWD4szz9zk'
const api = 'https://api.gettyimages.com/v3/search/images?fields=id,title,thumb,referral_destinations&sort_order=best&phrase='


const headers = {
  'Api-Key': 'qk4wms73dv6nf7fjzb3q927k'
}

/* grabs the first image from getty API that matches the query */

export const getImage = (query) => {
  fetch(`${api}/${query}`, { headers })
  .then(res => res.json())
  .then(data => data.images[0].display_sizes[0])
  .catch(() => console.log("error"))
}
