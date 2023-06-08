const axios = require('axios');
const blogsAPIURL = process.env.StrapiURL || "https://strapi-lumela.onrender.com/api/blogs";
module.exports = {

    getBlogsData: (req, res) => {
        try {
        const { query } = req.body;
            return axios.get(blogsAPIURL + '?' + query).then((response) => {
                return res
                    .status(200)
                    .set('Content-Type', 'application/transit+json')
                    .send(response.data)
                    .end();
            }).catch(e => {
                return res
                    .status(200)
                    .set('Content-Type', 'application/transit+json')
                    .send({ Status: "FAILED" })
                    .end();
            })
        } catch (ex) {
            console.log(ex,"ex")
            return res
                .status(200)
                .set('Content-Type', 'application/transit+json')
                .send({ Status: "FAILED" })
                .end();
        }
    },
}