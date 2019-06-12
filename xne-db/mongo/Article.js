/**
 * Created by maple
 */
var mongoose = require('mongoose');
var db = require('./mongo');

/**
 *  文章表:
 *  编号、文章标题、文章内容、文章作者、创建时间
 */
var ArticleSchema = new mongoose.Schema({
    articleId: String,
    content: String,
    title: String,
    createAt: Date,
    author: String,
});

ArticleSchema.index({
    articleId: 1,
})

let articleList = [{ //利息收益账户
    articleId: "10000001",
    title: "TEST",
    content: "TEST CONTENT",
    createAt: new Date(),
    author: "maple"
}]

var Article = module.exports = db.connection.model('Article', ArticleSchema);

articleList.forEach(function(p) {
    Article.findOne({
        articleId: p.articleId
    }).then(function(data) {
        if (data) {
            return;
            // throw new Error("Customer existed:" + data.articleId)
        }
        var Model = new Article(p)
        return Model.save()
    }).then(function(data) {}).catch(function(err) {
        console.log(err.message)
    })
})