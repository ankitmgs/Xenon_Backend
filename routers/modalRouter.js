const router = require("express").Router();
const Model = require("../models/threeDModel");

const multer = require("multer")
const fs = require("fs")
const unzipper = require("unzipper")

const imagestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./static/uploads/images")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const filestorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./static/uploads/zipfiles")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const extractFile = (filepath) => {
  fs.createReadStream("./static/uploads/zipfiles/" + filepath).pipe(
    unzipper.Extract({ path: "./static/uploads/extracted/" + filepath }),
  )
}

const uploadImage = multer({ storage: imagestorage })
const uploadFile = multer({ storage: filestorage })

router.post("/uploadimage", uploadImage.single("myimage"), (req, res) => {
  console.log(req.body)
  res.json({ message: "File upload success" })
})

router.post("/uploadfile", uploadFile.single("myfile"), (req, res) => {
  console.log(req.body)
  res.json({ message: "File upload success" })
})

router.post("/add", (req, res) => {
  data = req.body

  let model = new Model(data)

  model
    .save()
    .then((data) => {
      extractFile(data.data)
      res.status(200).json(data)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json(err)
    })
})


router.get("/getall", (req, res) => {

  Model.find({})
    .then((result) => {
      console.log(result)
      res.json(result)
    })
    .catch((err) => {
      console.error(err)
      res.json(err)
    })
  
})

router.get("/getbyid/:id", (req, res) => {
  // data dhund k laana database se       it give data in the form of array
  Model.findById(req.params.id)
    .then((result) => {
      console.log(result)
      res.json(result)
    })
    .catch((err) => {
      console.error(err)
      res.json(err)
    })
  // res.send(' user router');
})

router.delete('/delete/:modelid', (req, res) => {
  Model.findByIdAndDelete(req.params.modelid)
    .then((result) => {
      console.log(result)
      res.status(200).json({message: "model deleted"});
    })
    .catch((err) => {
      console.error(err)
      res.status(500).json(err);
    })
})

module.exports = router;