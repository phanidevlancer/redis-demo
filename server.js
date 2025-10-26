const express = require('express')
const axios = require('axios').default
const {client} = require('./client')


const app = express()

/**
 * Step 1 : Install docker 
 * Step 2 : Install Redis stack image on docker https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-stack/docker/
 *          Command - docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
 * Step 3 : Inside terminal run the below commands 
 *          cmd docker ps 
 *          docker exec -it c1dd9e0a925c bash
 *          redis-cli
 * 
 * Step 4 : Inside browser open http://localhost:8001/ for redis gui
 */

app.get('/', async (req, res) => {
    console.log("You got a request here")

    const cachedData = await client.get('posts')
    if (cachedData) {
        return res.json(JSON.parse(cachedData))
    }

    const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts')

    await client.set('posts', JSON.stringify(data))
    await client.expire('posts', 30)

    return res.json(data)



})


app.listen(9001, () => {
    console.log('server start on port 9001');

})