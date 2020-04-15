const mongoose = require('mongoose');

//Connect to DB
const dbName = 'fruitsDB';
const connectionUrl = 'localhost';
const connectionPort = '27017';
mongoose.connect(`mongodb://${connectionUrl}:${connectionPort}/${dbName}`, { useNewUrlParser: true });

//Define a schema for the data
const fruitSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 10
    },
    review: String
});

//Create mongoose model based on schema
//Mongoose name at start of model is by convention to use singular and it will auto make plural
const Fruit = mongoose.model("Fruit", fruitSchema);

//Create new fruit document
const fruit = new Fruit({
    name: "Apple",
    rating: 7,
    review: "This was pretty solid for a fruit"
});

//This saves our fruit document to the Fruits collection based on the fruit schema.
//fruit.save();

const personSchema = new mongoose.Schema({
    name: String,
    age: Number,
    //embedding documents
    favoriteFruit: fruitSchema
});

const Person = mongoose.model("Person", personSchema);

const pineapple = new Fruit({
    name: "Pineapple",
    score: 9,
    review: "Very tasty"
})

pineapple.save();

const person = new Person({
    name: "Bob",
    age: 26,
    favoriteFruit: pineapple
})

person.save();

const mango = new Fruit({
    name: "Mango",
    score: 4,
    review: "Very decent"
})

mango.save();

Person.updateOne({ name: "Bob" }, { favoriteFruit: mango }, (err) => {
    if (err) {
        console.log(err);
    }
})

Fruit.find((err, fruits) => {
    if (err) {
        console.log(err);
    } else {
        //close connection
        mongoose.connection.close();

        fruits.forEach((fruit) => {
            console.log(fruit.name);
        })
    }
})

// Fruit.updateOne({ _id: "5e963b7e2bcfa3555091a83b" }, { name: "Peach" }, (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully updated the document");
//     }
// })

// Fruit.deleteOne({ name: "Peach" }, (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully deleted the Peach");
//     }
// })

// Person.deleteMany({ name: "Bob" }, (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully deleted the Bobs");
//     }
// })


//Bulk save
// const kiwi = new Fruit({
//     name: "Kiwi",
//     rating: 10,
//     review: "Nom nom"
// });

// const orange = new Fruit({
//     name: "Orange",
//     rating: 4,
//     review: "This was pretty okay for a fruit"
// });

// const banana = new Fruit({
//     name: "Banana",
//     rating: 8,
//     review: "This was pretty darn solid for a fruit"
// });

// Fruit.insertMany([kiwi, orange, banana], (err) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Successfully saved fruits");
//     }
// });