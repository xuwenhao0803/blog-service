var express = require("express");
var router = express.Router();
const querySql = require("../db/index");
const { PWD_SALT, PRIVATE_KEY, EXPRISED, ROOT } = require("../utils/constant");
const { md5, upload } = require("../utils/index");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
  let { username, password, checkPassword, name } = req.body;
  try {
    let user = await querySql("select * from users where username=?", [
      username,
    ]);
    if (!user || user.length === 0) {
      const newPassword = md5(`${password}${PWD_SALT}`);
      await querySql("insert into users(username,password,name)value(?,?,?)", [
        username,
        newPassword,
        name,
      ]);
      res.send({ code: 0, msg: "该账号注册成功" });
    } else {
      res.send({ code: -1, msg: "该账号已经注册" });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/login", async (req, res, next) => {
  let { username, password } = req.body;
  try {
    let user = await querySql("select * from users where username=?", [
      username,
    ]);
    if (!user || user.length === 0) {
      res.send({ code: -1, msg: "该账号不存在" });
    } else {
      password = md5(`${password}${PWD_SALT}`);
      let result = await querySql(
        "select * from users where username=? and password=?",
        [username, password]
      );
      if (!result || result.length === 0) {
        res.send({ code: -1, msg: "账号或者密码不正确" });
      } else {
        let token = jwt.sign({ username }, PRIVATE_KEY, {
          expiresIn: EXPRISED,
        });

        res.send({ code: 0, msg: "登陆成功", token });
      }
    }
  } catch (e) {}
});
//获取用户信息接口
router.get("/info", async (req, res, next) => {
  try {
    let user = await querySql(
      "select username,name,head_img from users where username=?",
      [req.user.username]
    );
    if (user) {
      console.log(user);

      res.send({ code: "0", msg: "success", data: user[0] });
    }
  } catch (e) {
    next(e);
  }
});
//头像上传接口
router.post("/upload", upload.single("head_img"), async (req, res, next) => {
  let imgPath = req.file.path.split("public")[1];
  let imgUrl = ROOT + imgPath;
  res.send({ code: 0, data: imgUrl });
});

router.post("/updateUser", async (req, res, next) => {
  try {
    const { name, head_img } = req.body;
    let user = await querySql(
      "update users set name=?,head_img=? where username=?",
      [name, head_img, req.user.username]
    );
    console.log(user);

    res.send({ code: "0", msg: "success" });
  } catch (e) {
    console.log(e);
    
    next(e);
  }
});

module.exports = router;
