const express = require("express")
const router = express.Router()

router.get('/',(req,res) =>{
    res.render()
})


router.get('/categorias',(req,res) =>{
    res.render()
})

router.get("/teste",(req,res) => {
    res.send("Isso é um teste")
})

module.exports = router