const express = require("express");
const {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento,
} = require("../controllers/homeController");
const {
    perfilForm,
    cambiarFotoPerfil,
} = require("../controllers/perfilController");
const urlValidar = require("../middlewares/urlValida");
const verficarUser = require("../middlewares/verficarUser");

const router = express.Router();

router.get("/", verficarUser, leerUrls);
router.post("/", verficarUser, urlValidar, agregarUrl);
router.get("/eliminar/:id", verficarUser, eliminarUrl);
router.get("/editar/:id", verficarUser, editarUrlForm);
router.post("/editar/:id", verficarUser, urlValidar, editarUrl);

router.get("/perfil", verficarUser, perfilForm);
router.post("/perfil", verficarUser, cambiarFotoPerfil);

router.get("/:shortURL", redireccionamiento);

module.exports = router;
