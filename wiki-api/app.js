const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

///////////////////Requests Targeting All Articles////////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find((err, articles) => {
            if (!err) {
                res.send(articles);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;

        const article = new Article({
            title: title,
            content: content
        })

        article.save((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successful addition of article.")
            }
        });
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (err) {
                res.send(err);
            } else {
                res.send("Successful deletion of articles")
            }
        })
    })


///////////////////Requests Targeting Specific Articles////////////////////
app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (err) {
                res.send(err)
            } else if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("No articles matching that title were found")
            }
        })
    })
    .put((req, res) => {
        //If overwrite is specified, then the item found will be completely rewritten no matter if all the values are supplied
        //If its not specified it will only update specified pieces
        //Overwrite true is default Mongo behavior, but mongoose defaults to false
        Article.update({ title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send(`Successfully updated ${req.params.articleTitle}`)
                }
            })
    })
    .patch((req, res) => {
        //Patch is meant to only update the contents that were given instead of the entire entry like PUT
        Article.update({ title: req.params.articleTitle },
            { $set: req.body },
            (err) => {
                if (err) {
                    res.send(err)
                } else {
                    res.send(`Successfully updated ${req.params.articleTitle}`)
                }
            })
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (err) {
                res.send(err)
            } else {
                res.send(`Successfully deleted ${req.params.articleTitle}`)
            }
        })
    })

app.listen(3000, function () {
    console.log("Server started on port 3000");
});
