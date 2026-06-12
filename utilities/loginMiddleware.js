const express = require('express');
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');

async function loginMiddleware(req, res, next) {
    const token = req.cookies.token;
    if(!token){
        return res.redirect('/login')   
    }
    const decoded = jwt.verify(token, "secretKey");
    const user = await userModel.findOne({email: decoded.email});
    if(!user){
        return res.redirect('/login');
    }   
    req.user = user;
    req.user.email = decoded.email;
    next();
}

module.exports = loginMiddleware;