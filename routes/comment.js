var express = require("express");
var router = express.Router();
const querySql = require("../db/index");
const { PWD_SALT, PRIVATE_KEY, EXPRISED, ROOT } = require("../utils/constant");
const { md5, upload } = require("../utils/index");
const jwt = require("jsonwebtoken");
/**
 * 新增评论
 */
router.post("/add", async (req, res, next) => {
  try {
    const { comments, article_id } = req.body;
    const { username } = req.user;

    let user = await querySql(
      "select id,name,head_img from users where username=?",
      [username]
    );
    const user_id = user[0].id;
    const head_img = user[0].head_img;
    const saveComment = await querySql(
      "insert into comment (cn_content,user_id,create_date,article_id,head_img) value(?,?,NOW(),?,?)",
      [comments, user_id, article_id, head_img]
    );
    if (saveComment) {
      res.send({ code: "0", msg: "提交成功" });
    }
  } catch (e) {
    console.log(e);

    next(e);
  }
});
//查询评论接口
router.get("/list", async (req, res, next) => {
  try {
    const id = req.query.id;
    let user = await querySql(
      "select c.head_img,c.cn_content,u.name  from comment c, users u where c.user_id=u.id and c.article_id=?",
      [id]
    );
    if (user) {
      res.send({ code: "0", msg: "success", data: user });
    }
  } catch (e) {
      console.log(e);
      
    next(e);
  }
});
module.exports = router;
