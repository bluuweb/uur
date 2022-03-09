const formidable = require("formidable");
const fs = require("fs");
const Jimp = require("jimp");
const path = require("path");
const User = require("../models/User");

module.exports.perfilForm = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        return res.render("perfil", { user: req.user, imagen: user.imagen });
    } catch (error) {
        req.flash("mensajes", [{ msg: "no se puede leer perfil" }]);
        return res.redirect("/perfil");
    }
};

module.exports.cambiarFotoPerfil = (req, res) => {
    const form = new formidable.IncomingForm();

    form.maxFileSize = 50 * 1024 * 1024; // 5MB

    form.parse(req, async (err, fields, files) => {
        // console.log(fields);
        // console.log(files);

        if (err) {
            req.flash("mensajes", [{ msg: "falló formidable" }]);
            return res.redirect("/perfil");
        }

        const file = files.myFile;

        try {
            if (file.originalFilename === "") {
                throw new Error("No se subió ninguna imagen");
            }

            const imageTypes = ["image/jpeg", "image/png", "image/jpg"];

            if (!imageTypes.includes(file.mimetype)) {
                throw new Error("Por favor agrega una imagen .jpg o png");
            }

            if (file.size > 50 * 1024 * 1024) {
                throw new Error("Máximo 5MB");
            }

            const extension = file.mimetype.split("/")[1];
            const dirFile = path.join(
                __dirname,
                `../public/uploads/${req.user.id}.${extension}`
            );

            fs.renameSync(file.filepath, dirFile);

            const image = await Jimp.read(dirFile);
            image.resize(200, 200).quality(90).writeAsync(dirFile);

            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}.${extension}`;

            await user.save();

            req.flash("mensajes", [{ msg: "se guardó la imagen" }]);
            return res.redirect("/perfil");
        } catch (error) {
            console.log(error);
            req.flash("mensajes", [{ msg: error.message }]);
            return res.redirect("/perfil");
        }
    });
};
