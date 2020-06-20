var express = require("express");
var router = express.Router();
const querySql = require("../db/index");
const { PWD_SALT, PRIVATE_KEY, EXPRISED, ROOT } = require("../utils/constant");
const { md5, upload } = require("../utils/index");
const jwt = require("jsonwebtoken");
/**
 * 新增文章
 */
router.post("/add", async (req, res, next) => {
  try {
    const { details, title } = req.body;
    const { username } = req.user;

    let user = await querySql("select id from users where username=?", [
      username,
    ]);
    const user_id = user[0].id;
    const saveArticle = await querySql(
      "insert into article (title,content,create_date,user_id,state) value(?,?,NOW(),?,?)",
      [title, details, user_id, 1]
    );
    if (saveArticle) {
      res.send({ code: "0", msg: "保存成功" });
    }
  } catch (e) {
    console.log(e);

    next(e);
  }
});
/**
 * 更新文章接口
 */
router.post("/update", async (req, res, next) => {
  try {
    const { details, title, id } = req.body;
    const { username } = req.user;

    let user = await querySql("select id from users where username=?", [
      username,
    ]);
    const user_id = user[0].id;
    const updateArticle = await querySql(
      "update article set title=?,content=? where id=? and user_id=? ",
      [title, details, id, user_id]
    );
    if (updateArticle) {
      res.send({ code: "0", msg: "更新成功" });
    }
  } catch (e) {
    console.log(e);

    next(e);
  }
});
/**
 * 删除接口
 */
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { username } = req.user;

    let user = await querySql("select id from users where username=?", [
      username,
    ]);
    const user_id = user[0].id;
    const deleteArticle = await querySql(
      "delete from  article  where id=? and user_id=? ",
      [id, user_id]
    );
   
      res.send({ code: "0", msg: "删除成功" });

  } catch (e) {
    console.log(e);

    next(e);
  }
});
//获取列表接口
router.get("/list", async (req, res, next) => {
  try {
    let list = await querySql("select * from article");
    if (list) {
      res.send({ code: "0", msg: "success", data: list });
    }
  } catch (e) {
    console.log(e);

    next(e);
  }
});
//获取列表接口
router.get("/detail", async (req, res, next) => {
  try {
    const { username } = req.user;

    let user = await querySql("select id from users where username=?", [
      username,
    ]);
    const user_id = user[0].id;
    let list = await querySql("select * from article where user_id=?", [
      user_id,
    ]);
    if (list) {
      res.send({ code: "0", msg: "success", data: list });
    }
  } catch (e) {
    console.log(e);

    next(e);
  }
});
//获取列表接口
router.get("/detail/content", async (req, res, next) => {
  try {
    const id = req.query.id;
 //   const id = req.params.id;
    let list = await querySql("select * from article where id=?", [id]);
    if (list) {
      res.send({ code: "0", msg: "success", data: list[0] });
    }
  } catch (e) {
    console.log(e);

    next(e);
  }
});
module.exports = router;
