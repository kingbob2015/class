const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
  name: String
}

const Item = mongoose.model("Item", itemsSchema);

const walkDog = new Item({
  name: "Walk the dog"
});

const cookDinner = new Item({
  name: "Cook dinner"
});

const workout = new Item({
  name: "Workout"
});

const defaultItems = [walkDog, cookDinner, workout]

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find((err, items) => {
    if (items.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Success of insert of default items");
        }
      })
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: items });
    }
  })
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  const foundList = List.findOne({ name: customListName }, (err, foundList) => {
    if (err) {
      console.log(err)
    } else {
      if (foundList) {
        res.render("list", { listTitle: customListName, newListItems: foundList.items })
      } else {
        const list = new List({
          name: customListName,
          items: defaultItems
        })

        list.save();
        res.redirect(`/${_.lowerCase(customListName)}`);
      }
    }
  })

})

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  })

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect(`/${_.lowerCase(listName)}`);
    })
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Success of insert of default items");
      }
    })
    res.redirect("/");
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, foundList) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect(`/${_.lowerCase(listName)}`);
      }
    })
  }


});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
