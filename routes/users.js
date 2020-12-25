const express = require('express');
const bcrypt = require('bcryptjs')
const passport = require('passport')
const jwt = require("jsonwebtoken");
const User = require('../models/User')
const router = express.Router();
const keys = require('../config/key');

const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");



// router.get('/login', (req, res) => res.render('login'));

// router.get('/register', (req, res) => res.render('register'));

router.post('/register', (req, res) => {
    const {errors, isValid} = validateRegisterInput(req.body);

    if(!isValid){
      return res.status(400).json(errors);
  }  
    
    User.findOne({email:req.body.email}).then(user=>{

      if(user){
          return res.status(400).json({email:"Email already exists"});
      } else{
          const newUser = new User({
              name:req.body.name,
              password:req.body.password,
              email:req.body.email
          });

          // Hash password before storing in database
          const rounds  = 10;
          bcrypt.genSalt(rounds, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                  .save()
                  .then(res.redirect('/users/login'))
                  .catch(err => console.log(err));
              });
          });
      }

  });
});

router.post('/login', (req, res) => {
  const {errors, isValid} = validateLoginInput(req.body);
  if (!isValid) {
        return res.status(400).json(errors);
    }
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then(user=>{
      if(!user){
          return res.status(404).json({ emailnotfound: "Email not found" });
      }
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            // Create JWT Payload
            const payload = {
                id: user.id,
                name: user.name
            };

            // Sign token
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                 expiresIn: 41512810 
                }
            );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
  });
  
module.exports = router;