const express = require('express')
const router = express.Router()
const {
  getSingleProductImages,
  createImage,
  updateImage,
  deleteImage,
  uploadProductImages,
  setMainImage,
  deleteImageById,
} = require('../controllers/productImages')


router.route('/:id').get(getSingleProductImages); 


router.route('/').post(createImage);
router.post('/upload', uploadProductImages);
router.put('/main/:imageId', setMainImage);
router.delete('/image/:imageId', deleteImageById);


router.route('/:id').put(updateImage);


router.route('/:id').delete(deleteImage);

module.exports = router
