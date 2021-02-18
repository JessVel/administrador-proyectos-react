const UserModel = require("../models/user_model");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.validateUser = async (req, res) => {
  //extraer user, password y tipo de usuario
  const { id, user, password } = req.body;

  //Revisar si es administrador

  try {
    let usuario = await UserModel.findOne({ user });
    if (!usuario) {
      return res.status(400).json({ msg: "El usuario no existe" });
    }

    const passValidate = await bcryptjs.compare(password, usuario.password);

    if (!passValidate) {
      return res.status(400).json({ msg: "Contraseña incorrecta" });
    }

    const payload = {
      usuario: {
        id: usuario.id,
      },
    };

    jwt.sign(
      payload,
      process.env.CLAVE_SECRETA,
      {
        expiresIn: 3600, // 1 hora
      },
      (error, token) => {
        if (error) throw error;

        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};

//Obtener usuario autenticado
exports.userAuthentic = async (req, res) => {
  try {
    const usuario = await UserModel.findById(req.usuario.id);
    res.json({ usuario });
    console.log(usuario);
  } catch (error) {
    res.status(500).json({ msg: "No se pudieron obtener los datos del usuario" });
    console.log(error);
  }
};
