const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const { restart } = require('nodemon');

exports.crearUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    usuario = new Usuario(req.body);

    const salt = await bcryptjs.genSalt(10);
    usuario.password = await bcryptjs.hash(password, salt);

    usuario.save();
    res.json({ msg: 'Usuario creado correctamente' });
  } catch (error) {
    console.log(error);
    res.status(400).send('Hubo un error');
  }
};
