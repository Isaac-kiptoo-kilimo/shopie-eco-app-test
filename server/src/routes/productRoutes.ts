import { Router } from "express";
import { AddProduct, UpdateProductControllers, deleteProduct, fetchAllProductsControllers, getSingleProduct } from "../controllers/productControllers";


const productRoute=Router()


productRoute.post('/create', AddProduct)
productRoute.put('/update/:productID', UpdateProductControllers)
productRoute.get('/single/:productID', getSingleProduct)
productRoute.get('/all', fetchAllProductsControllers)
productRoute.delete('/delete/:ProductID', deleteProduct);



export default productRoute